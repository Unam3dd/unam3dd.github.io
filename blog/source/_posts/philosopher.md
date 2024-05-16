---
title: 42 Philosopher Report 📘
description: Eat, Sleep, Spaghetti, Repeat. This project will help you understand the use of threads. Among a group of philosophers, it's up to you to precisely anticipate the moment when each philosopher in the group will have to pick up forks and eat spaghetti, without any of them starving to death. 
tags:
  - programming
  - c
  - threads
  - multi-threading
  - concurrency
  - atomic
  - mutex
  - semaphore
  - contextswitch
  - scheduler
categories:
  - dev
  - 42project
date: 2024-05-16 11:42:09
---

![Philo](/images/philosopher.png)

## Introduction
The Philosopher project is a classic problem in concurrent programming, aiming to explore synchronization techniques and multi-threading concepts. The project revolves around simulating a scenario where a number of philosophers sit around a table with a limited number of chopsticks, each philosopher needing two chopsticks to eat.

## Objective 🎯
The primary objective of the project is to implement a solution that prevents deadlocks, ensures fair resource allocation, and maximizes efficiency in resource utilization. This involves utilizing various synchronization mechanisms and threading concepts to coordinate the actions of the philosophers in a concurrent environment.

## Key Concepts 🔑

| Concept                  | Description                                                                                                                                                                                           |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Threads                  | Utilizing threads to represent individual philosophers and concurrent actions.                                                                                                                       |
| Mutex                    | Using mutex locks to enforce exclusive access to shared resources such as chopsticks.                                                                                                                 |
| Semaphore                | Employing semaphores to control access to shared resources and prevent race conditions.                                                                                                                |
| Data Race                | A data race occurs when two or more threads concurrently access a shared variable or resource, leading to unpredictable behavior.                                                                    |
| Multi-Threading          | Concurrent execution of multiple threads within the same process, enabling tasks to be performed simultaneously.                                                                                     |
| Atomic Multi-Threading   | Ensuring thread safety by performing atomic operations on shared variables to prevent data races and inconsistencies.                                                                              |
| Task Queue               | Implementing a task queue to manage asynchronous tasks and distribute them among threads for execution.                                                                                             |
| Thread Pools             | Utilizing thread pools to manage a collection of pre-initialized threads, reducing overhead and improving performance by avoiding frequent thread creation and destruction.                          |
| Concurrency              | Implementing concurrent behavior to simulate the dining philosophers problem.                                                                                                                         |
| Deadlock Avoidance       | Designing a solution that prevents deadlocks by carefully managing resource acquisition and release.                                                                                                 |
| Resource Allocation      | Ensuring fair allocation of resources to prevent starvation of philosophers.                                                                                                                         |


## Tools and Technologies 🛠️
- **C Programming Language:** Implementing the project in C to leverage low-level control over threading and synchronization.
- **POSIX Threads (pthread):** Using the pthread library to create and manage threads, as well as synchronize their actions.
- **Mutex and Semaphore APIs:** Employing mutex and semaphore primitives provided by POSIX for synchronization.
- **Valgrind with Helgrind:** Using Valgrind's Helgrind tool to detect data races, potential deadlocks, and other synchronization issues in multi-threaded programs.
- **Address Sanitizer (ASAN):** Utilizing ASAN to detect memory corruption, buffer overflows, and other memory-related errors, including those involving multi-threaded code.

## Project Structure 🏗️
The project will be structured into modular components, with each component responsible for a specific aspect of the simulation:
- **Philosopher Threads:** Creation and management of philosopher threads.
- **Chopstick Management:** Implementation of mutex locks to represent chopsticks and ensure exclusive access.
- **Task Queue Management:** Handling the addition and execution of tasks within the task queue.
- **Thread Pool Management:** Initialization, utilization, and destruction of thread pools.
- **Simulation Control:** Synchronization mechanisms to control the progression of the simulation and prevent race conditions.
- **Output and Visualization:** Displaying the state of the simulation and relevant information to the user.

### Thread in a Process

A thread is the smallest unit of execution within a process. In a multi-threaded environment, a single process can contain multiple threads, each capable of independent execution. Threads share the process's memory space and resources, including code, data, and open files, allowing them to communicate and interact directly with one another. 

Threads within a process share certain resources, such as memory and file descriptors, which enables efficient communication and coordination between concurrent tasks. 

However, each thread has its own execution context, including a unique program counter, set of CPU registers, and **stack memory**. The stack memory is used for storing local variables, function parameters, and return addresses for function calls specific to that thread. 

Threads offer several advantages over processes, including lower overhead in terms of memory and system resource consumption, faster communication and synchronization between concurrent tasks, and increased responsiveness in interactive applications. 

In the context of the Philosopher project, threads are used to represent individual philosophers sitting around a table. Each philosopher is associated with a separate thread, allowing them to perform actions such as thinking, picking up chopsticks, eating, and putting down chopsticks concurrently. 

Synchronization mechanisms such as mutex locks and semaphores are employed to coordinate the actions of the philosophers and prevent conflicts when accessing shared resources.

## Keep it in your mind

- A thread is the smallest unit of execution within a process.
- In a multi-threaded environment, a single process can contain multiple threads, each capable of independent execution.
- Threads share the process's memory space and resources, including code, data, and open files.
- However, each thread has its own execution context, including a unique program counter, set of CPU registers, and stack memory.
- The stack memory is used for storing local variables, function parameters, and return addresses for function calls specific to that thread.
- Threads offer advantages such as lower memory and resource consumption, faster communication, synchronization between concurrent tasks, and increased responsiveness in interactive applications.
- Context Switch: A context switch is the process of saving the current state of a thread's execution context and restoring the state of another thread to allow it to continue execution. Context switches are necessary for multitasking and concurrency, enabling the operating system to efficiently manage the execution of multiple threads within a process.
- Scheduling: Scheduling is the process by which the operating system decides which threads should run and for how long. Thread scheduling algorithms determine the order and duration of execution for threads based on factors such as thread priority, CPU availability, and fairness.
- In the Philosopher project, threads represent individual philosophers, allowing them to perform actions concurrently around a table.
- Synchronization mechanisms such as mutex locks and semaphores are used to coordinate actions and prevent conflicts when accessing shared resources.

## Conclusion 🎓
Through the implementation of the Philosopher project, students will gain a deeper understanding of concurrent programming concepts, synchronization techniques, and the challenges of designing efficient and deadlock-free systems in a multi-threaded environment.

My Code of philosopher from 42 School [here](https://github.com/Unam3dd/Philo)
## References 📖
1. [Dining Philosophers Problem - Wikipedia](https://en.wikipedia.org/wiki/Dining_philosophers_problem)
2.  [Thread (computing) - Wikipedia](https://en.wikipedia.org/wiki/Thread_(computing))
3. [Multithreading - Wikipedia](https://fr.wikipedia.org/wiki/Multithreading)
4. [Lock - Wikipedia](https://en.wikipedia.org/wiki/Lock_(computer_science))
5. [Deadlock - Wikipedia](https://en.wikipedia.org/wiki/Deadlock)
6. [Race condition - Wikipedia](https://en.wikipedia.org/wiki/Race_condition)
7. [What are atomic types in the C language? - Stack Overflow](https://stackoverflow.com/questions/36955884/what-are-atomic-types-in-the-c-language)
8. [Thread pool - Wikipedia](https://en.wikipedia.org/wiki/Thread_pool)

## Subject
you can just download the subject [here](/images/philosopher.pdf)
