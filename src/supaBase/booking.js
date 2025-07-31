import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addPatient = async (patientData, resetForm) => {
  try {
    const { error } = await supabase.from('patients').insert(patientData);
    if (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
    alert('تم تقديم طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.');
    resetForm();
  } catch (error) {
    console.error('Error adding patient:', error);
    alert('فشل في إضافة المريض.');
  }
};

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};