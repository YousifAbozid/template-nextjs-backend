export async function GET() {
  const startTime = process.uptime();

  // You can add more health check logic here, like database connectivity tests
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(startTime / 60)}m ${Math.floor(startTime % 60)}s`,
    environment: process.env.NODE_ENV || 'development',
    memory: {
      rss: `${
        Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100
      } MB`,
      heapTotal: `${
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
      } MB`,
      heapUsed: `${
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
      } MB`,
    },
  };

  return Response.json(health);
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
