## Alice

This is an api built for a `alice the ai bot from ims`.

### Dependencies

1. To install project dependecies simply run

```shell
npm run install
```

or

```shell
yarn install
```

2. Set up environments

You will need `.env` and `.env.dev` files to run relavant environments with avaialble scripts

example env file contents

```
MONGO_URI = mongodb://localhost:27017 or any remote instance.
JWT_KEY = secret
AWS_ID = secret
AWS_SECRET = secret
AWS_RESOURCE_BUCKET = < BUCKET_NAME >
ASSETS_BASE_URL = https://assets.imssystems.tech
ACCESS_TOKEN_TTL = 2 days
REFRESH_TOKEN_TTL = 5 days
ACCESS_TOKEN_SECRET = secret
REFRESH_TOKEN_SECRET = secret
DATABASE = /test-management
SYSTEM_EMAIL = your.name@domain.com
SEND_GRID_API_KEY= send-grid-api-key
OPEN_AI_API_KEY = openai-api-key
```

### Available scripts

To run a production environment run the command

```
npm start
```

or

```
yarn start
```

To run a development environment run the command

```
npm start:dev
```

or

```
yarn start:dev
```

To run all the tests

```
npm test
```

or

```
yarn test
```
