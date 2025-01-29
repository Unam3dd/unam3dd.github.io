---
title: 42 RainFall Level00 - Walkthrough 🚀
tags:
  - cyber-security
  - rainfall
  - assembly
  - ctf
categories:
  - ctfs
  - 42project
date: 2025-01-29 20:55:02
---

# Welcome to RainFall

![rainfall](/images/rainfall.jpg)

# 🌊 Level00 of Rainfall Project 🌊

## 🔍 Introduction

We have access to the `level0` user via SSH. Inside the home directory, we find a **setuid** binary named `level0`.

```sh
level0@RainFall:~$ ls -la
total 737
dr-xr-x---+ 1 level0 level0     60 Mar  6  2016 .
dr-x--x--x  1 root   root      340 Sep 23  2015 ..
-rwsr-x---+ 1 level1 users  747441 Mar  6  2016 level0
```

## 🚀 Executing the Binary

Running the binary without arguments results in a segmentation fault, while providing any argument simply prints "No !". 🤔

```sh
level0@RainFall:~$ ./level0 
Segmentation fault (core dumped)
level0@RainFall:~$ ./level0 123
No !
```

Let's analyze it using gdb!

## 🕵️ Reverse Engineering with GDB

### 🛠️ Disassembling main

```asm
Dump of assembler code for function main:
   0x08048ec0 <+0>:     push   ebp
   0x08048ec1 <+1>:     mov    ebp,esp
   0x08048ec3 <+3>:     and    esp,0xfffffff0
   0x08048ec6 <+6>:     sub    esp,0x20
   0x08048ec9 <+9>:     mov    eax,DWORD PTR [ebp+0xc]
   0x08048ecc <+12>:    add    eax,0x4
   0x08048ecf <+15>:    mov    eax,DWORD PTR [eax]
   0x08048ed1 <+17>:    mov    DWORD PTR [esp],eax
   0x08048ed4 <+20>:    call   0x8049710 <atoi>
   0x08048ed9 <+25>:    cmp    eax,0x1a7
   0x08048ede <+30>:    jne    0x8048f58 <main+152>
```

## 🧩 Understanding the Assembly Code

- `sub esp, 0x20` → Allocates **32 bytes (equivalent to 256 bits)** of stack space for local variables.
- `mov eax, DWORD PTR [ebp+0xc]` → Loads the pointer to `argv`, which is stored at `ebp+0xc`.
- `add eax, 0x4` → Moves to `argv[1]` (since pointers are 4 bytes in x86).
- `mov eax, DWORD PTR [eax]` → Loads the value of `argv[1]` (the first argument given to the program).
- `call atoi` → Converts `argv[1]` from a string to an integer.
- `cmp eax, 0x1a7` → Compares the result with **423 (0x1A7 in hex)**.

**If the comparison is successful, the program spawns a shell! 🐚**

## 🎯 Exploiting the Binary

We simply run the binary with `423` as an argument:

```c
level0@RainFall:~$ ./level0 423
$ id
uid=2030(level1) gid=2020(level0) groups=2030(level1)
```

🎉 We now have access to `level1!` 🎉

## 🔑 Retrieving the Flag

Once inside the `level1` home directory, we can grab the `.pass` file:

```sh
$ cd ../level1
$ ls -la
-rw-r--r--+ 1 level1 level1   65 Sep 23  2015 .pass
$ cat .pass
********************************************
```

## 🏆 Conclusion

This level was a *simple integer comparison check*.
By passing `423` as an argument, we were able to execute a privileged shell and retrieve the next level's credentials! 🚀

#### 🎯 Key Takeaways:
1. 🛠️ Understanding stack manipulation (sub esp, 0x20 for local storage).
2. 🧩 Pointer arithmetic in C (argv[1] is at ebp+0xc).
3. 🔥 Exploiting integer comparisons to pop a shell !.

#### 🔓 On to the next level! 🔓
