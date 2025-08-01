import React from 'react';
import { Helmet } from 'react-helmet';
import { Stethoscope } from 'lucide-react';

export function CurrentPatient() {
  const patientName = 'أحمد محمد'; // Hardcoded for now, could be dynamic from props or state

  return (
    <>
      <Helmet>
        <title>{patientName ? `${patientName} - المريض الحالي` : 'المريض الحالي - نظام المواعيد الطبية'}</title>
        <meta
          name="description"
          content="عرض تفاصيل المريض الحالي قيد الكشف، بما في ذلك الأعراض ومعلومات الملف الطبي، في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="المريض الحالي, ملف طبي, أعراض المريض, نظام عيادة, برمجيات طبية" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta
          property="og:title"
          content={patientName ? `${patientName} - المريض الحالي` : 'المريض الحالي - نظام المواعيد الطبية'}
        />
        <meta
          property="og:description"
          content="تصفح تفاصيل المريض الحالي، بما في ذلك الأعراض وحالة الكشف، في نظام متقدم لإدارة العيادات."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={patientName ? `${patientName} - المريض الحالي` : 'المريض الحالي - نظام المواعيد الطبية'}
        />
        <meta name="twitter:description" content="عرض معلومات المريض الحالي وأعراضه بسهولة في نظام المواعيد الطبية." />
      </Helmet>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-primary">المريض الحالي</h3>
        <Stethoscope className="text-primary" />
      </div>

      <div className="bg-blue-100 rounded-lg p-2 mb-2">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-800">أحمد محمد</h4>
            <p className="text-gray-500 text-sm">35 سنة</p>
          </div>
          <span className="bg-primary px-2 py-1 rounded text-sm">قيد الكشف</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-gray-800 mb-2">ال الأعراض</h4>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          <li>ألم في الصدر</li>
          <li>صداع مستمر</li>
          <li>دوخة</li>
        </ul>
      </div>

      <button
        className="w-full bg-accent text-white py-2 rounded hover:bg-opacity-90 transition"
        style={{
          backgroundColor: 'var(--color-accent)',
        }}
      >
        فتح الملف الطبي الكامل
      </button>
    </>
  );
}
