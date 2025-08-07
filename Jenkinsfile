pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = '1.29.2'
    }

    stages {
        stage('Install Docker Compose if missing') {
            steps {
                sh '''
                if ! command -v docker-compose &> /dev/null
                then
                    echo "Docker Compose not found. Installing..."
                    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                    sudo chmod +x /usr/local/bin/docker-compose
                else
                    echo "Docker Compose is already installed."
                fi
                '''
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'Server',
                    url: 'https://github.com/choukskander/PFE_Express.js.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh '''
                docker-compose down || true
                docker-compose up --build -d
                '''
            }
        }
    }
}
