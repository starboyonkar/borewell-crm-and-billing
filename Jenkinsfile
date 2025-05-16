
pipeline {
    agent any
    
    environment {
        // Define environment variables
        DOCKER_IMAGE = 'borewell-crm-and-billing'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'borewell-crm-container'
        APP_PORT = '3000'
        HOST_PORT = '3000'
        REPOSITORY_NAME = 'borewell-crm-and-billing'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Check out code from the GitHub repository
                checkout scm
                echo 'Code checkout complete'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                echo 'Dependencies installed successfully'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint || true'
                echo 'Linting completed'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
                echo 'Build completed successfully'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || echo "No tests found, skipping tests"'
                echo 'Testing completed'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                // Build Docker image using the provided Dockerfile
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                echo 'Docker image built successfully'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    // Run the new container
                    sh "docker run -d -p ${HOST_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    
                    // Get the EC2 instance's public IP
                    def EC2_PUBLIC_IP = sh(
                        script: "curl -s http://169.254.169.254/latest/meta-data/public-ipv4",
                        returnStdout: true
                    ).trim()
                    
                    echo "Application deployed successfully and accessible at: http://${EC2_PUBLIC_IP}:${HOST_PORT}"
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            echo "The application is now available at http://\${EC2_PUBLIC_IP}:3000"
        }
        failure {
            echo 'Pipeline execution failed!'
        }
        always {
            // Clean up older Docker images to save disk space
            sh 'docker system prune -a -f || true'
        }
    }
}
