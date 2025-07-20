import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const addPatient = async (patientData) => {
  const { error } = await supabase.from("Patients").insert(patientData);

  if (error) {
    console.error("Error adding patient:", error);
  } else {
    alert("تم تقديم طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.");
  }
};
