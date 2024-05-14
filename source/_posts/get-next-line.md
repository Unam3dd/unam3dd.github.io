---
title: Get Next Line Report 📘
description: Whether it's a file, stdin, or even later a network connection, you'll always need a way to read content line by line. It's time to start working on this function, which will be essential for your future projects. 
tags:
  - algorithms
  - unix-logic
  - rigor
  - c
  - programming
categories:
  - dev
  - 42project
date: 2024-05-14 11:38:52
---
# Project Overview: Get Next Line (GNL) 

## Introduction
Get Next Line (GNL) is a project assigned by 42 School, designed to enhance students' proficiency in C programming and file input/output operations. The project challenges students to create a function that reads a line ending with a newline character (`'\n'`) from a file descriptor (FD), and then returns that line without the newline character.

## Objective
The main objective of the Get Next Line project is to familiarize students with buffer management, dynamic memory allocation, and the handling of file descriptors in C programming. This project also aims to improve students' problem-solving skills by implementing an efficient algorithm to read and manage input from files. 📚

## Features
1. **Reading from File Descriptor:** The GNL function is capable of reading from a file descriptor provided by the user.
2. **Dynamic Memory Allocation:** It dynamically allocates memory to store the read line, ensuring efficient memory usage.
3. **Buffer Management:** The function efficiently manages the buffer to handle cases where the requested line spans multiple buffer reads.
4. **Error Handling:** It provides robust error handling mechanisms to deal with potential errors during file reading and memory allocation. ⚠️

## Implementation
The implementation of Get Next Line involves reading each block of characters from the file descriptor (FD) into a buffer and processing it to extract the desired line. Here's how it works:

1. **Initialization:** The function initializes necessary variables, including the buffer to store characters read from the file descriptor.

2. **Reading Line:** The function reads characters from the file descriptor into the buffer. It reads one block (or buffer size) at a time until it encounters a newline character (`'\n'`) or reaches the end of file (EOF).

3. **Buffer Management:** If a newline character is found within the buffer, the function extracts the line up to that point and returns it. If the newline character is not found, the function continues reading from the file descriptor into the buffer until it finds the newline character or reaches the end of file.

4. **Error Handling:** Throughout this process, the function handles potential errors such as invalid file descriptors, memory allocation failures, and end-of-file conditions gracefully.

By reading and processing the file block by block, the Get Next Line function can efficiently handle files of varying sizes while minimizing memory usage. This approach also ensures that the function can handle lines of arbitrary lengths.


## Conclusion
The Get Next Line project is an essential exercise for 42 School students to strengthen their understanding of file input/output operations and memory management in C programming. By successfully completing this project, students gain valuable experience in dealing with real-world challenges encountered in software development. 🚀

## Resources

[Project](https://github.com/Unam3dd/GNL)

## Code Part

`get_next_line.h`

```c
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.h                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: stales <stales@student.42.angouleme.fr>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/14 19:19:47 by stales            #+#    #+#             */
/*   Updated: 2022/04/14 19:56:30 by stales           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef GET_NEXT_LINE_H
# define GET_NEXT_LINE_H

# include <stddef.h>
# ifndef MAX_FD
#  define MAX_FD 0x400
# endif
# ifndef BUFFER_SIZE
#  define BUFFER_SIZE 42
# endif

size_t		ft_len(char *s);
char		*ft_memchr(char *buf, unsigned char c);
char		*ft_memjoin(char *s1, char *s2);
char		*ft_stash(char *s);
char		*ft_read(int fd, char *buf);
char		*ft_line(char *buf);
char		*get_next_line(int fd);

#endif
```


`get_next_line.c`

```c
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: stales <stales@student.42.angouleme.fr>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/14 19:26:22 by stales            #+#    #+#             */
/*   Updated: 2022/04/14 19:50:02 by stales           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"
#include <unistd.h>
#include <stdlib.h>

char	*ft_read(int fd, char *buf)
{
	char	*tmp;
	int		bytes;

	if (!buf)
		return (NULL);
	tmp = (char *)malloc(sizeof(char) * BUFFER_SIZE + 1);
	if (!tmp)
		return (NULL);
	bytes = 1;
	while (bytes && !ft_memchr(buf, '\n'))
	{
		bytes = read(fd, tmp, BUFFER_SIZE);
		if (bytes < 0)
			break ;
		tmp[bytes] = 0;
		buf = ft_memjoin(buf, tmp);
	}
	free(tmp);
	tmp = NULL;
	if (bytes < 0 || !*buf)
	{
		free(buf);
		buf = NULL;
	}
	return (buf);
}

char	*ft_stash(char *s)
{
	char	*new;
	char	*start;
	char	*tmp;

	if (!s)
		return (NULL);
	start = ft_memchr(s, '\n');
	if (!start)
		return (NULL);
	new = (char *)malloc((ft_len(s) - (start - s)) + 1);
	if (!new)
		return (NULL);
	tmp = new;
	while (*start)
		*tmp++ = *start++;
	*tmp = 0;
	free(s);
	s = NULL;
	return (new);
}

char	*ft_line(char *buf)
{
	char	*tmp;
	char	*new;
	char	*end;

	end = ft_memchr(buf, '\n');
	if (!end)
		return (buf);
	new = (char *)malloc(end - buf + 1);
	if (!new)
		return (NULL);
	tmp = new;
	while (buf < end)
		*tmp++ = *buf++;
	*tmp = 0;
	return (new);
}

char	*get_next_line(int fd)
{
	static char	*buf;
	char		*line;

	if (fd < 0 || BUFFER_SIZE <= 0 || fd > MAX_FD)
		return (NULL);
	if (!buf)
	{
		buf = (char *)malloc(BUFFER_SIZE + 1);
		if (!buf)
			return (NULL);
		buf[0] = 0;
	}
	buf = ft_read(fd, buf);
	if (buf == NULL)
	{
		free(buf);
		buf = NULL;
	}
	line = ft_line(buf);
	buf = ft_stash(buf);
	return (line);
}
```

`get_next_line_utils.c`

```c
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line_utils.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: stales <stales@student.42.angouleme.fr>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/13 20:19:33 by stales            #+#    #+#             */
/*   Updated: 2022/04/14 19:50:05 by stales           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"
#include <stdlib.h>

size_t	ft_len(char *s)
{
	char	*tmp;

	tmp = s;
	while (*tmp)
		tmp++;
	return (tmp - s);
}

char	*ft_memchr(char *buf, unsigned char c)
{
	if (!buf)
		return (NULL);
	while (*buf && *buf != c)
		buf++;
	if (!*buf)
		return (NULL);
	return (++buf);
}

char	*ft_memjoin(char *s1, char *s2)
{
	char	*new;
	char	*tmp;
	char	*save;

	new = (char *)malloc(ft_len(s1) + ft_len(s2) + 1);
	if (!new)
		return (NULL);
	*new = 0;
	save = new;
	tmp = s1;
	while (*tmp)
		*new++ = *tmp++;
	if (s1)
	{
		free(s1);
		s1 = NULL;
	}
	while (new && *s2)
		*new++ = *s2++;
	*new = 0;
	return (save);
}
```

**Note** : Personally i didn't like the project because i find it useless and not optimised in my opinion reading a file line by line and not block by block is not very efficient i recommend you always load the file only once into your memory or if it's rather small load it into the stack to avoid dynamic allocations but for a large file i advise you to just allocate a large memory block the size of the file then write the file descriptor data into this buffer.

## Subject
Download subject [here](/images/get_next_line.pdf)
