import { supabase } from './booking';

export const getProfileData = async () => {
  let { data: DoctorProfile, error } = await supabase.from('DoctorProfile').select('*');

  if (error) {
    console.log(error);
    return [];
  }
  console.log(DoctorProfile[0]);
  return DoctorProfile[0];
};
