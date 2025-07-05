# LinkHub: A Full-Stack MERN Application with an End-to-End Serverless CI/CD Pipeline on AWS

<p align="center">
  <img src="YOUR_UI_SCREENSHOT_URL_HERE" alt="LinkHub Dashboard" width="80%">
</p>

This repository contains the source code for **LinkHub**, a modern, full-stack link management application, and the complete infrastructure code to deploy it on AWS using a fully automated, serverless CI/CD pipeline.

The primary goal of this project was to build a real-world application while implementing modern DevOps best practices, including Infrastructure as Code (IaC), containerization, and end-to-end automation.

---

## 🚀 Key Features

-   **Elegant UI:** A professional, responsive user interface built with Next.js and Tailwind CSS.
-   **Full-Stack Functionality:** Complete CRUD (Create, Read, Update, Delete) operations for managing links.
-   **User Authentication:** Secure user registration and login system using JWT.
-   **Advanced Features:** Search, filtering by project, and a polished user experience.
-   **Fully Automated Deployment:** Every `git push` to the `main` branch automatically builds, tests, and deploys the application to the AWS cloud.

---

## 🏛️ Solution Architecture

This project utilizes a modern, cloud-native architecture that separates the application from the infrastructure, ensuring scalability, security, and maintainability.

<p align="center">
  <img src="YOUR_ARCHITECTURE_DIAGRAM_URL_HERE" alt="Solution Architecture">
</p>

**The workflow is as follows:**

1.  **Code Push:** A developer pushes code changes to the GitHub repository.
2.  **CI/CD Pipeline Trigger:** A **GitHub Actions** workflow is automatically triggered.
3.  **Build & Push Docker Images:** The workflow builds Docker images for both the frontend (`client`) and backend (`server`) applications.
4.  **Store Images in ECR:** The newly built images are pushed to **Amazon Elastic Container Registry (ECR)**, a private and secure Docker registry.
5.  **Deploy to ECS:** The workflow then sends a command to **Amazon Elastic Container Service (ECS)** to pull the new images from ECR and deploy them as new tasks, using the **AWS Fargate** serverless compute engine.
6.  **Infrastructure as Code (IaC):** The entire AWS environment—including the VPC, Subnets, Security Groups, ECR repositories, ECS Cluster, Task Definition, and Application Load Balancer—is defined and managed as code using **Terraform**.

---

## 🛠️ Tech Stack & Tools

### Application Stack
-   **Frontend:** Next.js, React, Tailwind CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB Atlas (Cloud Database)
-   **Authentication:** JSON Web Tokens (JWT)

### DevOps & Cloud
-   **Containerization:** Docker, Docker Compose (for local development)
-   **Cloud Provider:** Amazon Web Services (AWS)
-   **Infrastructure as Code:** Terraform
-   **CI/CD:** GitHub Actions
-   **Container Orchestration:** AWS ECS with Fargate
-   **Container Registry:** AWS ECR
-   **Networking & Security:** AWS VPC, Security Groups, Application Load Balancer (ALB)

---

## ✨ CI/CD Pipeline in Action

<p align="center">
  <img src="YOUR_GITHUB_ACTIONS_SCREENSHOT_URL_HERE" alt="GitHub Actions Workflow">
</p>

The automated pipeline handles every step, from building the containers to deploying them in a highly available and scalable environment, ensuring rapid and reliable delivery of new features.

---

## 🌐 Live Demo

The application is deployed on AWS and is publicly accessible.

**[Link to Live Application]**

> **Note:** This is a personal portfolio project. The cloud infrastructure may be spun down periodically to manage costs. If the demo is unavailable, please feel free to run the project locally using `docker-compose`.
