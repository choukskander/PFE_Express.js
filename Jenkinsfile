pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE = "/usr/local/bin/docker-compose"
    }
    
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
                        sh "${DOCKER_COMPOSE} down || true"
                        sh "${DOCKER_COMPOSE} up --build -d"
                    }
                }
            }
        }
    }
}