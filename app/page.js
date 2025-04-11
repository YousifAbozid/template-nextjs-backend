'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // API routes organized by category
  const routes = {
    info: [
      { path: '/api', description: 'API information and documentation' },
      { path: '/api/health', description: 'Health check and system status' },
    ],
    authentication: [
      { path: '/api/auth/register', description: 'Register new user' },
      { path: '/api/auth/login', description: 'Login and receive JWT token' },
      { path: '/api/auth/me', description: 'Get current authenticated user' },
    ],
    users: [
      {
        path: '/api/users',
        description: 'List all users (GET) or create a new user (POST)',
      },
      {
        path: '/api/users/[id]',
        description: 'Get, update or delete a specific user',
      },
    ],
    test: [{ path: '/api/hello', description: 'Test endpoint' }],
  };

  // All routes flattened for the "all" category
  const allRoutes = Object.values(routes).flat();

  // Filter routes based on active category
  const getFilteredRoutes = () => {
    if (activeCategory === 'all') {
      return allRoutes;
    }
    return routes[activeCategory] || [];
  };

  return (
    <div className="api-docs-container">
      <header>
        <h1>Next.js Backend API Template</h1>
        <p>A comprehensive RESTful API built with Next.js App Router</p>
      </header>

      <nav className="categories">
        <button
          className={activeCategory === 'all' ? 'active' : ''}
          onClick={() => setActiveCategory('all')}
        >
          All Routes
        </button>
        {Object.keys(routes).map(category => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </nav>

      <main>
        <h2>
          {activeCategory === 'all'
            ? 'All API Routes'
            : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Routes`}
        </h2>
        <div className="routes-container">
          {getFilteredRoutes().map(route => (
            <div key={route.path} className="route-card">
              <h3>{route.path}</h3>
              <p>{route.description}</p>
              <div className="button-container">
                <a
                  href={route.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="route-button"
                >
                  Try API &rarr;
                </a>
                {route.path.startsWith('/api') && (
                  <a
                    href={`https://github.com/yourusername/template-nextjs-backend/tree/main/app${route.path}/route.js`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-button"
                  >
                    View Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>
          Made with Next.js - Check out the{' '}
          <a
            href="https://github.com/yourusername/template-nextjs-backend"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
        </p>
      </footer>

      <style jsx>{`
        .api-docs-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            'Open Sans',
            'Helvetica Neue',
            sans-serif;
        }

        header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        header p {
          font-size: 1.25rem;
          color: #4b5563;
        }

        .categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .categories button {
          background-color: #f3f4f6;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .categories button:hover {
          background-color: #e5e7eb;
        }

        .categories button.active {
          background-color: #3b82f6;
          color: white;
        }

        .routes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .route-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .route-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .route-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #111827;
        }

        .route-card p {
          color: #4b5563;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .button-container {
          display: flex;
          gap: 0.75rem;
        }

        .route-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #3b82f6;
          color: white;
          border-radius: 0.375rem;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .route-button:hover {
          background-color: #2563eb;
        }

        .source-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #f3f4f6;
          color: #4b5563;
          border-radius: 0.375rem;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .source-button:hover {
          background-color: #e5e7eb;
        }

        footer {
          margin-top: 3rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
        }

        footer a {
          color: #3b82f6;
          text-decoration: none;
        }

        footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
