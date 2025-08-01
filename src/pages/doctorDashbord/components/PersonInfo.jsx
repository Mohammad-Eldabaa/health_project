import React from 'react';
import { Helmet } from 'react-helmet';

export default function PersonInfo() {
  const personName = 'أحمد'; // Hardcoded for now, could be dynamic from props or state

  return (
    <>
      <Helmet>
        <title>{personName ? `${personName} - معلومات المريض` : 'معلومات المريض - نظام المواعيد الطبية'}</title>
        <meta
          name="description"
          content="عرض معلومات المريض الشخصية مثل الاسم، العمر، العنوان، وفصيلة الدم في نظام المواعيد الطبية."
        />
        <meta name="keywords" content="معلومات المريض, ملف طبي, نظام عيادة, برمجيات طبية, بيانات شخصية" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta
          property="og:title"
          content={personName ? `${personName} - معلومات المريض` : 'معلومات المريض - نظام المواعيد الطبية'}
        />
        <meta property="og:description" content="تصفح معلومات المريض الشخصية بسهولة في نظام متقدم لإدارة العيادات." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={personName ? `${personName} - معلومات المريض` : 'معلومات المريض - نظام المواعيد الطبية'}
        />
        <meta
          name="twitter:description"
          content="عرض بيانات المريض مثل الاسم، العمر، وفصيلة الدم بسهولة في نظام المواعيد الطبية."
        />
      </Helmet>

      <div className="bg-gray-100 rounded-3xl p-5 flex md:flex-row gap-5 justify-between items-center md:items-start">
        <table className="table-auto border-collapse w-full md:w-auto border-gray-300">
          <tbody>
            <tr>
              <td>الاسم</td>
              <td>
                <input type="text" value="أحمد" />
              </td>
            </tr>
            <tr>
              <td>العمر</td>
              <td>
                <input type="text" value="30" />
              </td>
            </tr>
            <tr>
              <td>العنوان</td>
              <td>
                <input type="text" value="القاهرة" />
              </td>
            </tr>
            <tr>
              <td>النوع</td>
              <td>
                <input type="text" value="ذكر" />
              </td>
            </tr>
            <tr>
              <td>فصيله الدم</td>
              <td>
                <input type="text" value="O+" />
              </td>
            </tr>
            <tr>
              <td>التلفون</td>
              <td>
                <input type="text" value="01210677917" />
              </td>
            </tr>
            <tr>
              <td>الحاله المرضيه</td>
              <td>
                <input type="text" value="سكر+ ضغط" />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="hidden md:inline">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User Avatar"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        </span>
      </div>
    </>
  );
}
