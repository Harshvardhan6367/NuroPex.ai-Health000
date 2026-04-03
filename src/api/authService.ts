import { UserProfile, Doctor, AuthResponse } from '@/types';
import { supabase } from '@/utils/supabaseClient';

export const MOCK_PATIENT_DATA: UserProfile = {
  id: 'p1',
  email: 'Harshvardhan@gmail.com',
  name: 'Harshvardhan',
  age: 28,
  gender: 'Male',
  medicalHistory: 'Asthma (Mild), Seasonal Allergies',
  medicalEvents: [
    {
      id: '1',
      date: '2023-11-15',
      title: 'Annual Physical Checkup',
      description: 'Blood pressure 120/80. Weight 72kg. All vitals normal. Patient advised to maintain regular exercise regime.',
      type: 'general',
      doctorName: 'Dr. Rajesh Kumar',
      location: 'City General Hospital',
    }
  ],
  reports: [],
  allergies: ['Penicillin'],
  medications: [],
  emergencyContact: {
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    relation: 'Spouse',
  },
};

const STORAGE_KEY = 'mediguard_auth_session';

export const AuthService = {
  /**
   * Syncs user details with the Supabase 'profiles' table.
   */
  syncProfile: async (id: string, data: Partial<UserProfile | Doctor> & { role?: string, email?: string }): Promise<any> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert({
          id,
          email: data.email,
          full_name: data.name,
          role: data.role,
          age: (data as UserProfile).age,
          gender: (data as UserProfile).gender,
          medical_history: (data as UserProfile).medicalHistory,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (err) {
      console.error("Profile sync failed:", err);
      return null;
    }
  },

  /**
   * Fetches the full profile for an authenticated user.
   */
  getProfile: async (id: string): Promise<any> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  login: async (email: string, password: string, roleParam: 'patient' | 'doctor' | 'relative'): Promise<AuthResponse> => {
    // 1. Check for local demo credentials first (Mock Bypass)
    if ((email === 'patient@demo.com' || email === 'doctor@demo.com') && password === 'password123') {
      console.log("Using Local Demo Logic for:", email);
      const isPatient = email === 'patient@demo.com';
      
      const session: AuthResponse = {
        user: {
          id: isPatient ? 'demo-patient-id' : 'demo-doctor-id',
          email: email,
          name: isPatient ? 'Sample Patient' : 'Dr. Demo Specialist',
          age: isPatient ? 28 : 45,
          gender: 'Male',
          medicalHistory: isPatient ? 'Asthma, Seasonal Allergies' : 'Board Certified Cardiologist',
          medicalEvents: [],
          reports: [],
          allergies: isPatient ? ['Penicillin'] : [],
          medications: [],
          emergencyContact: { name: 'Emergency Contact', phone: '+1234567890', relation: 'Family' }
        },
        role: (isPatient ? 'patient' : 'doctor') as any,
        token: 'local-demo-token',
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    // 2. Standard Supabase Auth logic
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user data returned");

      // Fetch profile from DB
      const profile = await AuthService.getProfile(data.user.id);
      const role = profile?.role || roleParam;

      // Construct AuthResponse
      const session: AuthResponse = {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.full_name || data.user.user_metadata?.full_name || 'User',
          age: profile?.age || 0,
          gender: profile?.gender || 'Male',
          medicalHistory: profile?.medical_history || '',
          medicalEvents: [],
          reports: [],
          allergies: [],
          medications: [],
          emergencyContact: { name: '', phone: '', relation: '' }
        },
        role: role as any,
        token: data.session?.access_token || '',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    } catch (err: any) {
      console.error("AuthService Login Error:", err);
      throw err;
    }
  },

  loginWithGoogle: async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
  },

  signup: async (name: string, email: string, password: string, role: 'patient' | 'doctor'): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      // Create initial profile in the profiles table
      await AuthService.syncProfile(data.user.id, { name, email, role });

      const session: AuthResponse = {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: name,
          age: 0,
          gender: 'Male',
          medicalHistory: '',
          medicalEvents: [],
          reports: [],
          allergies: [],
          medications: [],
          emergencyContact: { name: '', phone: '', relation: '' }
        },
        role: role as any,
        token: data.session?.access_token || '',
        isNewUser: true
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    } catch (err: any) {
      console.error("AuthService Signup Error:", err);
      throw err;
    }
  },

  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Listens for auth state changes (login, logout, token refresh).
   */
  onAuthStateChange: (callback: (session: AuthResponse | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch profile
        const profile = await AuthService.getProfile(session.user.id);
        const authResponse: AuthResponse = {
          user: {
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            age: profile?.age || 0,
            gender: profile?.gender || 'Male',
            medicalHistory: profile?.medical_history || '',
            medicalEvents: [],
            reports: [],
            allergies: [],
            medications: [],
            emergencyContact: { name: '', phone: '', relation: '' }
          },
          role: (profile?.role || session.user.user_metadata?.role || 'patient') as any,
          token: session.access_token,
          isNewUser: !profile // If no profile exists, it's likely a new user (especially from OAuth)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authResponse));
        callback(authResponse);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        callback(null);
      }
    });
  },

  getSession: (): AuthResponse | null => {
    const sessionStr = localStorage.getItem(STORAGE_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr) as AuthResponse;
    } catch {
      return null;
    }
  },
};
