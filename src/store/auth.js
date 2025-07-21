import { create } from "zustand";
import { supabase } from "../supaBase/booking";

const useAuthStore = create((set) => ({
  current_user: {},

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
    } else {
      console.log("Login successful!", data);
      set((state) => ({ ...state, current_user: data }));
    }
  },

  register: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Signup error:", error.message);
    } else {
      console.log("Signup successful!", data);
      set((state) => ({ ...state, current_user: data }));
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
}));

export default useAuthStore;
