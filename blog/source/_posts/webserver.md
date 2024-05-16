---
title: 42 WebServer Report📘
tags:
  - programming
  - cpp98
  - webserver
  - rfc2616
  - http
  - server
  - epoll
  - multiplexing
  - select
  - poll
  - epoll
  - broken
  - wrk
  - cgi
categories:
  - dev
  - 42project
date: 2024-05-16 16:12:10
---

## Project Description 🌐
The WebServer project, assigned at 42 School, challenges students to create a custom web server adhering to the HTTP/1.1 protocol as specified in the RFC documents. The main goal is to implement a web server entirely in pure C++98, including features such as CGI (Common Gateway Interface) support and a custom configuration file parser. Students are required to design and implement a configuration file format similar to that of widely used web servers like Nginx, enabling users to define routes and server settings.

## Key Features
1. **HTTP/1.1 Compliance:** The web server must adhere to the HTTP/1.1 protocol standards outlined in the RFC documents, ensuring compatibility with web browsers and other HTTP clients. This includes implementing key features such as HTTP methods (GET, POST, DELETE), headers, status codes, and message formats.
2. **Custom Configuration File:** Students must design and implement a custom configuration file format for the web server, allowing users to define server settings, routes, and CGI scripts.
3. **Route Handling:** The server should be capable of handling different routes specified in the configuration file, directing incoming HTTP requests to the appropriate handlers or CGI scripts.
4. **CGI Support:** Implementing support for CGI allows the web server to execute external programs or scripts in response to HTTP requests, enabling dynamic content generation.

## Implementation Details
1. **Configuration File Parser:** Students need to develop a parser to read and interpret the custom configuration file format, extracting server settings and route definitions.
2. **HTTP Request Handling:** The server should parse incoming HTTP requests, extract relevant information (e.g., method, path, headers), and route them according to the configured routes. Implementation of various HTTP methods (GET, POST, DELETE, etc.) is crucial for handling different types of requests.
3. **CGI Execution:** For requests targeting CGI scripts, the server should execute the specified scripts, passing request data via environment variables and standard input, and capturing the script's output for HTTP response generation.
4. **Error Handling:** Implementing appropriate error handling mechanisms to deal with malformed requests, internal server errors, and other exceptional conditions.

## Multiplexing and Multi-threading
To handle concurrent connections efficiently, students must be use multiplexing systems such as `select`, `poll`, or `epoll` instead of multi-threading. While multi-threading is not allowed, multiplexing allows the server to handle multiple connections in a single thread, reducing resource consumption and avoiding the complexity of managing multiple threads. For powerfully scalable servers, it is recommended to use a combination of thread pools and epoll for optimal performance.

## Testing with `wrk`
After implementing the web server, students should test its performance and scalability using tools like `wrk`, a modern HTTP benchmarking tool. `wrk` allows users to generate significant loads on the server, simulating real-world traffic and measuring response times, throughput, and concurrency. Testing with `wrk` helps ensure that the web server can handle high volumes of traffic efficiently and reliably.

## Adherence to RFC Standards
The implementation of the web server should closely follow the RFC standards for the HTTP/1.1 protocol. This includes proper handling of HTTP methods, headers, status codes, and message formats as defined in the relevant RFC documents.

## Conclusion
The WebServer project offers students an opportunity to deepen their understanding of web server architecture, HTTP protocol, and systems programming in C++. By implementing features such as HTTP method support and adherence to RFC standards, students gain practical experience in developing scalable and robust web server applications. 💻🌐🔧

## Reference
- [RFC - 2616](https://datatracker.ietf.org/doc/html/rfc2616)
- [My WebServer](https://github.com/Unam3dd/WebServer)
- [Select](https://man7.org/linux/man-pages/man2/select.2.html)
- [Poll](https://man7.org/linux/man-pages/man2/poll.2.html)
- [Epoll](https://man7.org/linux/man-pages/man7/epoll.7.html)
- [liburing](https://unixism.net/loti/async_intro.html)
- [io_uring](https://en.wikipedia.org/wiki/Io_uring)
- [cgi](https://en.wikipedia.org/wiki/Common_Gateway_Interface)
- [curl](https://curl.se/)
- [curl - wikipedia](https://en.wikipedia.org/wiki/CURL)
- [Epoll is fundamentaly broken - Part 1](https://idea.popcount.org/2017-02-20-epoll-is-fundamentally-broken-12/ "https://idea.popcount.org/2017-02-20-epoll-is-fundamentally-broken-12/")
- [Epoll is fundamentaly broken - Part 2](https://idea.popcount.org/2017-03-20-epoll-is-fundamentally-broken-22/ "https://idea.popcount.org/2017-03-20-epoll-is-fundamentally-broken-22/")
- [Select & Poll is fundamentaly broken](https://idea.popcount.org/2017-01-06-select-is-fundamentally-broken/ "https://idea.popcount.org/2017-01-06-select-is-fundamentally-broken/")

## Subject
you can just download the subject [here](/images/webserver.pdf)
