---
title: "What is OOP? - Object-Oriented Programming Explained"
description: "What is OOP? Object-Oriented Programming is a fundamental programming paradigm that organizes code in a structured way by objects."
date: 2026-01-05
tags: ["short-post", "base-knowledge", "oop"]
---

## Question:

What is OOP? (Fundamental knowledge)

## Answer:

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

### Encapsulation

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

### Polymorphism

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

