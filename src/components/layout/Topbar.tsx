import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = profile?.displayName || user?.displayName || 'User';
  const designation = profile?.designation || 'Procurement Officer';
  const photoURL = profile?.photoURL || user?.photoURL;
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Notifications state with dynamic updates
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'BID-001 verification completed', time: '5m ago', read: false },
    { id: 2, text: 'GST check failed for BID-003', time: '1h ago', read: false },
    { id: 3, text: 'Manual review required for EPFO', time: '2h ago', read: true },
  ]);

  useEffect(() => {
    const handleAppNotification = (e: Event) => {
      const custom = e as CustomEvent<{ text: string; time?: string }>;
      if (custom.detail?.text) {
        setNotifications((prev) => [
          {
            id: Date.now(),
            text: custom.detail.text,
            time: custom.detail.time || 'Just now',
            read: false,
          },
          ...prev,
        ]);
      }
    };
    window.addEventListener('app:notification', handleAppNotification);
    return () => window.removeEventListener('app:notification', handleAppNotification);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
      {/* Hamburger */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Notification bell */}
      <div className="relative" ref={notifRef}>
        <button
          type="button"
          onClick={() => setNotifOpen((o) => !o)}
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-11 z-40 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
            </div>
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 text-sm ${n.read ? '' : 'bg-brand/5'}`}
                >
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  )}
                  {n.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                  <div>
                    <p className="text-slate-700">{n.text}</p>
                    <p className="text-xs text-slate-400">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User dropdown */}
      <div className="relative" ref={dropRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
        >
          {photoURL ? (
            <img src={photoURL} alt={displayName} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {initials}
            </div>
          )}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{displayName}</p>
            <p className="text-xs text-slate-500">{designation}</p>
          </div>
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-40 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
            <div className="border-b border-slate-100 px-4 py-2.5">
              <p className="text-xs font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            {[
              { label: 'My Profile', to: '/profile' },
              { label: 'Settings', to: '/settings' },
            ].map((item) => (
              <button
                key={item.to}
                type="button"
                className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => { setDropdownOpen(false); navigate(item.to); }}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100 mt-1" />
            <button
              type="button"
              className="flex w-full items-center px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
