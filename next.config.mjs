/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization since we're only using this for API
  images: {
    unoptimized: true,
  },
  // Stricter headers for API usage
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: '*' },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET,POST,PUT,DELETE,OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value:
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
        },
      ],
    },
  ],
};

export default nextConfig;
