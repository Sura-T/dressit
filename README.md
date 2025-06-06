# Dating App Backend

A Node.js backend for a dating application where women can post dress looks and men can send money for them. After payment, users can chat.

## Features

- User authentication (signup, login)
- JWT-based authentication
- User profile management
- Input validation
- Error handling
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dating-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dating-app
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "nickname": "string",
  "email": "string",
  "password": "string",
  "role": "man" | "woman",
  "avatar_url": "string",
  "bio": "string",
  "location": "string",
  "birthday": "2025-06-06",
  "gender": "male" | "female" | "other",
  "interested_in_genders": ["male" | "female" | "other"],
  "interested_in_roles": ["man" | "woman"]
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "error": "Error message",
  "details": "Detailed error information (if available)"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Input validation using express-validator
- CORS enabled
- Environment variables for sensitive data

## Development

To run the development server with hot reloading:
```bash
npm run dev
```

To run tests:
```bash
npm test
```

## Production

To start the production server:
```bash
npm start
```

## License

MIT 