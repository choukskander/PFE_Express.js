pipeline {
  agent any

  environment {
    DOCKER_COMPOSE_PATH = '/home/vagrant/PFE/docker-compose.yml'
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/choukskander/PFE_Express.js.git'
      }
    }

    stage('Build and Deploy') {
      steps {
        dir('/home/vagrant/PFE') {
          sh 'docker-compose down'
          sh 'docker-compose up --build -d'
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished'
    }
  }
}
