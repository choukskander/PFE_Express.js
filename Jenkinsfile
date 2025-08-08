pipeline {
  agent any
  stages {
    stage('Clone') {
      steps {
        git branch: 'Server', url: 'https://github.com/choukskander/PFE_Express.js.git'
      }
    }
    stage('Build') {
      steps {
        sh 'docker build -t pfe-express:latest .'
      }
    }
    stage('Deploy') {
      steps {
        sh 'docker compose -f /home/vagrant/PFE/docker-compose.yml up -d --build'
      }
    }
  }
}