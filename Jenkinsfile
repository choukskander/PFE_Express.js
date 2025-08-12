pipeline {
    agent any

    environment {
        PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        WORKSPACE_DIR = 'PFE'
        COMPOSE_FILE = "${WORKSPACE_DIR}/docker-compose.yml"
    }

    stages {
        stage('Prepare Workspace') {
            steps {
                sh 'mkdir -p ${WORKSPACE_DIR}/Server ${WORKSPACE_DIR}/Client'
            }
        }

        stage('Clone Repositories') {
            steps {
                dir("${WORKSPACE_DIR}/Server") {
                    git branch: 'Server', url: 'https://github.com/choukskander/PFE_Express.js.git', credentialsId: 'github-token'
                }
                dir("${WORKSPACE_DIR}/Client") {
                    git branch: 'Client', url: 'https://github.com/choukskander/PFE_React.js.git', credentialsId: 'github-token'
                }
                dir("${WORKSPACE_DIR}") {
                    git branch: 'master', url: 'https://github.com/choukskander/PFE_Infrastructure.git', credentialsId: 'github-token'
                }
                sh 'ls -R ${WORKSPACE_DIR}'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker build -t pfe-express:latest ${WORKSPACE_DIR}/Server"
                sh "docker build -t pfe-frontend:latest ${WORKSPACE_DIR}/Client"
            }
        }

stage('Create .env File & Deploy') {
    steps {
        withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'DB_CONNECTION')]) {
            sh '''
                echo "DB_CONNECTION=$DB_CONNECTION" > ${WORKSPACE_DIR}/Server/.env
                cd ${WORKSPACE_DIR}
                docker-compose -f docker-compose.yml up -d --build
            '''
        }
    }
}


    }

    post {
        always {
            sh 'docker system prune -f --volumes || true'
            archiveArtifacts artifacts: "${WORKSPACE_DIR}/Server/.env, ${WORKSPACE_DIR}/docker-compose.yml", allowEmptyArchive: true
        }
    }
}
