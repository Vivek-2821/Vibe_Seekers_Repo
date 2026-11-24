import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleResetCartAndReload = () => {
    try {
      localStorage.removeItem('vibe_cart');
      localStorage.removeItem('vibe_coupon');
    } catch (e) {
      console.warn('Failed to clear cart storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-3xl font-bold">
              !
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Something went wrong</h1>
            <p className="text-zinc-400 text-sm mb-6">
              A temporary display error occurred. Clearing any corrupted cart data and refreshing usually fixes this.
            </p>
            {this.state.error?.message && (
              <div className="bg-black/50 border border-zinc-800 rounded-lg p-3 mb-6 text-left overflow-auto max-h-32 text-xs text-red-400 font-mono">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleResetCartAndReload}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-orange-600/20"
              >
                Reset Cart & Reload
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
