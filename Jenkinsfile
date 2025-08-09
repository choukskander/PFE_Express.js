pipeline {
    agent any

    environment {
        PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        COMPOSE_FILE = './PFE/docker-compose.yml'
        BACKEND_DIR = './PFE/Server'
        CLIENT_DIR = './PFE/Client'
    }

    stages {

        stage('Initialize') {
            steps {
                echo '🧹 Nettoyage du workspace...'
                sh '''
                    rm -rf PFE
                    mkdir -p PFE
                '''
                echo '✅ Workspace nettoyé et dossier PFE créé'
            }
        }

        stage('Clone Repositories') {
            steps {
                script {
                    try {
                        dir("${BACKEND_DIR}") {
                            git branch: 'Server',
                                url: 'https://github.com/choukskander/PFE_Express.js.git',
                                credentialsId: 'github-token'
                            sh 'git status'
                            echo '✅ Server repository cloné avec succès'
                        }
                    } catch (Exception e) {
                        error "❌ Échec du clonage du dépôt Server : ${e.message}"
                    }

                    try {
                        dir("${CLIENT_DIR}") {
                            git branch: 'Client',
                                url: 'https://github.com/choukskander/PFE_React.js.git',
                                credentialsId: 'github-token'
                            sh 'git status'
                            echo '✅ Client repository cloné avec succès'
                        }
                    } catch (Exception e) {
                        error "❌ Échec du clonage du dépôt Client : ${e.message}"
                    }

                    try {
                        dir('PFE') {
                            git branch: 'master',
                                url: 'https://github.com/choukskander/PFE_Infrastructure.git',
                                credentialsId: 'github-token'
                            sh 'ls -la'
                            echo '✅ Infrastructure repository cloné avec succès'
                        }
                    } catch (Exception e) {
                        error "❌ Échec du clonage du dépôt Infrastructure : ${e.message}"
                    }
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    try {
                        echo '🚀 Lancement du Build et Déploiement...'

                        // Arrêt des containers existants (sans erreur si absents)
                        sh "docker compose -f ${COMPOSE_FILE} down || true"

                        // Build + démarrage en détaché
                        sh "docker compose -f ${COMPOSE_FILE} up --build -d"

                        // Affichage des containers en cours
                        sh 'docker ps'

                        echo '✅ Build et Déploiement terminés avec succès'
                    } catch (Exception e) {
                        error "❌ Build and Deploy échoué : ${e.message}"
                    }
                }
            }
        }
    }
}
