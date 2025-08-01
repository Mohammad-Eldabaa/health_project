import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import { Person } from '@mui/icons-material';

const Settings = () => {
  // SEO metadata
  const pageTitle = 'الإعدادات - لوحة تحكم الطبيب';
  const seoDescription = 'تخصيص إعدادات الحساب وتغيير كلمة المرور في لوحة تحكم الطبيب باستخدام Clinic Smart.';
  const seoKeywords = 'إعدادات, لوحة تحكم طبيب, Clinic Smart, تغيير كلمة المرور, إعدادات الحساب';

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

      <div dir="rtl">
        <span className="text-base text-xl m-6 mt-10 font-bold">الإعدادات</span>
        <div className="m-4 sm:m-6 lg:m-8">
          <div className="rounded-xl shadow-sm p-4 bg-gray-100">
            <h2 className="text-xl font-bold mb-6">إعدادات الحساب</h2>
            <div className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-1/3">
                  <label className="block text-sm font-medium mb-1">الصورة الشخصية</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Person className="text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <button className="text-sm text-cyan-600 hover:text-cyan-800 block">تغيير الصورة</button>
                      <button className="text-sm text-red-600 hover:text-red-800">إزالة الصورة</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الأول</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    defaultValue="أحمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">اسم العائلة</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    defaultValue="محمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    defaultValue="ahmed@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    defaultValue="+20123456789"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-800 transition"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-sm p-4 bg-gray-100 mt-8">
            <h3 className="text-lg font-semibold mb-4">تغيير كلمة المرور</h3>
            <div className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-800 transition"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
