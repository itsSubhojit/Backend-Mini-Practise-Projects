# URL Shortener API

A simple and professional backend service for shortening long URLs into compact shareable links. This project is built with Node.js and Express and provides a clean API for creating short links, redirecting them to their original destinations, and tracking how many times each link is used.

## Overview

This URL shortener project is designed to be lightweight, practical, and production-friendly for learning and small-scale deployment. It includes:

- URL validation before shortening
- Safe Browsing checks for potentially harmful links
- Persistent URL storage in MongoDB
- Redirect support for short links
- Click tracking for shortened URLs
- Rate limiting to reduce abuse

## Features

- Create a short URL from a valid long URL
- Store the mapping in MongoDB
- Redirect a short URL back to its original destination
- Increase the click count every time a short link is used
- Reject invalid or unsafe URLs
- Limit repeated requests from the same IP

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- NanoID for short URL generation
- Validator for URL validation
- Axios for Safe Browsing requests
- CORS and rate limiting middleware

## Project Structure

```bash
URL Shortner API/
├── Backend/
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── controllers/
│       │   └── url.controller.js
│       ├── db/
│       │   └── index.js
│       ├── middlewares/
│       │   ├── errorHandler.js
│       │   └── rateLimiter.js
│       ├── models/
│       │   └── url.models.js
│       ├── routes/
│       │   └── url.route.js
│       ├── services/
│       │   └── safeBrowsing.service.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           └── asyncHandler.js
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- A MongoDB instance running
- A Google Safe Browsing API key

## Environment Variables

Create a `.env` file inside the `Backend` folder with the following values:

```env
PORT=8000
MONGODB_URI=your_mongodb_details
GOOGLE_SAFE_BROWSING_ENDPOINT=https://safebrowsing.googleapis.com/v4/threatMatches:find
GOOGLE_SAFE_BROWSING_KEY=your_google_safe_browsing_key
```

## Installation

```bash
git clone https://github.com/itsSubhojit/Backend-Mini-Practise-Projects.git
cd Backend-Mini-Practise-Projects
cd "URL Shortner Api"
cd Backend
npm install
npm run dev
```

The server will start on the port defined in your `.env` file.

## API Endpoints

### 1. Create a Short URL

- Method: `POST`
- Endpoint: `/api/v1/url/shortUrl`
- Body:

```json
{
  "longUrl": "https://example.com"
}
```

Example response:

```json
{
  "success": true,
  "message": "New ShortUrl Generated...",
  "data": {
    "longUrl": "https://example.com",
    "shortUrl": "abc123xyz",
    "click": 0
  }
}
```

### 2. Redirect to the Original URL

- Method: `GET`
- Endpoint: `/api/v1/url/:shortUrl`

Example:

```bash
curl http://localhost:8000/api/v1/url/abc123xyz
```

If the short URL exists, the user will be redirected to the original long URL and the click count will increase.

## Notes

- The API validates that the submitted URL is properly formatted.
- Unsafe URLs are blocked using Google Safe Browsing checks.
- The service applies a rate limit of 5 requests per 10 minutes per IP.
- If the short URL already exists, the API returns the existing mapping instead of creating a duplicate entry.

## License

This project is intended for learning and personal development purposes.

## Author

**Subhojit Chakraborty**
