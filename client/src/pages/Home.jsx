import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Loader2,
  Target,
  Zap,
} from 'lucide-react';
import api from '../api/axios';

const features = [
  {
    icon: FolderKanban,
    title: 'Organize by project',
    description: 'Group tasks into projects and keep everything structured.',
  },
  {
    icon: Target,
    title: 'Track progress',
    description: 'Monitor status, priorities, and due dates at a glance.',
  },
  {
    icon: Zap,
    title: 'Stay productive',
    description: 'A clean, fast interface designed for getting things done.',
  },
];

function Home() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    api
      .get('/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-slate-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm text-brand-700">
              <Zap size={16} aria-hidden="true" className="shrink-0" />
              Modern task management
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Get things done with{' '}
              <span className="text-brand-600">DOIT</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Create, organize, and track tasks across projects. A productivity
              platform built for teams and individuals who want to stay focused.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:w-auto"
              >
                Get started free
                <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
              </Link>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
              {apiStatus === 'checking' && (
                <>
                  <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                  Checking API connection...
                </>
              )}
              {apiStatus === 'online' && (
                <>
                  <CheckCircle2 size={16} aria-hidden="true" className="text-green-500" />
                  API connected
                </>
              )}
              {apiStatus === 'offline' && (
                <span role="alert" className="text-amber-600">
                  API offline — start the server to connect
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl">
          <h2
            id="features-heading"
            className="text-center text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Everything you need to stay on track
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Simple, powerful tools to manage your work without the clutter.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-brand-50 p-3 text-brand-600">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Home;
