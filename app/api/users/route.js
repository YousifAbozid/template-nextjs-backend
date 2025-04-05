import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { createUserSchema, userQuerySchema } from '@/schemas/user.schema';
import { withValidation } from '@/lib/validation';

export async function GET(request) {
  try {
    await connectToDatabase();

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    // Validate query parameters
    const {
      success,
      data: validQuery,
      errors,
    } = await validateSchema(queryParams, userQuerySchema);

    if (!success) {
      return Response.json(
        { error: 'Invalid query parameters', validationErrors: errors },
        { status: 400 }
      );
    }

    // Build filter based on validated query
    const filter = {};
    if (validQuery.isActive !== undefined) {
      filter.isActive = validQuery.isActive === 'true';
    }
    if (validQuery.role) {
      filter.role = validQuery.role;
    }
    if (validQuery.search) {
      filter.$or = [
        { name: { $regex: validQuery.search, $options: 'i' } },
        { email: { $regex: validQuery.search, $options: 'i' } },
      ];
    }

    // Pagination
    const page = validQuery.page || 1;
    const limit = validQuery.limit || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const users = await User.find(filter)
      .select(
        validQuery.fields?.replace(/,/g, ' ') || 'name email role isActive'
      )
      .sort(validQuery.sort || '-createdAt')
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    return Response.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

// Use withValidation middleware for POST requests
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

    // Create new user with validated data
    const newUser = await User.create(validatedData);

    return Response.json(
      {
        user: newUser,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
});

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
