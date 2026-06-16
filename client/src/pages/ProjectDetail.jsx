import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardList,
  Pencil,
  Flag,
  Plus,
  Trash2,
} from 'lucide-react';
import * as projectsApi from '../api/projects';
import * as tasksApi from '../api/tasks';
import Spinner from '../components/Spinner';
import FormError from '../components/FormError';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';

const initialForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectsApi.getProject(id),
        tasksApi.getProjectTasks(id),
      ]);
      setProject(projectRes.data.data.project);
      setTasks(tasksRes.data.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    const base =
      statusFilter === 'all'
        ? [...tasks]
        : tasks.filter((task) => task.status === statusFilter);

    return base.sort((a, b) => {
      if (sortBy === 'priority') {
        const rank = { high: 0, medium: 1, low: 2 };
        return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
      }

      if (sortBy === 'due_asc') {
        const aTime = a.dueDate ? dayjs(a.dueDate).valueOf() : Number.MAX_SAFE_INTEGER;
        const bTime = b.dueDate ? dayjs(b.dueDate).valueOf() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      }

      if (sortBy === 'due_desc') {
        const aTime = a.dueDate ? dayjs(a.dueDate).valueOf() : 0;
        const bTime = b.dueDate ? dayjs(b.dueDate).valueOf() : 0;
        return bTime - aTime;
      }

      if (sortBy === 'created_asc') {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
      }

      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    });
  }, [tasks, statusFilter, sortBy]);

  const resetForm = () => {
    setForm(initialForm);
    setFormError('');
    setEditingTask(null);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim()) {
      setFormError('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      if (editingTask) {
        const { data } = await tasksApi.updateTask(editingTask.id, payload);
        setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? data.data.task : task)));
      } else {
        const { data } = await tasksApi.createTask(id, payload);
        setTasks((prev) => [data.data.task, ...prev]);
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      const { data } = await tasksApi.updateTaskStatus(taskId, nextStatus);
      setTasks((prev) => prev.map((task) => (task.id === taskId ? data.data.task : task)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 h-8 w-56 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        <div className="mb-8 h-5 w-72 animate-pulse rounded bg-slate-100" aria-hidden="true" />
        <div className="space-y-3" aria-label="Loading tasks">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`task-skeleton-${i}`}
              className="h-24 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
              aria-hidden="true"
            />
          ))}
        </div>
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

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
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
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} aria-hidden="true" />
          Add task
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'todo', 'in_progress', 'done'].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={`rounded-lg px-3 py-2 text-sm ${
              statusFilter === value
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {value === 'in_progress' ? 'in progress' : value}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <label htmlFor="task-sort" className="mb-1 block text-sm font-medium text-slate-700">
          Sort tasks
        </label>
        <select
          id="task-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="created_desc">Newest first</option>
          <option value="created_asc">Oldest first</option>
          <option value="due_asc">Due date (earliest)</option>
          <option value="due_desc">Due date (latest)</option>
          <option value="priority">Priority (high to low)</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ClipboardList size={40} aria-hidden="true" className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No tasks yet</p>
          <p className="mt-1 text-sm text-slate-500">Create one to get started.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        task.id,
                        task.status === 'done' ? 'todo' : 'done'
                      )
                    }
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-700"
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 size={18} className="text-green-600" aria-hidden="true" />
                    ) : (
                      <Circle size={18} className="text-slate-400" aria-hidden="true" />
                    )}
                    {task.title}
                  </button>
                  {task.description && <p className="text-sm text-slate-600">{task.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Flag size={14} aria-hidden="true" />
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={14} aria-hidden="true" />
                        {dayjs(task.dueDate).format('MMM D, YYYY')}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <AlertCircle size={14} aria-hidden="true" />
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => openEditTask(task)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                  aria-label="Edit task"
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingTask ? 'Edit task' : 'Create task'}
      >
        <form onSubmit={handleSubmitTask} className="space-y-4" noValidate>
          {formError && <FormError message={formError} />}
          <Input
            id="title"
            name="title"
            label="Task title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium text-slate-700">
              Due date
            </label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size={18} />
                  Saving...
                </>
              ) : (
                editingTask ? 'Save changes' : 'Create task'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectDetail;
