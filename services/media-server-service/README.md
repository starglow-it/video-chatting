# Media Server Service

---

## After copying into your project, update the node.js dependencies and all packages.
## It will also be nice if you create a merge requeue with updated dependencies afterwards :)

---

## Dependencies

```
Node.js >= 16.3.0
RabbitMQ
MongoDB
```

## Available scripts

> npm run start - to start service \
> npm run dev - to start service with nodemon \
> npm run lint - to lint service \
> npm run lint:fix - to lint and fix errors \
> npm run lint:watch - to lint and watch for changes

## Service parts

### API
#### The API divided into modules
Each module contains:
- Router - contains a path, connects validators and controller to this path \
- Scheme validator - checks the data according to the scheme \
- Data validator - checks data against the database \
- Controller - calls service, works with http layer (setting cookies, sending response)

### Broker
#### The broker divided into modules by exchanges
Each module contains:
- Publisher - publish a message to the queue
- Consumer - subscribes to the queue
- Controller - calls service, ack message
#### Broker config must be sync with other services

### Services
Services must accept the first argument of an object with variables,
the second argument is an object with a session and other options
The version with the transaction must be called from the controllers
The non-transactional version called from services, with session passing to the service

### External Services
External services contain services that access external api

### Boot
Boot contains the scripts that are run at service startup

### Config
Config contains configuration files

### Const
Const contains files with constants

### Migrations
The migration file named in this pattern: TimestampInMS-transaction-name
The migration file must export 2 functions: `up` and `down`
`Up` run at the start of migration, if the migration has made an error `down` is called

### Models
Models contain models, and also export parameters of these models

### Utils
Utils contain helping functions
