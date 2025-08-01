import { useState } from 'react';
import { Helmet } from 'react-helmet-async'; // Using react-helmet-async for better async support
import { Eye, Pencil, Trash2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Status color mapping
const statusColor = {
  مستقر: 'bg-green-100 text-green-700',
  'حالة متوسطة': 'bg-yellow-100 text-yellow-700',
  'حالة حرجة': 'bg-red-100 text-red-700',
};

export default function Patients() {
  // Get data from local storage
  const data = JSON.parse(localStorage.getItem('doctorDashboardData'));
  let patientsData = data.patients;

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const lowerSearch = searchTerm.toLowerCase();
  const filteredPatients = patientsData.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(lowerSearch);
    const phoneMatch = p.phone.includes(searchTerm);
    const statusMatch = filterStatus === '' || p.status === filterStatus;

    return (nameMatch || phoneMatch) && statusMatch;
  });

  // SEO metadata
  const pageTitle = searchTerm
    ? `البحث عن "${searchTerm}" في المرضى - لوحة تحكم الطبيب`
    : filterStatus
    ? `المرضى بحالة ${filterStatus} - لوحة تحكم الطبيب`
    : 'المرضى - لوحة تحكم الطبيب';
  const seoDescription = searchTerm
    ? `البحث عن "${searchTerm}" في قائمة المرضى في لوحة تحكم الطبيب باستخدام Clinic Smart.`
    : filterStatus
    ? `عرض المرضى بحالة ${filterStatus} في لوحة تحكم الطبيب لإدارة بيانات المرضى بكفاءة.`
    : 'عرض وإدارة قائمة المرضى في لوحة تحكم الطبيب باستخدام Clinic Smart.';
  const seoKeywords = `المرضى, لوحة تحكم طبيب, Clinic Smart, إدارة مرضى${searchTerm ? `, ${searchTerm}` : ''}${
    filterStatus ? `, ${filterStatus}` : ''
  }`;

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

      <div className="p-4 space-y-4" dir="rtl">
        <h2 className="text-2xl font-bold">المرضى</h2>

        <div className="bg-gray-100 p-4 rounded-2xl shadow-md">
          <div className="flex items-center justify-between gap-2">
            <SearchBar
              placeholder="ابحث بالاسم أو الرقم ..."
              className="max-w-md bg-white rounded-2xl"
              onChange={setSearchTerm}
            />
            <div className="relative min-w-[140px] max-w-[200px]">
              <select
                className="w-full appearance-none bg-white border border-gray-300 rounded-full px-5 py-2 text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="" className="bg-cyan-500">
                  الكل
                </option>
                <option value="مستقر">مستقر</option>
                <option value="حالة متوسطة">حالة متوسطة</option>
                <option value="حالة حرجة">حالة حرجة</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-2">
                <FilterListIcon />
              </div>
            </div>
          </div>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-auto bg-white rounded-2xl shadow-md mt-3">
            {filteredPatients.length > 0 ? (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-white text-sm text-gray-600">
                    <th className="p-3">رقم</th>
                    <th className="p-3">الإسم</th>
                    <th className="p-3">العمر</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">رقم الهاتف</th>
                    <th className="p-3">العنوان</th>
                    <th className="p-3">آخر زيارة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="border-t border-gray-200 text-sm">
                      <td className="p-3">{p.id}</td>
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.age}</td>
                      <td className="p-3">{p.gender}</td>
                      <td className="p-3">{p.phone}</td>
                      <td className="p-3">{p.address}</td>
                      <td className="p-3">
                        {p.visits && p.visits.length > 0 ? p.visits[p.visits.length - 1].date : 'لا يوجد زيارات'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button className="text-cyan-500 hover:text-cyan-700 transition-colors">
                          <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                        </button>
                        <button className="text-yellow-600 hover:bg-yellow-100 p-1 rounded-full">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-600 hover:bg-red-100 p-1 rounded-full">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">لا توجد مرضى متطابقة لهذا البحث</p>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mt-3">
            {filteredPatients.map(p => (
              <div key={p.id} className="bg-white shadow rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-600">#{p.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>
                    {p.status}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>الاسم:</strong> {p.name}
                  </div>
                  <div>
                    <strong>العمر:</strong> {p.age}
                  </div>
                  <div>
                    <strong>النوع:</strong> {p.gender}
                  </div>
                  <div>
                    <strong>آخر زيارة:</strong>
                    {p.visits && p.visits.length > 0 ? p.visits[p.visits.length - 1].date : 'لا يوجد زيارات'}
                  </div>
                </div>
                <div className="flex justify-around pt-2 border-t border-gray-100">
                  <button className="text-blue-600 hover:bg-blue-100 p-1 rounded-full">
                    <Eye size={18} />
                  </button>
                  <button className="text-yellow-600 hover:bg-yellow-100 p-1 rounded-full">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded-full">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
