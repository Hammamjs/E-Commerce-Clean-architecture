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

# 🛒 E-Commerce Backend API (Clean Architecture)

A **scalable e-commerce backend** built with **NestJS**, designed using **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

> ⚠️ **Project Scope**
>
> This project focuses on **architecture quality, transactional consistency, and rich domain modeling** rather than full feature coverage.  
> It is intended as a **learning and reference project** for building maintainable backend systems.

---

## 🚀 Tech Stack

- Node.js / TypeScript
- NestJS (used only for HTTP & DI)
- PostgreSQL (Native SQL)
- pnpm
- Clean Architecture
- Domain-Driven Design (DDD)
- Unit of Work & Transactions

---

## 🧠 Architectural Principles

- Domain layer is **framework-agnostic**
- No NestJS decorators inside the domain
- Business rules live in **entities**, not services
- Application layer orchestrates workflows
- Infrastructure layer handles persistence and transactions
- Controllers are thin and contain no business logic
- Explicit transaction boundaries using Unit of Work

---

## 🧱 Architecture Overview

```text
Interfaces (HTTP / DTOs)
        ↓
Application (Use Cases, Commands, Queries)
        ↓
Domain (Entities, Value Objects, Enums)
        ↓
Infrastructure (Repositories, SQL, Transactions)

```

```text
src/
├── application
│ ├── command # Commands (write intent)
│ ├── queries # Queries (read intent)
│ ├── use-cases # Application business logic
│ ├── errors # Application-level errors
│ └── base.use-case.ts
│
├── domain
│ ├── entities # Rich domain models
│ ├── value-objects
│ ├── enums
│ └── repositories # Repository interfaces
│
├── infrastructure
│ ├── database # DB connection & config
│ └── persistence # Repository implementations
│ ├── unit-of-work # Transaction handling
│ └── async-context
│
├── interfaces
│ ├── http # Controllers
│ └── dto # Request / response DTOs
│
├── modules # NestJS modules
├── middleware
├── logger
└── types
```

## ✨ Features

**👤 Users**

- Create user

- Update user

- Delete user

- Find user by ID

- Find user by email

- List all users

**📦 Products**

- Create, update, delete products

- Find product by ID

- List all products

- Increase stock using transactions

- Decrease stock during checkout

**🛒 Cart**

- Create cart automatically per user

- Find cart by user

- Fetch cart with items

- Update cart checkout status

- Delete cart after successful checkout

**🧾 Cart Items**

- Add item to cart (transaction-safe)

- Remove item from cart

- List all cart items

- Quantity-based price calculation

**📑 Orders**

- Create order from cart

- Delete order

- Update order status

- Fetch user orders

- Fetch single order

**📋 Order Items**

- Create order items from cart

- Fetch order items by order ID(s)

- Update order item status

**🔁 Checkout Flow (Transactional)**

- All checkout steps run inside a single database transaction:

- Validate user

- Validate cart existence

- Validate cart items

- Validate product stock

- Decrease product stock

- Create order

- Create order items from cart

- Update cart status

- Delete cart after success

- If any step fails, the transaction is rolled back.

## 🧩 Key Patterns Used

- Repository Pattern

- Unit of Work

- Command / Query Separation

- Facade Pattern

- Rich Domain Model

- Explicit Error Handling

# 🧪 Scripts

### Install dependencies

```bash
pnpm install
```

### development

```bash
pnpm run start

# watch mode

pnpm run start:dev

# production

pnpm run start:prod

# unit tests

pnpm run test

### e2e tests

pnpm run test:e2e
```

### test coverage

```bash
 pnpm run test:cov
```

## 🎯 Project Goal

### This project is not a production-ready e-commerce system.

- Its goal is to demonstrate:

- Clean Architecture applied in NestJS

- Transaction-safe workflows

- Separation of concerns

- Scalable and maintainable backend design
