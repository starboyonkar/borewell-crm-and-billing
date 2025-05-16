# 🌟 Borewell CRM & Billing Web App

Welcome to the Borewell CRM and Billing Application — a modern, responsive web app built using **Vite + React + Tailwind CSS + TypeScript** and containerized with **Docker**, deployed using **Jenkins CI/CD** on an **AWS EC2** server.

---

## 🌐 Live Application

**URL:** http://<YOUR_EC2_PUBLIC_IP>:3000  
_Replace `<YOUR_EC2_PUBLIC_IP>` with your actual EC2 IP._

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

👤 Switch to Superuser (Optional)
bash
Copy
Edit
sudo su -
🔧 Install Java 17 (OpenJDK / Amazon Corretto)
bash
Copy
Edit
sudo yum install -y java-17-openjdk
# OR for Amazon Corretto
sudo amazon-linux-extras enable corretto17
sudo yum install -y java-17-amazon-corretto
java --version
☕ Install Jenkins
bash
Copy
Edit
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install -y jenkins
jenkins --version
✅ Start and Enable Jenkins
bash
Copy
Edit
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
🔑 Jenkins Initial Admin Password
bash
Copy
Edit
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
🐙 Install Git
bash
Copy
Edit
git --version
🐳 Install Docker
bash
Copy
Edit
sudo amazon-linux-extras install docker -y
# OR
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
docker --version
🔄 Add Users to Docker Group
bash
Copy
Edit
sudo usermod -aG docker ec2-user
sudo usermod -aG docker jenkins
sudo reboot
🧪 Docker Test
bash
Copy
Edit
docker run hello-world
docker ps
docker images
🌐 Install Nginx
bash
Copy
Edit
sudo amazon-linux-extras install nginx1 -y
# OR
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
🧰 Install Node.js and npm
bash
Copy
Edit
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs npm
nodejs --version
npm --version
📦 Setup Project Repository
bash
Copy
Edit
git clone https://github.com/starboyonkar/borewell-crm-and-billing.git
cd borewell-crm-and-billing
npm install --legacy-peer-deps
🐳 Build Docker Image for App
bash
Copy
Edit
docker build --progress=plain -t test-app .
docker build -t test-image .
🧪 Useful System Utilities
bash
Copy
Edit
top             # Monitor system processes
ps              # List current running processes
df -u           # View disk usage
🔁 Restart Jenkins (If Needed)
bash
Copy
Edit
sudo systemctl restart jenkins
🌍 Access Jenkins
Open your browser and go to:

text
Copy
Edit
http://<your-ec2-public-ip>:8080
Example:

text
Copy
Edit
http://43.204.32.19:8080
📚 Notes
Always restart the instance or log out and back in after modifying user groups.

Make sure required ports (e.g., 8080 for Jenkins, 80 for Nginx) are open in EC2 security groups.

✅ Confirmed Versions
bash
Copy
Edit
java --version
jenkins --version
git --version
docker --version
nodejs --version
npm --version
