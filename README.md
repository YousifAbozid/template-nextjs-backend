# 🚀 Next.js Backend Template

A production-ready Next.js 16+ API backend template with MongoDB integration, dynamic OpenAPI generation, and automatic type-safe documentation.

## ✨ Features

### 🎯 **Zod-to-OpenAPI System**

- **Functional Architecture**: Pure functions with Zod schemas - no classes or decorators
- **Type-Safe Validation**: Zod schemas provide runtime validation and type inference
- **Automatic OpenAPI Generation**: Uses `zod-to-openapi` for spec generation
- **Co-located Schemas**: Route-centric organization with schemas next to handlers
- **Zero Configuration**: Works out of the box with automatic route discovery
- **Live Documentation**: Interactive Swagger UI at `/api/docs`
- **SDK Generation**: Auto-generated React Query hooks with Orval

### 🗃️ **MongoDB Integration**

- **Mongoose ODM**: Full MongoDB integration with schema validation
- **Connection Caching**: Optimized for serverless environments
- **Middleware Pattern**: `withDatabase` wrapper for seamless DB connections
- **Model Organization**: Clean separation of concerns with organized models

### 🔧 **Developer Experience**

- **Hot Reload**: Watch mode for automatic OpenAPI regeneration
- **Type Safety**: Full TypeScript support with strict type checking
- **Route-Centric**: Co-located schemas and endpoints for better maintainability
- **Modern Stack**: Next.js 16+ App Router with ES modules

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

```bash
# Clone the template
git clone https://github.com/YousifAbozid/template-nextjs-backend.git
cd template-nextjs-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Generate API documentation and SDK
npm run api:generate
npm run api:sdk

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
API_TITLE="Your API Title"
API_VERSION="1.0.0"
API_DESCRIPTION="Your API Description"
```

## 📁 Project Structure

```
app/
├── api/                    # 🟢 API Routes (You modify these)
│   ├── users/
│   │   ├── route.ts       # API endpoints (GET, POST, etc.)
│   │   ├── schema.ts      # Zod schemas with OpenAPI metadata
│   │   └── openapi.ts     # OpenAPI route definitions
│   ├── health/            # Health check endpoint
│   ├── docs/              # Swagger UI documentation
│   └── openapi.json/      # OpenAPI JSON endpoint
├── lib/                   # Shared utilities and business logic
│   └── api/
│       ├── database/      # 🟢 Database connection utilities
│       ├── middleware/    # 🟢 Custom middleware
│       ├── models/        # 🟢 Mongoose models
│       ├── openapi/       # 🟢 OpenAPI registry and helpers
│       ├── config.ts      # 🟡 API configuration
│       └── sdk-mutator.ts # 🟡 SDK fetch configuration
├── layout.tsx             # Root layout
└── page.tsx               # Landing page

sdk/
└── index.ts               # 🔴 Auto-generated SDK (don't edit)

openapi.json               # 🔴 Auto-generated OpenAPI spec (don't edit)
```

**Legend**: 🟢 Safe to modify | 🟡 Modify carefully | 🔴 Auto-generated (don't touch)
**Legend**: 🟢 Safe to modify | 🟡 Modify carefully | 🔴 Auto-generated (don't touch)

## 🎯 Adding New API Routes

### 1. Create Route Structure

```bash
mkdir app/api/products
touch app/api/products/route.ts app/api/products/schema.ts app/api/products/openapi.ts
```

### 2. Define Zod Schemas (`schema.ts`)

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ProductSchema = z
  .object({
    _id: z.string().openapi({ description: 'Product ID' }),
    name: z
      .string()
      .min(1)
      .openapi({ description: 'Product name', example: 'Laptop' }),
    price: z
      .number()
      .min(0)
      .openapi({ description: 'Product price', example: 999.99 }),
    category: z
      .string()
      .openapi({ description: 'Category', example: 'Electronics' }),
    description: z.string().optional().openapi({ description: 'Description' }),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi('Product');

export const CreateProductRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ description: 'Product name' }),
    price: z.number().min(0).openapi({ description: 'Product price' }),
    category: z.string().openapi({ description: 'Category' }),
    description: z.string().optional(),
  })
  .openapi('CreateProductRequest');

export const ProductListResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.array(ProductSchema),
    count: z.number(),
  })
  .openapi('ProductListResponse');

export const ProductResponseSchema = z
  .object({
    success: z.literal(true),
    data: ProductSchema,
    message: z.string().optional(),
  })
  .openapi('ProductResponse');

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
```

### 3. Register OpenAPI Routes (`openapi.ts`)

```typescript
import { registry, createRouteConfig } from '@/lib/api/openapi';
import {
  CreateProductRequestSchema,
  ProductListResponseSchema,
  ProductResponseSchema,
} from './schema';

registry.registerPath(
  createRouteConfig({
    method: 'get',
    path: '/api/products',
    tags: ['Products'],
    summary: 'Get all products',
    responses: {
      200: {
        description: 'Products retrieved successfully',
        content: {
          'application/json': { schema: ProductListResponseSchema },
        },
      },
    },
  })
);

registry.registerPath(
  createRouteConfig({
    method: 'post',
    path: '/api/products',
    tags: ['Products'],
    summary: 'Create a new product',
    request: {
      body: {
        content: {
          'application/json': { schema: CreateProductRequestSchema },
        },
      },
    },
    responses: {
      201: {
        description: 'Product created successfully',
        content: {
          'application/json': { schema: ProductResponseSchema },
        },
      },
    },
  })
);
```

### 4. Create Route Handler (`route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withDatabase } from '@/lib/api/middleware';
import { Product } from '@/lib/api/models';
import { CreateProductRequestSchema } from './schema';
import './openapi'; // Import to register routes

export const GET = withDatabase(async () => {
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json({
    success: true,
    data: products,
    count: products.length,
  });
});

export const POST = withDatabase(async (req: NextRequest) => {
  const body = await req.json();

  // Validate with Zod
  const validationResult = CreateProductRequestSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { success: false, error: validationResult.error.issues[0].message },
      { status: 400 }
    );
  }

  const product = new Product(validationResult.data);
  const savedProduct = await product.save();

  return NextResponse.json(
    {
      success: true,
      data: savedProduct,
      message: 'Product created successfully',
    },
    { status: 201 }
  );
});
```

### 5. Create Database Model (`app/lib/api/models/Product.ts`)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
```

### 6. Regenerate Documentation

```bash
npm run api:generate  # Generate OpenAPI spec
npm run api:sdk       # Generate React Query SDK
```

**Result**: Your new route automatically appears in:

- OpenAPI spec at `/api/openapi.json`
- Interactive docs at `/api/docs`
- Generated SDK with React Query hooks in `sdk/index.ts`

## 🔧 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production (includes OpenAPI + SDK generation)
npm run start            # Start production server
npm run api:generate     # Generate OpenAPI spec from route definitions
npm run api:sdk          # Generate React Query SDK from OpenAPI spec
npm run api:watch        # Watch mode for OpenAPI + SDK regeneration
npm run api:dev          # Start dev server + OpenAPI/SDK watching
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier formatting
npm run format:check     # Check formatting without writing
npm run fix-all          # Run lint:fix + format
npm run test             # Run all checks (format:check, lint, type-check)
```

## 📖 API Documentation

Once running, access your API documentation:

- **Interactive Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **OpenAPI Spec**: [http://localhost:3000/api/openapi.json](http://localhost:3000/api/openapi.json)
- **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## 🔄 Auto-Generation Workflow

The system automatically:

1. **Scans OpenAPI Files**: Finds all `app/api/**/openapi.ts` files
2. **Imports Route Definitions**: Loads registry entries from each file
3. **Generates OpenAPI Spec**: Creates `openapi.json` in project root
4. **Generates SDK**: Uses Orval to create React Query hooks in `sdk/index.ts`
5. **Type Safety**: Full TypeScript types inferred from Zod schemas

### Generated Files (Auto-updated)

- `openapi.json` - OpenAPI 3.0 specification (project root)
- `sdk/index.ts` - Type-safe React Query hooks for API consumption

**⚠️ Never edit these files manually - they're regenerated on every build**

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Language**: TypeScript with ES Modules
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **OpenAPI**: [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) - Generate OpenAPI from Zod schemas
- **SDK Generation**: [Orval](https://orval.dev/) - Generate React Query hooks from OpenAPI
- **Documentation**: [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive API documentation
- **Code Quality**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) + [TypeScript](https://www.typescriptlang.org/)
- **Development**: [Chokidar](https://github.com/paulmillr/chokidar) file watching + [Concurrently](https://github.com/open-cli-tools/concurrently)
- **Development**: [Chokidar](https://github.com/paulmillr/chokidar) file watching + [Concurrently](https://github.com/open-cli-tools/concurrently)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t nextjs-backend .

# Run container
docker run -p 3000:3000 nextjs-backend
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 Additional Resources

- **[Development Guide](app/DEVELOPMENT_GUIDE.md)** - Comprehensive development documentation
- **[SDK Usage Examples](SDK_USAGE_EXAMPLES.md)** - How to use the auto-generated SDK
- **[GitHub Copilot Instructions](.github/copilot-instructions.md)** - AI coding assistant setup

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Mongoose](https://mongoosejs.com/) for MongoDB integration
- [OpenAPI](https://www.openapis.org/) specification contributors
- [Swagger](https://swagger.io/) for API documentation tools

---

**Built with ❤️ by [Yousif Abozid](https://github.com/YousifAbozid)**
