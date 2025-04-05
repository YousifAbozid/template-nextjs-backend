import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { updateUserSchema } from '@/schemas/user.schema';
import { validateSchema } from '@/lib/validation';
import {
  handleApiError,
  createNotFoundError,
  createBadRequestError,
} from '@/lib/errorHandler';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createBadRequestError('Invalid user ID format');
    }

    const user = await User.findById(id);

    if (!user) {
      throw createNotFoundError('User');
    }

    return Response.json({ user, success: true });
  } catch (error) {
    return handleApiError(error, 'users/[id]/GET');
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createBadRequestError('Invalid user ID format');
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
      throw createNotFoundError('User');
    }

    return Response.json({
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    return handleApiError(error, 'users/[id]/PUT');
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createBadRequestError('Invalid user ID format');
    }

    // Find user and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw createNotFoundError('User');
    }

    return Response.json({
      deletedUser,
      success: true,
    });
  } catch (error) {
    return handleApiError(error, 'users/[id]/DELETE');
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
