# Product Management System

RESTful API for product, customer and order management using Node.js, Express and SQLite, following the MVC (Model-View-Controller) architectural pattern.

## Installation

```bash
cd api
npm install
```

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit the `.env` file and configure the following variables:

```env
# Database Configuration
DB_PATH=products.db

# Session Configuration (CHANGE THIS IN PRODUCTION!)
SESSION_SECRET=your-secret-key-change-in-production

# Default Admin User (only used on first initialization)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:3000

# Server Configuration
PORT=3000
```

⚠️ **Important**: 
- Change `SESSION_SECRET` to a strong random string in production
- Change `DEFAULT_ADMIN_PASSWORD` to a secure password
- Never commit the `.env` file to version control (it's already in `.gitignore`)

## Initial Setup

After configuring the `.env` file, create the default user:

```bash
npm run init-user
```

This will create a default user with the credentials specified in your `.env` file.

## Running

```bash
npm start
```

The server will start on port 3000.

## Authentication

The API uses session-based authentication. All endpoints for products, customers, and orders require authentication.

### Login

Access the login page at:
🌐 **Login Page**: http://localhost:3000/login

### API Integration Interface

After logging in, you can use the interactive API integration page:
🌐 **API Integration**: http://localhost:3000/integration

This page allows you to test all API endpoints with a user-friendly interface.

## API Documentation

Interactive API documentation is available using ReDoc. Access the documentation at:

🌐 **API Documentation**: http://localhost:3000/docs

### Features:

- **Beautiful Documentation** - Clean and readable API documentation
- **Request/Response Examples** - See example requests and responses for each endpoint
- **Schema Documentation** - Complete schema definitions for all models
- **OpenAPI 3.0** - Standard OpenAPI specification

### Available Endpoints:

- **Products** - CRUD operations for products
- **Customers** - CRUD operations for customers
- **Orders** - CRUD operations and search functionality for orders

## Base URL

```
http://localhost:3000
```

## API Endpoints

### Authentication (Public)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status

### Protected Endpoints (Require Authentication)
- `/api/product` - Product management (requires authentication)
- `/api/customer` - Customer management (requires authentication)
- `/api/order` - Order management (requires authentication)

All protected endpoints will return a `401 Unauthorized` error if the user is not authenticated.
