import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-blue-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              Backend Template
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/api/docs"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              API Docs
            </Link>
            <Link
              href="/api/health"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Health Check
            </Link>
            <a
              href="https://github.com/YousifAbozid/template-nextjs-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-sm font-medium mb-6">
            ✨ Next.js 16+ Template
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Production-Ready
            <span className="text-blue-400 block">API Backend</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Next.js 16+ API backend template with MongoDB, Zod schemas, and
            automatic OpenAPI generation. Features functional architecture with
            co-located schemas and zero-configuration API discovery.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Zod-to-OpenAPI
            </h3>
            <p className="text-gray-300">
              Automatic OpenAPI 3.0 spec generation from Zod schemas with
              type-safe React Query SDK generation.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              MongoDB Integration
            </h3>
            <p className="text-gray-300">
              Seamless MongoDB connection with Mongoose ODM and automatic
              connection management.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Functional Architecture
            </h3>
            <p className="text-gray-300">
              Pure functions with co-located Zod schemas and automatic route
              discovery. No classes or decorators.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Type-Safe</h3>
            <p className="text-gray-300">
              Full TypeScript support with Zod runtime validation and automatic
              type inference.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Developer Experience
            </h3>
            <p className="text-gray-300">
              Hot reload, automatic documentation updates, and comprehensive
              development tools.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Production Ready
            </h3>
            <p className="text-gray-300">
              Built-in middleware, error handling, validation, and
              deployment-ready configuration.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/api/docs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Explore API Documentation
            </Link>
            <a
              href="https://github.com/YousifAbozid/template-nextjs-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <div className="text-sm text-gray-400">
            Built with ❤️ by{' '}
            <a
              href="https://github.com/YousifAbozid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Yousif Abozid
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <Link
                href="/api/health"
                className="text-sm text-gray-300 hover:text-green-400 transition-colors"
              >
                System Status
              </Link>
              <Link
                href="/api/openapi.json"
                className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                OpenAPI Spec
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Next.js Backend Template. MIT
              License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
