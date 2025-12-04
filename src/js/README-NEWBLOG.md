# How to add new blog

### Step 1: slug -> blog folder && add new blog to show in blogs
It will be list in the [blog-data.js](./blogs-data.js). So first adding new blog with slug -> slug will point to the folder thathave content.


### Step 2: create a new blog content with two different language.
Copy full html that need to have except body part has new content blog will be changed.


```js
 {
    slug: "api-overview", // <- path to folder contain blog
    title: "API & Microservice",
    date: "2025-11-10",
    tags: ["API","short-post"], // <- tag
    summary: "Understanding how APIs and microservices communicate by exchanging requests and responses.",
    languages: ["en", "vi"] // <- language switcher
  }
```