/**
 * Profile Service
 *
 * Stores extended user profile data (designation, department, etc.) in
 * localStorage, keyed by User UID.
 *
 * TODO: Replace localStorage with a real backend user-profile API when
 * the /api/v1/users/{uid}/profile endpoint is available.
 */

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  phone: string;
  designation: string;
  department: string;
  organization: string;
  employeeId: string;
  officeLocation: string;
  yearsOfExperience: string;
  responsibilities: string[];
  alternatePhone: string;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

const KEY = (uid: string) => `gem_profile_${uid}`;

export function getProfile(uid: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEY(uid));
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY(profile.uid), JSON.stringify(profile));
}

export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.displayName?.trim() &&
      profile.phone?.trim() &&
      profile.designation?.trim() &&
      profile.department?.trim() &&
      profile.organization?.trim(),
  );
}

export function getCompletionPercentage(profile: UserProfile | null): number {
  if (!profile) return 0;
  const fields: Array<keyof UserProfile> = [
    'displayName',
    'phone',
    'designation',
    'department',
    'organization',
    'employeeId',
    'officeLocation',
    'yearsOfExperience',
    'photoURL',
    'responsibilities',
  ];
  const filled = fields.filter((f) => {
    const v = profile[f];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === 'string' && v.trim().length > 0;
  }).length;
  return Math.round((filled / fields.length) * 100);
}
