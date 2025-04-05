// In-memory users database for example purposes
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

export async function GET() {
  return Response.json({
    users,
    total: users.length,
    success: true,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.name || !body.email) {
      return Response.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
    };

    users.push(newUser);

    return Response.json(
      {
        user: newUser,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

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
