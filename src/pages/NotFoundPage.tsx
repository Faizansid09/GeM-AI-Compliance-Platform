import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="text-8xl font-black text-slate-200">404</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist or has been moved.</p>
      <button
        type="button"
        onClick={() => navigate('/home')}
        className="mt-6 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
      >
        Go to Home
      </button>
    </div>
  );
}
