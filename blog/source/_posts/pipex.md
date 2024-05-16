---
title: 42 Pipex Report 📘
description: This project aims to deepen your understanding of the two concepts that you already know Redirections and Pipes. It is an introductory project for the bigger UNIX projects that will appear later on in the cursus.
tags:
  - programming
  - c
  - ipc
  - pipes
  - process
  - wait
  - redirections
categories:
  - dev
  - 42project
date: 2024-05-16 11:19:11
---

![[/image/Pasted image 20240513100349.png]]

# Project Overview: Pipex 42 School Project

## Introduction
Pipex is a project assigned within the curriculum of 42 School, designed to introduce students to the concept of pipes in Unix-based systems. The project involves implementing a basic command-line utility similar to the shell's pipeline feature, where the output of one command becomes the input of another command using pipes. Through Pipex, students gain practical experience in working with pipes and understanding how data flows between processes in Unix.

## Project Description
The Pipex project requires students to develop a command-line program that mimics the behavior of shell pipelines. The program takes two commands as arguments, executes them in sequence, and redirects the output of the first command to the input of the second command using pipes. The project emphasizes understanding file descriptors, process execution, and I/O redirection in Unix-based systems. Additionally, students learn about process synchronization and error handling to ensure reliable execution of the pipeline.

## Goals and Objectives
- Gain understanding of pipes and process communication in Unix.
- Learn to implement basic command-line utilities using pipes.
- Understand file descriptors, process execution, and I/O redirection concepts.
- Enhance skills in process synchronization and error handling.

## Pipes in Unix
Pipes are a form of inter-process communication (IPC) that allow data to flow from one process to another. In Unix-based systems, a pipe is represented by a unidirectional communication channel that connects the standard output (stdout) of one process to the standard input (stdin) of another process. Pipes are created using the `pipe()` system call and are typically used to enable communication between related processes, such as in shell pipelines.

### Example Usage of Pipes:
```bash
# Example shell command using pipes
ls -l | grep ".txt"
```
In this example, the output of the `ls -l` command is redirected (piped) as input to the `grep ".txt"` command, allowing `grep` to filter and display only the lines containing the ".txt" pattern.
## Approach

In approaching the Pipex project, students are encouraged to first understand the fundamentals of pipes and process communication in Unix. They then proceed to design and implement the pipeline execution logic, including creating pipes, forking processes, and redirecting I/O streams. Students may explore different strategies for parsing command-line arguments, executing commands, and handling errors to ensure robust functionality of the pipeline.

## Personal Recommendation

My recommendation for this project is to thoroughly understand the concepts of pipes and process communication before diving into implementation. Experiment with different scenarios involving pipes, such as handling multiple commands, handling errors, and managing process synchronization. Additionally, pay attention to error handling and edge cases to ensure the reliability and correctness of the pipeline implementation. Overall, embrace the learning experience offered by Pipex and enjoy exploring the fascinating world of process communication in Unix!

## Conclusion
The Pipex project provides students with a hands-on learning experience in working with pipes and process communication in Unix-based systems. By implementing a basic command-line utility similar to shell pipelines, students gain practical insights into pipes, file descriptors, process execution, and I/O redirection concepts. Through experimentation and exploration, students develop a deeper understanding of process communication mechanisms and acquire valuable skills applicable in various system programming scenarios.

🔗 Let the data flow through the pipes! 💻

**Note**: Pipes are a fundamental concept in Unix-based systems for enabling inter-process communication.

## Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#ifndef BUF_SIZE
#define BUF_SIZE 0x100
#endif

int main(int ac, char **av)
{
    char    buf[BUF_SIZE];
    int     fd[0x2] = {0, 0};
    pid_t   pid = 0;

    memset(buf, 0, sizeof(buf));

    if (ac != 2) {
        fprintf(stdout, "usage %s: <message>\n", av[0]);
        return (1);
    }

    // Create pipe with pipe system call
    if (pipe(fd) < 0) {
        perror("pipe");
        return (1);
    }

    // Show parent process ID
    printf("PID : %d\n", getpid());

    // Create child from parent process
    pid = fork();

    // Child Process
    if (!pid) {
        // Executed in Child process
        printf("PARENT: %d\n", getppid());
        printf("CHILD: %d\n", getpid());

        // You need to close two side of the pipe
        close(fd[0]);
        
        // Write in the pipe the first argument from the input
        write(fd[1], av[1], strlen(av[1]));
        // Exit child process with SUCCESS
        exit(EXIT_SUCCESS);
    }

    // Parent do not need to write so close it
    close(fd[1]);

    printf("[+] Waiting %d child\n", pid);

    // Wait child process from the parent process
    wait(NULL);

    // Reading from the pipe in READ mode because you have write in the pipe with child process.
    if (read(fd[0], buf, sizeof(buf)-1) < 0) {
        perror("read");
        return (1);
    }

    // Close READ pipe file descriptor
    close(fd[0]);

    // Show data transmit to the parent process from the child.
    printf("PID %d : %s\n", getpid(), buf);

    return (0);
}
```

**Sources:**
- Pipes in Unix: [GeeksforGeeks](https://www.geeksforgeeks.org/pipe-system-call-in-c/)
- Unix Process Creation: [IBM Developer](https://developer.ibm.com/tutorials/l-ipc1/)
- Pipe System call: [Pipe System call man page](https://man7.org/linux/man-pages/man2/pipe.2.html) 

## Subject
you can download the subject just here [here](/images/pipex.pdf)
