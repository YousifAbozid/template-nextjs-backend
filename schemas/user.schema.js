import { z } from 'zod';

// Base user schema with common fields
const userBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address format'),
  isActive: z.boolean().optional().default(true),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

// Schema for creating a new user
export const createUserSchema = userBaseSchema;

// Schema for updating an existing user
export const updateUserSchema = userBaseSchema.partial();

// Schema for user IDs
export const userIdSchema = z.object({
  id: z.string().min(24, 'Invalid ID format').max(24),
});

// Schema for queries (filtering, sorting, pagination)
export const userQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().optional().default(10),
  sort: z.string().optional().default('-createdAt'),
  fields: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  role: z.enum(['user', 'admin']).optional(),
  search: z.string().optional(),
});
