import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  const startTime = process.uptime();
  let dbStatus = 'UNKNOWN';

  try {
    // Check database connection
    await connectToDatabase();
    dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
  } catch (error) {
    console.error('Database health check failed:', error);
    dbStatus = 'DOWN';
  }

  const health = {
    status: dbStatus === 'UP' ? 'UP' : 'PARTIAL',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(startTime / 60)}m ${Math.floor(startTime % 60)}s`,
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: {
        status: dbStatus,
        name: 'MongoDB',
        connectionString: process.env.MONGODB_URI ? '****' : undefined,
      },
    },
    memory: {
      rss: `${Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100} MB`,
      heapTotal: `${Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100} MB`,
      heapUsed: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`,
    },
  };

  const status = dbStatus === 'UP' ? 200 : 503;
  return Response.json(health, { status });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
