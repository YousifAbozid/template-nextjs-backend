import { z } from 'zod';

/**
 * Validates request data against a Zod schema
 * @param {Object} data - Data to validate
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Object} - { success, data, errors }
 */
export async function validateSchema(data, schema) {
  try {
    const validData = await schema.parseAsync(data);
    return {
      success: true,
      data: validData,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {});

      return {
        success: false,
        data: null,
        errors: formattedErrors,
      };
    }

    // For unexpected errors
    return {
      success: false,
      data: null,
      errors: { _general: 'Validation failed' },
    };
  }
}

/**
 * Create a validated API handler using a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Function} handler - Handler function to call with validated data
 */
export function withValidation(schema, handler) {
  return async request => {
    try {
      const body = await request.json();
      const { success, data, errors } = await validateSchema(body, schema);

      if (!success) {
        return Response.json(
          {
            error: 'Validation failed',
            validationErrors: errors,
          },
          { status: 400 }
        );
      }

      return handler(data, request);
    } catch (error) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
  };
}
