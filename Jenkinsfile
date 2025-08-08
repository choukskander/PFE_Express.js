pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = 'v2.24.5'
    }

    stages {
        stage('Install Docker Compose') {
            steps {
                sh '''
                    if ! docker compose version > /dev/null 2>&1; then
                        echo "Installing Docker Compose plugin..."
                        sudo apt-get update
                        sudo apt-get install -y docker-compose-plugin
                    fi
                '''
            }
        }

        stage('Checkout Backend') {
            steps {
                git branch: 'Server',
                    url: 'https://github.com/choukskander/PFE_Express.js.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Checkout Infrastructure') {
            steps {
                dir('infrastructure') {
                    git branch: 'master',
                        url: 'https://github.com/choukskander/PFE_Infrastructure.git',
                        credentialsId: 'github-token'
                }
            }
        }

        stage('Checkout Frontend') {
            steps {
                dir('Client') {
                    git branch: 'Client',
                        url: 'https://github.com/choukskander/PFE_React.js.git',
                        credentialsId: 'github-token'
                }
            }
        }

        stage('Build and Deploy with Docker Compose') {
            steps {
                dir('infrastructure') {
                    sh '''
                        echo "Stopping existing containers..."
                        docker compose down || true
                        echo "Building and starting containers..."
                        docker compose up --build -d
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
