import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { CheckSquare, Menu, X } from 'lucide-react';

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-brand-600"
            onClick={closeMenu}
          >
            <CheckSquare size={24} aria-hidden="true" className="shrink-0" />
            <span className="text-xl tracking-tight text-slate-900">DOIT</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Get started
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
                  onClick={closeMenu}
                >
                  Get started
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 sm:px-6">
          &copy; {new Date().getFullYear()} DOIT. Built for productivity.
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
