export async function GET() {
	const apiInfo = {
		name: 'Next.js Backend API',
		version: '1.0.0',
		description: 'A RESTful API service built with Next.js',
		endpoints: {
			'/api': 'This information page',
			'/api/health': 'Health and status information',
			'/api/hello': 'A simple test endpoint',
			'/api/users': 'User management - GET (list), POST (create)',
			'/api/users/:id':
				'User operations - GET (read), PUT (update), DELETE (remove)'
		},
		documentation: 'For more details, see project documentation',
		timestamp: new Date().toISOString()
	}

	return Response.json(apiInfo)
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	})
}
