---
title: 42 Inception Report📘
tags:
  - dev-ops
  - namespace
  - container
  - inception
  - golang
  - docker
  - image
  - docker-compose
  - mvc
categories:
  - dev
  - 42project
date: 2024-05-16 14:22:22
---

![docker](/images/docker.png)

## Project Description
`Inception` is a project assigned in 42 School, a coding school renowned for its practical approach to learning. In this project, students are tasked with building a web application from scratch, demonstrating proficiency in full-stack development, system administration, and deployment techniques.

## Key Features
1. **Nginx Setup:** Configuring Nginx as a web server to serve static content and reverse proxy requests to the WordPress backend.
2. **WordPress with PHP-FPM:** Setting up WordPress with PHP-FPM (FastCGI Process Manager) to handle dynamic content generation and processing PHP scripts.
3. **MariaDB Database:** Configuring MariaDB as the database management system to store WordPress data, including posts, comments, and user information.
4. **Microservices Architecture:** Implementing a microservices architecture where each component (Nginx, WordPress, MariaDB) runs in its own container, allowing for independent scaling, updates, and maintenance.

## Why Docker? 🐳
### Advantages of Docker
- **Containerization:** Docker enables the packaging of applications and their dependencies into lightweight containers, providing consistency across different environments and simplifying the deployment process.
- **Security:** Containers isolate applications from the host system and other containers, reducing the risk of security vulnerabilities and ensuring a more secure environment for running applications.
- **Adaptability:** Docker containers are portable and can run on any platform that supports Docker, making it easy to move applications between development, testing, and production environments.
- **Compatibility:** Docker containers encapsulate everything needed to run an application, including libraries, dependencies, and configuration files, ensuring compatibility across different systems and eliminating dependency conflicts.
- **Performance:** Docker containers have minimal overhead compared to virtual machines, resulting in faster startup times and improved resource utilization.
## Kubernetes Integration 🌐
### Scalability and Orchestration
`Kubernetes` is used for container orchestration, providing a platform for automating deployment, scaling, and management of containerized applications. Key concepts include:
- **Nodes:** Physical or virtual machines that run containers. Kubernetes clusters consist of multiple nodes that work together to provide the computing resources for running applications.
- **Pods:** The smallest deployable units in Kubernetes, consisting of one or more containers that share network and storage resources. Pods are scheduled onto nodes and managed by the Kubernetes control plane.
## Personal Opinion
Docker technologies are amazing, and I use them every day in every project, both personal and professional. Docker has revolutionized the way we build, ship, and run applications, providing a consistent environment from development to production. It's incredible how Docker simplifies the deployment process and ensures that applications run reliably across different environments.
Setting up `Nginx`, `WordPress`, and `MariaDB` using `Docker` is a powerful way to demonstrate proficiency in system administration and deployment techniques. `Docker's` simplicity and portability make it an ideal choice for deploying `microservices` architectures, providing developers with flexibility and control over their infrastructure. 🌟.
## Microservices Architecture
### Example
- **REST API Service:** The `backend` of the web application is divided into `microservices`, with each service responsible for a specific functionality. For example, a REST API service handles HTTP requests and responses for accessing and manipulating data. This service is implemented using a technology stack such as Flask or Django and interacts with a `PostgreSQL` database to store and retrieve data.
- **PostgreSQL Database:** `PostgreSQL` is used as the database management system (DBMS) for the REST API Service. It runs in its own container, ensuring isolation and portability. Docker volumes may be used to persist data across container restarts.
- **Nginx Reverse Proxy:** `Nginx` acts as a reverse proxy, routing incoming requests to the appropriate `microservice` based on predefined rules or routes. This architecture improves scalability, fault tolerance, and maintainability by decoupling components and allowing them to be developed, deployed, and scaled independently.

![mvc1](/images/mvc1.png)
![mvc2](/images/mvc2.png)
![mvc3](/images/mvc3.png)

## Docker Compose
![docker-compose](/images/docker-compose.png)

### Simplifying Multi-Container Deployment
Docker Compose is a tool for defining and running multi-container Docker applications. It allows developers to define the services, networks, and volumes required for a multi-container application in a single YAML file, simplifying the deployment process and enabling easy scaling and orchestration of containers.

## Conclusion
`Inception` project offers students an opportunity to showcase their skills in full-stack development, system administration, and deployment techniques. By leveraging Docker, Kubernetes, and adopting a microservices architecture, students gain valuable experience in modern software development practices, ensuring scalability, security, and maintainability of their applications. 💻🔒🛠️

## Reference
- [Docker](https://www.docker.com/)
- [Inception](https://github.com/Unam3dd/Inception)
- [Docker Hub](https://hub.docker.com/)
- [Dive](https://github.com/wagoodman/dive)
- [ChainGuard](https://www.chainguard.dev/)
- [MicroService Architecture](https://appmaster.io/blog/docker-microservices-architecture)
- [K8S](https://kubernetes.io/fr/)
- [Docker-Compose](https://docs.docker.com/compose/)

## Subject
you can just download [here](/images/inception.pdf)
