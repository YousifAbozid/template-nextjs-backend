#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { openApiConfig } from '../app/lib/api/config.ts';

/**
 * Simple OpenAPI generation script using centralized configuration
 */
async function generateSimpleOpenAPI() {
  console.log('🚀 Generating simple OpenAPI specification...\n');

  // Use centralized config for the OpenAPI spec
  const openApiSpec = {
    openapi: '3.0.3',
    info: openApiConfig.info,
    servers: openApiConfig.servers,
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check endpoint',
          description: 'Returns the current health status of the API service',
          operationId: 'getHealthStatus',
          tags: ['Health'],
          parameters: [
            {
              name: 'detailed',
              in: 'query',
              required: false,
              description: 'Include detailed health information',
              schema: {
                type: 'boolean',
                example: true,
              },
            },
            {
              name: 'components',
              in: 'query',
              required: false,
              description: 'Check specific service components',
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: ['database', 'cache'],
              },
            },
          ],
          responses: {
            200: {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthResponseDto',
                  },
                },
              },
            },
            503: {
              description: 'Service is unhealthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthResponseDto',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        HealthResponseDto: {
          type: 'object',
          required: ['status', 'timestamp'],
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'degraded', 'unhealthy'],
              description: 'Overall health status',
              example: 'healthy',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Health check timestamp',
              example: '2023-12-04T10:30:00Z',
            },
            version: {
              type: 'string',
              description: 'Application version',
              example: '1.0.0',
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
              example: 86400,
            },
            details: {
              type: 'object',
              description: 'Detailed health information (when detailed=true)',
              properties: {
                database: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'connected',
                    },
                    responseTime: {
                      type: 'number',
                      description: 'Response time in milliseconds',
                      example: 15,
                    },
                  },
                },
                memory: {
                  type: 'object',
                  properties: {
                    usage: {
                      type: 'number',
                      description: 'Memory usage percentage',
                      example: 45.2,
                    },
                    total: {
                      type: 'string',
                      description: 'Total available memory',
                      example: '8GB',
                    },
                  },
                },
              },
            },
          },
        },
      },
      securitySchemes: openApiConfig.securitySchemes,
    },
    tags: [
      {
        name: 'Health',
        description: 'System health check operations',
      },
    ],
  };

  // Ensure output directory exists
  const outputDir = openApiConfig.paths.output.spec
    .split('/')
    .slice(0, -1)
    .join('/');
  await fs.mkdir(outputDir, { recursive: true });

  const specPath = openApiConfig.paths.output.spec;

  // Write the spec file
  await fs.writeFile(specPath, JSON.stringify(openApiSpec, null, 2));

  console.log(`✅ OpenAPI spec written to: ${specPath}`);

  // Generate TypeScript types
  try {
    const { execSync } = await import('child_process');
    console.log('🔤 Generating TypeScript types...');

    const typesPath = openApiConfig.paths.output.types;
    const command = `npx openapi-typescript ${specPath} -o ${typesPath}`;
    execSync(command, { stdio: 'inherit' });

    console.log(`✅ Types generated at: ${typesPath}`);
  } catch (error) {
    console.error('❌ Failed to generate types:', error.message);
  }

  // Generate API client
  try {
    const { execSync } = await import('child_process');
    console.log('🔌 Generating API client...');

    const clientPath = openApiConfig.paths.output.client;
    const command = `npx swagger-typescript-api generate -p ${specPath} -o ${path.dirname(clientPath)} -n ${path.basename(clientPath)}`;
    execSync(command, { stdio: 'inherit' });

    console.log(`✅ API client generated at: ${clientPath}`);
  } catch (error) {
    console.error('❌ Failed to generate API client:', error.message);
  }

  console.log('\n🎉 Simple OpenAPI generation completed successfully!');
  console.log('\nGenerated files:');
  console.log(`- OpenAPI spec: ${openApiConfig.paths.output.spec}`);
  console.log(`- TypeScript types: ${openApiConfig.paths.output.types}`);
  console.log(`- API client: ${openApiConfig.paths.output.client}`);
}

// Export the function for use in watch mode
export { generateSimpleOpenAPI as generateOpenAPI };

// Run the generation when called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateSimpleOpenAPI().catch(console.error);
}
