---
title: "Some question with basic knowledge"
description: "Common questions about fundamental knowledge that I should know and are often asked by recruiters. You can also ask yourself these questions to test your knowledge level and answer them to avoid being caught off guard when asked. I will update these questions more frequently."
date: 2026-01-05
tags: ["short-post", "base-knowledge"]
---

I write this blog to record questions that test my knowledge level and answer them to remember better. I also think these are common questions that recruiters will ask.

I will update my questions and answers here. If there are any mistakes, I hope you can contribute and remind me so we can learn together.

## Question 1: 

What do you do first when the application encounters an error? (Testing debugging ability and logical thinking.)

### Answer:

- First, I will find the error by placing logs in the application's execution flow to check which code block the error is in.

- I will divide the code into different blocks, then check each block one by one. For example, if I have 3 code blocks and 2 blocks are confirmed to be correct, then the problem will be in the remaining block.

- After finding the faulty code block, I will continue adding more detailed logs. When running the application, the code will execute those logs to tell me in detail how the current code operates, what the next step produces, and from there I will catch where the logic produces incorrect results. This is to make the code tell a story about how the code runs.

- This will help me identify where the bug is. It could be a logic error, a race condition when 2 code blocks run in parallel and one block runs first but incorrectly, contrary to my original intention of waiting for the result of the other block to run.

Things to avoid when debugging:

- Reading the entire code. This makes it easy to miss small, hard-to-spot errors and becomes tiring.

- Having theories but in the form of unverified guesses.

- Fixing errors immediately without understanding the old bug, which may create new bugs.

- Not logging. Not knowing how the code runs.

## Question 2: 

What are Gitflow, Github flow, and Gitlab flow, and how do they differ? (Testing teamwork ability with Git tools. Of course, when working on a shared project, being proficient with Git is essential.)

### Answer:

Common ways to work with Git are Gitflow, Github flow, and Gitlab flow. I will call the main branch (or master) main.

#### Gitflow:

- This is the classic way of dividing a project into multiple parts. There are 3 main types: main/production/release, develop, feature/hot-fix.

- Among these, main is the primary branch, usually managed by the project manager when merging from develop. A new branch called production/release can be added by version.

- Next is the develop branch. This is the branch where everyone in the team will work together. All new features will be merged into this branch and can be used to deploy to staging for testing before the official launch on production on the main branch.

- Finally, there is feature/. Usually, this is a branch that developers will create with a name for a new feature, develop in this branch, then rebase onto develop before merging and merge after code review and completion.

- Additionally, when there is an error, there will be a hot-fix branch used to resolve major bugs promptly when production has errors. After completion, it will be merged into both production/main/release and develop.

**Pros and Cons:**

- Detailed environment, clearer workflow.

- Complex when there are many environments, and the more branches there are, the more likely conflicts will occur when merging. :D This is something people will be quite concerned about.

- CI/CD is more difficult because there is both production/release for main, and dev for staging.

#### Github flow:

- This method is faster than Gitflow, with only one main branch and feature, hot-fix branches. The main branch will be the primary branch and everyone works around it.

**Pros and Cons:**

- This method reduces the complex process of Gitflow but at the same time, the version after merging will be production/release instead of having a staging phase for testing.

- Easier CI/CD (main branch).

#### Gitlab flow:

- This is a process that combines both Gitflow and Github flow (hybrid). Depending on the team's standards. Usually, there will also be main, feature, staging, production/release.

- This process can be:

`feature -> main -> staging -> release`

or

`feature -> main -> release/1.0 -> production`

**Pros:**

- More flexible.

- Suitable for CI/CD.

- Clear environment distinction (dev, staging, production).

## Question 3: 

What is OOP? (Fundamental knowledge)

### Answer:

OOP is Object-oriented programming. It means organizing code in a structured way by objects.

Take a simple example like when there is a user object: `user` will have functions and properties like: `login()`, `name`, `payBy()`.

If we don't organize this by object, code will be mixed together (coupling), which makes code harder to maintain, modify, and also harder to read.

If we restructure with a `user`:

```typescript

class user {
    userName: string;
    login() {}
    payBy(whichBank: string) {
        if (whichBank === "momo")
        ...
    }
}

```

then when calling the function it will be `user.userName = Khoa`, `user.login()`.

#### Encapsulation

Code is now easier to read and these functions belong to that specific object and only expose the components that need to be used externally. Therefore, the logic within the object will be protected and not changed from outside.

- Child classes can reuse parent classes and reduce code duplication:

```typescript

class engine {
    howManyOilPerKm() {}
}

class car {
    engine: engine;
    run() {}
}
```

Although this reduces code duplication, it also has the potential for code to become interdependent, and when the parent class changes, the child class will break.

#### Polymorphism

An example of polymorphism is addition. We have a simple add() function, but when we fill in parameters a.add(b) where b is a real number, integer, or fraction, the object will automatically understand and perform the addition operation. This is polymorphism. But it doesn't mean using if () and else(). Specifically:

```typescript
interface Add {
    sum(first: number, second: number): number;
}

class AddNumber implements Add {
    sum(first: number, second: number): number {
        return Math.round(first + second);
    }
}

class AddFloat implements Add {
    sum(first: number, second: number): number {
        return first + second;
    }
}

function addThreeArgument(adder: Add, first: number, second: number, third: number): number {
    return adder.sum(adder.sum(first, second), third);
}

const numberAdder = new AddNumber();
const floatAdder = new AddFloat();

addThreeArgument(numberAdder, 1, 2, 3);
addThreeArgument(floatAdder, 1.1, 2.2, 3.3);
```

Simply put, it creates multiple forms for one object. The object will automatically choose based on type without needing to check.

This also helps easily add logs to check which class the error is actually in, because if using if-else, the code will have logic coupling with each other and be harder to mock test.

I still have 3 more questions:
- Related to SQL: SELECT, WHERE, JOIN.
- What is REST API?
- Array and linked list. Compare stack and queue.

