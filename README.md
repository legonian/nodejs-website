# Blog Website

This repository present website written in NodeJS using Express framework.
It provides basic functionality of creating posts and managing your account.

## Features

This website using following server-side tools:
+ Express web-framework
+ MVC design pattern
+ EJS templating engine
+ User authentication with validation of any user input like user info, posts and messages
+ PostgreSQL database storage
+ Simple brute-force attack protection
+ Password hashing
+ Unit and integration tests using Jest and Puppeteer

Client-side tools include:
+ Full Bootstrap and responsive UI
+ Usage of Google reCaptcha
+ Strict Content Security Policy to prevent basic vulnerabilities
+ Interface for creating users, post, and direct messages
+ Posts editing using SimpleMDE markdown editor
+ Additional client-side validation of any sent data

## Demo
Demo app example is running in Heroku Cloud (free dynos):

https://guarded-dusk-85683.herokuapp.com/

<img align="left" width="400" alt="Home Page" src="https://github.com/legonian/nodejs-website/raw/master/public/images/example-pages-440x850/home-page.png">
<img width="400" alt="Signup Page" src="https://github.com/legonian/nodejs-website/raw/master/public/images/example-pages-440x850/signup.png">

<img align="left" width="400" alt="Profile Page" src="https://github.com/legonian/nodejs-website/raw/master/public/images/example-pages-440x850/profile.png">
<img width="400" alt="New Post Page" src="https://github.com/legonian/nodejs-website/raw/master/public/images/example-pages-440x850/new-post.png">

<img align="left" width="400" alt="Messages Page" src="https://github.com/legonian/nodejs-website/raw/master/public/images/example-pages-440x850/messages.png">
<img width="400" alt="Settings Page" src="https://github.com/legonian/nodejs-website/raw/master/public/images/example-pages-440x850/settings.png">

## Installation

To install type in console:

```
$ git clone https://github.com/legonian/nodejs-website
$ cd nodejs-website
$ npm ci
```

## Usage

Before runing the server Postgres database need to be created with following
scripts: ``./create_db.sql`` and ``./node_modules/connect-pg-simple/table.sql``.
Also credentials for database, google recaptcha and cookies placed in
environment variables: ``$DATABASE_URL``, ``$RECAPTCHA_SECRET``,
``$SESSION_SECRET``.

The ``$DATABASE_URL`` follows this naming convention:

```
postgres://<username>:<password>@<host>/<dbname>
```

Also when running in local use ``sslmode=disable`` URI query.

If ``$NODE_ENV`` variable did not equal ``production``
when captcha will be disabled. It's can be useful before setup your reCaptcha
account or to use in local network.

To get info about what is ``$SESSION_SECRET`` variable read:
https://github.com/expressjs/session#secret

After running commands and setting up environment variables type:

```
$ npm run start
```

And access website by typing in browser ``http://localhost:3000``.
