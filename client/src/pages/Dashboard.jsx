import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <div className="mb-2 inline-flex rounded-lg bg-brand-50 p-2 text-brand-600">
          <LayoutDashboard size={24} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome, {user?.name}
        </h1>
        <p className="mt-2 text-slate-600">
          Your dashboard is ready. Projects and tasks arrive in Phase 3.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Project management coming soon — stay tuned for Phase 3.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
