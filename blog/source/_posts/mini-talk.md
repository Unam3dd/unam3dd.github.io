---
title: 42 Mini-Talk Report 📘
description: The purpose of this project is to code a small data exchange program using UNIX signals. It is an introductory project for the bigger UNIX projects that will appear later on in the cursus. 
tags:
  - programming
  - c
  - unix-logic
  - rigor
  - unix
  - ipc
  - signal
  - process
categories:
  - dev
  - 42project
date: 2024-05-16 11:00:04
---

![IPC](/images/ipc.png)

## Introduction
MiniTalk is a project assigned within the curriculum of 42 School, designed to introduce students to inter-process communication (IPC) through signal handling in Unix-based systems. The project involves implementing a simple client-server communication protocol using signals, where the client sends messages to the server, and the server displays the received messages. Through MiniTalk, students gain practical experience in working with signals and IPC mechanisms.

## Project Description
The MiniTalk project requires students to develop a client-server application in which the client sends messages to the server using signals. The server, upon receiving a message signal from the client, decodes and displays the message. The project emphasizes understanding signal handling, signal transmission, and message decoding. Additionally, students learn about signal safety and synchronization techniques to ensure reliable communication between the client and server processes.

## Goals and Objectives
- Gain understanding of inter-process communication (IPC) concepts.
- Learn to implement signal handling mechanisms in Unix-based systems.
- Develop client-server communication protocol using signals.
- Enhance skills in message decoding and signal synchronization.

## Inter-Process Communication (IPC)
Inter-process communication (IPC) refers to the mechanisms provided by an operating system that allows processes to communicate with each other and synchronize their actions. IPC is essential for building complex systems where multiple processes need to collaborate or exchange data.

### Examples of IPC Mechanisms:
1. **Pipes**: Pipes are one-way communication channels that allow the output of one process to be connected directly to the input of another process. They are commonly used for communication between related processes, such as a parent process and its child process. used in `pipex` project from 42 school.

2. **Named Pipes (FIFOs)**: Named pipes, also known as FIFOs (First-In-First-Out), are similar to pipes but have a name in the file system. They can be used for communication between unrelated processes, as they exist independently of the processes that create them.

3. **Shared Memory**: Shared memory allows multiple processes to share a region of memory, enabling them to communicate by reading and writing to the same memory area. It is one of the fastest IPC mechanisms but requires careful synchronization to avoid race conditions. like `redis`

4. **Message Queues**: Message queues provide a mechanism for processes to communicate by sending and receiving messages. Messages are stored in a queue and can be retrieved by processes in the order they were sent. Message queues are often used for asynchronous communication between processes. like `RabbitMQ` or `redis`

5. **Signals**: Signals are software interrupts used to notify a process of an event or to request the process to perform a specific action. Signals can be used for simple communication between processes, such as MiniTalk's client-server communication protocol.

## Personal Recommendation
My recommendation for this project is to thoroughly understand the concepts of signal handling and IPC before diving into implementation. Experiment with different IPC mechanisms and signal transmission methods to gain a deeper understanding of inter-process communication. Additionally, pay attention to synchronization techniques and signal safety practices to ensure reliable communication between processes. Overall, embrace the learning experience offered by MiniTalk and enjoy exploring the fascinating world of IPC in Unix-based systems!

## Conclusion
The MiniTalk project provides students with a hands-on learning experience in inter-process communication using signals in Unix-based systems. By implementing a simple client-server communication protocol, students gain practical insights into signal handling, IPC mechanisms, and message decoding techniques. Through experimentation and exploration, students develop a deeper understanding of signal-based communication and acquire valuable skills applicable in various system programming scenarios.

🚀 Let the signal-based communication journey begin! 💬

**Note**: `SIGUSR1` and `SIGUSR2` signals can be utilized to transmit information between the client and server processes.

## Screenshot
![Minitalk](/images/minitalk.png)

## References

- Unix Signals: [GeeksforGeeks](https://www.geeksforgeeks.org/signals-c-language/)
- IPC in Unix: [Tutorialspoint](https://www.tutorialspoint.com/unix/unix-inter-process-communication.htm)
- My MiniTalk: [Minitalk](https://github.com/Unam3dd/minitalk_)

## Subject
you can download the subject just [here](/images/minitalk.pdf)
