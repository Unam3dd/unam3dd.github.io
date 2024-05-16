---
title: 42 Micro-Shell Report📘
tags:
  - 42exam
  - programming
  - c
  - pipes
  - ipc
  - shell
  - process
categories:
  - dev
  - 42project
date: 2024-05-16 13:26:44
---

## Warning: ⚠️ Exam Spoiler 🚧

![crab-micro-shell.png](/images/micro-shell-crab.png)

## Project Description 🚀💻🐚🔧
Exam04, commonly known as Microshell, is a project assigned in 42 School, a renowned coding school known for its immersive and practical approach to learning. Microshell challenges students to develop a minimalist Unix shell, often referred to as a "microshell," which provides basic command-line functionality similar to popular Unix shells like Bash or Zsh.

The primary goal of Microshell is to familiarize students with fundamental concepts of shell programming, including command execution, input/output redirection, piping, and basic error handling. Students are tasked with implementing a lightweight shell capable of interpreting user commands, executing them, and handling basic I/O operations.

## Key Features
1. Command Interpretation: Microshell interprets user commands entered via the command-line interface.
2. Command Execution: The shell executes commands entered by the user, including both built-in commands and external programs.
3. Input/Output Redirection: Support for input and output redirection, allowing users to redirect standard input and output streams.
4. Pipelines: Microshell supports command pipelines, enabling users to chain commands together, with the output of one command serving as the input to another.
5. Basic Error Handling: Provides basic error handling mechanisms to notify users of invalid commands or execution failures.

## Project Structure
1. Command Parsing Module: Responsible for parsing user input and breaking it down into commands and arguments.
2. Execution Module: Handles the execution of commands, including both built-in commands and external programs.
3. Redirection and Pipes Module: Implements input and output redirection, as well as piping functionality.
4. Error Handling Module: Deals with errors encountered during command execution, providing informative error messages to users.

## Challenges
1. Parsing User Input: Properly parsing user input to identify commands, arguments, and redirection/pipeline operators.
2. Command Execution: Ensuring correct execution of commands, including handling of built-in commands, external programs, and error conditions.
3. Input/Output Redirection: Implementing input and output redirection features, including file descriptor manipulation and error checking.
4. Pipeline Implementation: Managing command pipelines efficiently, including handling inter-process communication and synchronization.

## Learning Outcomes
1. Understanding of Shell Programming Concepts: Students gain insight into shell programming concepts, including command interpretation, process management, and I/O redirection.
2. Proficiency in C Programming: Through the implementation of Microshell, students enhance their C programming skills, particularly in areas such as string manipulation, memory management, and system calls.
3. Problem-Solving Skills: Tackling the challenges of Microshell fosters problem-solving abilities, critical thinking, and debugging skills essential for software development.
4. Independent Learning: Microshell encourages independent learning and exploration of Unix shell concepts, empowering students to delve deeper into shell programming beyond the project requirements.

Overall, Exam04 - Microshell is a stimulating project that allows students to explore the fundamentals of shell programming, refine their coding skills, and gain practical experience in developing software for Unix-like systems. 🚀💻🐚🔧

## Code MicroShell
```c
#include <unistd.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>

typedef enum pipe_flag_t pipe_flag_t;

enum pipe_flag_t
{
	READ,
	WRITE
};

void	ft_putstr_fd(int fd, const char *str)
{
	if (!str)
		return ;
	char *tmp = (char *)str;
	while (*tmp)
		tmp++;
	write(fd, str, tmp - str);
}

void	ft_error(const char *path, const char *str)
{
	ft_putstr_fd(STDERR_FILENO, "error: ");
	if (path)
		ft_putstr_fd(STDERR_FILENO, path);
	ft_putstr_fd(STDERR_FILENO, str);
}

void	ft_cd(const char *str)
{
	if (!str)
		ft_putstr_fd(STDERR_FILENO, "error: cd: bad arguments\n");
	if (chdir(str) < 0) {
		ft_putstr_fd(STDERR_FILENO, "error: cd: cannot change directory to ");
		ft_putstr_fd(STDERR_FILENO, str);
		ft_putstr_fd(STDERR_FILENO, "\n");
	}
}

int main(int ac, char **av, char **env)
{
	if (ac < 2)
		return (1);

	int fd[2] = {0, 0};
	int tmp = dup(STDIN_FILENO);
	int i = 1;

	while (av[i])
	{
		av = &av[i];

		i = 0;

		while (av[i] && strcmp(av[i], ";") && strcmp(av[i], "|"))
			i++;

		if (av[0] && !strcmp(av[0], "cd")) {
			if (i != 2) {
				ft_putstr_fd(STDERR_FILENO, "error: cd: bad arguments\n");
				continue ;
			}
			ft_cd(av[1]);
			continue ;
		}

		if (av[i] && !strcmp(av[i], "|")) {
			if (pipe(fd) < 0) {
				ft_putstr_fd(STDERR_FILENO, "error: fatal\n");
				break ;
			}

			av[i] = NULL;
	
			if (av[0] && !fork()) {
				close(fd[READ]); // on a pas besoin de lire, il n'y a pas de data
				dup2(fd[WRITE], STDOUT_FILENO);
				close(fd[WRITE]); // pour que pipe work on dois la fermer
				dup2(tmp, STDIN_FILENO);
				close(tmp);
				execve(av[0], av, env);
				ft_putstr_fd(STDERR_FILENO, "error: cannot execute ");
				ft_putstr_fd(STDERR_FILENO, av[0]);
				ft_putstr_fd(STDERR_FILENO, "\n");
				exit(1);
			}

			close(fd[WRITE]); // on ecrit pas
			close(tmp);
			tmp = fd[READ];
			i++;
			continue ;
		}

		if ((!av[i] || !strcmp(av[i], ";")))
		{
			if (av[i] && !strcmp(av[i], ";")) {
				av[i] = NULL;
				i++;
			}

			if (av[0] && !fork()) {
				dup2(tmp, STDIN_FILENO);
				close(tmp);
				execve(av[0], av, env);
				ft_putstr_fd(STDERR_FILENO, "error: cannot execute ");
				ft_putstr_fd(STDERR_FILENO, av[0]);
				ft_putstr_fd(STDERR_FILENO, "\n");
				exit(1);
			}
			close(tmp);
			while (waitpid(-1, NULL, WUNTRACED) != -1);
			tmp = dup(STDIN_FILENO);
		}
	}
	close(tmp);
	return (0);
}
```


