import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-600">
          <Compass size={28} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you are looking for does not exist or was moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
