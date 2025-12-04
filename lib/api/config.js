/**
 * Centralized OpenAPI configuration
 * Single source of truth for API documentation settings
 */
export const openApiConfig = {
  // API Information
  info: {
    title: 'Next.js Decorator API',
    version: '1.0.0',
    description: 'Modern Next.js API with decorator-based OpenAPI generation',
    contact: {
      name: 'API Support',
      url: 'https://github.com/YousifAbozid/template-nextjs-backend',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  // Servers configuration
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],

  // Security schemes (only one Bearer Auth)
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Bearer token authentication',
    },
  },

  // File paths
  paths: {
    output: {
      spec: 'lib/api/types/openapi.json',
      types: 'lib/api/types/api-types.ts',
      client: 'lib/api/types/api-client.ts',
    },
  },

  // Generation patterns
  patterns: [
    'app/api/**/*.js',
    'app/api/**/*.ts',
    'lib/api/**/*.js',
    'lib/api/**/*.ts',
  ],
};
