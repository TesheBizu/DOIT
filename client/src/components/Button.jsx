function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-500',
    secondary:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-brand-500',
    ghost:
      'text-slate-600 hover:bg-slate-100 focus-visible:outline-brand-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-500',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
