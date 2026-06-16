import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import FormError from '../components/FormError';
import Spinner from '../components/Spinner';
import { forgotPassword } from '../api/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setHint('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setStatus(res.data?.message || 'If an account exists for this email, a reset link has been sent.');
      setHint(
        res.data?.hint || "If you don't see the email, check your spam or junk folder."
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-600">
            <Send size={28} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot your password?</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          noValidate
        >
          {error && <FormError message={error} />}

          {status ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {status}
              </div>
              {hint ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {hint}
                </div>
              ) : null}
            </div>
          ) : null}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
              setStatus('');
              setHint('');
            }}
          />

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            {loading ? (
              <>
                <Spinner size={18} />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

