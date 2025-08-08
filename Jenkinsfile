pipeline {
    agent any
    options {
        skipDefaultCheckout()
    }
    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
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
        stage('Build and Deploy') {
            steps {
                dir('infrastructure') {
                    sh '/usr/bin/docker compose down || true'
                    sh '/usr/bin/docker compose up --build -d'
                }
            }
        }
    }
}
