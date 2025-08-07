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
                // Utiliser le workspace par défaut de Jenkins
                sh 'docker-compose down || true'
                sh 'docker-compose up --build -d'
            }
        }
    }
}
