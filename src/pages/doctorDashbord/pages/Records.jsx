import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import PersonInfo from '../components/PersonInfo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PrescriptionModel from './PrescriptionModel';
import AddIcon from '@mui/icons-material/Add';

// Status color mapping
const statusColor = {
  مستقر: 'bg-green-100 text-green-700',
  'حالة متوسطة': 'bg-yellow-100 text-yellow-700',
  'حالة حرجة': 'bg-red-100 text-red-700',
};

export default function Records() {
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const data = JSON.parse(localStorage.getItem('doctorDashboardData'));
  const allPatients = data?.patients || [];

  // Filter patients based on search term
  const filteredPatients = allPatients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePatientSelect = patient => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setIsSearchOpen(false);
  };

  // SEO metadata
  const pageTitle = selectedPatient
    ? `سجل المريض ${selectedPatient.name} - لوحة تحكم الطبيب`
    : searchTerm
    ? `البحث عن "${searchTerm}" في سجل المرضى - لوحة تحكم الطبيب`
    : 'سجل المرضى - لوحة تحكم الطبيب';
  const seoDescription = selectedPatient
    ? `عرض سجل المريض ${selectedPatient.name} بما في ذلك الأمراض المزمنة، الأدوية، والتحاليل في لوحة تحكم الطبيب باستخدام Clinic Smart.`
    : searchTerm
    ? `البحث عن "${searchTerm}" في سجلات المرضى في لوحة تحكم الطبيب باستخدام Clinic Smart.`
    : 'عرض وإدارة سجلات المرضى الطبية في لوحة تحكم الطبيب باستخدام Clinic Smart.';
  const seoKeywords = `سجل المرضى, لوحة تحكم طبيب, Clinic Smart, سجل طبي, بيانات مريض${
    selectedPatient ? `, ${selectedPatient.name}` : ''
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

      <PrescriptionModel
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        selectedPatient={selectedPatient}
      />

      <div className="flex flex-col mx-2 sm:mx-4 lg:mx-6 my-3 px-4" dir="rtl">
        <div className="flex items-center gap-3 justify-between">
          <span className="font-bold sm:text-lg lg:text-xl mb-5">سجل المريض</span>
        </div>

        <div className="flex justify-between items-center mb-5 gap-2">
          <div className="relative w-full" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث باسم المريض"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(e.target.value.length > 0);
                }}
                onFocus={() => searchTerm.length > 0 && setIsSearchOpen(true)}
                className="w-full border border-gray-300 rounded-2xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {/* Dropdown arrow */}
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isSearchOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Dropdown list */}
            {isSearchOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-300 max-h-60 overflow-auto">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      {patient.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-center">لا يوجد نتائج مطابقة</li>
                )}
              </ul>
            )}
          </div>

          <button
            className="flex items-center gap-1 text-white rounded-2xl px-3 py-2.5 bg-teal-600 hover:bg-teal-700 transition text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setIsPrescriptionOpen(true)}
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <AddIcon fontSize="small" />
            <span>روشتة جديدة</span>
          </button>
        </div>

        {/* Patient Information */}
        {selectedPatient ? (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0 bg-gray-50 rounded-2xl p-3 lg:w-3/5">
              <h2 className="text-md font-bold mb-2 text-gray-800 mx-3">بيانات المريض</h2>
              <div className="bg-white rounded-3xl p-5 flex md:flex-row gap-5 justify-between items-center md:items-start">
                <table className="table-auto border-collapse w-full md:w-auto border-gray-300">
                  <tbody>
                    <tr>
                      <td>الاسم</td>
                      <td className="px-0 md:px-5">{selectedPatient.name}</td>
                    </tr>
                    <tr>
                      <td>العمر</td>
                      <td className="px-0 md:px-5">{selectedPatient.age}</td>
                    </tr>
                    <tr>
                      <td>العنوان</td>
                      <td className="px-0 md:px-5">{selectedPatient.address}</td>
                    </tr>
                    <tr>
                      <td>النوع</td>
                      <td className="px-0 md:px-5">{selectedPatient.gender}</td>
                    </tr>
                    <tr>
                      <td>فصيلة الدم</td>
                      <td className="px-0 md:px-5">{selectedPatient.blood}</td>
                    </tr>
                    <tr>
                      <td>التلفون</td>
                      <td className="px-0 md:px-5">{selectedPatient.phone}</td>
                    </tr>
                    <tr>
                      <td>الحالة المرضية</td>
                      <td className="px-0 md:px-5">{selectedPatient.Medical_condition}</td>
                    </tr>
                  </tbody>
                </table>
                <span className="hidden md:inline">
                  <AccountCircleIcon style={{ fontSize: '100px', color: '#59B8D0FF' }} />
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-2/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0 md:min-h-30">
                <div className="bg-gray-100 rounded-xl p-3">
                  <h2 className="text-sm font-bold mb-2 text-gray-800">الأمراض المزمنة</h2>
                  {selectedPatient?.chronic_diseases?.length > 0 ? (
                    <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                      {selectedPatient.chronic_diseases.map((disease, index) => (
                        <li key={index}>{disease}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-gray-500 text-lg">لا توجد</p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-100 rounded-xl p-3">
                  <h2 className="text-sm font-bold mb-2 text-gray-800">الأدوية الحالية</h2>
                  {selectedPatient?.visits?.length > 0 ? (
                    <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                      {selectedPatient.visits[selectedPatient.visits.length - 1].prescriptions.map(
                        (prescription, index) => (
                          <li key={index}>{prescription.name}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-gray-500 text-lg">لا توجد</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl p-3">
                <h2 className="text-sm font-bold mb-2 text-gray-800">التحاليل والفحوصات</h2>
                {selectedPatient?.tests?.length > 0 ? (
                  <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                    {selectedPatient.tests.map((t, index) => (
                      <li key={index}>
                        <div className="flex justify-between">
                          <p>- {t.name}</p>
                          <p>{t.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-gray-500 text-lg">لا توجد</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-4 text-center text-gray-500">يرجى اختيار مريض لعرض سجله الطبي</div>
        )}

        {/* Previous Visits */}
        {selectedPatient && (
          <div className="bg-gray-100 rounded-2xl my-3 p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 mt-10">
            <h3 className="text-base sm:text-lg font-semibold m-0">الزيارات السابقة</h3>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-auto bg-white rounded-2xl shadow-md">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-white text-sm text-gray-700 text-center">
                    <th className="p-3 text-gray-700 font-medium border-b border-gray-200">رقم الزيارة</th>
                    <th className="p-3 text-gray-700 font-medium border-b border-gray-200">الإسم</th>
                    <th className="p-3 text-gray-700 font-medium border-b border-gray-200">تاريخ الزيارة</th>
                    <th className="p-3 text-gray-700 font-medium border-b border-gray-200">الحالة</th>
                    <th className="p-3 text-gray-700 font-medium border-b border-gray-200">عرض</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.visits.map((visit, index) => (
                    <tr key={index} className="hover:bg-gray-50 bg-white text-center">
                      <td className="p-3 border-b border-gray-100 text-gray-600">{index + 1}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-600">{selectedPatient.name}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-600">{visit.date}</td>
                      <td className="p-3 border-b border-gray-100">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColor[selectedPatient.status]
                          }`}
                        >
                          {selectedPatient.status}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-100">
                        <button className="text-cyan-500 hover:text-cyan-700 transition-colors">
                          <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {selectedPatient.visits.map((visit, index) => (
                <div key={index} className="bg-white rounded-2xl p-3 shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">الزيارة #{index + 1}</p>
                      <p className="text-sm">{selectedPatient.name}</p>
                    </div>
                    <button className="bg-cyan-500 text-white p-1 rounded hover:bg-cyan-600 transition">
                      <VisibilityIcon fontSize="small" />
                    </button>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>{visit.date}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[selectedPatient.status]}`}
                    >
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
