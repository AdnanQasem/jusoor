import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ غير متوقع</h1>
            <p className="text-slate-600 mb-4">
              نأسف، حدثت مشكلة في تحميل الصفحة
            </p>
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-right">
                <p className="text-sm text-red-700 font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
