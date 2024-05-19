---
title: 42 SnowCrash Level14 - Walkthrough 👾
tags:
  - ctf
  - snowcrash
  - assembly
  - debugger
categories:
  - ctfs
  - 42project
date: 2024-05-19 16:15:15
---

![snowcrash](/images/snowcrash.png)

## Introduction

After some enumeration, we initially found nothing. However, there is one file we haven't reversed or exploited yet: the `getflag` binary.

```sh
level14@SnowCrash:~$ which getflag
/bin/getflag
```

### Analyzing the getflag Binary

To begin, let's open the getflag binary in GDB:

```sh
level14@SnowCrash:~$ gdb /bin/getflag
GNU gdb (Ubuntu/Linaro 7.4-2012.04-0ubuntu2.1) 7.4-2012.04
...
Reading symbols from /bin/getflag...(no debugging symbols found)...done.
(gdb) r
Starting program: /bin/getflag 
You should not reverse this
[Inferior 1 (process 3456) exited with code 01]
(gdb)
```

We can see that the binary has `ptrace` protection, which prevents it from being debugged normally.

### Bypassing ptrace Protection

After researching, we found a method to bypass this protection. We can set a catchpoint for the `ptrace` syscall and modify the `eax` register to bypass the check.

Steps to Bypass ptrace Protection

1. Start GDB and set a catchpoint for the `ptrace` syscall:

```sh
level14@SnowCrash:/tmp$ gdb /bin/getflag
GNU gdb (Ubuntu/Linaro 7.4-2012.04-0ubuntu2.1) 7.4-2012.04
...
(gdb) catch syscall ptrace
Catchpoint 1 (syscall 'ptrace' [26])
```

2. Define commands to execute when the catchpoint is hit:

```sh
(gdb) commands 1
Type commands for breakpoint(s) 1, one per line.
End with a line saying just "end".
>set ($eax) = 0
>continue
>end
```

This setup ensures that when the `ptrace` syscall is invoked, the `eax` register is set to 0, effectively bypassing the ptrace protection.

3. Set a breakpoint at the main function and disassemble it:

```assembly
(gdb) b main
Breakpoint 2 at 0x804894a
(gdb) disass main
Dump of assembler code for function main:
   0x08048946 <+0>:     push   %ebp
   0x08048947 <+1>:     mov    %esp,%ebp
   0x08048949 <+3>:     push   %ebx
   0x0804894a <+4>:     and    $0xfffffff0,%esp
   0x0804894d <+7>:     sub    $0x120,%esp
   0x08048953 <+13>:    mov    %gs:0x14,%eax
   0x08048959 <+19>:    mov    %eax,0x11c(%esp)
   0x08048960 <+26>:    xor    %eax,%eax
   0x08048962 <+28>:    movl   $0x0,0x10(%esp)
   0x0804896a <+36>:    movl   $0x0,0xc(%esp)
   0x08048972 <+44>:    movl   $0x1,0x8(%esp)
   0x0804897a <+52>:    movl   $0x0,0x4(%esp)
   0x08048982 <+60>:    movl   $0x0,(%esp)
   0x08048989 <+67>:    call   0x8048540 <ptrace@plt>
   0x0804898e <+72>:    test   %eax,%eax
   0x08048990 <+74>:    jns    0x80489a8 <main+98>
   0x08048992 <+76>:    movl   $0x8048fa8,(%esp)
   0x08048999 <+83>:    call   0x80484e0 <puts@plt>
   0x0804899e <+88>:    mov    $0x1,%eax
   0x080489a3 <+93>:    jmp    0x8048eb2 <main+1388>
   0x080489a8 <+98>:    movl   $0x8048fc4,(%esp)
   0x080489af <+105>:   call   0x80484d0 <getenv@plt>
   0x080489b4 <+110>:   test   %eax,%eax
   0x080489b6 <+112>:   je     0x80489ea <main+164>
   0x080489b8 <+114>:   mov    0x804b040,%eax
   0x080489bd <+119>:   mov    %eax,%edx
   0x080489bf <+121>:   mov    $0x8048fd0,%eax
   0x080489c4 <+126>:   mov    %edx,0xc(%esp)
   0x080489c8 <+130>:   movl   $0x25,0x8(%esp)
   0x080489d0 <+138>:   movl   $0x1,0x4(%esp)
   0x080489d8 <+146>:   mov    %eax,(%esp)
   0x080489db <+149>:   call   0x80484c0 <fwrite@plt>
   0x080489e0 <+154>:   mov    $0x1,%eax
   0x080489e5 <+159>:   jmp    0x8048eb2 <main+1388>
```

4. Set a breakpoint at the instruction where the user ID is checked:

```sh
(gdb) b *0x08048b0a
Breakpoint 3 at 0x8048b0a
```

5. run the program

```sh
(gdb) r
Starting program: /bin/getflag 
```

6. Continue execution until the user ID check and modify the `eax` register:

```sh
Breakpoint 3, 0x08048b0a in main ()
(gdb) set ($eax) = 3014
(gdb) c
Continuing.
Check flag.Here is your token : ************************************
[Inferior 1 (process 3161) exited normally]
```
