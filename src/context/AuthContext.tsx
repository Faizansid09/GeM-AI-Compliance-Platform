/**
 * Auth Context
 *
 * Authentication state is stored in localStorage.
 * On "Continue" → user is signed in with their entered/default details.
 * On logout → localStorage is cleared.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getProfile, isProfileComplete, type UserProfile } from '../services/profile.service';

const SESSION_KEY = 'gem_auth_user';

export interface MockUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: MockUser | null;
  profile: UserProfile | null;
  loading: boolean;
  ready: boolean;
  profileComplete: boolean;
  signIn: (name?: string, email?: string) => Promise<void>;
  signInAsNewUser: (name?: string, email?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => void;
  updateUserSession: (updates: Partial<MockUser>) => void;
}

function readSession(): MockUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

function writeSession(u: MockUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readSession();
    setUser(stored);
    if (stored) {
      setProfile(getProfile(stored.uid));
    }
    setLoading(false);
    setReady(true);
  }, []);

  const signIn = async (name = 'Demo Officer', email = 'officer@cpcl.gov.in') => {
    const u: MockUser = {
      uid: 'demo-' + btoa(email),
      displayName: name,
      email,
      photoURL: null,
    };
    writeSession(u);
    setUser(u);
    setProfile(getProfile(u.uid));
  };

  const signInAsNewUser = async (name = 'New Officer', email = '') => {
    const freshUid = 'user-' + Date.now();
    const cleanEmail = email.trim() || `officer.${Math.floor(100 + Math.random() * 900)}@cpcl.gov.in`;
    const u: MockUser = {
      uid: freshUid,
      displayName: name,
      email: cleanEmail,
      photoURL: null,
    };
    writeSession(u);
    setUser(u);
    setProfile(null);
  };

  const signOut = async () => {
    clearSession();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = () => {
    if (user) setProfile(getProfile(user.uid));
  };

  const updateUserSession = (updates: Partial<MockUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    writeSession(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        ready,
        profileComplete: isProfileComplete(profile),
        signIn,
        signInAsNewUser,
        signOut,
        refreshProfile,
        updateUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
