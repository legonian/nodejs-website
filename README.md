# test_server
To run localy type in console:
```
npm ci
npm run dev
```
Before runing the server Postgress database need to be created with script ``create_db.sql`` and ``./node_modules/connect-pg-simple/table.sql``. Credentials for database, captcha and coockies placed in environment variables. If ``NODE_ENV`` variable did not equal ``production`` when captcha is disabled.

To test only pages looks and not backend logic with database:
```
npm run templates
```
After running commands access server by typing in browser:
```
http://localhost:3000
```
Also working version could be found by this link: https://guarded-dusk-85683.herokuapp.com/.