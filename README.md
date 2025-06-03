## 🌟 “End-to-End CI/CD Pipeline for a Containerized React + Node.js Web App Using GitHub, Jenkins & Docker on AWS with Automated Deployment”

Welcome to the Borewell CRM and Billing Application — a modern, responsive web app built using **Vite + React + Tailwind CSS + TypeScript** and containerized with **Docker**, deployed using **Jenkins CI/CD** on an **AWS EC2** server.

---

## 🌐 Live Application

**URL:** https://borewell-crm-billing.netlify.app/

_Replace `<YOUR_EC2_PUBLIC_IP>` with your actual EC2 IP._

---

![Borewell_CRM-Billing_page-0001](https://github.com/user-attachments/assets/2dad33c0-93fc-489d-802f-08af5789841d)

---

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Docker](https://www.docker.com/)
- [Jenkins](https://www.jenkins.io/)

---

## 🧑‍💻 Local Development

> **Requirements**: Node.js, npm, git

### Step-by-Step:

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_REPO_URL>

# Step 2: Navigate to the project folder
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install --legacy-peer-deps

# Step 4: Start local development server
npm run dev


# 🚀 Jenkins + Docker + NodeJS Setup on Amazon Linux 2 (EC2)

This guide includes all commands used to install and configure **Jenkins**, **Docker**, **Node.js**, **Nginx**, and related tools on an EC2 instance running Amazon Linux 2.

---

## 🛠️ Update and Upgrade System
```bash
sudo yum update -y
sudo yum upgrade
```

---

## 👤 Switch to Superuser (Optional)
```bash
sudo su -
```

---

## 🔧 Install Java 17 (OpenJDK / Amazon Corretto)
```bash
sudo yum install -y java-17-openjdk
# OR for Amazon Corretto
sudo amazon-linux-extras enable corretto17
sudo yum install -y java-17-amazon-corretto
java --version
```

---

## ☕ Install Jenkins
```bash
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install -y jenkins
jenkins --version
```

### ✅ Start and Enable Jenkins
```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```

---

## 🔑 Jenkins Initial Admin Password
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 🐙 Install Git
```bash
git --version
```

---

## 🐳 Install Docker
```bash
sudo amazon-linux-extras install docker -y
# OR
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
docker --version
```

### 🔄 Add Users to Docker Group
```bash
sudo usermod -aG docker ec2-user
sudo usermod -aG docker jenkins
sudo reboot
```

### 🧪 Docker Test
```bash
docker run hello-world
docker ps
docker images
```

---

## 🌐 Install Nginx
```bash
sudo amazon-linux-extras install nginx1 -y
# OR
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🧰 Install Node.js and npm
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs npm
nodejs --version
npm --version
```

---

## 📦 Setup Project Repository
```bash
git clone https://github.com/starboyonkar/borewell-crm-and-billing.git
cd borewell-crm-and-billing
npm install --legacy-peer-deps
```

---

## 🐳 Build Docker Image for App
```bash
docker build --progress=plain -t test-app .
docker build -t test-image .
```

---

## 📊 System Monitoring Commands for Amazon Linux

To monitor CPU, memory, and network traffic on your Amazon Linux EC2 instance, use the following commands:

# Real-time CPU and memory usage
```bash
top
```
# Detailed memory usage
```bash
free -m
```
# Summary of system usage (CPU, memory, disk, network)
```bash
vmstat 1
```
# Detailed performance report (requires sysstat)
```bash
sudo yum install sysstat -y
mpstat -P ALL 1
```
---

## 📡 Network Traffic Monitoring
```bash
ifconfig
```
# Real-time network traffic (requires iftop)
```bash
sudo yum install iftop -y
sudo iftop
```

---

## 🔁 Restart Jenkins (If Needed)
```bash
sudo systemctl restart jenkins
```

---

## 🌍 Access Jenkins
Open your browser and go to:
```text
http://<your-ec2-public-ip>:8080
```
Example:
```text
http://43.204.32.19:8080
```

---

## 📚 Notes
- Always restart the instance or log out and back in after modifying user groups.
- Make sure required ports (e.g., 8080 for Jenkins, 80 for Nginx) are open in EC2 security groups.

---

## ✅ Confirmed Versions
```bash
java --version
jenkins --version
git --version
docker --version
nodejs --version
npm --version
```

---

## 📚 Project Purpose

This project was developed as part of a hands-on learning experience to understand the end-to-end process of modern web application deployment using:

- **Jenkins CI/CD**
- **Docker**
- **React + Vite**
- **Amazon EC2 (Linux)**
- **Nginx reverse proxy**
- **GitHub integration**

It covers building, testing, containerizing, and deploying a full-stack web application in a real server environment — with a focus on **DevOps principles** and **cloud infrastructure**.

---

## 👤 Author Profile

**Name:** Onkar Chaugule  
🎓 **Education:** BTech in Electronics & Telecommunication  
📍 **Location:** Solapur, Maharashtra, India  
💼 **Interests:** DevOps, Embedded IoT, Cloud Engineering, Full-Stack Development  
📧 **Email:** onkarchougule501@gmail.com  
🔗 **LinkedIn:** [linkedin.com/in/onkar-chaugule](https://linkedin.com/in/onkar-chaugule)

---

> 🛠️ *This repository is maintained as an educational project. Contributions and feedback are welcome!*  
> ⭐ *If you find it useful, feel free to star and share!*



