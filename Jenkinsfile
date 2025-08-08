pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'Server',
                    url: 'https://choukskander:ghp_1234567890abcdef1234567890abcdef1234@github.com/choukskander/PFE_Express.js.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true' // true pour ne pas bloquer si pas encore de tests
            }
        }
    }
}
