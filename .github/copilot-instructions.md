# GitHub Copilot Instructions - Next.js Functional API Template

## Architecture Overview

This is a **Next.js 16+ App Router API backend** with **MongoDB integration**, **Zod validation**, and **automatic OpenAPI generation**. The system uses a functional, declarative architecture with zero classes or decorators.

**Key Principle**: Route-centric organization with co-located schemas and automatic OpenAPI discovery.

## Critical Development Patterns

### Route Structure (Co-location Pattern)

```
app/api/[resource]/
├── route.ts          # API endpoints (GET, POST, etc.)
├── schema.ts         # Zod schemas with OpenAPI metadata
└── openapi.ts        # OpenAPI route definitions
```

**Always create all three files together**. The generator scans `openapi.ts` files and imports them to register routes.

### Zod Schema Pattern

```typescript
// schema.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateUserRequestSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .openapi({ description: 'User name', example: 'John' }),
    email: z
      .string()
      .email()
      .openapi({ description: 'Email', example: 'john@example.com' }),
  })
  .openapi('CreateUserRequest');

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
```

### OpenAPI Definition Pattern

```typescript
// openapi.ts
import { registry, createRouteConfig } from '@/lib/api/openapi';
import { CreateUserRequestSchema, UserResponseSchema } from './schema';

registry.registerPath(
  createRouteConfig({
    method: 'post',
    path: '/api/users',
    tags: ['Users'],
    summary: 'Create a new user',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateUserRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: UserResponseSchema,
          },
        },
      },
    },
  })
);
```

### Route Handler Pattern

```typescript
// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withDatabase } from '@/lib/api/middleware';
import { User } from '@/lib/api/models';
import { CreateUserRequestSchema } from './schema';
import './openapi'; // CRITICAL: Import to register routes

export const POST = withDatabase(async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Validate with Zod
    const validationResult = CreateUserRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email } = validationResult.data;

    // Business logic
    const user = new User({ name, email });
    const savedUser = await user.save();

    return NextResponse.json(
      { success: true, data: savedUser, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
});
```

## Auto-Generation Workflow

**Critical**: The build system (`npm run build`) runs `api:generate` → `api:sdk` → `next build`.

```bash
npm run api:generate    # Scan openapi.ts files, generate openapi.json
npm run api:sdk         # Generate SDK from openapi.json using Orval
npm run api:dev         # Next.js dev + auto-regeneration
npm run api:watch       # Watch mode for OpenAPI + SDK
```

**Generated files (never edit manually)**:

- `openapi.json` - OpenAPI 3.0 spec at project root
- `sdk/index.ts` - Type-safe React Query hooks

## Database Patterns

### Model Definition

```typescript
// app/lib/api/models/[Model].ts
interface IModel extends Document {
  field: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModelSchema: Schema<IModel> = new Schema(
  { field: { type: String, required: true } },
  { timestamps: true }
);

export const Model =
  mongoose.models.Model || mongoose.model<IModel>('Model', ModelSchema);
```

### Connection Handling

- **Never call `mongoose.connect()` directly**
- Use `withDatabase` middleware - handles connection caching for serverless
- Connection config in `app/lib/api/config.ts`

## Response Patterns

**Standard API response format**:

```typescript
// Success
return NextResponse.json({
  success: true,
  data: result,
  count?: number,        // For lists
  message?: string       // For operations
});

// Error
return NextResponse.json(
  { success: false, error: 'Error message' },
  { status: 500 }
);
```

## Critical Files & Dependencies

### Configuration

- `app/lib/api/config.ts` - Database config
- `orval.config.ts` - SDK generation config

### Core Helpers

- `app/lib/api/openapi/registry.ts` - OpenAPI registry
- `app/lib/api/openapi/helpers.ts` - Response helpers
- `app/lib/api/middleware/database.ts` - Connection middleware

### Generation Scripts

- `scripts/generate-openapi.mjs` - OpenAPI spec generator
- `scripts/watch-openapi.mjs` - Development file watcher

## Development Workflow

1. **Add route**: Create `app/api/[resource]/schema.ts`, `openapi.ts`, `route.ts`
2. **Define schemas**: Use Zod with `.openapi()` metadata
3. **Register routes**: Use `registry.registerPath()` in `openapi.ts`
4. **Import openapi**: Add `import './openapi'` in `route.ts`
5. **Validate requests**: Use `schema.safeParse()` in handlers
6. **Run generation**: `npm run api:generate && npm run api:sdk`
7. **Check docs**: http://localhost:3000/api/docs (Swagger UI)

## Common Gotchas

- **Import openapi.ts**: Must import in route.ts to register routes
- **Extend Zod**: Must call `extendZodWithOpenApi(z)` in schema files
- **Mongoose models**: Always check `mongoose.models.ModelName` before creating
- **Import paths**: Use `@/lib/` not relative paths
- **Schema exports**: Must use `export` keyword for type inference
- **Route names**: Directory name becomes OpenAPI tag (`users` → `Users`)
- **Build order**: Generation runs before Next.js build

## Testing Endpoints

- **Health check**: `/api/health`
- **API info**: `/api`
- **API docs**: `/api/docs` (Swagger UI)
- **OpenAPI spec**: `/openapi.json` (JSON)

## Tools & Technologies

- **Zod**: Schema validation and type inference
- **zod-to-openapi**: OpenAPI generation from Zod schemas
- **Orval**: SDK generation with React Query
- **Next.js 16**: App Router with Route Handlers
- **MongoDB**: Database with Mongoose ODM

The system prioritizes **zero configuration** and **functional patterns** - routes are discovered automatically, types are inferred from schemas, and documentation stays in sync.
