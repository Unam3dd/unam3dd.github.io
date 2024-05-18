---
title: 42 SnowCrash - Level00 🚀
tags:
  - cyber-security
  - snowcrash
  - cryptography
  - ctf
categories:
  - ctfs
  - 42project
date: 2024-05-17 15:28:02
---

# Welcome to SnowCrash

![snowcrash](/images/snowcrash.png)

Hello guys, today I'm going to show you level 00 of the SnowCrash project from 42 school.

First of all, we need to download the SnowCrash ISO and create a virtual machine with VirtualBox or any other virtualization tool such as VMWare. You can also use a Vagrant file to build your virtual machine.

To find our machine on our network, you can see your netmask with commands such as `ipconfig` or `ip a`.

I'm running the following command just above and it shows something like that:

```shell
ifconfig wlan0
wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.255.120  netmask 255.255.255.0  broadcast 192.168.255.255
        inet6 fe80::becd:d2f3:8351:255b  prefixlen 64  scopeid 0x20<link>
        ether 60:67:20:b2:a1:3e  txqueuelen 1000  (Ethernet)
        RX packets 288278  bytes 406349224 (387.5 MiB)
        RX errors 0  dropped 2  overruns 0  frame 0
        TX packets 102496  bytes 10894468 (10.3 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

My virtual machine is connected with a bridge adapter, so it uses my physical network card.

Looking at the output, you can observe my netmask is `255.255.255.0`. This means the first three bytes in big endian order represent my network part, and the last significant byte represents my host part. Consequently, my CIDR notation is `/24`, indicating that we have `256` possible hosts on this network. However, two hosts are reserved (the network host and broadcast host), leaving us with only `254` possible alive hosts on this network.

Next, I use `nmap` to scan my network with a CIDR of `/24` to determine which hosts are alive on the network.
```shell
nmap -sn 192.168.255.1/24
Starting Nmap 7.94 ( https://nmap.org ) at 2024-05-17 10:57 CEST
Nmap scan report for 192.168.255.120
Host is up (0.00038s latency).
Nmap scan report for 192.168.255.204
Host is up (0.00033s latency).
Nmap scan report for 192.168.255.248
Host is up (0.011s latency).
Nmap done: 256 IP addresses (3 hosts up) scanned in 6.50 seconds
```

So, as you can see, three hosts are up. The first at `192.168.255.120` is my physical laptop, the second at `192.168.255.204` is my virtual machine, and the third is my Android access point at `192.168.1.255.248`.

Now, we can use the following command to scan different services running on this virtual machine:

```
nmap -v -sV 192.168.255.204
Starting Nmap 7.94 ( https://nmap.org ) at 2024-05-17 11:04 CEST
NSE: Loaded 46 scripts for scanning.
Initiating Ping Scan at 11:04
Scanning 192.168.255.204 [2 ports]
Completed Ping Scan at 11:04, 0.00s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 11:04
Completed Parallel DNS resolution of 1 host. at 11:04, 0.07s elapsed
Initiating Connect Scan at 11:04
Scanning 192.168.255.204 [1000 ports]
Discovered open port 80/tcp on 192.168.255.204
Discovered open port 4242/tcp on 192.168.255.204
Completed Connect Scan at 11:04, 0.03s elapsed (1000 total ports)
Initiating Service scan at 11:04
Scanning 2 services on 192.168.255.204
Completed Service scan at 11:04, 6.01s elapsed (2 services on 1 host)
NSE: Script scanning 192.168.255.204.
Initiating NSE at 11:04
Completed NSE at 11:04, 0.01s elapsed
Initiating NSE at 11:04
Completed NSE at 11:04, 0.01s elapsed
Nmap scan report for 192.168.255.204
Host is up (0.0012s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.2.22 ((Ubuntu))
4242/tcp open  ssh     OpenSSH 5.9p1 Debian 5ubuntu1.7 (Ubuntu Linux; protocol 2.0)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.40 seconds
```

As you can see, two services are up on this machine. The first is a web server running Apache httpd 2.2.22, and the second is an SSH server on port `4242` with OpenSSH 5.9p1 Debian. The version is quite old because the subject itself is older. However, the goal of the subject is not to exploit these services directly; the first login credentials are provided, making it just level 0, and the same goes for the password.

But just out of curiosity, we can send HTTP requests to the web server.

```shell
curl http://192.168.255.204:80
<html><body><h1>It works!</h1>
<p>This is the default web page for this server.</p>
<p>The web server software is running but no content has been added, yet.</p>
</body></html>
```

Okay, let's connect with an SSH client to the virtual machine and see what we can observe after connecting.

```shell
ssh level00@192.168.255.204 -p 4242
	  _____                      _____               _     
	 / ____|                    / ____|             | |    
	| (___  _ __   _____      _| |     _ __ __ _ ___| |__  
	 \___ \| '_ \ / _ \ \ /\ / / |    | '__/ _` / __| '_ \ 
	 ____) | | | | (_) \ V  V /| |____| | | (_| \__ \ | | |
	|_____/|_| |_|\___/ \_/\_/  \_____|_|  \__,_|___/_| |_|
                                                        
  Good luck & Have fun

          192.168.255.204 
level00@192.168.255.204's password: 
level00@SnowCrash:~$ 
```

Once connected via SSH, if we run the `ls` command, let's see what we have:
```shell
level00@SnowCrash:~$ ls -la
total 12
dr-xr-x---+ 1 level00 level00  100 Mar  5  2016 .
d--x--x--x  1 root    users    340 Aug 30  2015 ..
-r-xr-x---+ 1 level00 level00  220 Apr  3  2012 .bash_logout
-r-xr-x---+ 1 level00 level00 3518 Aug 30  2015 .bashrc
-r-xr-x---+ 1 level00 level00  675 Apr  3  2012 .profile
level00@SnowCrash:~$
```

Our goal is to log in with the `flag00` user to obtain our flag.

After a few minutes, I decided to run the following command to check which binaries have the SUID flag set for the `flag00` user:

```shell
level00@SnowCrash:~$ find / -user flag00 -print 2>/dev/null
/usr/sbin/john
/rofs/usr/sbin/john
```

Okay, let's check what we have.

`John the Ripper` is a common tool used in cybersecurity for password cracking and hash analysis.

```shell
level00@SnowCrash:~$ ls -la /usr/sbin/john 
----r--r-- 1 flag00 flag00 15 Mar  5  2016 /usr/sbin/john
```

Wait, the `john` binary is in read-only mode? Let's try `cat /usr/sbin/john`.

```shell
level00@SnowCrash:~$ cat /usr/sbin/john 
cdiiddwpgswtgt
```

Okay, it looks like a message encrypted with a cipher such as substitution, monoalphabetic, or polyalphabetic algorithms. If we take that string and put it into CyberChef, we can see it's a ROT cipher.

For the write-up, I'll use my own Python script to decipher the message.

```python
#!/usr/bin/env python3

def rot(k, word):
    return ''.join([chr((ord(letter) - 97 + k) % 26 + 97) for letter in word])

if __name__ == "__main__":
    for i in range(0, 26):
        print(rot(i, "cdiiddwpgswtgt"))
```

If we run the following script, we can obtain the decrypted message:

```shell
python3 script.py
cdiiddwpgswtgt
dejjeexqhtxuhu
efkkffyriuyviv
fgllggzsjvzwjw
ghmmhhatkwaxkx
hinniibulxbyly
ijoojjcvmyczmz
jkppkkdwnzdana
klqqllexoaebob
lmrrmmfypbfcpc
mnssnngzqcgdqd
nottoohardhere
opuuppibseifsf
pqvvqqjctfjgtg
qrwwrrkdugkhuh
rsxxsslevhlivi
styyttmfwimjwj
tuzzuungxjnkxk
uvaavvohykolyl
vwbbwwpizlpmzm
wxccxxqjamqnan
xyddyyrkbnrobo
yzeezzslcospcp
zaffaatmdptqdq
abggbbunequrer
bchhccvofrvsfs
```

As you can see, on the 11th row, you can read `nottoohardhere`. If you try to log in to `flag00` with this password, you can get the flag.

```shell
level00@SnowCrash:~$ su flag00
Password: 
Don't forget to launch getflag !
flag00@SnowCrash:~$ ls
README.txt
flag00@SnowCrash:~$ getflag
Check flag.Here is your token : xxxxxxxxxxxxxxxxxxxxxxxxx
```
