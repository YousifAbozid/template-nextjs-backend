import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { createUserSchema } from '@/schemas/user.schema';
import { withValidation } from '@/lib/validation';

// Register a new user
export const POST = withValidation(createUserSchema, async validatedData => {
  try {
    await connectToDatabase();

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password, // Will be hashed by the pre-save hook
      role: validatedData.role || 'user',
    });

    // Generate authentication token
    const token = user.generateAuthToken();

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return Response.json(
      {
        user: userWithoutPassword,
        token,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Failed to register user', details: error.message },
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
