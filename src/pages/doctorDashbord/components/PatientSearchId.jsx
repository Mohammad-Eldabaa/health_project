import React from 'react';
import { Helmet } from 'react-helmet';

const PatientSearchId = () => {
  return (
    <>
      <Helmet>
        <title>البحث عن مريض بالمعرف - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="ابحث عن المرضى باستخدام المعرف الخاص بهم في نظام المواعيد الطبية للوصول السريع إلى ملفاتهم الطبية."
        />
        <meta name="keywords" content="بحث مريض, معرف المريض, ملف طبي, نظام عيادة, برمجيات طبية" />
        <meta name="robots" content="noindex, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="البحث عن مريض بالمعرف - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="ابحث بسهولة عن ملفات المرضى باستخدام المعرف في نظام متقدم لإدارة العيادات."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="البحث عن مريض بالمعرف - نظام المواعيد الطبية" />
        <meta
          name="twitter:description"
          content="الوصول السريع إلى ملفات المرضى من خلال البحث بالمعرف في نظام المواعيد الطبية."
        />
      </Helmet>

      <div className="patient-search-id">
        {/* Placeholder for search functionality */}
        <h3 className="text-xl font-bold text-primary mb-4">البحث عن مريض بالمعرف</h3>
      </div>
    </>
  );
};

export default PatientSearchId;
