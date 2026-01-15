---
title: "What is OAuth and what can it do? How does it work?"
description: "OAuth is a term that is used very often but many people don't know what it means, how the flow works, and why we use OAuth."
date: 2026-01-15
tags: ["OAuth", "base-knowledge", "short-post"]
---

# What is OAuth?

OAuth is an open standard that defines an authorization flow between systems. Applications/webs can obtain tokens to authorize access to user resources from other systems that the application/web needs without knowing the user's password. Instead of requiring third-party applications to store user login credentials, OAuth allows users to grant permissions directly, and the application only receives an access token that represents that access permission.

# What is OAuth used for?

Examples include Google Calendar, Google Drive, and Gmail.

For Gmail, we might encounter Outlook on Windows, for example. We will log in to Google and then grant access permissions to Gmail—create, edit, delete, etc.—for Outlook instead of providing login credentials to Outlook.

Applications need to access through Google's API to interact with resources, and the current application/web needs a token to authorize and define the scope of permissions for that user's resources. This requires a method to obtain this token through several steps.

We will go through OAuth 2.0, the new standard that completely replaces version 1.0 (complex in the exchange process, limited in implementation despite being secure).

Web (JavaScript) from client-side application:

![Google OAuth 2.0 communicate](/assets/blogs/o-auth/1.png)

# Steps:

- First, when a user accesses an application/web that needs resources from Google, this application will send an `Authorization request` to Google servers. This request also includes information about which user and which resources the application needs to access.

- User logs in to Google so Google can authenticate (authentication) the user's identity.

- After the user logs in, they will see a screen showing which permissions the application needs from Google, then confirm that they grant permissions to the application/web.

- Google now knows the user has granted access to resources, sends back an `Authorization code` (also called `exchange code`) as proof that the user has granted the application access to those resources. This contains the exchange code and proof.

- The `Authorization code` is used as proof to begin the most important token exchange, the `access token` to access resources. The application will send this proof along with the exchange code to Google for the final token exchange and receive an `access token`.

- Now that we have the `access token`, use it to call APIs to interact with resources with the granted permissions.

## Terms:

- Authorization request: requesting permission to access the resources the application needs, waiting for user authentication.

- Authorization code (exchange code): used as proof that the user has granted permissions for resources, and does not contain information to access resources.

- Access token: this token is what the application uses to access resources with granted permissions.

- Resource Owner: the user (you).

- Client: third-party application/web.

- Authorization Server: server that issues tokens (Google OAuth Server).

- Resource Server: server that contains resources (Google Drive API, Gmail API, ...).

## Notes:

- Authorization and Authentication are different.

- Authorization is granting permissions, Authentication is verifying identity.

# Source:

[Using OAuth 2.0 to access Google APIs](https://developers.google.com/identity/protocols/oauth2?hl=en#1.-obtain-oauth-2.0-credentials-from-the-dynamic_data.setvar.console_name.)
