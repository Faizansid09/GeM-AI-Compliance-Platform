import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user, profileComplete, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  // Already authenticated → skip login
  if (!loading && user) {
    return <Navigate to={profileComplete ? '/home' : '/profile-setup'} replace />;
  }

  const handleSignIn = async () => {
    setSigningIn(true);
    await signIn();
    // AuthContext updates → ProtectedRoute redirects automatically
    navigate('/profile-setup');
  };

  const benefits = [
    { icon: '🤖', title: 'AI-Powered Verification', desc: 'Automated analysis of 15+ compliance parameters' },
    { icon: '🏛️', title: 'Multi-Portal Integration', desc: 'GST, MCA21, EPFO, ESIC & government databases' },
    { icon: '📊', title: 'Risk Assessment', desc: 'Intelligent risk scoring and compliance metrics' },
    { icon: '📋', title: 'Complete Audit Trail', desc: 'Every action logged for governance & accountability' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel — Branding ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 lg:flex lg:w-[55%]">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">GeM Bid Compliance</p>
            <p className="text-[11px] text-white/60">CPCL · Ministry of Petroleum & Natural Gas</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SIH 2026 · Problem Statement ID 26100
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            AI-Powered<br />
            GeM Bid Compliance<br />
            Verification Platform
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Automate bidder compliance verification with intelligent document analysis,
            multi-source portal verification, and AI-driven risk assessment.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-white/15 bg-white/10 p-4">
                <span className="text-2xl">{b.icon}</span>
                <p className="mt-2 text-sm font-semibold text-white">{b.title}</p>
                <p className="mt-0.5 text-xs text-white/60">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px] text-white/40">
          Chennai Petroleum Corporation Limited (CPCL) · Smart Automation Theme
        </p>
      </div>

      {/* ── Right panel — Sign In ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xl font-bold text-slate-900">GeM Compliance</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to the GeM Compliance Platform
            </p>
          </div>

          {/* Officer Portal Sign-In button */}
          <button
            type="button"
            id="btn-officer-signin"
            onClick={handleSignIn}
            disabled={signingIn || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingIn ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="h-5 w-5 text-emerald-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            )}
            {signingIn ? 'Authenticating…' : 'Sign In as CPCL Officer'}
          </button>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Secure · Authorised CPCL procurement personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
