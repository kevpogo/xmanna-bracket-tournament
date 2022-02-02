## Description

Simple gestion of bracket-tournament.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Endpoints

Go to http://localhost:3000/info to access to swagger.

## Env vars

| Env var                           | default                   | description                                                         |
| --------------------------------- | ------------------------- | ------------------------------------------------------------------- |
| RULE_CAN_PLAYERS_MULTI_TOURNAMENT | false                     | set true to allow the player to participate in multiple tournaments |
| MONGO_URL                         | mongodb://127.0.0.1:27017 | url of MongoDB                                                      |
| MONGODB_DATABASE_NAME             | bracket-tournament        | database name in MongoDB                                            |
| PORT                              | 3000                      | port of application                                                 |
