import React from 'react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import { Calendar } from 'lucide-react';
import { Field, ErrorMessage } from 'formik';

export function AgeInput() {
  // SEO metadata
  const pageTitle = 'إدخال العمر - لوحة تحكم الطبيب';
  const seoDescription = 'إدخال العمر الخاص بالمريض أو الطبيب في نموذج لوحة تحكم الطبيب باستخدام Clinic Smart.';
  const seoKeywords = 'إدخال العمر, لوحة تحكم طبيب, Clinic Smart, عمر المريض, عمر الطبيب';

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

      <div className="w-full" dir="rtl">
        <label className="block text-sm font-medium mb-2 text-gray-800">
          <Calendar className="inline w-5 h-5 mr-2 text-teal-600 mx-2" />
          العمر *
        </label>
        <Field
          type="number"
          name="age"
          required
          min="1"
          max="120"
          placeholder="أدخل عمرك"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-right h-[50px]"
          style={{ direction: 'rtl' }}
        />
        <ErrorMessage name="age" component="div" className="text-red-600 text-sm mt-1" />
      </div>
    </>
  );
}
