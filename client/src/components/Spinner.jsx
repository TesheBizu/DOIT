import { Loader2 } from 'lucide-react';

function Spinner({ className = '', size = 20 }) {
  return (
    <Loader2
      size={size}
      aria-hidden="true"
      className={`animate-spin ${className}`}
    />
  );
}

export default Spinner;
