pipeline {
  agent any
  environment {
    // Workspace-relative paths
    COMPOSE_FILE = './PFE/docker-compose.yml'
    BACKEND_DIR = './PFE/Server'
    CLIENT_DIR = './PFE/Client'
  }
  stages {
    stage('Initialize') {
      steps {
        // Clean workspace and create PFE directory
        sh 'rm -rf PFE'
        sh 'mkdir -p PFE'
        echo 'Workspace cleaned and PFE directory created'
      }
    }
    stage('Clone Repositories') {
      steps {
        // Clone Server repository
        dir('PFE/Server') {
          script {
            try {
              git branch: 'Server',
                  url: 'https://github.com/choukskander/PFE_Express.js.git',
                  credentialsId: 'github-token'
              sh 'git status'
              echo 'Server repository cloned successfully'
            } catch (Exception e) {
              error "Failed to clone Server repository: ${e.message}"
            }
          }
        }
        // Clone Client repository
        dir('PFE/Client') {
          script {
            try {
              git branch: 'main', // REPLACE with correct branch
                  url: 'https://github.com/choukskander/PFE_Client.git', // REPLACE with correct URL
                  credentialsId: 'github-token'
              sh 'git status'
              echo 'Client repository cloned successfully'
            } catch (Exception e) {
              error "Failed to clone Client repository: ${e.message}"
            }
          }
        }
        // Clone docker-compose repository
        dir('PFE') {
          script {
            try {
              git branch: 'main', // REPLACE with correct branch
                  url: 'https://github.com/choukskander/PFE_Docker.git', // REPLACE with correct URL
                  credentialsId: 'github-token'
              sh 'git status'
              echo 'Docker-compose repository cloned successfully'
            } catch (Exception e) {
              error "Failed to clone docker-compose repository: ${e.message}"
            }
          }
        }
        // Verify directory structure
        sh 'ls -R PFE'
      }
    }
    stage('Build') {
      steps {
        // Build backend and frontend Docker images
        sh "docker build -t pfe-express:latest ${BACKEND_DIR}"
        sh "docker build -t pfe-frontend:latest ${CLIENT_DIR}"
        echo 'Docker images built successfully'
      }
    }
    stage('Deploy') {
      steps {
        // Inject MongoDB Atlas connection string
        withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'DB_CONNECTION')]) {
          sh """
            # Create .env file
            echo 'DB_CONNECTION=\${DB_CONNECTION}' > ${BACKEND_DIR}/.env
            # Verify .env file
            cat ${BACKEND_DIR}/.env
            # Run docker compose
            docker compose -f ${COMPOSE_FILE} up -d --build
          """
        }
        echo 'Application deployed successfully'
      }
    }
  }
  post {
    always {
      // Clean up Docker resources
      sh 'docker system prune -f --volumes || true'
      // Archive logs for debugging
      archiveArtifacts artifacts: 'PFE/Server/.env, PFE/docker-compose.yml', allowEmptyArchive: true
    }
    success {
      echo 'Pipeline completed successfully! Backend: http://localhost:5000, Frontend: http://localhost:3000'
    }
    failure {
      echo 'Pipeline failed! Check Jenkins console output and Docker logs:'
      sh 'docker compose -f ${COMPOSE_FILE} logs || true'
    }
  }
}