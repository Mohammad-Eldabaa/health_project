import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";
import { useState, useEffect } from 'react';

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
      .from("Patients")
      .insert(patientData)
      .select();

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

    return { success: true, patientId: data[0]?.id };
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
    return { success: false, error };
  }
};

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    subscription = authSubscription;

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};