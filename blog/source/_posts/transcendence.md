---
title: 42 Transcendence Report📘
tags:
  - programming
  - typescript
  - nestjs
  - angular
  - docker
  - nginx
  - websocket
  - socketio
  - postgresql
  - typeORM
  - snyk
  - RESTAPI
categories:
  - dev
  - 42project
date: 2024-05-16 16:23:29
---

![nestjs](/images/nestjs.png)
![nginx](/images/nginx.png)
![snyk](/images/snyk.png)

## Project Description
Transcendence is an ambitious project assigned at 42 School, aimed at creating a dynamic web platform that seamlessly integrates social networking features with real-time multiplayer gaming. The project leverages modern technologies such as NestJS for REST API development, AngularJS for frontend implementation, and Socket.IO for WebSocket communication. Additionally, Transcendence implements reverse proxy setup with NGINX for backend services and incorporates Single Sign-On (SSO) authentication with the 42 API, along with Two-Factor Authentication (2FA) for enhanced security.

## Key Features
1. **Social Network Integration:** Users can create personalized profiles, connect with friends, exchange messages, and share various types of content such as posts, images, and videos. The social networking aspect of Transcendence fosters community engagement and collaboration among users.
2. **Real-Time Multiplayer Gaming:** Transcendence introduces real-time multiplayer gaming experiences, allowing users to participate in exciting games such as Pong. Players can challenge each other, compete in tournaments, and engage in friendly matches while interacting with friends and fellow gamers.
3. **WebSocket Communication:** The platform utilizes Socket.IO for WebSocket communication, enabling real-time updates, notifications, and chat functionality within the gaming environment.
4. **Reverse Proxy Setup with NGINX:** NGINX serves as a reverse proxy for the backend services, enhancing security, scalability, and performance by efficiently routing incoming requests to the appropriate backend servers.
5. **SSO Authentication with 42 API:** Transcendence implements Single Sign-On (SSO) authentication with the 42 API, allowing users to log in to the platform using their 42 credentials, streamlining the authentication process and providing a seamless user experience.
6. **Two-Factor Authentication (2FA):** To ensure the security of user accounts, Transcendence incorporates Two-Factor Authentication (2FA), adding an extra layer of protection by requiring users to verify their identity using a second factor, such as a mobile device or email.

## Technologies Used
- **NestJS:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications using TypeScript.
- **AngularJS:** A JavaScript-based open-source front-end web framework for developing single-page applications.
- **Socket.IO:** A library for real-time web applications, enabling bidirectional communication between clients and servers using WebSockets.
- **NGINX:** A high-performance web server and reverse proxy server, known for its scalability, reliability, and efficient handling of concurrent connections.
- **42 API:** The API provided by 42 School for user authentication and authorization, enabling Single Sign-On (SSO) authentication with Transcendence.
- **TypeORM:** An Object-Relational Mapping (ORM) library for TypeScript and JavaScript that simplifies database management by providing a query builder and entity manager for interacting with relational databases.
- **Two-Factor Authentication (2FA):** A security mechanism that requires users to provide two different authentication factors to verify their identity, enhancing the security of user accounts.
- **Snyk:** A security platform that helps developers find and fix vulnerabilities in their dependencies and container images, ensuring the security and integrity of the application.
- **Other Tools and Libraries:** Various other tools and libraries are utilized for development, testing, and deployment, ensuring the reliability, security, and performance of the Transcendence platform.
## Security Concerns

- Any password stored in your database must be hashed
- Your website must be protected against SQL injections
- You must implement some kind of server-side validation for forms and any user input
- Please make sure you use a strong password hashing algorithm
- For obvious security reasons, any credentials, API Keys, env variables etc.. must be saved locally in a .env file and ignored by git
- Publicy stored credentials will lead you directly to a failure of the project
## User Account
- The user must login using the OAuth system of 42 intranet
- The user should be able to choose a unique name that will be displayed on the website.
- The user should be able to upload an avatar. If the user doesn't upload an avatar a default one must be set
- The user should be able to enable two-factor authentication. For instance Google authenticator or sending a text message to their phone
- The user should be able to add other users as friends and see their current status (online, offline, in a game, and so forth)
- Stats (such as: wins and losses, ladder level, achievements, and so forth) have to be displayed on the user profile.
- Each user should have a Match history including 1v1 games, ladder, and anything else useful, Anyone who is logged in should be able to consult it

## Chat
- The user should be able to create channels (chat rooms) that can be either public or private or protected by a password
- The user should be able to send direct messages to other users
- The user should be able to block other users? This way they will see no more messages from the account they blocked
- The user who has created a new channel is automatically set as the channel owner until they leave it
- The channel owner can set a password reduired to access the channel change it, and also remove it
- The channel owner is a channel administrator. They can set other users as administrators
- A user who is an administrator of a channel can kick,ban,mute other user, but not the channel owners
- The user should be able to invite other users to play a Pong game through the chat interface
- The user should be able to access other players profiles through the chat interface

## Game
- Therefore users, should be able to play a live Pong game versus another player directly on the website
- There must be a matchmaking system the user can join a queue until they get automatically matched with someone else.
- It can be a canvas game, or it can be a game rendered in 3D, it can also be ugly but in any case it must be faithful to the original Pong (1972)
- You must offer some customization options (for example power-ups or different maps). However the user should be able to select a default version of the game without any extra features if they want to
- The game must be responsive.

## Conclusion
Transcendence represents a cutting-edge project that combines social networking and multiplayer gaming into a seamless and immersive web experience. By leveraging modern technologies such as NestJS, AngularJS, Socket.IO, NGINX, and integrating features such as SSO authentication and 2FA, Transcendence aims to redefine the way users interact and engage with each other online, while ensuring the security and integrity of the platform. 💻🎮🌐

## Reference
- [Typescript Best Pratice](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/typescript-best-practices.html)
- [Typescript (Type vs Interface)](https://codelynx.dev/posts/typescript-type-vs-interface)
-  [How to use 42API](https://api.intra.42.fr/apidoc/guides/web_application_flow) Unit Test [How to test NestJS](https://medium.com/@bhkfazano/testing-your-api-services-with-nestjs-mocking-vs-real-database-bbfe689ed745)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Nginx](https://www.nginx.com/)
- [Snyk](https://snyk.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Prisma](https://www.prisma.io/)
- [SocketIO](https://socket.io/)
- [BETH - TechStack](https://stackademic.com/blog/beth-a-modern-stack-for-the-modern-web)
- [My Transcendence](https://github.com/Unam3dd/transcendence)
- [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)

## Subject

![Subect](/images/transcendence.pdf)
