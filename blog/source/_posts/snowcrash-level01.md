---
title: 42 SnowCrash Level 01 - Walkthrough 👾
tags:
  - ctf
  - 42project
  - snowcrash
  - hash
  - brute-force
  - john
categories:
  - ctfs
  - 42project
date: 2024-05-18 13:31:13
---

![snowcrash](snowcrash.png)

##  Introduction

Hello, everyone! Today, I'll guide you through Level 01 of the SnowCrash project in the 42 cyber-security curriculum. Let's dive in!

## Enumeration

Once you're logged in, it's time to enumerate the system for useful information. One of the first files to check is `/etc/passwd`, which lists all user accounts on the system. Let's examine this file:

```sh
cat /etc/passwd
```

Here is the relevant section of the output:

```shell
level11:x:2011:2011::/home/user/level11:/bin/bash
level12:x:2012:2012::/home/user/level12:/bin/bash
level13:x:2013:2013::/home/user/level13:/bin/bash
level14:x:2014:2014::/home/user/level14:/bin/bash
flag00:x:3000:3000::/home/flag/flag00:/bin/bash
flag01:42hDRfypTqqnw:3001:3001::/home/flag/flag01:/bin/bash
flag02:x:3002:3002::/home/flag/flag02:/bin/bash
flag03:x:3003:3003::/home/flag/flag03:/bin/bash
flag04:x:3004:3004::/home/flag/flag04:/bin/bash
flag05:x:3005:3005::/home/flag/flag05:/bin/bash
```

The `42hDRfypTqqnw` is the hashed password for the `flag01` user. We need to crack this hash to proceed.

## Cracking the Hash

We can use tools like `john` (John the Ripper) to crack the password hash. First, save the hash to a file:

file:

```sh
echo "42hDRfypTqqnw" > hash
```

Next, use `john` to crack the hash:
```shell
john hash
```
John will process the hash and attempt to crack it using its default wordlist.

After a short time, you should see output similar to this:
```shell
Using default input encoding: UTF-8
Loaded 1 password hash (descrypt, traditional crypt(3) [DES 256/256 AVX2])
Will run 8 OpenMP threads
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
Almost done: Processing the remaining buffered candidate passwords, if any.
Proceeding with wordlist:/usr/share/john/password.lst
abcdefg          (?)     
1g 0:00:00:00 DONE 2/3 (2023-10-27 05:29) 20.00g/s 983040p/s 983040c/s 983040C/s 123456..lucky0
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

The password for `flag01` is revealed to be `abcdefg`.

Now, use this password to switch to the `flag01` user and get the flag ;)
