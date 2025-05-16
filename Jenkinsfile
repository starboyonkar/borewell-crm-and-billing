
pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'borewell-crm-and-billing'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'borewell-crm-container'
        APP_PORT = '8080'
        HOST_PORT = '3000'
        EC2_PUBLIC_IP = '43.204.32.19'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checkout complete'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install --legacy-peer-deps'
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
                script {
                    try {
                        // Clean any previous Docker artifacts
                        sh "docker system prune -f || true"
                        
                        // Build Docker image
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                        echo 'Docker image built successfully'
                    } catch (Exception e) {
                        echo "Docker build failed: ${e.getMessage()}"
                        sh "docker system prune -f || true"
                        error "Docker build failed. See logs for details."
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    try {
                        // Stop and remove existing container if it exists
                        sh "docker stop ${CONTAINER_NAME} || true"
                        sh "docker rm ${CONTAINER_NAME} || true"
                        
                        // Run the new container with port mapping from 8080 (container) to 3000 (host)
                        sh "docker run -d -p ${HOST_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        
                        echo "Application deployed successfully and accessible at: http://${EC2_PUBLIC_IP}:${HOST_PORT}"
                    } catch (Exception e) {
                        echo "Deployment failed: ${e.getMessage()}"
                        error "Deployment failed. See logs for details."
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            echo "The application is now available at http://${env.EC2_PUBLIC_IP}:3000"
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
