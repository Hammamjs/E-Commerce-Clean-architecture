<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# E-Commerce Backend API

A scalable e-commerce backend built with NestJS, following Clean Architecture principles.
**This project for now it's very small focusing on clean arch more than what providing**

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## features

- products
- carts
- order
- checkout

## Architecture

Clean Architecture with domain-driven separation

## Features

The project currently implements the following **basic e-commerce functionalities**:

- **Users**
  - Create, update, delete
- **Products**
  - Create, update, delete
  - Special repository methods to increase/decrease stock using transactions
- **Cart**
  - CRUD operations
  - Special methods:
    - **createUserCart**: Checks if a user cart exists; returns it, otherwise creates a new one
    - **deleteTx**: Deletes a cart during checkout in a transaction-safe way
- **Cart Items**
  - CRUD operations
  - Special methods:
    - **addItemTx**: Adds an item to the cart in a transaction-safe way
    - **removeItemTx**: Removes an item using a transaction
- **Orders**
  - CRUD operations
- **Order Items**
  - **createFromCart**: Creates order items from a cart using transactions

## Project Focus

- Focused on **Clean Architecture** and **separation of concerns**
- Domain layer is **framework-agnostic**; NestJS-specific features (like `@Injectable`) are not used in inner layers
- Database: Native SQL (PostgreSQL)
- Transactions are handled through **interfaces and wrappers** to keep inner layers clean
- Basic repositories provide CRUD operations and are extended by feature-specific repositories
- Simulation of payment/checkout flow; **no real payment gateway integration yet**
- Emphasis on **maintainability and scalability**, not full feature coverage yet

## Project Structure

```text
src/
├───application
│   ├───command
│   │   ├───cart
│   │   ├───cart-item
│   │   ├───checkout
│   │   ├───order
│   │   ├───order-item
│   │   ├───product
│   │   └───users
│   ├───errors
│   ├───queries
│   │   ├───cart
│   │   ├───order
│   │   └───order-items
│   └───use-cases
│       ├───cart
│       ├───cart-items
│       ├───check-out
│       ├───order
│       ├───order-items
│       ├───product
│       └───users
├───domain
│   ├───entities
│   ├───enums
│   ├───repositories
│   └───value-objects
├───infrastructure
│   ├───database
│   └───persistence
│       ├───cart
│       ├───cart-items
│       ├───order
│       ├───order-items
│       ├───products
│       ├───unit-of-work
│       └───users
├───interfaces
│   ├───dto
│   │   ├───cart-itemsDto
│   │   ├───cartDto
│   │   ├───check-outDto
│   │   ├───Order-itemDto
│   │   ├───orderDto
│   │   ├───productsDto
│   │   └───usersDto
│   └───http
├───logger
├───middleware
├───modules
└───types

```

## TODO / Roadmap

### Core Features

- [x] Users CRUD
- [x] Products CRUD
- [x] Cart CRUD with transaction-safe methods
- [x] Order CRUD
- [x] Cart Items CRUD with transaction-safe methods
- [x] Order Items from Cart transaction

### Security / Auth

- [ ] Add Authentication (JWT)
- [ ] Add Guards for routes (role-based access)
- [ ] Add password hashing

### Payments / Checkout

- [ ] Integrate real payment gateway (Stripe / PayPal)
- [ ] Checkout workflow complete

### Infrastructure / DevOps

- [ ] Database migrations automated
- [ ] Logging and monitoring
- [ ] Unit and e2e test coverage > 80%
- [ ] Docker support

### Refactoring / Clean Architecture

- [ ] Move any remaining framework code out of domain layer
- [ ] Add base repository patterns for all entities
- [ ] Add shared utilities and value objects
