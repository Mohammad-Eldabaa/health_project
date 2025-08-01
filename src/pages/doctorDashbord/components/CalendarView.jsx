import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarStyle.css';

export const CalendarView = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-gray-100">
      <Helmet>
        <title>تقويم المواعيد - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="اختيار التواريخ للمواعيد الطبية بسهولة باستخدام تقويم تفاعلي في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="تقويم مواعيد, مواعيد طبية, نظام عيادة, اختيار التاريخ, برمجيات طبية" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="تقويم المواعيد - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="استخدم التقويم التفاعلي لتحديد مواعيد الأطباء بسهولة في نظام متقدم لإدارة العيادات."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="تقويم المواعيد - نظام المواعيد الطبية" />
        <meta
          name="twitter:description"
          content="إدارة مواعيد الأطباء بسهولة باستخدام تقويم تفاعلي في نظام المواعيد الطبية."
        />
      </Helmet>

      <h3 className="text-xl font-bold text-textPrimary mb-4">التقويم</h3>
      <Calendar onChange={setDate} value={date} locale="ar-EG" calendarType="gregory" />
      <p className="mt-4 text-sm text-gray-600 text-center">التاريخ المختار: {date.toLocaleDateString('ar-EG')}</p>
    </div>
  );
};
