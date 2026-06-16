import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import * as projectsApi from '../api/projects';
import Spinner from '../components/Spinner';
import FormError from '../components/FormError';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await projectsApi.getProject(id);
      setProject(data.data.project);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={32} className="text-brand-600" />
        <span className="sr-only">Loading project...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <FormError message={error || 'Project not found'} />
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>

      <div className="mb-8">
        <div
          className="mb-4 h-1.5 w-16 rounded-full"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{project.title}</h1>
        {project.description && (
          <p className="mt-2 max-w-2xl text-slate-600">{project.description}</p>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <ClipboardList size={40} aria-hidden="true" className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">No tasks yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Task management arrives in Phase 4.
        </p>
      </div>
    </div>
  );
}

export default ProjectDetail;
