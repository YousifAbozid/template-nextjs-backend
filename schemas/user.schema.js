import { z } from 'zod';

// Base user schema with common fields
const userBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address format'),
  isActive: z.boolean().optional().default(true),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

// Schema for creating a new user with password
export const createUserSchema = userBaseSchema
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

// Schema for updating an existing user
export const updateUserSchema = userBaseSchema.partial();

// Schema for changing password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

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
