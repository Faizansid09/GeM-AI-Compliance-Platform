import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState({ verificationComplete: true, failedChecks: true, manualReview: true, officerActions: false });
  const [saved, setSaved] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">Manage account and notification preferences.</p>
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          ✓ Settings saved.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Account */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-700">Signed in as</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-700">Authentication</p>
                <p className="text-xs text-slate-500">Institutional SSO / OAuth</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/10 text-brand">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              { key: 'verificationComplete', label: 'Verification Completed', desc: 'When a bid verification finishes.' },
              { key: 'failedChecks', label: 'Failed Compliance Checks', desc: 'When a compliance check fails.' },
              { key: 'manualReview', label: 'Manual Review Required', desc: 'When a check needs officer review.' },
              { key: 'officerActions', label: 'Officer Actions', desc: 'When another officer takes an action.' },
            ].map((n) => (
              <label key={n.key} className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">{n.label}</p>
                  <p className="text-xs text-slate-400">{n.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifs[n.key as keyof typeof notifs]}
                  onClick={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                    notifs[n.key as keyof typeof notifs] ? 'bg-brand' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      notifs[n.key as keyof typeof notifs] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="mt-5 w-full rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
          >
            Save Preferences
          </button>
        </div>

        {/* Appearance */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Appearance</h2>
          <p className="text-sm text-slate-500">Light mode is active. Dark mode coming in the next release.</p>
        </div>

        {/* Security */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Security</h2>
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Authentication is managed via secure institutional identity infrastructure with session encryption and token management.
          </div>
        </div>
      </div>
    </div>
  );
}
