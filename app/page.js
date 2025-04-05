export default function Home() {
	return (
		<div
			style={{
				fontFamily: 'system-ui, sans-serif',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				margin: 0,
				padding: '1rem',
				textAlign: 'center'
			}}>
			<h1>Next.js API Service</h1>
			<p>
				This is a backend-only API service. Please use the API endpoints to
				interact with the service.
			</p>
			<p>Available endpoints:</p>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				<li style={{ marginBottom: '0.5rem' }}>
					<code>/api/hello</code> - GET: Basic test endpoint
				</li>
				<li style={{ marginBottom: '0.5rem' }}>
					<code>/api/users</code> - GET, POST: User operations
				</li>
			</ul>
		</div>
	)
}
