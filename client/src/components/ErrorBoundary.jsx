import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('UI ErrorBoundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <h1 className="text-lg font-semibold text-red-700">Something went wrong</h1>
            <p className="mt-2 text-sm text-red-600">
              Please refresh the page. If the issue continues, sign out and sign in again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
