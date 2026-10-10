import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans notranslate" translate="no">
          <div className="max-w-md w-full bg-white rounded-3xl border-2 border-b-4 border-slate-200 p-6 sm:p-8 text-center space-y-5 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">
                Terjadi Kendala Tampilan
              </h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Halaman mengalami kendala saat memperbarui komponen antarmuka. Anda dapat memuat ulang halaman untuk melanjutkan.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left overflow-x-auto">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">Pesan Sistem:</span>
                <code className="text-[11px] font-mono font-bold text-rose-600 break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>Muat Ulang</span>
              </button>

              <a
                href="/admin/dashboard"
                className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider border-2 border-slate-200 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
