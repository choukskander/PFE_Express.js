pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-token' // ID des credentials Jenkins (username + token GitHub)
        REPO_URL = 'https://github.com/choukskander/PFE_Express.js.git'
    }

    stages {
        stage('Checkout Backend') {
            steps {
                dir('Server') {
                    deleteDir() // Supprime dossier pour éviter dépôt vide
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/Server']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            url: "${REPO_URL}",
                            credentialsId: "${GITHUB_CREDENTIALS}"
                        ]]
                    ])
                }
            }
        }

        stage('Checkout Frontend') {
            steps {
                dir('Client') {
                    deleteDir()
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/Client']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            url: "${REPO_URL}",
                            credentialsId: "${GITHUB_CREDENTIALS}"
                        ]]
                    ])
                }
            }
        }

        stage('Checkout Infra') {
            steps {
                dir('Infra') {
                    deleteDir()
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/master']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            url: "${REPO_URL}",
                            credentialsId: "${GITHUB_CREDENTIALS}"
                        ]]
                    ])
                }
            }
        }

        stage('Build and Run with Docker Compose') {
            steps {
                sh '''
                    cd Infra
                    docker compose down
                    docker compose up -d --build
                '''
            }
        }
    }
}
