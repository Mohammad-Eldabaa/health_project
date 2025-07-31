import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const showAlert = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: "#0097A7",
    background: "#f8f9fa",
  });
};

export const addPatient = async (patientData, resetForm, navigate) => {
  try {
    // 1. التحقق من اتصال Supabase
    if (!supabase) {
      throw new Error("لا يوجد اتصال بقاعدة البيانات");
    }

    // 2. محاولة الإدراج
    const { data, error } = await supabase
      .from("Patients") // تأكد أن اسم الجدول صحيح
      .insert(patientData)
      .select(); // إضافة select() للحصول على البيانات المدرجة

    if (error) {
      throw error;
    }

    // 3. عند النجاح
    showAlert(
      "success",
      "تم الحجز بنجاح",
      "سنقوم بالتواصل معك لتأكيد الموعد. رقم الطلب: " + data[0]?.id
    );

    if (resetForm) resetForm();
    if (navigate) navigate("/confirmation");
    
    return true;
  } catch (error) {
    console.error("تفاصيل الخطأ:", error);

    // 4. معالجة أنواع الأخطاء المختلفة
    let errorMessage = "حدث خطأ غير متوقع";

    if (error.message) {
      errorMessage = error.message;
    }

    if (error.code === "PGRST301") {
      errorMessage = "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى";
      if (navigate) navigate("/login");
    }

    showAlert("error", "خطأ في الحجز", errorMessage);
    return false;
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
