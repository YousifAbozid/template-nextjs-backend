# Next.js Backend API Template

A robust, production-ready template for building scalable RESTful APIs with Next.js. This template provides a solid foundation with built-in authentication, rate limiting, MongoDB integration, and comprehensive testing support.

## Features

- ✅ **Next.js App Router** - Modern routing system
- ✅ **MongoDB Integration** - With Mongoose ORM
- ✅ **Authentication** - JWT-based auth system
- ✅ **Rate Limiting** - Tiered and configurable limiting
- ✅ **Input Validation** - Schema validation with Zod
- ✅ **Error Handling** - Centralized error management
- ✅ **Logging** - Structured logging with Winston
- ✅ **Testing** - Complete Jest test setup
- ✅ **API Documentation** - Self-documenting endpoints
- ✅ **CORS Support** - Configured for cross-origin requests
- ✅ **ESLint & Prettier** - Code quality tools
- ✅ **Husky & lint-staged** - Git hooks

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/template-nextjs-backend.git
cd template-nextjs-backend
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit `.env.local` with your configuration

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The API will be available at [http://localhost:3000/api](http://localhost:3000/api)

## API Endpoints

### Base Routes

- `GET /api` - API information and documentation
- `GET /api/health` - Health check and system status
- `GET /api/hello` - Test endpoint

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current authenticated user

### User Management

- `GET /api/users` - List all users (with pagination, filtering)
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Authentication

This template uses JWT (JSON Web Tokens) for authentication. Protected routes use the `requireAuth` middleware to verify the user is logged in.

Example of using authentication:

```js
// Include Authorization header in your requests
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer YOUR_JWT_TOKEN',
};
```

## Rate Limiting

The API implements a tiered rate limiting system:

- Anonymous users: 30 requests per minute
- Authenticated users: 100 requests per minute
- Admin users: 300 requests per minute
- Auth endpoints: Stricter limiting (10 requests per minute)

## Project Structure

```
/
├── app/                   # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management endpoints
│   │   └── ...
│   └── ...
├── lib/                   # Utility libraries
│   ├── errorHandler.js    # Error handling
│   ├── jwt.js             # JWT utilities
│   ├── logger.js          # Logging functions
│   ├── mongodb.js         # Database connection
│   ├── rateLimiter.js     # Rate limiting utilities
│   └── validation.js      # Validation helpers
├── middleware/            # Middleware functions
│   ├── auth.js            # Authentication middleware
│   └── rateLimiter.js     # Rate limiting middleware
├── middleware.js          # Next.js middleware
├── models/                # Mongoose models
│   └── User.js            # User model
├── schemas/               # Validation schemas
│   └── user.schema.js     # User validation schemas
├── tests/                 # Test files
│   ├── middleware/        # Middleware tests
│   ├── lib/               # Library tests
│   └── utils/             # Test utilities
├── scripts/               # Utility scripts
└── ...config files
```

## Environment Variables

These variables can be configured in your `.env` file:

| Variable                  | Description                | Default                                                |
| ------------------------- | -------------------------- | ------------------------------------------------------ |
| `MONGODB_URI`             | MongoDB connection string  | `mongodb://localhost:27017/your-database-name`         |
| `JWT_SECRET`              | Secret key for JWT         | `your_very_strong_jwt_secret_key_change_in_production` |
| `JWT_EXPIRES_IN`          | JWT expiration time        | `7d`                                                   |
| `API_VERSION`             | API version for headers    | `1.0.0`                                                |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window in ms    | `60000`                                                |
| `RATE_LIMIT_MAX_REQUESTS` | Standard rate limit        | `60`                                                   |
| `RATE_LIMIT_STRICT_MAX`   | Strict rate limit for auth | `10`                                                   |
| `RATE_LIMIT_API_MAX`      | API endpoints rate limit   | `120`                                                  |
| `LOG_LEVEL`               | Logging level              | `info`                                                 |

## Testing

This template includes comprehensive test setup with Jest:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Error Handling

All API errors are handled with a consistent format:

```json
{
  "error": "Error message",
  "validationErrors": {
    "field": "Field-specific error"
  },
  "success": false
}
```

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

### Other Deployment Options

The template can be deployed to any platform supporting Next.js:

- AWS Amplify
- Netlify
- Docker container
- Traditional Node.js hosting

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Zod](https://github.com/colinhacks/zod)
- [Winston](https://github.com/winstonjs/winston)
- [JWT](https://jwt.io/)

---

Built with ❤️ by Yousif Abozid
