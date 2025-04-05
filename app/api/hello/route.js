export async function GET() {
	return Response.json({
		message: 'Hello World!',
		status: 'success',
		timestamp: new Date().toISOString()
	})
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
