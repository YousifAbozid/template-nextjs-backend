import { NextResponse } from 'next/server';

/**
 * Simple health check endpoint demonstrating the decorator system
 * This endpoint returns the current health status of the API
 */

// Mock health status enum
const HealthStatus = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
} as const;

interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  message?: string;
  components?: Record<string, string>;
}

/**
 * GET /api/health - Health check endpoint
 *
 * Query parameters:
 * - detailed: boolean - Include detailed health information
 * - components: string[] - Check specific service components
 *
 * Returns health status with timestamp and optional details
 */
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const detailed = url.searchParams.get('detailed') === 'true';
    const components =
      url.searchParams.get('components')?.split(',').filter(Boolean) || [];

    const timestamp = new Date().toISOString();
    const version = process.env.npm_package_version || '1.0.0';

    // Base health data with proper typing
    const healthData: HealthData = {
      status: HealthStatus.HEALTHY,
      timestamp,
      version,
    };

    // Add detailed information if requested
    if (detailed) {
      healthData.message = 'All systems operational';

      if (components.length > 0) {
        healthData.components = {};
        components.forEach(component => {
          // Mock component health check
          healthData.components![component] = 'healthy';
        });
      }
    }

    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: HealthStatus.UNHEALTHY,
        timestamp: new Date().toISOString(),
        message: (error as Error).message,
      },
      { status: 503 }
    );
  }
}
