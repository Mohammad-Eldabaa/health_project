import React, { useEffect, useRef, useContext } from 'react';
import Chart from 'chart.js/auto';
import { AppointmentContext } from './AppointmentContext';

const NursingDashboardCharts = () => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const appointmentTypeChartRef = useRef(null);
  const { appointments } = useContext(AppointmentContext);

  const revenueData = {
    totalRevenue: 15000,
    dailyRevenue: 2500,
    weeklyRevenue: 12000,
  };

  const appointmentCounts = appointments.reduce((acc, appt) => {
    const date = new Date(appt.date).toLocaleDateString('ar-EG');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const appointmentData = {
    labels: Object.keys(appointmentCounts).length
      ? Object.keys(appointmentCounts)
      : ['2025-07-15', '2025-07-16', '2025-07-17', '2025-07-18', '2025-07-19', '2025-07-20', '2025-07-21'],
    datasets: [
      {
        label: 'عدد المواعيد',
        data: Object.keys(appointmentCounts).length ? Object.values(appointmentCounts) : [5, 8, 6, 10, 7, 9, 12],
        borderColor: '#0097A7',
        backgroundColor: 'rgba(0, 151, 167, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const statusData = {
    labels: ['مستقر', 'حالة متوسطة', 'حالة حرجة'],
    datasets: [
      {
        label: 'حالة المرضى',
        data: [60, 25, 15],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverOffset: 4,
      },
    ],
  };

  const weeklyRevenueData = {
    labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    datasets: [
      {
        label: 'الإيرادات (جنيه)',
        data: [1000, 1200, 1400, 1100, 1800, 1600, 2000],
        fill: false,
        borderColor: '#00BCD4',
        tension: 0.4,
      },
    ],
  };

  const appointmentTypeData = {
    labels: ['كشف', 'متابعة', 'استشارة'],
    datasets: [
      {
        label: 'عدد المواعيد',
        data: [10, 5, 3],
        backgroundColor: ['#00BCD4', '#4DD0E1', '#B2EBF2'],
      },
    ],
  };

  useEffect(() => {
    const lineChart = new Chart(lineChartRef.current, {
      type: 'line',
      data: appointmentData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#333' },
          },
          title: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: 'التاريخ', color: '#333' },
            ticks: { color: '#333' },
          },
          y: {
            title: { display: true, text: 'عدد المواعيد', color: '#333' },
            ticks: { color: '#333' },
            beginAtZero: true,
          },
        },
      },
    });

    const pieChart = new Chart(pieChartRef.current, {
      type: 'pie',
      data: statusData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#333' },
          },
          title: { display: false },
        },
      },
    });

    const revenueChart = new Chart(revenueChartRef.current, {
      type: 'line',
      data: weeklyRevenueData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#333' },
          },
          title: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: 'اليوم', color: '#333' },
            ticks: { color: '#333' },
          },
          y: {
            title: { display: true, text: 'الإيرادات (جنيه)', color: '#333' },
            ticks: { color: '#333' },
            beginAtZero: true,
          },
        },
      },
    });

    const appointmentTypeChart = new Chart(appointmentTypeChartRef.current, {
      type: 'pie',
      data: appointmentTypeData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#333' },
          },
          title: { display: false },
        },
      },
    });

    return () => {
      lineChart.destroy();
      pieChart.destroy();
      revenueChart.destroy();
      appointmentTypeChart.destroy();
    };
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="bi bi-currency-dollar"></i> ملخص الإيرادات
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-6">
          <div>
            <h6 className="text-sm font-medium">إجمالي الإيرادات</h6>
            <p className="text-green-600 text-xl font-semibold">
              {revenueData.totalRevenue.toLocaleString('ar-EG')} جنيه
            </p>
          </div>
          <div>
            <h6 className="text-sm font-medium">الإيرادات اليومية</h6>
            <p className="text-blue-600 text-xl font-semibold">
              {revenueData.dailyRevenue.toLocaleString('ar-EG')} جنيه
            </p>
          </div>
          <div>
            <h6 className="text-sm font-medium">الإيرادات الأسبوعية</h6>
            <p className="text-cyan-600 text-xl font-semibold">
              {revenueData.weeklyRevenue.toLocaleString('ar-EG')} جنيه
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="bi bi-graph-up"></i> المواعيد اليومية
          </h5>
          <canvas ref={lineChartRef}></canvas>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="bi bi-pie-chart"></i> توزيع حالة المرضى
          </h5>
          <canvas ref={pieChartRef}></canvas>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="bi bi-graph-up"></i> الإيرادات الأسبوعية
          </h5>
          <canvas ref={revenueChartRef}></canvas>
        </div>

        {/* Appointment Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="bi bi-pie-chart"></i> أنواع المواعيد
          </h5>
          <canvas ref={appointmentTypeChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default NursingDashboardCharts;
