# Next.js Backend Template with Decorator-Based OpenAPI System

✨ **Modern Next.js API Template with TypeScript decorator-based OpenAPI generation** 🚀

A comprehensive Next.js backend template featuring a complete decorator-based OpenAPI generation system that provides type-safe API development with automatic documentation generation.

## 🌟 Features

### 🎯 **Decorator-Based OpenAPI System**

- **Custom Decorators**: `@ApiProperty`, `@ApiOperation`, `@ApiTags`, parameter decorators
- **DTO-First Development**: Combine OpenAPI docs with class-validator decorators
- **Schema Generation**: Reflection-based OpenAPI 3.0 schema generation
- **Type Safety**: Generated TypeScript types and API client
- **Validation**: Built-in request validation using class-validator

### 🔧 **Development Experience**

- **Hot Reload**: Watch mode for automatic OpenAPI regeneration
- **Build Integration**: OpenAPI generation integrated into Next.js build process
- **Interactive Docs**: Built-in API documentation UI at `/docs`
- **Type Generation**: Automatic TypeScript types and API client generation

### 🛠️ **Production Ready**

- **ES Modules**: Modern JavaScript with .js extension imports
- **Clean Architecture**: Separation of concerns with organized file structure
- **Error Handling**: Structured error responses with proper OpenAPI schemas
- **Validation**: Runtime validation with comprehensive error messages

## 🚀 Quick Start

### 1. Installation

```bash
git clone <your-repo>
cd template-nextjs-backend
npm install
```

### 2. Start Development

```bash
# Start with OpenAPI watching
npm run api:dev

# Or start separately
npm run dev          # Next.js development server
npm run api:watch    # OpenAPI generation watch mode
```

### 3. Generate OpenAPI Documentation

```bash
npm run api:generate  # Generate OpenAPI spec, types, and client
```

### 4. View Documentation

- **Interactive UI**: http://localhost:3000/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs

## 📁 Project Structure

```
├── app/api/              # Next.js API routes
│   ├── health/          # Health check endpoint
│   ├── users/           # User management endpoints
│   └── docs/            # OpenAPI JSON endpoint
├── lib/api/             # Decorator system
│   ├── decorators/      # Custom decorators (@ApiProperty, @ApiOperation, etc.)
│   ├── validation/      # Validation middleware and decorators
│   ├── schema/          # OpenAPI schema generation engine
│   ├── dto/            # Data Transfer Objects
│   └── types/          # Generated types (auto-generated)
├── scripts/            # OpenAPI generation scripts
└── app/docs/          # Interactive documentation page
```

## 🔧 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production (includes OpenAPI generation)
npm run api:generate     # Generate OpenAPI spec, types, and client
npm run api:watch        # Watch mode for development
npm run api:dev          # Start dev server + OpenAPI watching
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
npm run format           # Prettier formatting
```

## 📋 API Examples

### Health Check Endpoint

```bash
# Basic health check
GET /api/health

# With detailed information
GET /api/health?detailed=true&components=database,cache
```

### Users CRUD Operations

```bash
# Get all users (with pagination)
GET /api/users?limit=10&offset=0&search=john

# Create user
POST /api/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}

# Get specific user
GET /api/users/{id}

# Update user
PUT /api/users/{id}
Content-Type: application/json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

# Delete user
DELETE /api/users/{id}
```

## 🎯 Decorator System Usage

### Creating DTOs

```javascript
// lib/api/dto/user.dto.js
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '../decorators/index.js';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  name;

  @ApiProperty({
    description: 'User email address',
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email;

  @ApiPropertyOptional({
    description: 'User age',
    type: 'number',
    minimum: 13,
    maximum: 120,
  })
  @IsOptional()
  age;
}
```

### Creating API Endpoints

```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';
// Note: Full decorator system is implemented - this shows the concept

/**
 * GET /api/users - Get all users
 * Supports pagination, search, and sorting
 */
export async function GET(request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const search = url.searchParams.get('search');

  // Your business logic here
  return NextResponse.json({ users: [], total: 0, limit, offset: 0 });
}

/**
 * POST /api/users - Create new user
 * Validates request body against CreateUserDto
 */
export async function POST(request) {
  const userData = await request.json();

  // Validation would happen here with the decorator system
  // Your business logic here
  return NextResponse.json(userData, { status: 201 });
}
```

## 🔧 Generated Files

The system automatically generates:

- **`lib/api/types/openapi.json`** - Complete OpenAPI 3.0 specification
- **`lib/api/types/api-types.ts`** - TypeScript types for all schemas
- **`lib/api/types/api-client.ts`** - Fully typed API client

## 📖 Documentation

- **[API System Documentation](./API.md)** - Complete guide to the decorator system
- **Interactive Docs**: `/docs` - Live API documentation
- **OpenAPI Spec**: `/api/docs` - Raw OpenAPI JSON

## 🛠️ Technical Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: JavaScript/TypeScript with ES Modules
- **Validation**: class-validator + class-transformer
- **Documentation**: OpenAPI 3.0 + Swagger UI
- **Type Generation**: openapi-typescript + swagger-typescript-api
- **Styling**: Tailwind CSS

## 🔄 Development Workflow

1. **Create DTOs** in `lib/api/dto/` with decorator annotations
2. **Implement API routes** in `app/api/` using standard Next.js patterns
3. **Run watch mode** with `npm run api:dev` during development
4. **Generated types and docs** are automatically updated
5. **Build for production** with automatic OpenAPI generation

## 📦 Environment Variables

```env
API_TITLE=Your API Name
API_VERSION=1.0.0
API_DESCRIPTION=Your API Description
API_BASE_URL=http://localhost:3000
```

## 🚀 Production Deployment

The OpenAPI generation is integrated into the build process:

```bash
npm run build  # Generates OpenAPI spec before building
```

## 🤝 Contributing

1. Follow the existing code patterns
2. Add comprehensive JSDoc comments
3. Run `npm run test` before committing
4. Update documentation when adding features

## 📝 License

MIT

---

**Ready for production deployment with optimized architecture** 🚀
