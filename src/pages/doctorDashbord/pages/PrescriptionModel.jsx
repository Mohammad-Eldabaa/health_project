import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support

export default function PrescriptionModel({ isOpen, onClose, selectedPatient }) {
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    if (selectedPatient?.name) {
      setPatientName(selectedPatient.name);
    }
  }, [selectedPatient]);

  if (!isOpen) return null;

  // SEO metadata
  const pageTitle = patientName ? `روشتة جديدة لـ ${patientName} - لوحة تحكم الطبيب` : 'روشتة جديدة - لوحة تحكم الطبيب';
  const seoDescription = patientName
    ? `إنشاء روشتة طبية جديدة للمريض ${patientName} في لوحة تحكم الطبيب باستخدام Clinic Smart.`
    : 'إنشاء روشتة طبية جديدة في لوحة تحكم الطبيب باستخدام Clinic Smart.';
  const seoKeywords = `روشتة طبية, لوحة تحكم طبيب, Clinic Smart, وصفة طبية${patientName ? `, ${patientName}` : ''}`;

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="noindex" /> {/* Private dashboard, not indexed */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" dir="rtl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">روشتة جديدة</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-xl">
              &times;
            </button>
          </div>

          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">اسم المريض</label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>

            {/* تقدر تضيف باقي الحقول هنا زي الأدوية، التاريخ، التشخيص... */}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              حفظ الروشتة
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
