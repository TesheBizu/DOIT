import { useCallback, useEffect, useState } from 'react';
import { FolderKanban, Plus, Search, BarChart3, Clock3, CheckCircle2 } from 'lucide-react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as projectsApi from '../api/projects';
import * as dashboardApi from '../api/dashboard';
import { defaultProjectForm } from '../utils/projects';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import FormError from '../components/FormError';
import Spinner from '../components/Spinner';

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(defaultProjectForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const quotes = [
    'Small progress each day adds up to big results.',
    'Focus on being productive, not busy.',
    'Done is better than perfect.',
    'Clarity comes from engagement, not thought.',
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await projectsApi.getProjects();
      setProjects(data.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const { data } = await dashboardApi.getDashboard();
      setStats(data.data);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchDashboardStats();
  }, [fetchProjects, fetchDashboardStats]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [quotes.length]);

  useEffect(() => {
    const q = searchText.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await dashboardApi.searchTasks(q);
        setSearchResults(data.data.tasks);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(defaultProjectForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description || '',
      color: project.color,
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setForm(defaultProjectForm);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Project title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingProject) {
        const { data } = await projectsApi.updateProject(editingProject.id, form);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? data.data.project : p))
        );
      } else {
        const { data } = await projectsApi.createProject(form);
        setProjects((prev) => [data.data.project, ...prev]);
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await projectsApi.deleteProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <span className="bg-float-orb left-[-3rem] top-10 h-32 w-32 bg-brand-300" />
      <span className="bg-float-orb bg-float-orb-reverse right-[-4rem] top-24 h-36 w-36 bg-emerald-300" />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-lg bg-brand-50 p-2 text-brand-600">
            <FolderKanban size={24} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-slate-600">
            {projects.length === 0
              ? 'Create your first project to get started.'
              : `You have ${projects.length} project${projects.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        <Button onClick={openCreateModal} className="shrink-0">
          <Plus size={18} aria-hidden="true" />
          New project
        </Button>
      </div>

      <div className="quote-fade mb-6 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white px-4 py-3 text-sm text-slate-700">
        "{quotes[quoteIndex]}"
      </div>

      {stats && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-blue-600">
              <FolderKanban size={18} aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-500">Projects</p>
            <p className="text-xl font-semibold text-slate-900">{stats.totals.projects}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <BarChart3 size={18} aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-500">Open Tasks</p>
            <p className="text-xl font-semibold text-slate-900">
              {stats.byStatus.todo + stats.byStatus.in_progress}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 inline-flex rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock3 size={18} aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-500">Overdue</p>
            <p className="text-xl font-semibold text-slate-900">{stats.overdue}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 inline-flex rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-500">Done</p>
            <p className="text-xl font-semibold text-slate-900">{stats.byStatus.done}</p>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="task-search" className="mb-2 block text-sm font-medium text-slate-700">
          Search tasks across projects
        </label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="task-search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by task title or description..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900"
          />
        </div>
        {searchText.trim() && (
          <div className="mt-3">
            {searchLoading ? (
              <p className="text-sm text-slate-500">Searching...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-sm text-slate-500">No matching tasks found.</p>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((task) => (
                  <li key={task.id} className="rounded-lg border border-slate-200 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">
                          {task.project?.title || 'Project'} · {task.status.replace('_', ' ')}
                          {task.dueDate ? ` · due ${dayjs(task.dueDate).format('MMM D')}` : ''}
                        </p>
                      </div>
                      <Link
                        to={`/projects/${task.project?.id}`}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700"
                      >
                        Open
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6">
          <FormError message={error} />
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner size={32} className="text-brand-600" />
          <span className="sr-only">Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FolderKanban size={48} aria-hidden="true" className="mx-auto mb-4 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900">No projects yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Create a project to organize your tasks.
          </p>
          <Button onClick={openCreateModal} className="mt-6">
            <Plus size={18} aria-hidden="true" />
            Create your first project
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard
                project={project}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
              />
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit project' : 'New project'}
      >
        <ProjectForm
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          error={formError}
          loading={submitting}
          submitLabel={editingProject ? 'Save changes' : 'Create project'}
        />
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete project"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <strong className="text-slate-900">{deleteTarget?.title}</strong>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner size={18} />
                Deleting...
              </>
            ) : (
              'Delete project'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
