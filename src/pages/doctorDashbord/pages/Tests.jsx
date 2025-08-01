import { useState } from 'react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import {
  Search,
  Add,
  FilterList,
  Print,
  Delete,
  Edit,
  LocalHospital,
  Science,
  Bloodtype,
  MonitorHeart,
  MedicalServices,
} from '@mui/icons-material';

const Tests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [selectedPatient, setSelectedPatient] = useState('');

  const patients = ['أحمد محمد', 'سارة علي', 'محمود إبراهيم', 'ياسمين خالد'];

  const categories = [
    { name: 'الكل', icon: <MedicalServices />, color: '#8e44ad' },
    { name: 'الدم', icon: <Bloodtype />, color: '#e74c3c' },
    { name: 'الكبد', icon: <LocalHospital />, color: '#3498db' },
    { name: 'البول', icon: <Science />, color: '#2ecc71' },
    { name: 'الأشعة', icon: <MonitorHeart />, color: '#f39c12' },
  ];

  const testsData = [
    { id: 1, name: 'تحليل دم شامل', category: 'الدم', duration: '24 ساعة', urgent: true },
    { id: 3, name: 'تحليل وظائف الكبد', category: 'الكبد', duration: '48 ساعة', urgent: true },
    { id: 2, name: 'تحليل سكر الدم', category: 'الدم', duration: '4 ساعات', urgent: false },
    { id: 4, name: 'تحليل البول الكامل', category: 'البول', duration: '6 ساعات', urgent: false },
    { id: 5, name: 'أشعة سينية للصدر', category: 'الأشعة', duration: 'فوري', urgent: true },
    { id: 6, name: 'تحليل الدهون', category: 'الدم', duration: '24 ساعة', urgent: false },
    { id: 7, name: 'أشعة مقطعية', category: 'الأشعة', duration: '24 ساعة', urgent: true },
  ];

  const filteredTests = testsData.filter(
    test =>
      (activeFilter === 'الكل' || test.category === activeFilter) &&
      (test.name.includes(searchTerm) || test.category.includes(searchTerm))
  );

  const handleSelectTest = id => {
    setSelectedTests(prev => (prev.includes(id) ? prev.filter(testId => testId !== id) : [...prev, id]));
  };

  // SEO metadata
  const pageTitle = selectedPatient
    ? `تحاليل وفحوصات لـ ${selectedPatient} - لوحة تحكم الطبيب`
    : searchTerm
    ? `البحث عن "${searchTerm}" في التحاليل والفحوصات - لوحة تحكم الطبيب`
    : 'تحاليل وفحوصات طبية - لوحة تحكم الطبيب';
  const seoDescription = selectedPatient
    ? `إدارة التحاليل والفحوصات الطبية للمريض ${selectedPatient} في لوحة تحكم الطبيب باستخدام Clinic Smart.`
    : searchTerm
    ? `البحث عن "${searchTerm}" في التحاليل والفحوصات الطبية في لوحة تحكم الطبيب باستخدام Clinic Smart.`
    : 'إدارة التحاليل والفحوصات الطبية بما في ذلك تحاليل الدم، الكبد، والبول في لوحة تحكم الطبيب باستخدام Clinic Smart.';
  const seoKeywords = `تحاليل طبية, فحوصات, لوحة تحكم طبيب, Clinic Smart${
    selectedPatient ? `, ${selectedPatient}` : ''
  }${searchTerm ? `, ${searchTerm}` : ''}`;

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

      <div className="p-5 bg-white min-h-screen" dir="rtl">
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            التحاليل والفحوصات الطبية <Science className="text-cyan-500 text-3xl" />
          </h2>
        </div>

        <div className="flex gap-2 items-center justify-between mb-5">
          {/* Select Box */}
          <div className="w-full sm:max-w-md bg-white">
            <label className="mb-2 text-sm text-gray-600">اختر المريض</label>
            <select
              className="relative flex items-center w-full sm:max-w-md bg-white border border-gray-300 rounded-md p-2 focus:ring focus:ring-teal-200"
              value={selectedPatient}
              onChange={e => setSelectedPatient(e.target.value)}
            >
              <option value="">-- اختر مريضاً --</option>
              {patients.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            className="flex items-center gap-1 bg-teal-600 text-white px-2 py-2 rounded-md h-fit self-end min-w-[130px]"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <Add className="w-4 h-4" />
            إضافة تحليل
          </button>
        </div>

        <div className="flex flex-wrap gap-1 md:gap-3 mb-5 justify-between">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(cat.name)}
              className={`flex-1 items-center gap-2 px-2 py-2 rounded-lg border transition ${
                activeFilter === cat.name ? 'bg-cyan-100 border-cyan-500' : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
              style={{ color: cat.color }}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-5 shadow-sm rounded-2xl">
          <div className="flex gap-2 items-center justify-between mb-5">
            <div className="relative flex items-center w-full sm:max-w-md bg-white">
              <Search className="absolute left-3 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="ابحث عن تحليل..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-gray-700 bg-white">
                <FilterList /> الفلاتر
              </button>
            </div>
          </div>

          {/* Table view on md+ screens */}
          <div className="hidden lg:block overflow-auto bg-white rounded-2xl shadow-md mt-3">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white text-sm text-gray-600 text-center">
                  <th className="p-4">
                    <input
                      type="checkbox"
                      onChange={e =>
                        e.target.checked ? setSelectedTests(testsData.map(test => test.id)) : setSelectedTests([])
                      }
                    />
                  </th>
                  <th className="p-4">اسم التحليل</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">مدة النتيجة</th>
                  <th className="p-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map(test => (
                  <tr
                    key={test.id}
                    className={
                      selectedTests.includes(test.id)
                        ? 'bg-blue-50 border-t border-gray-300 text-center'
                        : 'border-t border-gray-300 text-center'
                    }
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={() => handleSelectTest(test.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">{test.name}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: categories.find(c => c.name === test.category)?.color + '20',
                          color: categories.find(c => c.name === test.category)?.color,
                        }}
                      >
                        {test.category}
                      </span>
                    </td>
                    <td className="p-4">{test.duration}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button className="text-teal-800 hover:bg-teal-50 p-2 rounded-full">
                          <Add />
                        </button>
                        <button className="text-cyan-500 hover:bg-cyan-50 p-2 rounded-full">
                          <Edit />
                        </button>
                        <button className="text-red-900 hover:bg-red-50 p-2 rounded-full">
                          <Delete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mt-3">
            {filteredTests.map(test => (
              <div
                key={test.id}
                className={`p-4 rounded-lg shadow bg-white ${
                  selectedTests.includes(test.id) ? 'border border-blue-400' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">{test.name}</h3>
                </div>
                <div className="text-sm mt-1">
                  التصنيف:{' '}
                  <span
                    className="font-medium"
                    style={{ color: categories.find(c => c.name === test.category)?.color }}
                  >
                    {test.category}
                  </span>
                </div>
                <div className="text-sm mt-1">مدة النتيجة: {test.duration}</div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <button className="text-teal-800 hover:bg-teal-50 p-2 rounded-full">
                      <Add />
                    </button>
                    <button className="text-cyan-500 hover:bg-cyan-50 p-2 rounded-full">
                      <Edit />
                    </button>
                    <button className="text-red-900 hover:bg-red-50 p-2 rounded-full">
                      <Delete />
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(test.id)}
                    onChange={() => handleSelectTest(test.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTests.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-50 p-4 rounded-xl shadow my-5">
            <div className="font-medium text-slate-800">{selectedTests.length} عنصر محدد</div>
            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center gap-1 px-2 py-2 rounded-md text-white bg-teal-500"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <Add /> إضافة
              </button>
              <button className="flex items-center gap-1 px-2 py-2 rounded-md text-white bg-cyan-500">
                <Print /> طباعة
              </button>
              <button className="flex items-center gap-1 bg-red-900 text-white px-2 py-2 rounded-md">
                <Delete /> حذف
              </button>
            </div>
          </div>
        )}

        {filteredTests.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">لا توجد تحاليل متطابقة مع بحثك</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Tests;
