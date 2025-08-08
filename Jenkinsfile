pipeline {
  agent any
  environment {
    // Define workspace-relative paths
    COMPOSE_FILE = './PFE/docker-compose.yml'
    BACKEND_DIR = './PFE/Server'
    CLIENT_DIR = './PFE/Client'
  }
  stages {
    stage('Clone Repositories') {
      steps {
        // Clean workspace to avoid Git errors
        deleteDir()
        // Create PFE directory
        sh 'mkdir -p PFE'
        // Clone Server repository
        dir('PFE/Server') {
          git branch: 'Server',
              url: 'https://github.com/choukskander/PFE_Express.js.git',
              credentialsId: 'github-token'
        }
        // Clone Client repository
        dir('PFE/Client') {
          git branch: 'main', // Adjust branch if different
              url: 'https://github.com/choukskander/PFE_Client.git', // Adjust URL
              credentialsId: 'github-token'
        }
        // Clone docker-compose repository
        dir('PFE') {
          git branch: 'main', // Adjust branch if different
              url: 'https://github.com/choukskander/PFE_Docker.git', // Adjust URL
              credentialsId: 'github-token'
        }
      }
    }
    stage('Build') {
      steps {
        // Build the backend Docker image
        sh "docker build -t pfe-express:latest ${BACKEND_DIR}"
        // Build the frontend Docker image (optional, as docker-compose will build it)
        sh "docker build -t pfe-frontend:latest ${CLIENT_DIR}"
      }
    }
    stage('Deploy') {
      steps {
        // Inject MongoDB Atlas connection string into .env file
        withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'DB_CONNECTION')]) {
          sh """
            # Create .env file with MongoDB Atlas connection string
            echo 'DB_CONNECTION=\${DB_CONNECTION}' > ${BACKEND_DIR}/.env
            # Run docker compose
            docker compose -f ${COMPOSE_FILE} up -d --build
          """
        }
      }
    }
  }
  post {
    always {
      // Clean up dangling images and stopped containers
      sh 'docker system prune -f --volumes'
    }
    success {
      echo 'Pipeline completed successfully! Backend running on http://localhost:5000, Frontend on http://localhost:3000'
    }
    failure {
      echo 'Pipeline failed! Check Jenkins console output and Docker logs for details.'
    }
  }
}