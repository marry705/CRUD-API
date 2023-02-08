# CRUD-API
https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md

# START

1. git clone this repository

2. checkout on `dev` branch

3. copy and rename `.env.template` file as `.env`. Add data on it.

```
MAIN_PORT=4000
```

4. `npm i`

If everything goes well, then a `node_modules` folder should appear.

5. `npm run start:dev`

If everything goes well, then a message `🚀 Server ready on MAIN_PORT` should appear in the console

6. `npm run start:prod`

If everything goes well, then a `dist` folder should appear and message `🚀 Server ready on MAIN_PORT` should appear in the console.

7. `npm run start:multi`

If everything goes well, then a message `🚀 Server ready on MAIN_PORT` and `Worker NUMBER_OF_WORKER is now connected to http://localhost:{WORKER_PORT}` should appear in the console. 

# TESTING 
You can use, for example, `Postman` to test API.

!! Remember about request headers. You need `'content-type': 'application/json'`.

```
GET http://localhost:MAIN_PORT/api/users

GET http://localhost:MAIN_PORT/api/users/{userId}

POST http://localhost:MAIN_PORT/api/users

PUT http://localhost:MAIN_PORT/api/users/{userId}

DELETE http://localhost:MAIN_PORT/api/users/{userId}
```

Structure of the body to create a new user.

!! All fields are required.

```
{
    "username": "Marry",
    "age": 20,
    "hobbies": [“hobbie1", "hobbie2"]
}
```

Structure of the body to update a user.

```
{
    "username": "MarryNewName",
    "age": 21,
    "hobbies": [“hobbie1", "hobbie2", "newHobbie"]
}
```