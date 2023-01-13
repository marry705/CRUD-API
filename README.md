# CRUD-API
https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md

1. git clone this repository

2. add data on `.env.template`.

For example:
```
MAIN_PORT=4000
```
3. rename `.env.template` on `.env`

4. `npm i`

If everything goes well, then a `node_modules` folder should appear.

5. `npm run start:dev`

If everything goes well, then a message `🚀 Server ready on MAIN_PORT` should appear in the console

6. `npm run start:prod`

If everything goes well, then a `dist` folder should appear and message `🚀 Server ready on MAIN_PORT` should appear in the console.

7. `npm run start:multi`

If everything goes well, then a message `🚀 Server ready on MAIN_PORT` and `Worker NUMBER_OF_WORKER is now connected to http://localhost:{WORKER_PORT}` should appear in the console. 

8. `npm run test`