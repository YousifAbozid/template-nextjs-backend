import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { updateUserSchema } from '@/schemas/user.schema';
import { validateSchema } from '@/lib/validation';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // Await params before destructuring
    const { id } = await params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ user, success: true });
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    // Await params before destructuring
    const { id } = await params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Get and validate request body
    const body = await request.json();
    const {
      success,
      data: validatedData,
      errors,
    } = await validateSchema(body, updateUserSchema);

    if (!success) {
      return Response.json(
        { error: 'Validation failed', validationErrors: errors },
        { status: 400 }
      );
    }

    // Find user and update with validated data
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    // Await params before destructuring
    const { id } = await params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Find user and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      deletedUser,
      success: true,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
