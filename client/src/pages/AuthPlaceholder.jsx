function PlaceholderPage({ title }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">Coming in Phase 2 — Authentication</p>
    </div>
  );
}

export function Login() {
  return <PlaceholderPage title="Sign in" />;
}

export function Register() {
  return <PlaceholderPage title="Create account" />;
}
