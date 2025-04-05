import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { loginSchema } from '@/schemas/user.schema';
import { withValidation } from '@/lib/validation';

// Login a user
export const POST = withValidation(loginSchema, async validatedData => {
  try {
    await connectToDatabase();

    // Find user by email - explicitly include password for verification
    const user = await User.findOne({ email: validatedData.email }).select(
      '+password'
    );

    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(validatedData.password))) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return Response.json(
        { error: 'Your account is deactivated' },
        { status: 403 }
      );
    }

    // Generate authentication token
    const token = user.generateAuthToken();

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return Response.json({
      user: userWithoutPassword,
      token,
      success: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Failed to login', details: error.message },
      { status: 500 }
    );
  }
});

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
