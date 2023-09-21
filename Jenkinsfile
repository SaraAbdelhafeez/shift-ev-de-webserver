pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'your-credentials-id', url: 'https://github.com/your-repo.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install --save-dev jest'
                sh 'npm install'
            }
        }

        stage('Syntax Check') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npx jest'
            }
        }
    }
}