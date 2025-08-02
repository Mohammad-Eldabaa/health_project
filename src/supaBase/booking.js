import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addPatient = async (patientData, resetForm) => {
  const { phoneNumber, email } = patientData;

  const { data: existingPhone } = await supabase
    .from('patients')
    .select('id')
    .eq('phoneNumber', phoneNumber)
    .maybeSingle();

  if (existingPhone) {
    alert('رقم الهاتف مستخدم بالفعل.');
    return;
  }

  if (email) {
    const { data: existingEmail } = await supabase.from('patients').select('id').eq('email', email).maybeSingle();

    if (existingEmail) {
      alert('البريد الإلكتروني مستخدم بالفعل.');
      return;
    }
  }

  // Proceed with insert
  const { error } = await supabase.from('patients').insert(patientData);

  if (error) {
    console.error('Error adding patient:', error);
  } else {
    alert('تم تقديم طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.');
    if (typeof resetForm === 'function') resetForm();
  }
};
