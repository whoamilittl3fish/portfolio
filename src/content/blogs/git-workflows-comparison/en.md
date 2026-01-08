---
title: "Gitflow, Github flow, and Gitlab flow - Understanding Git Workflows"
description: "What are Gitflow, Github flow, and Gitlab flow, and how do they differ?"
date: 2026-01-05
tags: ["short-post", "base-knowledge", "git"]
---

## Question:

What are Gitflow, Github flow, and Gitlab flow, and how do they differ? (Testing teamwork ability with Git tools. Of course, when working on a shared project, being proficient with Git is essential.)

## Answer:

Common ways to work with Git are Gitflow, Github flow, and Gitlab flow. I will call the main branch (or master) main.

### Gitflow:

- This is the classic way of dividing a project into multiple parts. There are 3 main types: main/production/release, develop, feature/hot-fix.

- Among these, main is the primary branch, usually managed by the project manager when merging from develop. A new branch called production/release can be added by version.

- Next is the develop branch. This is the branch where everyone in the team will work together. All new features will be merged into this branch and can be used to deploy to staging for testing before the official launch on production on the main branch.

- Finally, there is feature/. Usually, this is a branch that developers will create with a name for a new feature, develop in this branch, then rebase onto develop before merging and merge after code review and completion.

- Additionally, when there is an error, there will be a hot-fix branch used to resolve major bugs promptly when production has errors. After completion, it will be merged into both production/main/release and develop.

**Pros and Cons:**

- Detailed environment, clearer workflow.

- Complex when there are many environments, and the more branches there are, the more likely conflicts will occur when merging. :D This is something people will be quite concerned about.

- CI/CD is more difficult because there is both production/release for main, and dev for staging.

### Github flow:

- This method is faster than Gitflow, with only one main branch and feature, hot-fix branches. The main branch will be the primary branch and everyone works around it.

**Pros and Cons:**

- This method reduces the complex process of Gitflow but at the same time, the version after merging will be production/release instead of having a staging phase for testing.

- Easier CI/CD (main branch).

### Gitlab flow:

- This is a process that combines both Gitflow and Github flow (hybrid). Depending on the team's standards. Usually, there will also be main, feature, staging, production/release.

- This process can be:

`feature -> main -> staging -> release`

or

`feature -> main -> release/1.0 -> production`

**Pros:**

- More flexible.

- Suitable for CI/CD.

- Clear environment distinction (dev, staging, production).

