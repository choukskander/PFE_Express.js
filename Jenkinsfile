pipeline {
    agent any

    stages {
        stage('Checkout Infrastructure') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/choukskander/PFE_Infrastructure.git',
                    credentialsId: 'github-token'
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
        stage('Checkout Frontend') {
            steps {
                dir('Client') {
                    git branch: 'main', 
                        url: 'https://github.com/choukskander/PFE_Client.git',
                        credentialsId: 'github-token'
                }
            }
        }
        stage('Build and Deploy') {
            steps {
                dir('.') { // Racine du workspace
                    sh 'docker-compose down || true'
                    sh 'docker-compose up --build -d'
                }
            }
        }
    }
}
