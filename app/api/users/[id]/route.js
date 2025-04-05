// Reference the same in-memory database (in production this would be a real database)
let users = [
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

export async function GET(request, { params }) {
	// Ensure params is properly resolved
	const { id } = params
	const userId = parseInt(id, 10)
	const user = users.find((user) => user.id === userId)

	if (!user) {
		return Response.json({ error: 'User not found' }, { status: 404 })
	}

	return Response.json({ user, success: true })
}

export async function PUT(request, { params }) {
	try {
		// Ensure params is properly resolved
		const { id } = params
		const userId = parseInt(id, 10)
		const userData = await request.json()

		const userIndex = users.findIndex((user) => user.id === userId)

		if (userIndex === -1) {
			return Response.json({ error: 'User not found' }, { status: 404 })
		}

		// Update user data
		users[userIndex] = {
			...users[userIndex],
			...userData,
			id: userId // Ensure ID doesn't change
		}

		return Response.json({
			user: users[userIndex],
			success: true
		})
	} catch (error) {
		return Response.json({ error: 'Invalid request' }, { status: 400 })
	}
}

export async function DELETE(request, { params }) {
	// Ensure params is properly resolved
	const { id } = params
	const userId = parseInt(id, 10)
	const userIndex = users.findIndex((user) => user.id === userId)

	if (userIndex === -1) {
		return Response.json({ error: 'User not found' }, { status: 404 })
	}

	// Remove the user
	const deletedUser = users[userIndex]
	users = users.filter((user) => user.id !== userId)

	return Response.json({
		deletedUser,
		success: true
	})
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	})
}
