import { Helmet } from 'react-helmet';

const statuses = [
  { label: 'مؤكد', color: 'bg-green-500' },
  { label: 'في الانتظار', color: 'bg-yellow-500' },
  { label: 'ملغى', color: 'bg-red-500' },
];

export const AppointmentSummary = ({ appointments }) => {
  return (
    <>
      <Helmet>
        <title>ملخص المواعيد - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="عرض ملخص حالات المواعيد الطبية (مؤكد، في الانتظار، ملغى) في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="ملخص المواعيد, مواعيد طبية, حالات المواعيد, نظام عيادة, برمجيات طبية" />
        <meta name="robots" content="noindex, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="ملخص المواعيد - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="تصفح ملخص حالات المواعيد الطبية بسهولة في نظام متقدم لإدارة العيادات."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ملخص المواعيد - نظام المواعيد الطبية" />
        <meta name="twitter:description" content="ملخص سريع لحالات المواعيد الطبية في نظام المواعيد الطبية." />
      </Helmet>

      <div className="flex space-x-4 space-x-reverse">
        {statuses.map((status, idx) => {
          const count = appointments.filter(a => a.status === status.label).length;
          return (
            <div key={idx} className="flex items-center text-sm">
              <div className={`w-3 h-3 rounded-full ${status.color} ml-1 mr-5`} />
              <span>
                {status.label} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};
