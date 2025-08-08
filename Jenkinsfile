pipeline {
    agent any

    stages {
        stage('Check Docker') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Checkout Backend') {
            steps {
                dir('Server') {
                    git branch: 'Server',
                        url: 'https://github.com/choukskander/PFE_Express.js.git',
                        credentialsId: 'github-token'
                }
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
                    sh 'docker compose down || true'
                    sh 'docker compose up --build -d'
                }
            }
        }
    }
}
