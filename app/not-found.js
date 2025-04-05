'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <main className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404 - Page Not Found</h1>
          <p className="not-found-message">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link href="/" className="back-home-link">
            Back to Home
          </Link>
        </div>
      </main>

      <style jsx>{`
        .not-found-container {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          background: linear-gradient(
            to bottom,
            var(--background-color, #ffffff),
            rgba(var(--secondary-color, 200, 200, 200), 0.2)
          );
        }

        .not-found-content {
          text-align: center;
        }

        .not-found-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .not-found-message {
          color: var(--muted-color, #666666);
          margin-bottom: 2rem;
        }

        .back-home-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: var(--primary-color, #0070f3);
          color: white;
          border-radius: 4px;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .back-home-link:hover {
          background-color: var(--primary-dark-color, #0050d0);
        }
      `}</style>
    </>
  );
}
