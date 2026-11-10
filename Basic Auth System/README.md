# 🔐 Basic Auth System

A production-ready REST API for user authentication built with Node.js, Express, and MongoDB.

---

## 🚀 Features

- **User Registration** — with duplicate username/email detection
- **User Login** — via username or email
- **JWT Authentication** — access token + refresh token strategy
- **Token Versioning** — every logout invalidates all existing tokens via a version counter baked into the JWT
- **Refresh Access Token** — issue a new access token using a valid refresh token
- **Secure Cookies** — `httpOnly` + `secure` cookie flags
- **Password Hashing** — bcrypt with 10 salt rounds
- **Zod Input Validation** — schema-based validation on register and login with clean field-level error messages
- **Rate Limiting** — 10 requests per 5 minutes per IP on public routes
- **Protected Routes** — unified `verifyJwtTokens` middleware (cookie + header support)
- **User Logout** — increments token version + clears cookies + removes refresh token from DB
- **Custom Error Handling** — `ApiError` class with stack trace and custom errors array
- **Consistent API Responses** — `ApiResponse` class with status-aware `success` flag
- **Async Error Wrapper** — `asyncHandler` utility, no repetitive try/catch

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Validation | Zod |
| Password | bcrypt |
| Rate Limiting | express-rate-limit |
| Config | dotenv |
| Dev Tool | nodemon |
| Cookies | cookie-parser |

---

## 📁 Project Structure

```
src/
├── controllers/
│   └── user.controller.js          # registerUser, loginUser, logoutUser, generateRefreshAccessToken
├── db/
│   └── index.js                    # MongoDB connection
├── middlewares/
│   ├── auth.middleware.js          # verifyJwtTokens (JWT verify + tokenVersion check)
│   ├── errorHandler.js             # Global error handler
│   ├── rate-limiter.middleware.js  # express-rate-limit config
│   └── validate.middleware.js      # Zod validation middleware (register + login)
├── models/
│   └── user.model.js               # User schema, bcrypt hook, JWT methods, incrementTokenVersion
├── routes/
│   └── user.routes.js              # API routes
├── utils/
│   ├── ApiError.js                 # Custom error class (statusCode, message, errors[])
│   ├── ApiResponse.js              # Standard response class
│   └── asyncHandler.js             # Async wrapper utility
├── validators/
│   └── user.validator.js           # Zod schemas: registerSchema, loginSchema
└── index.js                        # App entry point
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/itsSubhojit/Backend-Mini-Practise-Projects.git
cd "Basic Auth System"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

### 4. Run the development server

```bash
npm run dev
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:8000/api/v1/users`

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/register` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login with username or email |
| POST | `/logout` | ✅ | Logout and invalidate token |
| POST | `/refresh-accesstoken` | ❌ | Get a new access token via refresh token |

---

### Register User
**POST** `/register`

```json
{
  "username": "testuser",
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Validation rules:**
- `username` — min 3 characters
- `fullName` — min 3 characters
- `email` — valid email format
- `password` — min 8, max 16 characters

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "User registered successfully",
  "data": { "_id": "...", "username": "testuser", "fullName": "Test User", "email": "test@example.com" },
  "success": true
}
```

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "password", "message": "Password must be at least 8 characters" }
  ],
  "data": null
}
```

---

### Login User
**POST** `/login`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

> Login works with either `username` or `email` — both are not required simultaneously.

**Response:** Sets `accessToken` and `refreshToken` as `httpOnly` cookies.

---

### Logout User
**POST** `/logout`

> Requires a valid `accessToken` — send via cookie or `Authorization: Bearer <token>` header.

- Increments `tokenVersion` in DB — all previously issued tokens are immediately invalidated
- Clears `accessToken` and `refreshToken` cookies
- Removes refresh token from database

---

### Refresh Access Token
**POST** `/refresh-accesstoken`

> Send the `refreshToken` via cookie or `Authorization: Bearer <token>` header.

**Response:** Issues a new `accessToken` as a cookie.

```json
{
  "statusCode": 200,
  "message": "Access Granted",
  "data": { "accessToken": "..." },
  "success": true
}
```

---

## 🔑 Token Versioning

Token versioning ensures that **logging out truly invalidates the session** — even if someone still holds the old JWT.

**How it works:**
- A `tokenVersion` counter (starts at `0`) is stored on the user document in MongoDB
- Every access token has `tokenVersion` baked into its payload at the time of login
- On every protected request, `verifyJwtTokens` compares the token's `tokenVersion` against the DB value
- On logout, `tokenVersion` is incremented by 1 — all old tokens no longer match and are rejected with `401 Session expired`

```
Login  → token issued with tokenVersion: 0
Request → token has 0, DB has 0 → ✅ allowed
Logout → DB tokenVersion becomes 1
Old token → has 0, DB has 1 → ❌ 401 Session expired
```

---

## 🔒 Security Highlights

- Passwords are never stored in plain text — bcrypt hashing with 10 rounds
- Refresh tokens are stored in DB and invalidated on logout
- Cookies are `httpOnly` (XSS protection) and `secure` (HTTPS only)
- Sensitive fields (`password`, `refreshToken`) are never returned in API responses
- Token versioning prevents reuse of old JWTs after logout
- Zod validates and trims all inputs before they reach the controller
- Rate limiting (10 requests / 5 min) on public routes guards against brute force

---

## 🗺️ Future Goals

- [ ] Frontend integration — React + Vite with AuthContext and PrivateRoute
- [ ] Email verification on registration
- [ ] Password reset via email (forgot password flow)

---

## 👨‍💻 Author

**Subhojit Chakraborty**

---

> Built with curiosity.
