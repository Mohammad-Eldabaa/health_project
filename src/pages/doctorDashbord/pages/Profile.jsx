import { Helmet } from 'react-helmet'; // Using react-helmet for better async support

export default function Profile() {
  // SEO metadata
  const pageTitle = 'الملف الشخصي - لوحة تحكم الطبيب';
  const seoDescription = 'عرض وتعديل الملف الشخصي للطبيب في لوحة تحكم Clinic Smart.';
  const seoKeywords = 'الملف الشخصي, لوحة تحكم طبيب, Clinic Smart, بيانات الطبيب';

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

      <div className="p-4" dir="rtl">
        <h2 className="text-2xl font-bold mb-4">الملف الشخصي</h2>
        <p className="text-gray-600">هنا يمكنك عرض وتعديل بياناتك الشخصية كطبيب.</p>
        {/* Placeholder content, to be replaced with actual profile data and form */}
      </div>
    </>
  );
}
