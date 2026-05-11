# 🔀 API Gateway — Endpoint Reference

## Base URL

```
http://localhost:8000
```

## Authentication

Most endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Endpoints

### 👤 User Service

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/users/signup` | ❌ | Register a new user |
| `POST` | `/users/login` | ❌ | Login and get JWT token |
| `GET` | `/users/profile` | ✅ | Get current user profile |
| `PUT` | `/users/profile` | ✅ | Update user profile |

### 📦 Product Service

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/products` | ❌ | List all products |
| `GET` | `/products/{id}` | ❌ | Get product by ID |
| `POST` | `/products` | 🔑 Admin | Create a product |
| `PUT` | `/products/{id}` | 🔑 Admin | Update a product |
| `DELETE` | `/products/{id}` | 🔑 Admin | Delete a product |
| `GET` | `/categories` | ❌ | List all categories |
| `POST` | `/categories` | 🔑 Admin | Create a category |

### 🛒 Cart Service

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/cart` | ✅ | Get user's cart |
| `POST` | `/cart/items` | ✅ | Add item to cart |
| `PUT` | `/cart/items/{id}` | ✅ | Update cart item quantity |
| `DELETE` | `/cart/items/{id}` | ✅ | Remove item from cart |
| `DELETE` | `/cart` | ✅ | Clear cart |

### 📋 Order Service

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/orders` | ✅ | Place an order |
| `GET` | `/orders` | ✅ | List user's orders |
| `GET` | `/orders/{id}` | ✅ | Get order details |

### 💳 Payment Service

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/payments` | ✅ | Process payment |
| `GET` | `/payments/{id}` | ✅ | Get payment status |

## Query Parameters

### Product Listing

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search query |
| `category` | string | — | Filter by category ID |
| `featured` | bool | — | Featured products only |
| `limit` | int | 20 | Items per page |
| `offset` | int | 0 | Pagination offset |

## Error Responses

```json
{
  "detail": "Error description"
}
```

| Code | Meaning |
|------|---------|
| `400` | Bad Request — invalid input |
| `401` | Unauthorized — missing/invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found |
| `429` | Rate Limited |
| `500` | Internal Server Error |
