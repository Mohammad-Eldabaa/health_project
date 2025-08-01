import React from 'react';
import { Helmet } from 'react-helmet';
import DoctorProfile from './DoctorProfile';

const DoctorDashProfile = () => {
  return (
    <div className="doctor-dashboard">
      <Helmet>
        <title>لوحة تحكم الطبيب - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="إدارة ملف الطبيب الشخصي، بما في ذلك الخبرات العملية والشهادات، في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="ملف الطبيب, لوحة تحكم الطبيب, نظام عيادة, شهادات طبية, خبرات عملية" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="لوحة تحكم الطبيب - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="نظام متقدم لإدارة ملف الطبيب الشخصي، يتيح عرض وتعديل الخبرات والشهادات بسهولة."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="لوحة تحكم الطبيب - نظام المواعيد الطبية" />
        <meta name="twitter:description" content="إدارة ملف الطبيب بسهولة وفعالية مع نظام المواعيد الطبية." />
      </Helmet>
      <DoctorProfile isDoctorView={true} />
    </div>
  );
};

export default DoctorDashProfile;
