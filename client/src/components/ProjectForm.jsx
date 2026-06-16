import { Palette } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import FormError from './FormError';
import Spinner from './Spinner';
import { PROJECT_COLORS } from '../utils/projects';

function ProjectForm({ form, onChange, onSubmit, onCancel, error, loading, submitLabel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <FormError message={error} />}

      <Input
        id="title"
        name="title"
        label="Project title"
        placeholder="My new project"
        value={form.title}
        onChange={onChange}
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
          placeholder="What is this project about?"
          value={form.description}
          onChange={onChange}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <fieldset>
        <legend className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Palette size={16} aria-hidden="true" />
          Color
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map(({ value, label }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={value}
                checked={form.color === value}
                onChange={onChange}
                className="sr-only"
              />
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                  form.color === value ? 'border-slate-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: value }}
                title={label}
              >
                <span className="sr-only">{label}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size={18} />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
