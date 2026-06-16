import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, RotateCcw } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import FormError from '../components/FormError';
import Spinner from '../components/Spinner';
import { resetPassword } from '../api/auth';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!token) {
      setError('Reset token is missing. Please use the link from your email.');
      return;
    }

    if (!form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, password: form.password });
      setStatus(res.data?.message || 'Password reset successful. Please sign in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-600">
            <RotateCcw size={28} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose a new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          noValidate
        >
          {error && <FormError message={error} />}

          {status ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {status}
            </div>
          ) : null}

          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="New password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            }
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Confirm new password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            icon={Lock}
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            {loading ? (
              <>
                <Spinner size={18} />
                Resetting...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Back to{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;

