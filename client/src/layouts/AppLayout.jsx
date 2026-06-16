import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import FormError from '../components/FormError';

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', password: '' });
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const { isAuthenticated, user, logout, updateProfile } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    setProfileMenuOpen(false);
  };

  const openProfileModal = () => {
    setProfileForm({ name: user?.name || '', password: '' });
    setProfileError('');
    setProfileOpen(true);
    setProfileMenuOpen(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');

    if (!profileForm.name.trim()) {
      setProfileError('Name is required');
      return;
    }

    setProfileLoading(true);
    try {
      const payload = { name: profileForm.name.trim() };
      if (profileForm.password) {
        if (profileForm.password.length < 6) {
          setProfileError('Password must be at least 6 characters');
          setProfileLoading(false);
          return;
        }
        payload.password = profileForm.password;
      }
      await updateProfile(payload);
      setProfileOpen(false);
      setProfileForm({ name: '', password: '' });
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const profileInitial = user?.name?.trim()?.[0]?.toUpperCase() || 'U';

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

          <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 shadow-sm hover:border-brand-300"
                    aria-label="Account menu"
                    aria-expanded={profileMenuOpen}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                      {profileInitial}
                    </div>
                    <span className="max-w-[7rem] truncate">{user?.name}</span>
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={openProfileModal}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <User size={16} aria-hidden="true" />
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
              {isAuthenticated ? (
                <>
                  <li className="px-3 text-sm text-slate-500">{user?.name}</li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      onClick={closeMenu}
                    >
                      <LayoutDashboard size={18} aria-hidden="true" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut size={18} aria-hidden="true" />
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <>
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
                </>
              )}
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

      <Modal
        isOpen={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setProfileForm({ name: '', password: '' });
          setProfileError('');
        }}
        title="Profile"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
          {profileError && <FormError message={profileError} />}
          <Input
            id="profile-name"
            name="name"
            label="Name"
            value={profileForm.name}
            onChange={handleProfileChange}
            autoComplete="name"
          />
          <Input
            id="profile-password"
            name="password"
            type="password"
            label="New password"
            placeholder="Leave blank to keep current password"
            value={profileForm.password}
            onChange={handleProfileChange}
            autoComplete="new-password"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setProfileOpen(false);
                setProfileForm({ name: '', password: '' });
                setProfileError('');
              }}
              disabled={profileLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AppLayout;
