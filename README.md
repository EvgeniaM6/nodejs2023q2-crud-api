# Node.js CRUD API

This task is simple CRUD API using in-memory database underneath.

## Setup

- Use 18 LTS version of Node.js
- Clone this repo
- Go to project directory: 
```bash
cd nodejs2023q2-crud-api
```
- Install dependencies: 
```bash
npm i
```
- Switch to `develop` branch:
```bash
git checkout develop
```
- Create `.env` file and specify port on which you want to run the server. `PORT=4000` for example. If `.env` is missing and environment variable `PORT` is undefined, server will use default port `4000`.
- When the server is started, you can send requests to the address `http://localhost:4000/`

## Starting application

There are four different modes of operation:

- To launch single server instance in development mode run:
```bash
npm run start:dev
```
- To launch single server instance in production mode run:
```bash
npm run start:prod
```
- To launch server in cluster mode wih round-robin load balancer run:
```bash
npm run start:multi
```

In Cluster Mode there are multiple instances of the application using the Node.js `Cluster API` (equal to the number of available parallelism - 1 on the host machine, each listening on port PORT + n) with a load balancer that distributes requests across them (using Round-robin algorithm).

## Running tests

1. To run provided integration tests (3 different scenarios are provided) run server in one git bash:
```bash
npm run start:dev
```
2. And run tests in other git bash:
```bash
npm test
```

## Usage

- **GET** `api/users` is used to get all users
  - Server answers with `status code` **200** and all users records
- **GET** `api/users/{userId}` gets user with provided `userId`
  - Server answers with `status code` **200** and user record with `id === userId` if it exists
  - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server answers with `status code` **404** and corresponding message if user record with `id === userId` doesn't exist
- **POST** `api/users` creates new user and stores it in in-memory database

  - Server answers with `status code` **201** and newly created user record
  - Server answers with `status code` **400** and corresponding message if request `body` does not contain **required** fields

- **PUT** `api/users/{userId}` updates existing user with provided `userId`

  - Server answers with `status code` **200** and updated user record
  - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server answers with `status code` **400** and corresponding message if request `body` does not contain **required** fields
  - Server answers with `status code` **404** and corresponding message if user record with `id === userId` doesn't exist

- **DELETE** `api/users/{userId}` deletes existing user with provided `userId`
  - Server answers with `status code` **204** if the user record is found and deleted
  - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server answers with `status code` **404** and corresponding message if user record with `id === userId` doesn't exist

Bodies of **POST** and **PUT** requests **must be** in the following format:

- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)

Requests to non-existing endpoints (e.g. `some-non/existing/resource`) are handled (server answers with `status code` **404** and corresponding human-friendly message)

Errors on the server side that occur during the processing of a request are handled and processed correctly (server answers with `status code` **500** and corresponding human-friendly message)

Users are stored in in-memory database and have following properties:

- `id` — unique identifier (`string`, `uuid`) generated on server side
- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
