// authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../supaBase/booking";

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
          console.error("Login error:", error.message);
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
              role: "user",
            },
          },
        });

        if (error) {
          console.error("Signup error:", error.message);
        } else {
          set({ current_user: data?.user?.user_metadata });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ current_user: null });
      },

      // CUemail: () => get().current_user?.user?.email || "",
      CUname: () => get().current_user?.full_name || "",
      CUaddress: () => get().current_user?.address || "",
      CUphone: () => get().current_user?.phone || "",
      CUrole: () => get().current_user?.role || "",
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ current_user: state.current_user }),
    }
  )
);

export default useAuthStore;
