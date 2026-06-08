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

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
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
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    bat '''
                        if not exist dependency-check (
                            curl -L https://github.com/jeremylong/DependencyCheck/releases/download/v10.0.3/dependency-check-10.0.3-release.zip -o dc.zip
                            tar -xf dc.zip
                        )
                        dependency-check\\bin\\dependency-check.bat --scan backend --format HTML --format XML --out . --disableOssIndex
                    '''
                }
            }
            post {
                always {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker images...'
                bat 'docker build --no-cache -t %DOCKER_IMAGE%-backend:latest ./backend'
                bat 'docker build --no-cache -t %DOCKER_IMAGE%-frontend:latest ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
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
