import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Stethoscope, User, Calendar, Clock, Droplet, Pill } from 'lucide-react';
import { DollarSign } from "lucide-react";


const Statistics = () => {
  // بيانات المرضى حسب الشهر
  const monthlyPatientData = [
    { name: 'يناير', patients: 120 },
    { name: 'فبراير', patients: 180 },
    { name: 'مارس', patients: 150 },
    { name: 'أبريل', patients: 210 },
    { name: 'مايو', patients: 190 },
    { name: 'يونيو', patients: 230 },
    { name: 'يوليو', patients: 205 },
  ];

  // بيانات أنواع الزيارات
  const visitTypeData = [
    { name: 'كشف جديد', value: 35 },
    { name: 'متابعة', value: 45 },
    { name: 'استشارة', value: 20 },
  ];

  // بيانات الإيرادات
  const revenueData = [
    { name: 'Q1', revenue: 12500 },
    { name: 'Q2', revenue: 18900 },
    { name: 'Q3', revenue: 15800 },
    { name: 'Q4', revenue: 21000 },
  ];

  // بيانات الأدوية الأكثر صرفًا
  const medicationsData = [
    { name: 'باراسيتامول', prescriptions: 85 },
    { name: 'أموكسيسيلين', prescriptions: 72 },
    { name: 'أوميبرازول', prescriptions: 63 },
    { name: 'لوراتادين', prescriptions: 58 },
    { name: 'فيتامين د', prescriptions: 92 },
  ];

  // ألوان للرسوم البيانية
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // إحصائيات سريعة
  const quickStats = [
    { icon: <User className="w-6 h-6 text-cyan-600" />, title: "إجمالي المرضى", value: "1,248", change: "+12%" },
    { icon: <Stethoscope className="w-6 h-6 text-cyan-600" />, title: "الزيارات هذا الشهر", value: "205", change: "+8%" },
    { icon: <Calendar className="w-6 h-6 text-cyan-600" />, title: "متوسط الانتظار", value: "15 دقيقة", change: "-2%" },
    { icon: <Droplet className="w-6 h-6 text-cyan-600" />, title: "التحاليل المطلوبة", value: "87", change: "+5%" },
    { icon: <Pill className="w-6 h-6 text-cyan-600" />, title: "وصفات طبية", value: "192", change: "+10%" },
    { icon: <Clock className="w-6 h-6 text-cyan-600" />, title: "متوسط مدة الكشف", value: "12 دقيقة", change: "0%" },
  ];

  return (
    <div className="px-6 bg-white min-h-screen" dir="rtl">
      <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3 mb-8">
        <span className="text-base sm:text-lg lg:text-xl">إحصائيات العياده <Activity className="text-cyan-600 inline" /> </span>
      </div>


      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-2 md:grid-cols-3  xl:grid-cols-6 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-full bg-cyan-100 text-cyan-600">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' :
                stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm text-gray-500 mt-2">{stat.title}</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>


      {/* الرسوم البيانية الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 ">
        {/* عدد المرضى الشهري */}
        <div className="lg:col-span-2 bg-gray-50 p-4 rounded-2xl shadow-md  ">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-cyan-600" />
            توزيع المرضى شهرياً
          </h2>
          <div className='p-4 bg-white rounded-2xl shadow-sm border border-gray-200'>
            <div className="h-80">
              <ResponsiveContainer width="105%" height="100%">
                <BarChart data={monthlyPatientData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickMargin={30}/>
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
          <div className='p-4 bg-white rounded-2xl shadow-sm border border-gray-200'>

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


      <div className='p-4 bg-gray-50 rounded-2xl shadow-sm border border-gray-200'>

        {/* ملخص الأرقام */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
            <p className="text-xl font-bold text-green-600">150,000 ج.م</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">الربع الأعلى</p>
            <p className="text-xl font-bold text-blue-600">الربع الثاني</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">الدواء الأكثر صرفاً</p>
            <p className="text-xl font-bold text-purple-600">Paracetamol</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm text-gray-500">الدواء الأقل صرفاً</p>
            <p className="text-xl font-bold text-orange-600">Paracetamol</p>
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
                  <Tooltip />
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
                <BarChart
                  data={medicationsData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <Bar dataKey="prescriptions" fill="#7222A0FF" name="عدد المرات" />
                  <YAxis dataKey="name" type="category" width={10} tickMargin={-30} tick={{ fill: "#FFFF", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      {/* ملخص إحصائي */}
      <div className="bg-gray-50 p-4 rounded-2xl shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">ملخص إحصائي</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-100 shadow-sm p-4 rounded-2xl  bg-white">
            <h3 className="text-sm font-medium text-gray-500">أكثر أيام الأسبوع ازدحاماً</h3>
            <p className="text-xl font-bold mt-1">الأحد والثلاثاء</p>
          </div>
          <div className="border border-gray-100 shadow-sm p-4 rounded-2xl  bg-white">
            <h3 className="text-sm font-medium text-gray-500">أكثر الأوقات ازدحاماً</h3>
            <p className="text-xl font-bold mt-1">10 صباحاً - 12 ظهراً</p>
          </div>
          <div className="border border-gray-100 shadow-sm p-4 rounded-2xl  bg-white">
            <h3 className="text-sm font-medium text-gray-500">أكثر التشخيصات شيوعاً</h3>
            <p className="text-xl font-bold mt-1">نزلات البرد، اضطرابات المعدة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;