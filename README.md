# test_server
To run localy type in console:
```
npm ci
npm run dev
```
Before runing the server Postgress database need to be created. Credentials for database, captcha and coockies placed in environment variables. If ``NODE_ENV`` variable did not equal ``production`` when captcha is disabled.

To test only frontend:
```
npm run templates
```
To access server type in browser:
```
http://localhost:3000
```
