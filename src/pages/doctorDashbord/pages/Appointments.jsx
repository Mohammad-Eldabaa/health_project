import { useState } from 'react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import { Calendar, Clock, User, Stethoscope, Search, Frown } from 'lucide-react';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample appointment data
  const appointmentsData = {
    today: [
      {
        id: 1,
        patientName: 'أحمد محمد',
        time: '09:00 ص',
        status: 'مؤكد',
        type: 'كشف جديد',
        phone: '0123456789',
      },
      {
        id: 2,
        patientName: 'سارة علي',
        time: '10:30 ص',
        status: 'مؤكد',
        type: 'متابعة',
        phone: '0111222333',
      },
      {
        id: 3,
        patientName: 'محمد خالد',
        time: '12:00 م',
        status: 'في الانتظار',
        type: 'استشارة',
        phone: '0100555666',
      },
    ],
    upcoming: [
      {
        id: 4,
        patientName: 'فاطمة الزهراء',
        date: 'غدًا',
        time: '10:00 ص',
        status: 'مؤكد',
        type: 'كشف جديد',
        phone: '0155777888',
      },
      {
        id: 5,
        patientName: 'يوسف أحمد',
        date: 'بعد غد',
        time: '11:30 ص',
        status: 'مؤكد',
        type: 'متابعة',
        phone: '0122333444',
      },
    ],
    past: [
      {
        id: 6,
        patientName: 'نورا سعيد',
        date: 'الأمس',
        time: '09:30 ص',
        status: 'منتهي',
        type: 'كشف دوري',
        phone: '0100111222',
      },
      {
        id: 7,
        patientName: 'خالد عمر',
        date: '20 يوليو',
        time: '02:00 م',
        status: 'منتهي',
        type: 'استشارة',
        phone: '0123444555',
      },
    ],
  };

  // Filter appointments based on search query
  const filteredAppointments = appointmentsData[activeTab].filter(
    appointment =>
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.phone.includes(searchQuery)
  );

  // SEO metadata based on active tab
  const getSeoMetadata = () => {
    let title = 'جدول المواعيد - لوحة تحكم الطبيب';
    let description = 'إدارة مواعيد المرضى في لوحة تحكم الطبيب باستخدام Clinic Smart.';
    let keywords = 'مواعيد طبية, لوحة تحكم طبيب, Clinic Smart, إدارة مواعيد, مرضى';

    switch (activeTab) {
      case 'today':
        title = 'مواعيد اليوم - لوحة تحكم الطبيب';
        description = 'عرض وإدارة مواعيد اليوم للمرضى في لوحة تحكم الطبيب.';
        keywords += ', مواعيد اليوم';
        break;
      case 'upcoming':
        title = 'المواعيد القادمة - لوحة تحكم الطبيب';
        description = 'عرض وإدارة المواعيد القادمة للمرضى في Clinic Smart.';
        keywords += ', مواعيد قادمة';
        break;
      case 'past':
        title = 'المواعيد السابقة - لوحة تحكم الطبيب';
        description = 'الاطلاع على سجل المواعيد السابقة للمرضى في لوحة التحكم.';
        keywords += ', مواعيد سابقة';
        break;
      default:
        break;
    }

    if (searchQuery) {
      title = `البحث عن "${searchQuery}" في ${title}`;
      description += ` البحث عن "${searchQuery}" في جدول المواعيد.`;
      keywords += `, ${searchQuery}`;
    }

    return { title, description, keywords };
  };

  const { title, description, keywords } = getSeoMetadata();

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="noindex" /> {/* Private dashboard, not indexed */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <div className="px-6 min-h-screen" dir="rtl">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3">
            <span className="text-base sm:text-lg lg:text-xl">جدول المواعيد</span>
          </div>
          <button
            className="text-white px-4 py-2 rounded-2xl flex items-center gap-2"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            إضافة موعد جديد
          </button>
        </div>

        {/* Tabs and Search */}
        <div className="bg-gray-100 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex border-b pb-2 border-gray-200 w-full md:w-auto">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'today' ? 'text-white bg-cyan-500 rounded-2xl' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('today')}
              >
                اليوم
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'upcoming' ? 'text-white bg-cyan-500 rounded-2xl' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                القادمة
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'past' ? 'text-white bg-cyan-500 rounded-2xl' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('past')}
              >
                السابقة
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ابحث باسم المريض أو رقم الهاتف"
                className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Appointments Display - Table for larger screens, Cards for mobile */}
          <div className="rounded-lg overflow-hidden mt-4">
            {filteredAppointments.length > 0 ? (
              <>
                {/* Table for medium and larger screens */}
                <div className="hidden md:block overflow-x-auto bg-white">
                  <table className="min-w-full divide-y divide-gray-100 rounded-2xl">
                    <thead className="bg-gray-10">
                      <tr>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          المريض
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          التاريخ/الوقت
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نوع الزيارة
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAppointments.map(appointment => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
                                <User style={{ color: 'var(--color-primary-dark)' }} size={18} />
                              </div>
                              <div className="mr-4">
                                <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                                <div className="text-sm text-gray-500">{appointment.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-1 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {appointment.date && `${appointment.date} - `}
                              {appointment.time}
                            </div>
                          </td>
                          <td className="px-1 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Stethoscope className="text-gray-400 mr-2" size={16} />
                              <span className="text-sm text-gray-900">{appointment.type}</span>
                            </div>
                          </td>
                          <td className="px-1 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === 'مؤكد'
                                  ? 'bg-green-100 text-green-800'
                                  : appointment.status === 'في الانتظار'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-1 py-1 whitespace-nowrap text-sm font-medium">
                            <div className="flex">
                              <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-cyan-100 rounded-2xl">
                                تفاصيل
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {filteredAppointments.map(appointment => (
                    <div key={appointment.id} className="rounded-2xl p-4 shadow-sm bg-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-cyan-100 text-cyan-600 rounded-full h-10 w-10 flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.phone}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <Clock className="inline mr-1 text-gray-400" size={14} />
                        {appointment.date && `${appointment.date} - `}
                        {appointment.time}
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <Stethoscope className="inline mr-1 text-gray-400" size={14} />
                        {appointment.type}
                      </div>
                      <div className="mb-1 flex justify-between">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            appointment.status === 'مؤكد'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'في الانتظار'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                        <button className="text-teal-800 hover:text-teal-400 transition-colors">
                          <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <Frown className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد مواعيد</h3>
                <p className="mt-1 text-sm text-gray-500">لم يتم العثور على مواعيد تطابق معايير البحث.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 p-4 rounded-2xl shadow-sm mt-6">
          <h2 className="text-lg font-semibold mb-4">ملخص إحصائي</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500">مواعيد اليوم</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">3</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">مواعيد مؤكدة</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">2</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500">في الانتظار</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;
