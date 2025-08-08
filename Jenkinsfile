pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'PFE/docker-compose.yml'
    BACKEND_DIR  = 'PFE/Server'
    CLIENT_DIR   = 'PFE/Client'
  }

  options {
    disableConcurrentBuilds()
    // logRotator(numToKeepStr: '10') // optionnel
  }

  stages {
    stage('Init') {
      steps {
        deleteDir() // nettoie proprement le workspace
        echo 'Workspace nettoyé'
      }
    }

    stage('Checkout Infrastructure (compose)') {
      steps {
        dir('PFE') {
          checkout([
            $class: 'GitSCM',
            userRemoteConfigs: [[
              url: 'https://github.com/choukskander/PFE_Infrastructure.git',
              credentialsId: 'github-token'
            ]],
            branches: [[name: '*/main']],
            extensions: []
          ])
        }
        sh 'ls -la PFE'
      }
    }

    stage('Checkout Backend') {
      steps {
        dir('PFE/Server') {
          checkout([
            $class: 'GitSCM',
            userRemoteConfigs: [[
              url: 'https://github.com/choukskander/PFE_Express.js.git',
              credentialsId: 'github-token'
            ]],
            branches: [[name: '*/Server']],
            extensions: []
          ])
        }
        sh 'ls -la PFE/Server'
      }
    }

    stage('Checkout Frontend') {
      steps {
        dir('PFE/Client') {
          checkout([
            $class: 'GitSCM',
            userRemoteConfigs: [[
              url: 'https://github.com/choukskander/PFE_React.js.git',
              credentialsId: 'github-token'
            ]],
            branches: [[name: '*/main']],
            extensions: []
          ])
        }
        sh 'ls -la PFE/Client'
      }
    }

    stage('Préparer .env du backend') {
      steps {
        withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'DB_CONNECTION')]) {
          sh """
            cat > ${BACKEND_DIR}/.env <<'EOF'
DB_CONNECTION=${DB_CONNECTION}
PORT=5000
NODE_ENV=production
EOF
            echo 'Contenu du .env backend:'
            cat ${BACKEND_DIR}/.env
          """
        }
      }
    }

    stage('Build & Up via docker compose') {
      steps {
        sh "docker compose -f ${COMPOSE_FILE} up -d --build"
      }
    }
  }

  post {
    success {
      echo 'Pipeline OK — Backend: http://localhost:5000  Frontend: http://localhost:3000'
    }
    failure {
      echo 'Echec du pipeline — logs docker-compose:'
      sh "docker compose -f ${COMPOSE_FILE} logs || true"
    }
    always {
      // Evite de tout purger agressivement sur la machine Jenkins
      // sh 'docker builder prune -af || true'
      archiveArtifacts artifacts: 'PFE/docker-compose.yml,PFE/Server/.env', allowEmptyArchive: true
    }
  }
}