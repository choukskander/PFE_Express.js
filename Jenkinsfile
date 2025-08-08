pipeline {
    agent any
    options {
        skipDefaultCheckout() // empêche le checkout auto de Jenkins
    }
    stages {
        stage('Nettoyage du workspace') {
            steps {
                deleteDir()
            }
        }
        stage('Cloner Backend') {
            steps {
                dir('Server') {
                    git branch: 'Server',
                        url: 'https://github.com/choukskander/PFE_Express.js.git',
                        credentialsId: 'github-token'
                }
            }
        }
        stage('Cloner Frontend') {
            steps {
                dir('Client') {
                    git branch: 'Client',
                        url: 'https://github.com/choukskander/PFE_React.js.git',
                        credentialsId: 'github-token'
                }
            }
        }
        stage('Cloner Infrastructure') {
            steps {
                dir('infrastructure') {
                    git branch: 'master', 
                        url: 'https://github.com/choukskander/PFE_Infrastructure.git',
                        credentialsId: 'github-token'
                }
            }
        }
        stage('Déploiement avec Docker Compose') {
            steps {
                dir('infrastructure') {
                    sh 'docker compose down || true'
                    sh 'docker compose up --build -d'
                }
            }
        }
    }
}
