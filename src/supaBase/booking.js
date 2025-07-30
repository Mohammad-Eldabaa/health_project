import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addPatient = async (patientData, resetForm) => {
  const { error } = await supabase.from("patients").insert(patientData);

  if (error) {
    console.error("Error adding patient:", error);
    // window.location.href = "/login";
  } else {
    alert("تم تقديم طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.");
    resetForm();
  }
};

// import { useState, useEffect } from 'react'

// export default function App() {
//   const [session, setSession] = useState(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   if (!session) {
//     // return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
//   }
//   else {
//     return (<div>Logged in!</div>)
//   }
// }