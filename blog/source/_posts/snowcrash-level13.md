---
title: 42 SnowCrash Level13 - Walkthrough 🤖
tags:
  - ctf
  - snowcrash
  - assembly
  - gdb
  - debugger
categories:
  - ctfs
  - 42project
date: 2024-05-19 15:49:03
---

## Introduction

In Level 13 of the SnowCrash project by 42 school, you are provided with a 32-bit binary file named `level13`. When executed, the binary outputs the following message:

```sh ./level13
UID 2013 started us but we expect 4242
```

### Binary Analysis
To analyze the binary, you can use the objdump command to disassemble it and inspect the main function. Here is the command and relevant output:

```sh
objdump -d ./level13 -M intel
```

### Main Function Disassembly


```asm
 0804858c <main>:
 804858c:    55                    push   ebp
 804858d:    89 e5                 mov    ebp,esp
 804858f:    83 e4 f0              and    esp,0xfffffff0
 8048592:    83 ec 10              sub    esp,0x10
 8048595:    e8 e6 fd ff ff        call   8048380 <getuid@plt>
 804859a:    3d 92 10 00 00        cmp    eax,0x1092
 804859f:    74 2a                 je     80485cb <main+0x3f>
 80485a1:    e8 da fd ff ff        call   8048380 <getuid@plt>
 80485a6:    ba c8 86 04 08        mov    edx,0x80486c8
 80485ab:    c7 44 24 08 92 10 00  mov    DWORD PTR [esp+0x8],0x1092
 80485b2:    00 
 80485b3:    89 44 24 04           mov    DWORD PTR [esp+0x4],eax
 80485b7:    89 14 24              mov    DWORD PTR [esp],edx
 80485ba:    e8 a1 fd ff ff        call   8048360 <printf@plt>
 80485bf:    c7 04 24 01 00 00 00  mov    DWORD PTR [esp],0x1
 80485c6:    e8 d5 fd ff ff        call   80483a0 <exit@plt>
 80485cb:    c7 04 24 ef 86 04 08  mov    DWORD PTR [esp],0x80486ef
 80485d2:    e8 9d fe ff ff        call   8048474 <ft_des>
 80485d7:    ba 09 87 04 08        mov    edx,0x8048709
 80485dc:    89 44 24 04           mov    DWORD PTR [esp+0x4],eax
 80485e0:    89 14 24              mov    DWORD PTR [esp],edx
 80485e3:    e8 78 fd ff ff        call   8048360 <printf@plt>
 80485e8:    c9                    leave
 80485e9:    c3                    ret
```

### Key Instruction
Key Instruction

The key instruction to focus on is at address `0x804859a`:

```assembly
0x804859a:    3d 92 10 00 00        cmp    eax,0x1092
```

This instruction compares the `eax` register with `0x1092` (which is `4242` in decimal). To successfully execute the binary and obtain the flag, `eax` needs to be set to `4242`.

### Exploitation Process

To exploit this binary, you can use a debugger like GDB (with the GEF extension) or any other debugger of your choice. Here are the steps using GDB:

1. Start GDB with the binary

```sh
gdb ./level13
```

2. Set a breakpoint at the critical instruction:

```sh
gdb> b *0x804859a
```

3.  Run the binary:

```sh
gdb> run
```

4. Overwrite the eax register before the comparison:

```sh
gdb> set $eax=0x1092
```

5. Verify the value of `eax`:

```sh
gdb> info registers eax
```

6. Continue execution to complete the binary and obtain the flag:

```sh
gdb> c
```

## Conclusion

By following the above steps, you will be able to bypass the UID check in the binary and retrieve the token. Use the token to connect with the `flag13` user and get the flag.

This level illustrates the importance of understanding assembly instructions and utilizing debugging tools to manipulate the execution flow of a binary.
