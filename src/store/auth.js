// authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supaBase/booking';

const useAuthStore = create(
  persist(
    (set, get) => ({
      current_user: null,

      login: async ({ email, password }, nav) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error.message);
        } else {
          set({ current_user: data?.user?.user_metadata });
          nav();
        }
      },

      register: async ({ email, password, phone, name, address }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone,
              address,
              role: 'user',
            },
          },
        });

        if (error) {
          console.error('Signup error:', error.message);
        } else {
          set({ current_user: data?.user?.user_metadata });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ current_user: null });
      },
      handleForgotPassword: async email => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/resetpassword`,
        });

        if (error) {
          console.error('Error sending reset email:', error.message);
        } else {
          alert('Check your email for the password reset link.');
        }
      },

      updatePassword: async (newPassword, next) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          console.error('Error updating email:', error.message);
        } else {
          alert('Your password updated successfully.');
          window.history.replaceState(null, '', window.location.pathname + window.location.search);

          next();
        }
      },

      // CUemail: () => get().current_user?.user?.email || "",
      CUname: () => get().current_user?.full_name || '',
      CUaddress: () => get().current_user?.address || '',
      CUphone: () => get().current_user?.phone || '',
      CUrole: () => get().current_user?.role || '',
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ current_user: state.current_user }),
    }
  )
);

export default useAuthStore;
