import { create } from "zustand";
import { supabase } from "../supaBase/booking";

const useFirstAidStore = create((set, get) => ({
  lastId: 0,

  // Async action to get data by ID
  getStateById: async () => {
    const { data, error } = await supabase
      .from("FirstAid")
      .select("*")
      .eq("id", get().lastId)
      .single();

    if (error) {
      console.error("Error fetching FirstAid record:", error.message);
      return null;
    }

    // set({ lastId: id });
    return data?.detail || "";
  },

  getAllStatusNames: async () => {
    const { data, error } = await supabase.from("FirstAid").select("name");

    if (error) {
      console.error("Error fetching FirstAid names:", error.message);
      return [];
    }

    return data;
  },
  setLastId: (id) => {
    set({ lastId: id });
  },
}));

export default useFirstAidStore;
