pipeline {
    agent any

    environment {
        DOCKER_PATH = "/usr/bin/docker"
    }

    stages {

        stage('Check Docker') {
            steps {
                sh '''
                    echo "Vérification de Docker..."
                    which ${DOCKER_PATH} || echo "Docker introuvable"
                    ${DOCKER_PATH} --version
                '''
            }
        }

        stage('Checkout Backend') {
            steps {
                dir('Server') {
                    deleteDir()
                    git branch: 'main',
                        url: 'https://github.com/choukskander/PFE_Express.js.git',
                        credentialsId: 'github-token'
                }
            }
        }

        stage('Checkout Frontend') {
            steps {
                dir('Client') {
                    deleteDir()
                    git branch: 'main',
                        url: 'https://github.com/choukskander/PFE_React.js.git',
                        credentialsId: 'github-token'
                }
            }
        }

        stage('Checkout Infrastructure') {
            steps {
                dir('infrastructure') {
                    deleteDir()
                    git branch: 'main',
                        url: 'https://github.com/choukskander/PFE_Infrastructure.git',
                        credentialsId: 'github-token'
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                dir('infrastructure') {
                    sh '''
                        echo "Arrêt des conteneurs existants..."
                        ${DOCKER_PATH} compose down || true
                        
                        echo "Construction et démarrage des conteneurs..."
                        ${DOCKER_PATH} compose up --build -d
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Déploiement réussi !"
        }
        failure {
            echo "❌ Échec du pipeline."
        }
    }
}
