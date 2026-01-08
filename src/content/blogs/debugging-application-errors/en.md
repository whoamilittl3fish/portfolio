---
title: "What to do first when the application encounters an error"
description: "When an application encounters an error, what steps should you take?"
date: 2026-01-05
tags: ["short-post", "base-knowledge", "debugging"]
---

## Question:

What do you do first when the application encounters an error? (Testing debugging ability and logical thinking.)

## Answer:

- First, I will find the error by placing logs in the application's execution flow to check which code block the error is in.

- I will divide the code into different blocks, then check each block one by one. For example, if I have 3 code blocks and 2 blocks are confirmed to be correct, then the problem will be in the remaining block.

- After finding the faulty code block, I will continue adding more detailed logs. When running the application, the code will execute those logs to tell me in detail how the current code operates, what the next step produces, and from there I will catch where the logic produces incorrect results. This is to make the code tell a story about how the code runs.

- This will help me identify where the bug is. It could be a logic error, a race condition when 2 code blocks run in parallel and one block runs first but incorrectly, contrary to my original intention of waiting for the result of the other block to run.

Things to avoid when debugging:

- Reading the entire code. This makes it easy to miss small, hard-to-spot errors and becomes tiring.

- Having theories but in the form of unverified guesses.

- Fixing errors immediately without understanding the old bug, which may create new bugs.

- Not logging. Not knowing how the code runs.

