import { Link } from 'react-router-dom';
import { FolderOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

function ProjectCard({ project, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="group relative rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className="h-2 rounded-t-xl"
        style={{ backgroundColor: project.color }}
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${project.color}20`, color: project.color }}
            >
              <FolderOpen size={18} aria-hidden="true" />
            </div>
            <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-600">
              {project.title}
            </h3>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label={`Actions for ${project.title}`}
              aria-expanded={menuOpen}
            >
              <MoreVertical size={18} aria-hidden="true" />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                />
                <ul
                  className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                  role="menu"
                >
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(project);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={16} aria-hidden="true" />
                      Edit
                    </button>
                  </li>
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(project);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        {project.description && (
          <p className="mb-4 line-clamp-2 text-sm text-slate-600">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{project.taskCount ?? 0} tasks</span>
          <Link
            to={`/projects/${project.id}`}
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
