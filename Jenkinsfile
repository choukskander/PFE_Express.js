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
                sh 'mkdir -p ${WORKSPACE_DIR}' 
                sh 'mkdir -p ${WORKSPACE_DIR}/Server'
                sh 'mkdir -p ${WORKSPACE_DIR}/Client'
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

        stage('Build') {
            steps {
                sh "docker build -t pfe-express:latest ${WORKSPACE_DIR}/Server"
                sh "docker build -t pfe-frontend:latest ${WORKSPACE_DIR}/Client"
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'DB_CONNECTION')]) {
                    sh """
                        echo 'DB_CONNECTION=\${DB_CONNECTION}' > ${WORKSPACE_DIR}/Server/.env
                        docker compose -f ${COMPOSE_FILE} up -d --build
                    """
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f --volumes || true'
            archiveArtifacts artifacts: "${WORKSPACE_DIR}/Server/.env, ${WORKSPACE_DIR}/docker-compose.yml", allowEmptyArchive: true
        }
        success {
            echo 'Pipeline succeeded! Check: http://localhost:5000 (backend), http://localhost:3000 (frontend)'
        }
        failure {
            echo 'Pipeline failed—likely permissions. Add Jenkins user to Docker group with: sudo usermod -aG docker jenkins && sudo service jenkins restart'
        }
    }
}