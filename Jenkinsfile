pipeline {
    agent any

    tools {
        nodejs 'NodeJS'          // must match name in Jenkins > Tools
        'org.jenkinsci.plugins.DependencyCheck.tools.DependencyCheckInstallation' 'DC'
    }

    environment {
        DOCKER_IMAGE = "sriharikr0511/moodlogger"
        SONAR_PROJECT = "moodlogger"
    }

    stages {

        stage('Git Version') {
            steps {
                echo 'Checking Git version...'
                sh 'git --version'
            }
        }

        stage('Dependency Install') {
            steps {
                echo 'Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Code Quality - SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT} \
                            -Dsonar.sources=backend \
                            -Dsonar.host.url=http://host.docker.internal:9000
                        """
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan backend --format HTML --format XML', odcInstallation: 'DC'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker images...'
                sh 'docker build -t ${DOCKER_IMAGE}-backend:latest ./backend'
                sh 'docker build -t ${DOCKER_IMAGE}-frontend:latest ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push ${DOCKER_IMAGE}-backend:latest'
                    sh 'docker push ${DOCKER_IMAGE}-frontend:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                sh 'docker stop moodlogger-backend || true'
                sh 'docker stop moodlogger-frontend || true'
                sh 'docker rm moodlogger-backend || true'
                sh 'docker rm moodlogger-frontend || true'
                sh 'docker run -d --name moodlogger-backend -p 5000:5000 ${DOCKER_IMAGE}-backend:latest'
                sh 'docker run -d --name moodlogger-frontend -p 3000:80 ${DOCKER_IMAGE}-frontend:latest'
            }
        }
    }

    post {
        success { echo 'Pipeline completed successfully!' }
        failure  { echo 'Pipeline failed. Check logs above.' }
    }
}
