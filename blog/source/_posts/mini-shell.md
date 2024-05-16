---
title: Mini-Shell Report📘
description: L'objectif de ce projet est de créer un simple shell. 
tags:
  - programming
  - c
  - algorithms
  - shell
  - pipes
  - readlines
  - tokenizer
  - linked-list
  - bash
  - zsh
  - valgrind
  - terminal
categories:
  - dev
  - 42project
date: 2024-05-16 12:29:10
---

![terminal](/images/terminal.jpg)

## Project Description
Minishell is a project assigned in 42School, a coding school known for its hands-on approach to learning and emphasis on peer collaboration. It serves as a fundamental exercise in system programming and software development. The project requires students to develop their own version of a Unix shell, a command-line interface to interact with the operating system.

The Minishell project immerses students into the intricate world of Unix shells, offering a hands-on exploration of concepts such as process management, environment variables, signal handling, and command execution. By building a simplified shell, students gain insights into the underlying mechanisms of shells like Bash or Zsh, enhancing their understanding of operating system principles and C programming.

## Key Features
1. **Command Prompt:** Users are greeted with a command prompt, where they can input commands and interact with the shell.
2. **Parsing:** Minishell parses user input to identify commands and arguments accurately, handling complex command structures.
3. **Execution:** The shell executes commands entered by the user, whether they are built-in commands or external programs.
4. **Environment Variables:** Users can manage environment variables, including setting, unsetting, and displaying them as needed.
5. **Signal Handling:** Minishell appropriately handles signals such as Ctrl+C (SIGINT) and Ctrl+D (EOF), ensuring a responsive and user-friendly experience.
6. **Redirection:** Support for input and output redirection enables users to manipulate standard input and output streams, facilitating advanced command workflows.
7. **Pipes:** The shell supports piping, allowing users to chain commands together and create powerful command pipelines.

## Project Structure
1. **Parsing Module:** Responsible for parsing user input and breaking it down into commands and arguments, utilizing techniques such as tokenization and abstract syntax trees (AST).
2. **Execution Module:** Manages the execution of commands, handling both built-in commands and external programs using efficient process management techniques.
3. **Environment Module:** Handles environment variables, providing functionality to set, unset, and display environment variables, ensuring a flexible and customizable shell environment.
4. **Signal Handling Module:** Deals with signals such as SIGINT and SIGQUIT, implementing graceful termination and error handling strategies to maintain shell stability.
5. **Redirection and Pipes Module:** Implements input and output redirection, as well as piping functionality, using file descriptors and inter-process communication mechanisms like Unix pipes.

## Challenges
1. Parsing Complex Commands: Handling complex command structures, including nested commands, quotes, and special characters, requires robust parsing logic and error handling.
2. Managing Processes: Ensuring proper creation, management, and termination of processes, especially when dealing with background processes and job control.
3. Signal Handling: Implementing signal handlers to manage signals effectively while maintaining shell responsiveness and stability.
4. Redirection and Pipes: Managing input and output redirection, as well as piping functionality, requires careful handling of file descriptors and communication between processes.

## Learning Outcomes
1. **Understanding of Operating System Concepts:** Students gain insight into fundamental operating system principles, including process management, file I/O, and inter-process communication.
2. **Proficiency in C Programming:** By working extensively with the C programming language, students enhance their skills in memory management, pointer manipulation, and system calls.
3. **Problem-Solving Skills:** Tackling the challenges of Minishell cultivates problem-solving abilities, critical thinking, and debugging skills, essential for software development.
4. **Collaboration and Peer Learning:** Minishell is often completed in teams, fostering collaboration, communication, and peer learning among students, mimicking real-world software development environments.

## Recommended Libraries
- **Readline GNU Library:** While not necessary, the Readline GNU library is recommended for implementing command-line editing and history features in Minishell. It can enhance the user experience and simplify input handling.

## Builtins required for the project
`Minishell` supports a set of built-in commands that are executed directly by the shell without spawning a new process, providing functionalities such as changing directories (`cd`), printing the current working directory (`pwd`), and managing environment variables (`export`, `unset`).

![msh](/images/minishell.png)

## References
- [Unix Shell](https://en.wikipedia.org/wiki/Unix_shell)
- [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell))
- [Zsh](https://en.wikipedia.org/wiki/Z_shell)
- [My MiniShell OutDated version](https://github.com/Unam3dd/NeoShell)
- [Architecture of Open Source Applications - The Bourne-Again Shell](https://aosabook.org/en/v1/bash.html)
- [Readline - Wikipedia](https://en.wikipedia.org/wiki/GNU_Readline)
- [Let's build a linux shell - Part III](https://medium.com/swlh/lets-build-a-linux-shell-part-iii-a472c0102849)
- [Readline - Library](https://tiswww.case.edu/php/chet/readline/readline.html)
- [Readline - Man Pages](https://www.man7.org/linux/man-pages/man3/readline.3.html)
- [Parsing](https://en.wikipedia.org/wiki/Parsing)
- [Lexer](https://en.wikipedia.org/wiki/Lexical_analysis)
- [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- [Linked List](https://en.wikipedia.org/wiki/Linked_list)

Overall, Minishell is a challenging yet rewarding project that allows students to delve into the intricacies of Unix shells, solidify their understanding of system programming concepts, and hone their coding skills through practical application and hands-on experience. 🚀🐧🔧📚💻🔍.

## Subject
![Subject](/images/minishell.pdf)
