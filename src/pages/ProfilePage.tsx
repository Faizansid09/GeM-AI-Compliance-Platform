import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveProfile, getCompletionPercentage, type UserProfile } from '../services/profile.service';

const DESIGNATIONS = [
  'Procurement Officer', 'Tender Evaluation Officer', 'Compliance Officer',
  'Purchase Officer', 'Finance Officer', 'Technical Officer', 'Department Head', 'Administrator',
  'Senior Manager', 'Deputy Manager', 'Other',
];
const DEPARTMENTS = [
  'Procurement', 'Purchase', 'Finance', 'Legal', 'Technical', 'Compliance', 'Administration', 'IT',
  'Operations', 'HR', 'Other',
];
const RESPONSIBILITIES = [
  'Bid Evaluation', 'Vendor Verification', 'Compliance Verification', 'Tender Management',
  'Procurement', 'Technical Evaluation', 'Financial Evaluation', 'Contract Management',
];

const INPUT_CLASS = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50 disabled:text-slate-500';

export function ProfilePage() {
  const { user, profile, refreshProfile, updateUserSession } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const initialDesig = profile?.designation || '';
  const isKnownDesig = DESIGNATIONS.slice(0, -1).includes(initialDesig);
  const initialDept = profile?.department || '';
  const isKnownDept = DEPARTMENTS.slice(0, -1).includes(initialDept);

  const [form, setForm] = useState({
    displayName: profile?.displayName || user?.displayName || '',
    email: profile?.email || user?.email || 'officer@cpcl.gov.in',
    photoURL: profile?.photoURL || user?.photoURL || '',
    phone: (profile?.phone || '').replace(/\D/g, '').slice(0, 10),
    designation: initialDesig ? (isKnownDesig ? initialDesig : 'Other') : '',
    customDesignation: initialDesig && !isKnownDesig ? initialDesig : '',
    department: initialDept ? (isKnownDept ? initialDept : 'Other') : '',
    customDepartment: initialDept && !isKnownDept ? initialDept : '',
    organization: profile?.organization || 'Chennai Petroleum Corporation Limited (CPCL)',
    employeeId: profile?.employeeId || '',
    officeLocation: profile?.officeLocation || '',
    yearsOfExperience: profile?.yearsOfExperience || '',
    responsibilities: profile?.responsibilities || [],
    alternatePhone: (profile?.alternatePhone || '').replace(/\D/g, '').slice(0, 10),
  });

  const set = (key: keyof typeof form, value: string | string[]) => {
    setErrorMsg(null);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleResp = (r: string) =>
    set('responsibilities', form.responsibilities.includes(r)
      ? form.responsibilities.filter((x) => x !== r)
      : [...form.responsibilities, r]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photoURL', reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!user) return;
    setErrorMsg(null);

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length !== 10) {
      setErrorMsg('Phone number must be exactly 10 digits.');
      return;
    }

    if (form.alternatePhone) {
      const altDigits = form.alternatePhone.replace(/\D/g, '');
      if (altDigits.length !== 10) {
        setErrorMsg('Alternate phone number must be exactly 10 digits.');
        return;
      }
    }

    if (form.designation === 'Other' && !form.customDesignation.trim()) {
      setErrorMsg('Please specify your designation.');
      return;
    }

    if (form.department === 'Other' && !form.customDepartment.trim()) {
      setErrorMsg('Please specify your department.');
      return;
    }

    const finalDesig = form.designation === 'Other' ? (form.customDesignation.trim() || 'Other') : form.designation;
    const finalDept = form.department === 'Other' ? (form.customDepartment.trim() || 'Other') : form.department;
    const finalEmail = form.email.trim() || user.email || '';

    updateUserSession({ email: finalEmail, displayName: form.displayName });

    const updatedProfile: UserProfile = {
      uid: user.uid,
      email: finalEmail,
      displayName: form.displayName,
      photoURL: form.photoURL,
      phone: phoneDigits,
      designation: finalDesig,
      department: finalDept,
      organization: form.organization,
      employeeId: form.employeeId,
      officeLocation: form.officeLocation,
      yearsOfExperience: form.yearsOfExperience,
      alternatePhone: form.alternatePhone ? form.alternatePhone.replace(/\D/g, '').slice(0, 10) : '',
      responsibilities: form.responsibilities,
      profileComplete: true,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProfile(updatedProfile);
    refreshProfile();
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const completion = getCompletionPercentage({ uid: user?.uid ?? '', ...form, profileComplete: true, createdAt: '', updatedAt: '' });
  const initials = form.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-0.5 text-sm text-slate-500">Manage your account details and professional information.</p>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="button" onClick={handleSave} className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors">Save Changes</button>
          </div>
        )}
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          ✓ Profile updated successfully.
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Profile header card */}
      <div className="card flex flex-wrap items-center gap-5 p-6">
        <div className="relative">
          {form.photoURL ? (
            <img src={form.photoURL} alt={form.displayName} className="h-20 w-20 rounded-full object-cover ring-4 ring-brand/10" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white">
              {initials || '?'}
            </div>
          )}
          {editing && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-slate-700 p-1.5 text-white hover:bg-slate-600"
              aria-label="Change photo"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">{form.displayName || 'Unknown'}</p>
          <p className="text-sm text-slate-500">
            {(form.designation === 'Other' ? form.customDesignation : form.designation) || '—'} · {(form.department === 'Other' ? form.customDepartment : form.department) || '—'}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">{form.email || user?.email}</p>
          {/* Completion bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Profile completion</span><span>{completion}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Personal Information</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Full Name</dt>
              {editing ? (
                <input
                  type="text"
                  className={INPUT_CLASS + ' mt-1'}
                  value={form.displayName}
                  onChange={(e) => set('displayName', e.target.value)}
                  placeholder="Your full name"
                />
              ) : (
                <dd className="mt-1 text-sm text-slate-800">{form.displayName || '—'}</dd>
              )}
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Phone (10 Digits)</dt>
              {editing ? (
                <input
                  type="tel"
                  maxLength={10}
                  className={INPUT_CLASS + ' mt-1'}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="e.g. 9876543210"
                />
              ) : (
                <dd className="mt-1 text-sm text-slate-800">{form.phone || '—'}</dd>
              )}
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Alternate Phone</dt>
              {editing ? (
                <input
                  type="tel"
                  maxLength={10}
                  className={INPUT_CLASS + ' mt-1'}
                  value={form.alternatePhone}
                  onChange={(e) => set('alternatePhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Optional (10 digits)"
                />
              ) : (
                <dd className="mt-1 text-sm text-slate-800">{form.alternatePhone || '—'}</dd>
              )}
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Official Email</dt>
              {editing ? (
                <input
                  type="email"
                  className={INPUT_CLASS + ' mt-1'}
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="officer@cpcl.gov.in"
                />
              ) : (
                <dd className="mt-1 text-sm text-slate-800">{form.email || user?.email || '—'}</dd>
              )}
            </div>
          </dl>
        </div>

        {/* Professional */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Professional Information</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Designation</dt>
              {editing ? (
                <>
                  <select
                    className={INPUT_CLASS + ' mt-1'}
                    value={form.designation}
                    onChange={(e) => set('designation', e.target.value)}
                  >
                    <option value="">Select Designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {form.designation === 'Other' && (
                    <input
                      type="text"
                      className={INPUT_CLASS + ' mt-2'}
                      value={form.customDesignation}
                      onChange={(e) => set('customDesignation', e.target.value)}
                      placeholder="Specify custom designation"
                      autoFocus
                    />
                  )}
                </>
              ) : (
                <dd className="mt-1 text-sm text-slate-800">
                  {(form.designation === 'Other' ? form.customDesignation : form.designation) || '—'}
                </dd>
              )}
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Department</dt>
              {editing ? (
                <>
                  <select
                    className={INPUT_CLASS + ' mt-1'}
                    value={form.department}
                    onChange={(e) => set('department', e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {form.department === 'Other' && (
                    <input
                      type="text"
                      className={INPUT_CLASS + ' mt-2'}
                      value={form.customDepartment}
                      onChange={(e) => set('customDepartment', e.target.value)}
                      placeholder="Specify custom department"
                      autoFocus
                    />
                  )}
                </>
              ) : (
                <dd className="mt-1 text-sm text-slate-800">
                  {(form.department === 'Other' ? form.customDepartment : form.department) || '—'}
                </dd>
              )}
            </div>
            {[
              { label: 'Organization', key: 'organization' },
              { label: 'Employee ID', key: 'employeeId' },
              { label: 'Office Location', key: 'officeLocation' },
            ].map((f) => (
              <div key={f.key}>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.label}</dt>
                {editing ? (
                  <input type="text" className={INPUT_CLASS + ' mt-1'} value={form[f.key as keyof typeof form] as string} onChange={(e) => set(f.key as keyof typeof form, e.target.value)} />
                ) : (
                  <dd className="mt-1 text-sm text-slate-800">{(form[f.key as keyof typeof form] as string) || '—'}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="card p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Areas of Responsibility</h2>
        <div className="flex flex-wrap gap-2">
          {RESPONSIBILITIES.map((r) => {
            const checked = form.responsibilities.includes(r);
            return editing ? (
              <button key={r} type="button" onClick={() => toggleResp(r)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${checked ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 bg-white text-slate-600 hover:border-brand/40'}`}>
                {checked && '✓ '}{r}
              </button>
            ) : (
              <span key={r} className={`rounded-full border px-3 py-1 text-xs font-medium ${checked ? 'border-brand/30 bg-brand/5 text-brand' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                {r}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
