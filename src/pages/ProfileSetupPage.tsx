import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveProfile, getCompletionPercentage, type UserProfile } from '../services/profile.service';

const DESIGNATIONS = [
  'Procurement Officer',
  'Tender Evaluation Officer',
  'Compliance Officer',
  'Purchase Officer',
  'Finance Officer',
  'Technical Officer',
  'Department Head',
  'Administrator',
  'Senior Manager',
  'Deputy Manager',
  'Other',
];

const DEPARTMENTS = [
  'Procurement',
  'Purchase',
  'Finance',
  'Legal',
  'Technical',
  'Compliance',
  'Administration',
  'IT',
  'Operations',
  'HR',
  'Other',
];

const RESPONSIBILITIES = [
  'Bid Evaluation',
  'Vendor Verification',
  'Compliance Verification',
  'Tender Management',
  'Procurement',
  'Technical Evaluation',
  'Financial Evaluation',
  'Contract Management',
];

function RequiredStar() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required && <RequiredStar />}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50 disabled:text-slate-500';

export function ProfileSetupPage() {
  const { user, profileComplete, refreshProfile, updateUserSession } = useAuth();
  const navigate = useNavigate();

  // Redirect if profile already complete
  if (profileComplete) return <Navigate to="/home" replace />;

  const [form, setForm] = useState({
    displayName: user?.displayName ?? '',
    photoURL: user?.photoURL ?? '',
    email: user?.email ?? 'officer@cpcl.gov.in',
    phone: '',
    designation: '',
    customDesignation: '',
    department: '',
    customDepartment: '',
    organization: 'Chennai Petroleum Corporation Limited (CPCL)',
    employeeId: '',
    officeLocation: '',
    yearsOfExperience: '',
    alternatePhone: '',
    responsibilities: [] as string[],
  });
  const [errors, setErrors] = useState<Partial<typeof form & { global: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: string | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleResponsibility = (r: string) => {
    set(
      'responsibilities',
      form.responsibilities.includes(r)
        ? form.responsibilities.filter((x) => x !== r)
        : [...form.responsibilities, r],
    );
  };

  const validate = (): boolean => {
    const e: Partial<typeof form & { global: string }> = {};
    if (!form.displayName.trim()) e.displayName = 'Full name is required.';
    if (!form.email.trim()) {
      e.email = 'Official email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid official email address.';
    }

    const phoneClean = form.phone.replace(/\D/g, '');
    if (!phoneClean) {
      e.phone = 'Phone number is required.';
    } else if (phoneClean.length !== 10) {
      e.phone = 'Phone number must be exactly 10 digits.';
    }

    if (form.alternatePhone) {
      const altClean = form.alternatePhone.replace(/\D/g, '');
      if (altClean.length !== 10) {
        e.alternatePhone = 'Alternate phone must be exactly 10 digits.';
      }
    }

    if (!form.designation) {
      e.designation = 'Designation is required.';
    } else if (form.designation === 'Other' && !form.customDesignation.trim()) {
      e.customDesignation = 'Please specify your designation.';
    }

    if (!form.department) {
      e.department = 'Department is required.';
    } else if (form.department === 'Other' && !form.customDepartment.trim()) {
      e.customDepartment = 'Please specify your department.';
    }

    if (!form.organization.trim()) e.organization = 'Organization is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photoURL: 'Image must be under 2MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set('photoURL', reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setSaving(true);

    const finalDesignation = form.designation === 'Other'
      ? (form.customDesignation.trim() || 'Other')
      : form.designation;
    const finalDepartment = form.department === 'Other'
      ? (form.customDepartment.trim() || 'Other')
      : form.department;
    const finalEmail = form.email.trim() || user.email || '';

    updateUserSession({ email: finalEmail, displayName: form.displayName });

    const profile: UserProfile = {
      uid: user.uid,
      email: finalEmail,
      displayName: form.displayName,
      photoURL: form.photoURL,
      phone: form.phone.replace(/\D/g, '').slice(0, 10),
      designation: finalDesignation,
      department: finalDepartment,
      organization: form.organization,
      employeeId: form.employeeId,
      officeLocation: form.officeLocation,
      yearsOfExperience: form.yearsOfExperience,
      alternatePhone: form.alternatePhone ? form.alternatePhone.replace(/\D/g, '').slice(0, 10) : '',
      responsibilities: form.responsibilities,
      profileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    refreshProfile();
    setSaved(true);
    setTimeout(() => {
      navigate('/home', { replace: true });
    }, 1200);
  };

  // Completion preview
  const preview = getCompletionPercentage({
    ...form,
    uid: user?.uid ?? '',
    email: user?.email ?? '',
    profileComplete: false,
    createdAt: '',
    updatedAt: '',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-900">GeM Compliance</p>
          </div>
          <p className="text-xs text-slate-400">Step 1 of 1 — Complete Your Profile</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            This information will be recorded with all your compliance decisions and audit actions.
          </p>

          {/* Completion bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Profile Completion</span>
              <span>{preview}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${preview}%` }}
              />
            </div>
          </div>
        </div>

        {saved && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            ✓ Profile setup completed successfully. Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Profile Image ── */}
          <div className="card p-6">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                {form.photoURL ? (
                  <img
                    src={form.photoURL}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-brand/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-400">
                    {form.displayName.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Change Photo
                </button>
                <p className="mt-1.5 text-xs text-slate-400">JPG, PNG or GIF · Max 2MB</p>
                {errors.photoURL && <p className="mt-1 text-xs text-red-600">{errors.photoURL}</p>}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className="card p-6">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Full Name" required error={errors.displayName}>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={form.displayName}
                  onChange={(e) => { set('displayName', e.target.value); }}
                  placeholder="Enter your full name"
                />
              </FormField>

              <FormField label="Official Email" required error={errors.email}>
                <input
                  type="email"
                  className={INPUT_CLASS}
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="officer@cpcl.gov.in"
                />
              </FormField>

              <FormField label="Phone Number (10 digits)" required error={errors.phone}>
                <input
                  type="tel"
                  maxLength={10}
                  className={INPUT_CLASS}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="e.g. 9876543210"
                />
              </FormField>

              <FormField label="Alternate Phone" error={errors.alternatePhone}>
                <input
                  type="tel"
                  maxLength={10}
                  className={INPUT_CLASS}
                  value={form.alternatePhone}
                  onChange={(e) => set('alternatePhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Optional (10 digits)"
                />
              </FormField>
            </div>
          </div>

          {/* ── Professional Information ── */}
          <div className="card p-6">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Professional Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Designation" required error={errors.designation || errors.customDesignation}>
                <select
                  className={INPUT_CLASS}
                  value={form.designation}
                  onChange={(e) => set('designation', e.target.value)}
                >
                  <option value="">Select designation</option>
                  {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
                </select>
                {form.designation === 'Other' && (
                  <input
                    type="text"
                    className={INPUT_CLASS + ' mt-2'}
                    value={form.customDesignation}
                    onChange={(e) => set('customDesignation', e.target.value)}
                    placeholder="Specify your designation"
                    autoFocus
                  />
                )}
              </FormField>

              <FormField label="Department" required error={errors.department || errors.customDepartment}>
                <select
                  className={INPUT_CLASS}
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
                {form.department === 'Other' && (
                  <input
                    type="text"
                    className={INPUT_CLASS + ' mt-2'}
                    value={form.customDepartment}
                    onChange={(e) => set('customDepartment', e.target.value)}
                    placeholder="Specify your department"
                    autoFocus
                  />
                )}
              </FormField>

              <FormField label="Organization" required error={errors.organization}>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={form.organization}
                  onChange={(e) => set('organization', e.target.value)}
                />
              </FormField>

              <FormField label="Employee ID / Officer ID">
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={form.employeeId}
                  onChange={(e) => set('employeeId', e.target.value)}
                  placeholder="e.g. CPCL-2024-0042"
                />
              </FormField>

              <FormField label="Office Location">
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={form.officeLocation}
                  onChange={(e) => set('officeLocation', e.target.value)}
                  placeholder="e.g. Manali, Chennai"
                />
              </FormField>

              <FormField label="Years of Experience">
                <select
                  className={INPUT_CLASS}
                  value={form.yearsOfExperience}
                  onChange={(e) => set('yearsOfExperience', e.target.value)}
                >
                  <option value="">Select range</option>
                  {['0-2', '3-5', '6-10', '11-15', '16-20', '20+'].map((r) => (
                    <option key={r}>{r} years</option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Areas of Responsibility */}
            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Areas of Responsibility <span className="normal-case font-normal text-slate-400">(optional, select all that apply)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {RESPONSIBILITIES.map((r) => {
                  const checked = form.responsibilities.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleResponsibility(r)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        checked
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-brand/50'
                      }`}
                    >
                      {checked && '✓ '}{r}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <button
              type="submit"
              disabled={saving || saved}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : 'Save Profile & Continue'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
