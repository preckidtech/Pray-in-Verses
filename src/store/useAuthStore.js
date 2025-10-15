import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, me as apiMe } from '../lib/auth';

const initialState = {
  user: null,        // { id, email, displayName, role }
  loading: false,
  error: null,
  initialized: false // we’ve called /auth/me at least once
};

export const useAuthStore = create(devtools((set, get) => ({
  ...initialState,

  // call on app mount
  initAuth: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    try {
      const user = await apiMe();
      set({ user, loading: false, initialized: true });
    } catch (e) {
      // likely 401 if not logged in
      set({ user: null, loading: false, initialized: true });
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      const user = await apiSignup(payload);
      // user is created but not logged in; up to you if you want to auto-login after
      set({ loading: false });
      return user;
    } catch (e) {
      set({ loading: false, error: e.message || 'Signup failed' });
      throw e;
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { user } = await apiLogin(payload); // cookie set by server
      set({ user, loading: false });
      return user;
    } catch (e) {
      set({ loading: false, error: e.message || 'Login failed' });
      throw e;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiLogout(); // clears cookie
      set({ user: null, loading: false });
    } catch (e) {
      set({ loading: false, error: e.message || 'Logout failed' });
      throw e;
    }
  },
})));

export default useAuthStore;