pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKER_IMAGE = "sriharikr0511/moodlogger"
        SONAR_PROJECT = "moodlogger"
    }

    stages {

        stage('Git Version') {
            steps {
                bat 'git --version'
            }
        }

        stage('Dependency Install') {
            steps {
                echo 'Installing backend dependencies...'
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Code Quality - SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        bat """
                            "${scannerHome}\\bin\\sonar-scanner.bat" ^
                            -Dsonar.projectKey=moodlogger ^
                            -Dsonar.sources=backend ^
                            -Dsonar.host.url=http://localhost:9000
                        """
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    dependencyCheck additionalArguments: '--scan backend --format HTML --format XML', odcInstallation: 'DC'
                    dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker images...'
                bat 'docker build -t %DOCKER_IMAGE%-backend:latest ./backend'
                bat 'docker build -t %DOCKER_IMAGE%-frontend:latest ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                    bat 'docker push %DOCKER_IMAGE%-backend:latest'
                    bat 'docker push %DOCKER_IMAGE%-frontend:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                bat 'docker stop moodlogger-backend || exit 0'
                bat 'docker stop moodlogger-frontend || exit 0'
                bat 'docker rm moodlogger-backend || exit 0'
                bat 'docker rm moodlogger-frontend || exit 0'
                bat 'docker run -d --name moodlogger-backend -p 5000:5000 %DOCKER_IMAGE%-backend:latest'
                bat 'docker run -d --name moodlogger-frontend -p 3000:80 %DOCKER_IMAGE%-frontend:latest'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
