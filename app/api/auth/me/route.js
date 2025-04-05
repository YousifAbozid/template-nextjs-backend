import { authenticateUser, requireAuth } from '@/middleware/auth';

export async function GET(request) {
  try {
    // Check if user is authenticated
    const authError = await requireAuth(request);
    if (authError) return authError;

    // Get user data
    const user = await authenticateUser(request);

    return Response.json({
      user,
      success: true,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return Response.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
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
