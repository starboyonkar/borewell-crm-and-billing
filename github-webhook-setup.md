
# GitHub Webhook Setup for Jenkins CI/CD Pipeline

This guide explains how to set up a GitHub webhook to automatically trigger the Jenkins pipeline when code changes are pushed to your repository.

## Prerequisites

- Your GitHub repository: `borewell-crm-and-billing`
- A running Jenkins server with the GitHub plugin installed
- The Jenkins server must be accessible from the internet on port 8080

## Steps to Configure the Webhook

1. **Get your Jenkins webhook URL**
   - In Jenkins, navigate to your project
   - Go to "Configure" > "Build Triggers"
   - Select "GitHub hook trigger for GITScm polling"
   - Save the configuration
   - Your webhook URL will be: `http://YOUR_EC2_PUBLIC_IP:8080/github-webhook/`

2. **Configure the webhook in GitHub**
   - Go to your GitHub repository `borewell-crm-and-billing`
   - Click on "Settings" > "Webhooks" > "Add webhook"
   - Set the Payload URL to your Jenkins webhook URL
   - Content type: select "application/json"
   - Secret: (optional) You can add a secret for additional security
   - Select "Just the push event" (or customize as needed)
   - Ensure "Active" is checked
   - Click "Add webhook"

3. **Test the webhook**
   - Make a small change to your repository and push it
   - Go to your Jenkins pipeline and verify that a new build was triggered automatically

## Troubleshooting

- Check the GitHub webhook delivery history to see if requests were sent successfully
- Verify that your Jenkins server is accessible from the internet on port 8080
- Check Jenkins logs for any errors related to webhook processing
- Ensure the GitHub plugin is properly configured in Jenkins

## Port Configuration

Your EC2 instance has the following ports configured:
- SSH (22): Remote login
- HTTP (80): Public access
- HTTPS (443): SSL access
- Custom TCP (3000): Vite/React application
- Custom TCP (8080): Jenkins

For more detailed information, refer to the [Jenkins GitHub plugin documentation](https://plugins.jenkins.io/github/).
