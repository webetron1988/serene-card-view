import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRoleRow {
  role: AppRole;
  tenant_id: string | null;
}

interface ProfileRow {
  user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  status: Database["public"]["Enums"]["user_status"];
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  roles: UserRoleRow[];
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithPassword: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasPlatformRole: (role: AppRole) => boolean;
  hasTenantRole: (tenantId: string, role: AppRole) => boolean;
  isTenantMember: (tenantId: string) => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId: string) => {
    // Defer heavy queries to avoid blocking the auth callback
    const [{ data: profileData }, { data: rolesData }] = await Promise.all([
      supabase.from("profiles").select("user_id, email, display_name, avatar_url, status").eq("user_id", userId).maybeSingle(),
      supabase.from("user_roles").select("role, tenant_id").eq("user_id", userId),
    ]);
    setProfile(profileData ?? null);
    setRoles(rolesData ?? []);
  };

  useEffect(() => {
    // 1) Subscribe FIRST (per Supabase guidance)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Defer to avoid deadlock inside the callback
        setTimeout(() => loadUserData(newSession.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });

    // 2) THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      if (existingSession?.user) {
        loadUserData(existingSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithPassword = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        data: displayName ? { display_name: displayName } : undefined,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
  };

  const hasPlatformRole = (role: AppRole) =>
    roles.some((r) => r.role === role && r.tenant_id === null);

  const hasTenantRole = (tenantId: string, role: AppRole) =>
    roles.some((r) => r.role === role && r.tenant_id === tenantId);

  const isTenantMember = (tenantId: string) =>
    roles.some((r) => r.tenant_id === tenantId);

  const refreshUserData = async () => {
    if (user) await loadUserData(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        roles,
        loading,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        hasPlatformRole,
        hasTenantRole,
        isTenantMember,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
