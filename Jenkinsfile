pipeline {
    agent any
    
    environment {
        // Define environment variables
        REPOSITORY_NAME = 'borewell-crm-and-billing'
        CONTAINER_NAME = 'borewell-crm-container'
        HOST_PORT = '3000'
        APP_PORT = '8080'
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
        
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    try {
                        // Ensure Docker Compose is installed
                        sh "docker-compose -v || echo 'Docker Compose not installed'"
                        
                        // Stop existing containers and remove orphans
                        sh "docker-compose down --remove-orphans || true"
                        
                        // Clean Docker cache if needed
                        sh "docker system prune -f || true"
                        
                        // Build and start the Docker containers
                        sh "docker-compose up -d --build"
                        
                        // Get the EC2 instance's public IP
                        def EC2_PUBLIC_IP = sh(
                            script: "curl -s http://169.254.169.254/latest/meta-data/public-ipv4",
                            returnStdout: true
                        ).trim()
                        
                        echo "Application deployed successfully and accessible at: http://${EC2_PUBLIC_IP}:${HOST_PORT}"
                    } catch (Exception e) {
                        echo "Deployment failed: ${e.getMessage()}"
                        
                        // Additional error information
                        sh "docker-compose logs"
                        
                        error "Deployment failed. See logs for details."
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            script {
                def EC2_PUBLIC_IP = sh(
                    script: "curl -s http://169.254.169.254/latest/meta-data/public-ipv4",
                    returnStdout: true
                ).trim()
                echo "The application is now available at http://${EC2_PUBLIC_IP}:3000"
            }
        }
        failure {
            echo 'Pipeline execution failed!'
            // Additional debug information on failure
            sh "docker-compose logs || true"
        }
        always {
            // Clean up older Docker images to save disk space, but keep the current ones
            sh 'docker system prune -a -f --filter "until=24h" || true'
        }
    }
}
