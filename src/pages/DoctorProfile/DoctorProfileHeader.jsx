import React from 'react';
import { Helmet } from 'react-helmet';
import { FaEdit, FaSave } from 'react-icons/fa';
import { useProfileStore } from '../../store/profile';
import { motion } from 'framer-motion';

const DoctorProfileHeader = ({ editMode, setEditMode, variants }) => {
  const { updateProfileData, changedProfileData } = useProfileStore();

  return (
    <motion.div
      className="flex justify-between items-center mb-8 p-6 rounded-xl bg-gradient-to-r from-[#0097A7] to-[#006064] text-white shadow-lg"
      variants={variants}
    >
      <Helmet>
        <title>رأس ملف الطبيب - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="إدارة رأس ملف الطبيب الشخصي مع إمكانية تعديل وحفظ التغييرات في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="ملف الطبيب, تعديل البروفايل, نظام عيادة, برمجيات طبية, إدارة ملف شخصي" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="رأس ملف الطبيب - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="إدارة فعالة لرأس ملف الطبيب مع خيارات التعديل والحفظ في نظام متقدم لإدارة العيادات."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="رأس ملف الطبيب - نظام المواعيد الطبية" />
        <meta name="twitter:description" content="إدارة رأس ملف الطبيب بسهولة وفعالية مع نظام المواعيد الطبية." />
      </Helmet>

      <h1 className="text-2xl font-bold">البروفايل الطبي</h1>
      <div className="flex gap-4">
        <motion.button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
            editMode ? 'bg-white text-[#0097A7] hover:bg-gray-100' : 'bg-[#006064] hover:bg-[#00838F]'
          } font-medium transition-all hover:shadow-md`}
          onClick={() => {
            if (editMode) {
              delete changedProfileData.image;
              updateProfileData(changedProfileData);
            }
            setEditMode(!editMode);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editMode ? (
            <>
              <FaSave /> حفظ التغييرات
            </>
          ) : (
            <>
              <FaEdit /> تعديل البروفايل
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DoctorProfileHeader;
