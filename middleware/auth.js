import { verifyToken, getTokenFromRequest } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Middleware to protect routes that require authentication
 */
export async function authenticateUser(request) {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Check if user exists
    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns Response or null if authenticated
 */
export async function requireAuth(request) {
  const user = await authenticateUser(request);

  if (!user) {
    return Response.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    );
  }

  return null; // Allow request to continue
}

/**
 * Check if user is admin
 * @returns Response or null if admin
 */
export async function requireAdmin(request) {
  const user = await authenticateUser(request);

  if (!user) {
    return Response.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return Response.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  return null; // Allow request to continue
}
