import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Stethoscope, User, Calendar, Clock, Droplet, Pill } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { supabase } from '../../../supaBase/booking';
import { toast } from 'react-toastify';

const Statistics = () => {
  const [monthlyPatientData, setMonthlyPatientData] = useState([]);
  const [visitTypeData, setVisitTypeData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [medicationsData, setMedicationsData] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const fetchMonthlyPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(`date, patient_id`)
        .order('date', { ascending: true });

      if (error) throw error;

      // تجميع البيانات شهرياً
      const monthlyData = data.reduce((acc, visit) => {
        const date = new Date(visit.date);
        const month = date.toLocaleString('ar-EG', { month: 'long' });

        if (!acc[month]) {
          acc[month] = { patients: 0 };
        }

        acc[month].patients += 1;
        return acc;
      }, {});

      return Object.entries(monthlyData).map(([name, value]) => ({
        name,
        patients: value.patients,
      }));
    } catch (err) {
      console.error('Error fetching monthly patients:', err);
      throw err;
    }
  };

  // جلب أنواع الزيارات
  const fetchVisitTypes = async () => {
    try {
      const { data, error } = await supabase.from('appointments').select(`reason, id`).not('reason', 'is', null);

      if (error) throw error;

      // تجميع أنواع الزيارات
      const visitTypes = data.reduce((acc, appointment) => {
        const type = appointment.reason || 'غير محدد';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(visitTypes).map(([name, value]) => ({
        name,
        value,
      }));
    } catch (err) {
      console.error('Error fetching visit types:', err);
      throw err;
    }
  };

  // جلب الإيرادات الربعية
  const fetchQuarterlyRevenue = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`date, amount`)
        .eq('status', 'تم')
        .order('date', { ascending: true });

      if (error) throw error;

      // تجميع الإيرادات حسب الربع
      const quarterlyData = data.reduce((acc, appointment) => {
        const date = new Date(appointment.date);
        const quarter = ` الشهر ${date.getMonth() + 1}`;

        if (!acc[quarter]) {
          acc[quarter] = 0;
        }

        acc[quarter] += appointment.amount || 0;
        return acc;
      }, {});

      return Object.entries(quarterlyData).map(([name, revenue]) => ({
        name,
        revenue,
      }));
    } catch (err) {
      console.error('Error fetching quarterly revenue:', err);
      throw err;
    }
  };

  // جلب الأدوية الأكثر صرفاً
  const fetchTopMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('prescription_medications')
        .select(`medication_id (name), id`)
        .limit(5);

      if (error) throw error;

      // تجميع عدد مرات صرف كل دواء
      const medsCount = data.reduce((acc, med) => {
        const name = med.medication_id?.name || 'غير معروف';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(medsCount)
        .map(([name, prescriptions]) => ({ name, prescriptions }))
        .sort((a, b) => b.prescriptions - a.prescriptions);
    } catch (err) {
      console.error('Error fetching top medications:', err);
      throw err;
    }
  };


  const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const endOfMonth = new Date(startOfMonth);
endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  // جلب الإحصائيات السريعة
  const fetchQuickStats = async () => {
    try {
      const [totalPatients, monthlyVisits, testRequests, prescriptionsCount] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact' }),
        supabase
          .from('visits')
          .select('id', { count: 'exact' })
          .gte('date', startOfMonth.toISOString())
          .lt('date', endOfMonth.toISOString()),

        supabase.from('test_requests').select('id', { count: 'exact' }).gte('created_at', startOfMonth.toISOString())
  .lt('created_at', endOfMonth.toISOString()),
        supabase.from('prescriptions').select('id', { count: 'exact' }),
      ]);

      return [
        {
          icon: <User className="w-6 h-6 text-cyan-600" />,
          title: 'إجمالي المرضى',
          value: totalPatients.count || 0,
          change: '+12%',
        },
        {
          icon: <Stethoscope className="w-6 h-6 text-cyan-600" />,
          title: 'الزيارات هذا الشهر',
          value: monthlyVisits.count || 0,
          change: '+8%',
        },
        {
          icon: <Droplet className="w-6 h-6 text-cyan-600" />,
          title: 'التحاليل هذا الشهر',
          value: testRequests.count || 0,
          change: '+5%',
        },
        {
          icon: <Pill className="w-6 h-6 text-cyan-600" />,
          title: 'وصفات طبية',
          value: prescriptionsCount.count || 0,
          change: '+10%',
        },
        {
          icon: <Clock className="w-6 h-6 text-cyan-600" />,
          title: 'متوسط مدة الكشف',
          value: '12 دقيقة',
          change: '0%',
        },
      ];
    } catch (err) {
      console.error('Error fetching quick stats:', err);
      throw err;
    }
  };

  // جلب جميع البيانات عند تحميل المكون أو تغيير الفلتر الزمني
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [monthlyPatients, visitTypes, quarterlyRevenue, topMedications, stats] = await Promise.all([
          fetchMonthlyPatients(),
          fetchVisitTypes(),
          fetchQuarterlyRevenue(),
          fetchTopMedications(),
          fetchQuickStats(),
        ]);

        setMonthlyPatientData(monthlyPatients);
        setVisitTypeData(visitTypes);
        setRevenueData(quarterlyRevenue);
        setMedicationsData(topMedications);
        setQuickStats(stats);
      } catch (err) {
        setError(err);
        toast.error('حدث خطأ في جلب البيانات الإحصائية');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>حدث خطأ في تحميل البيانات:</p>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 bg-white min-h-screen" dir="rtl">
      <div className='flex justify-between'>
        <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3 mb-8">
          <span className="text-base sm:text-lg lg:text-xl">
            إحصائيات العياده <Activity className="text-cyan-600 inline" />{' '}
          </span>
        </div>
        <div className='pt-4'>
          <select
            className="border border-cyan-500 rounded-lg p-2 bg-white shadow-sm"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
          >
            <option value="monthly">شهري</option>
            <option value="quarterly">ربع سنوي</option>
            <option value="yearly">سنوي</option>
          </select>
        </div>
      </div>

      {/* فلتر زمني */}

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-full bg-cyan-100 text-cyan-600">{stat.icon}</div>
              <span
                className={`text-sm font-medium ${
                  stat.change.startsWith('+')
                    ? 'text-green-600'
                    : stat.change.startsWith('-')
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm text-gray-500 mt-2">{stat.title}</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* الرسوم البيانية الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* عدد المرضى الشهري */}
        <div className="lg:col-span-2 bg-gray-50 p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-cyan-600" />
            توزيع المرضى شهرياً
          </h2>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="h-80">
              <ResponsiveContainer width="105%" height="100%">
                <BarChart data={monthlyPatientData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickMargin={30} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="var(--color-primary)" name="عدد المرضى" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* أنواع الزيارات */}
        <div className="bg-gray-50 p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Stethoscope className="text-cyan-600" /> توزيع أنواع الزيارات
          </h2>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visitTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {visitTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-2xl shadow-sm border border-gray-200">
        {/* ملخص الأرقام */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
            <p className="text-xl font-bold text-green-600">
              {revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} ج.م
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">الربع الأعلى</p>
            <p className="text-xl font-bold text-blue-600">
              {revenueData.length > 0
                ? revenueData.reduce((max, item) => (item.revenue > max.revenue ? item : max), revenueData[0]).name
                : 'لا يوجد بيانات'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">الدواء الأكثر صرفاً</p>
            <p className="text-xl font-bold text-purple-600">
              {medicationsData.length > 0 ? medicationsData[0].name : 'لا يوجد بيانات'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">الدواء الأقل صرفاً</p>
            <p className="text-xl font-bold text-orange-600">
              {medicationsData.length > 0 ? medicationsData[medicationsData.length - 1].name : 'لا يوجد بيانات'}
            </p>
          </div>
        </div>

        {/* صف الرسوم البيانية الثاني */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* الإيرادات */}
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-cyan-600" /> الإيرادات الربعية
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="110%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickMargin={-10} />
                  <Tooltip formatter={value => [`${value} ج.م`, 'الإيرادات']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#009688FF" name="الإيرادات (ج.م)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* الأدوية الأكثر صرفًا */}
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Pill className="text-cyan-600" /> الأدوية الأكثر صرفاً
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicationsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <Bar dataKey="prescriptions" fill="#7222A0FF" name="عدد المرات" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
