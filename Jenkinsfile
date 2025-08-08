pipeline {
    agent any
    
    stages {
        stage('Checkout Infrastructure') {
            steps {
                git branch: 'master',
                     url: 'https://github.com/choukskander/PFE_Infrastructure.git',
                     credentialsId: 'github-token'
            }
        }
        
        stage('Checkout Backend') {
            steps {
                dir('Server') {
                    git branch: 'Server',
                         url: 'https://github.com/choukskander/PFE_Express.js.git',
                         credentialsId: 'github-token'
                }
            }
        }
        
        stage('Checkout Frontend') {
            steps {
                dir('Client') {
                    git branch: 'Client',
                         url: 'https://github.com/choukskander/PFE_React.js.git',
                         credentialsId: 'github-token'
                }
            }
        }
        
        stage('Build and Deploy') {
            steps {
                dir('.') {
                    withEnv(["PATH=$PATH:/usr/local/bin"]) {
                        sh '/usr/local/bin/docker-compose down || true'
                        sh '/usr/local/bin/docker-compose up --build -d'
                    }
                }
            }
        }
    }
}