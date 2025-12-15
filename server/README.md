# EduManage Server

EduManage School Management System - Backend API built with NestJS.

## Description

EduManage is a comprehensive school management system that provides APIs for managing students, teachers, groups, and administrative tasks.

## Installation

```bash
$ npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

DB_URL=postgresql://username:password@localhost:5432/edumanage_db

TOKEN_ACCESS_TOKEN_KEY=your-access-token-secret-key
TOKEN_ACCESS_TOKEN_TIME=86400
TOKEN_REFRESH_TOKEN_KEY=your-refresh-token-secret-key
TOKEN_REFRESH_TOKEN_TIME=604800

SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=admin123
SUPER_ADMIN_FULLNAME=Super Admin

UPLOAD_FOLDER=uploads
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/api`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is private and proprietary.
