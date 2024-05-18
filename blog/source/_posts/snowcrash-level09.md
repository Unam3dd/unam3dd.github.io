---
title: 42 SnowCrash Level09 - Walkthrough 👾
tags:
  - ctf
  - snowcrash
categories:
  - ctfs
  - 42project
date: 2024-05-18 15:55:18
---

![snowcrash](/images/snowcrash.png)

### Introduction:

In level 09, we are provided with a token encoded as a list of hexadecimal values. Our objective is to decode this token using a Python script.

### Steps:

1. **Understanding the Token Encoding:**
   We have a token represented as a list of hexadecimal values:
   ```python
   data = [0x66, 0x34, 0x6b, 0x6d, 0x6d, 0x36, 0x70, 0x7c, 0x3d, 0x82, 0x7f, 0x70,
     0x82, 0x6e, 0x83, 0x82, 0x44, 0x42, 0x83, 0x44, 0x75, 0x7b, 0x7f, 0x8c,
     0x89]
    ```
    Each value in the list corresponds to a ASCII character in the buffer.

2. **Decoding the Token**:
    We use a Python script to decode the token by subtracting the index from each character's ASCII value:
    ```python
    flag = "".join([chr(data[i] - i) for i in range(len(data))])
    print(flag)
    ```
    This script will output the decoded flag.

3. **Executing the Script**:
    We save the script in a file, let's say `decode_flag.py`, and then execute it or just run the following command:
    ```shell
    python3 -c 'data = [0x66, 0x34, 0x6b, 0x6d, 0x6d, 0x36, 0x70, 0x7c, 0x3d, 0x82, 0x7f, 0x70,
    0x82, 0x6e, 0x83, 0x82, 0x44, 0x42, 0x83, 0x44, 0x75, 0x7b, 0x7f, 0x8c,
    0x89];flag = "".join([ chr(data[i] - i) for i in range(len(data)) ]);print(flag)
    ```

## Conclusion
By decoding the token using the provided Python script, we successfully obtained the flag for level 09.
