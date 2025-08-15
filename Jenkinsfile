pipeline {
    agent any

    environment {
        PATH = "${tool('SonarScanner')}/bin:${env.PATH}"
        INFRA_DIR = "PFE/PFE_Infrastructure"
        SERVER_DIR = "PFE/Server"
        CLIENT_DIR = "PFE/Client"
        NEXUS_REGISTRY = 'localhost:8082'
        BACKEND_IMAGE = "${NEXUS_REGISTRY}/pfe-express:latest"
        FRONTEND_IMAGE = "${NEXUS_REGISTRY}/pfe-frontend:latest"
    }

    stages {

        stage('Cleanup & Prepare') {
            steps {
                deleteDir()
                sh "mkdir -p ${SERVER_DIR} ${CLIENT_DIR} ${INFRA_DIR}"
            }
        }

        stage('Clone Repositories') {
            steps {
                dir(SERVER_DIR) { git branch: 'Server', url: 'https://github.com/choukskander/PFE_Express.js.git', credentialsId: 'github-token' }
                dir(CLIENT_DIR) { git branch: 'Client', url: 'https://github.com/choukskander/PFE_React.js.git', credentialsId: 'github-token' }
                dir(INFRA_DIR) { git branch: 'master', url: 'https://github.com/choukskander/PFE_Infrastructure.git', credentialsId: 'github-token' }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    dir(SERVER_DIR) { sh "sonar-scanner -Dsonar.projectKey=pfe-backend -Dsonar.projectName='PFE Backend' -Dsonar.sources=. -Dsonar.exclusions=**/node_modules/**" }
                    dir(CLIENT_DIR) { sh "sonar-scanner -Dsonar.projectKey=pfe-frontend -Dsonar.projectName='PFE Frontend' -Dsonar.sources=. -Dsonar.exclusions=**/node_modules/**" }
                }
            }
        }

        stage('Build App Images') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE} ${SERVER_DIR}"
                sh "docker build -t ${FRONTEND_IMAGE} ${CLIENT_DIR}"
            }
        }

        stage('Login to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-docker-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh "docker login ${NEXUS_REGISTRY} -u $NEXUS_USER -p $NEXUS_PASS"
                }
            }
        }

        stage('Push App Images') {
            steps {
                sh "docker push ${BACKEND_IMAGE}"
                sh "docker push ${FRONTEND_IMAGE}"
            }
        }

        // === ÉTAPE DE DÉPLOIEMENT FINALE ET ROBUSTE ===
        stage('Deploy Application') {
            steps {
                dir(INFRA_DIR) {
                    withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'DB_CONNECTION')]) {
                        script {
                            echo "Préparation des fichiers de configuration..."
                            sh "echo 'DB_CONNECTION=${DB_CONNECTION}' > ../Server/.env"
                            
                            // On s'assure que le fichier prometheus.yml existe pour la commande 'build'
                            // On utilise le bon contenu
                            writeFile(
                                file: 'prometheus.yml', 
                                text: '''
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['prometheus:9090']
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:5000']
'''
                            )

                            sh """
                                set -x
                                # La commande --build est maintenant cruciale
                                # Elle construit notre image Prometheus personnalisée avant de la lancer.
                                # Ceci résout DÉFINITIVEMENT le problème de montage de volume.
                                docker-compose down --volumes --remove-orphans || true
                                docker-compose up --build -d 
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline terminé. Les services restent actifs."
            // On peut garder l'archivage, c'est utile.
            archiveArtifacts artifacts: "${SERVER_DIR}/.env, ${INFRA_DIR}/prometheus.yml, ${INFRA_DIR}/docker-compose.yml", allowEmptyArchive: true
        }
    }
}