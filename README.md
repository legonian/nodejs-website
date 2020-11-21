# Blog Website

This repository present website written in NodeJS using Express framework.
It provides basic functionality of creating posts and managing your account.

## Features

This website include following features:
+ Express framework that provide minimalist design and long support from developers
+ EJS templating engine
+ Following MVC design pattern
+ Bootstrap with almost none of CSS-code with full mobile support
+ Authentication of website users to have possibility to create posts
+ Google reCaptcha when authenticating user
+ PostgreSQL as database for all data
+ Usage of Content Security Policy to prevent basic vulnerabilities
+ Client and server side validation of any content coming to database
+ Messaging between registered users
+ Posts editing using SimpleMDE markdown editor

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

Before runing the server Postgress database need to be created with script
``create_db.sql`` and ``./node_modules/connect-pg-simple/table.sql``.
Also credentials for database, google recaptcha and cookies placed in
environment variables: ``$DATABASE_URL``, ``$RECAPTCHA_SECRET``,
``$SESSION_SECRET``. If ``$NODE_ENV`` variable did not equal ``production``
when captcha will be disabled.

After running commands and setting up environment variables type:

```
$ npm run dev
```

And access website by typing in browser ``http://localhost:3000``.
