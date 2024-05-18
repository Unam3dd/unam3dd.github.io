---
title: 42 SnowCrash Level02 - Walkthrough 👾
tags:
  - ctf
  - 42project
  - snowcrash
  - wireshark
  - network
categories:
  - ctfs
  - 42project
date: 2024-05-18 14:02:04
---

![snowcrash](/images/snowcrash.png)

## Introduction

Analyze the pcap file using Wireshark

Open the pcap file using Wireshark to analyze the traffic.

1. Launch Wireshark and open the level02.pcap file.
2. Look for any interesting packets or data that might contain sensitive information such as login attempts, credentials, etc.
3. In this case, the output contains encoded or obscured information including login attempts and a potentially useful password.

## Decode the password

From the analysis, you will see the following sequence in the packet data:

```data
..%..%..&..... ..#..'..$..&..... ..#..'..$.. .....#.....'........... .38400,38400....#.SodaCan:0....'
..DISPLAY.SodaCan:0......xterm.........."........!........"..".....b........b....	B.
..............................1.......!.."......"......!..........."........"..".............	..
.....................
Linux 2.6.38-8-generic-pae (::ffff:10.1.1.2) (pts/10)
..wwwbugs login: l.le.ev.ve.el.lX.X
..
Password: ft_wandr...NDRel.L0L
.
..
Login incorrect
wwwbugs login: 
```

The password `ft_wandr...NDRel.L0L` seems obscured with `0x7f` hex characters (DEL ASCII) in the packet data.

## Hexadecimal analysis and password correction

Given the hexadecimal dump

```hexdump
000000B9  66                                                 f
000000BA  74                                                 t
000000BB  5f                                                 _
000000BC  77                                                 w
000000BD  61                                                 a
000000BE  6e                                                 n
000000BF  64                                                 d
000000C0  72                                                 r
000000C1  7f                                                 .
000000C2  7f                                                 .
000000C3  7f                                                 .
000000C4  4e                                                 N
000000C5  44                                                 D
000000C6  52                                                 R
000000C7  65                                                 e
000000C8  6c                                                 l
000000C9  7f                                                 .
000000CA  4c                                                 L
000000CB  30                                                 0
000000CC  4c                                                 L
000000CD  0d                                                 .
```

The `7f` hex character is the DEL ASCII character. Removing the 7f characters and adjusting the string, we get the correct password:
    - Original: `ft_wandr...NDRel.L0L`
    - Remove `ndr` and replace with `NDR`
    - Corrected Password: `ft_waNDReL0L`

Now you can connect with `flag02` with this password `ft_waNDReL0L`
