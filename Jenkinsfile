pipeline {
    agent any

    environment {
        NODE_HOME = tool 'npm'
        PATH = "${NODE_HOME}/bin:${env.PATH}"
        SONAR_HOME = tool 'sonar'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/dhruvmoradiya69/CI-CD-Deployment-HotelHub-MERN.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "cd backend && npm install && npm run build && cd .. && cd frontend && npm install && npm run build && cd .."
            }
        }

        stage('Sonarqube Quality Analysis') {
            steps {
                withSonarQubeEnv("sonarqube") {
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=mern-app -Dsonar.projectKey=mern-app"
                }
            }
        }

        stage('Sonar Quality Gate') {
            steps {
                timeout(time: 2, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'owasp'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Trivy File Scan') {
            steps {
                sh 'trivy fs --format table -o trivy-fs-report.html .'
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        sh 'docker build -t mern-frontend:latest ./frontend'
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        sh 'docker build -t mern-backend:latest ./backend'
                    }
                }
            }
        }

        stage('Scan Docker Images') {
            parallel {
                stage('Scan Frontend Image') {
                    steps {
                        sh 'trivy image --format table -o trivy-fi-report.html mern-frontend:latest'
                    }
                }
                stage('Scan Backend Image') {
                    steps {
                        sh 'trivy image --format table -o trivy-bi-report.html mern-backend:latest'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhubid',
                    usernameVariable: 'dockerHubUser',
                    passwordVariable: 'dockerHubPass'
                )]) {
                    sh 'echo "$dockerHubPass" | docker login -u "$dockerHubUser" --password-stdin'
                    sh 'docker image tag mern-frontend:latest $dockerHubUser/mern-frontend:latest'
                    sh 'docker image tag mern-backend:latest $dockerHubUser/mern-backend:latest'
                    sh 'docker push $dockerHubUser/mern-frontend:latest'
                    sh 'docker push $dockerHubUser/mern-backend:latest'
                }
            }
        }

        //stage('Deployment') {
            //steps {
                //sh "docker compose down && docker compose up --build -d"
            //}
        //}
    }
}