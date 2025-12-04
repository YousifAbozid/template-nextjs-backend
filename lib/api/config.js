const productionUrl = 'https://template-nextjs-backend.vercel.app';

export const openApiConfig = {
  // API Information
  info: {
    title: process.env.API_TITLE || 'Next.js Decorator API',
    version: process.env.API_VERSION || '1.0.0',
    description:
      process.env.API_DESCRIPTION ||
      'Modern Next.js API with decorator-based OpenAPI generation',
    contact: {
      name: 'API Support',
      url: 'https://github.com/YousifAbozid/template-nextjs-backend',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  // Servers configuration - automatically adapts to environment
  servers:
    process.env.NODE_ENV === 'production'
      ? [
          {
            url: productionUrl,
            description: 'Production server',
          },
        ]
      : [
          {
            url: 'http://localhost:3000',
            description: 'Local development server',
          },
          {
            url: productionUrl,
            description: 'Development server (Vercel)',
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
