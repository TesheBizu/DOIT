import { AlertCircle } from 'lucide-react';

function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default FormError;
