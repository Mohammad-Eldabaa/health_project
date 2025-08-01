import React from 'react';
import { Helmet } from 'react-helmet';
import DoctorProfile from './DoctorProfile';

const PatientView = () => {
  return (
    <div className="patient-profile-page">
      <Helmet>
        <title>عرض ملف الطبيب - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="تصفح ملف الطبيب الشخصي، بما في ذلك التخصص، الخبرات العملية، والشهادات الطبية، من وجهة نظر المريض في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="ملف الطبيب, عرض المريض, تخصص طبي, خبرات عملية, شهادات طبية, نظام عيادة" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="عرض ملف الطبيب - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="اطلع على تفاصيل ملف الطبيب، بما في ذلك الخبرات والشهادات، بسهولة من خلال نظام المواعيد الطبية."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="عرض ملف الطبيب - نظام المواعيد الطبية" />
        <meta
          name="twitter:description"
          content="تصفح ملفات الأطباء بسهولة وفعالية من منظور المريض في نظام المواعيد الطبية."
        />
      </Helmet>
      <DoctorProfile isDoctorView={false} />
    </div>
  );
};

export default PatientView;
