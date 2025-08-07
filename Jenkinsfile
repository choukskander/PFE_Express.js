pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'Server', 
                     url: 'https://github.com/choukskander/PFE_Express.js.git',
                     credentialsId: 'github-token'
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
}