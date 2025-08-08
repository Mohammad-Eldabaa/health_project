// patientService.js
import { supabase } from '../../supaBase/booking'; // عدل المسار حسب مكان ملف supabase client عندك

/**
 * جلب بيانات مريض مع زياراته، روشتاته، التحاليل، والملاحظات
 * @param {number} patientId - رقم المريض
 * @returns {Promise<Object>} بيانات المريض أو خطأ
 */


export async function fetchPatientMedicalRecord(patientId) {
  if (!patientId) throw new Error('Patient ID is required');

  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      visits (
        id, date, diagnosis, notes,
        doctor_id,
        prescriptions (
          id, date, notes,
          prescription_medications (
            id, dosage, duration,
            medication:medication_id (id, name)
          )
        )
      ),
      test_requests (
        id, test_id, result, status,
        test: test_id (id, name, duration, urgent)
      )
    `)
    .eq('id', patientId)
    .single();

  if (error) throw error;
  return data;
}