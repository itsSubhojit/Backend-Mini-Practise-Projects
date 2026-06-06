# 🔐 Basic Auth System

A production-ready REST API for user authentication built with Node.js, Express, and MongoDB.

---

## 🚀 Features

- **User Registration** — with duplicate username/email detection
- **User Login** — via username or email
- **JWT Authentication** — access token + refresh token strategy
- **Secure Cookies** — `httpOnly` + `secure` cookie flags
- **Password Hashing** — bcrypt with 10 salt rounds
- **Protected Routes** — `verifyJWT` middleware
- **User Logout** — clears cookies + removes refresh token from DB
- **Custom Error Handling** — `ApiError` class with stack trace
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
| Password | bcrypt |
| Config | dotenv |
| Dev Tool | nodemon |
| Cookies | cookie-parser |

---

## 📁 Project Structure

```
src/
├── controllers/
│   └── user.controller.js       # registerUser, loginUser, logoutUser
├── db/
│   └── index.js                 # MongoDB connection
├── middlewares/
│   └── auth.middleware.js       # verifyJWT middleware
├── models/
│   └── user.model.js            # User schema, bcrypt hooks, JWT methods
├── routes/
│   └── user.routes.js           # API routes
├── utils/
│   ├── ApiError.js              # Custom error class
│   ├── ApiResponse.js           # Standard response class
│   └── asyncHandler.js          # Async wrapper utility
└── index.js                     # App entry point
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
| POST | `/logout` | ✅ | Logout current user |

---

### Register User
**POST** `/register`

```json
{
  "username": "testuser",
  "fullName": "Test User",
  "email": "test@test.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "statuscode": 200,
  "message": "User registered successfully",
  "data": { "_id": "...", "username": "testuser", "fullName": "Test User", "email": "test@test.com" },
  "success": true
}
```

---

### Login User
**POST** `/login`

```json
{
  "username": "testuser",
  "email": "test@test.com",
  "password": "123456"
}
```

> Login works with either `username` or `email` — both are not required simultaneously.

**Response:** Sets `accessToken` and `refreshToken` as `httpOnly` cookies.

---

### Logout User
**POST** `/logout`

> Requires valid `accessToken` cookie. Clears both cookies and removes refresh token from database.

---

## 🔒 Security Highlights

- Passwords are never stored in plain text — bcrypt hashing with 10 rounds
- Refresh tokens are stored in DB and invalidated on logout
- Cookies are `httpOnly` (XSS protection) and `secure` (HTTPS only)
- Sensitive fields (`password`, `refreshToken`) are never returned in API responses

---

## 🗺️ Future Goals

- [ ] Frontend integration — React + Vite with AuthContext and PrivateRoute
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Rate limiting — prevent brute force attacks
- [ ] Upgrade to full-stack RAG Chatbot using this auth system as base

---

## 👨‍💻 Author

csubhojit

---

> Built with curiosity.