import React, { useEffect, useRef, useContext } from "react";
import Chart from "chart.js/auto";
import { AppointmentContext } from "./AppointmentContext";

const NursingDashboardCharts = () => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const appointmentTypeChartRef = useRef(null);
  const { appointments } = useContext(AppointmentContext);

  // Sample revenue data (replace with real data from backend/context)
  const revenueData = {
    totalRevenue: 15000,
    dailyRevenue: 2500,
    weeklyRevenue: 12000,
  };

  // Dynamic appointment data (group by date)
  const appointmentCounts = appointments.reduce((acc, appt) => {
    const date = new Date(appt.date).toLocaleDateString("ar-EG");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const appointmentData = {
    labels: Object.keys(appointmentCounts).length
      ? Object.keys(appointmentCounts)
      : [
          "2025-07-15",
          "2025-07-16",
          "2025-07-17",
          "2025-07-18",
          "2025-07-19",
          "2025-07-20",
          "2025-07-21",
        ],
    datasets: [
      {
        label: "عدد المواعيد",
        data: Object.keys(appointmentCounts).length
          ? Object.values(appointmentCounts)
          : [5, 8, 6, 10, 7, 9, 12],
        borderColor: "#0097A7",
        backgroundColor: "rgba(0, 151, 167, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Sample patient status data (replace with real data if available)
  const statusData = {
    labels: ["مستقر", "حالة متوسطة", "حالة حرجة"],
    datasets: [
      {
        label: "حالة المرضى",
        data: [60, 25, 15],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        hoverOffset: 4,
      },
    ],
  };

  // Sample weekly revenue data
  const weeklyRevenueData = {
    labels: [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ],
    datasets: [
      {
        label: "الإيرادات (جنيه)",
        data: [1000, 1200, 1400, 1100, 1800, 1600, 2000],
        fill: false,
        borderColor: "#00BCD4",
        tension: 0.4,
      },
    ],
  };

  // Sample appointment types data
  const appointmentTypeData = {
    labels: ["كشف", "متابعة", "استشارة"],
    datasets: [
      {
        label: "عدد المواعيد",
        data: [10, 5, 3],
        backgroundColor: ["#00BCD4", "#4DD0E1", "#B2EBF2"],
      },
    ],
  };

  useEffect(() => {
    // Initialize charts
    const lineChart = new Chart(lineChartRef.current, {
      type: "line",
      data: appointmentData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#333" },
          },
          title: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: "التاريخ", color: "#333" },
            ticks: { color: "#333" },
          },
          y: {
            title: { display: true, text: "عدد المواعيد", color: "#333" },
            ticks: { color: "#333" },
            beginAtZero: true,
          },
        },
      },
    });

    const pieChart = new Chart(pieChartRef.current, {
      type: "pie",
      data: statusData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#333" },
          },
          title: { display: false },
        },
      },
    });

    const revenueChart = new Chart(revenueChartRef.current, {
      type: "line",
      data: weeklyRevenueData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#333" },
          },
          title: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: "اليوم", color: "#333" },
            ticks: { color: "#333" },
          },
          y: {
            title: { display: true, text: "الإيرادات (جنيه)", color: "#333" },
            ticks: { color: "#333" },
            beginAtZero: true,
          },
        },
      },
    });

    const appointmentTypeChart = new Chart(appointmentTypeChartRef.current, {
      type: "pie",
      data: appointmentTypeData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#333" },
          },
          title: { display: false },
        },
      },
    });

    // Cleanup charts on unmount
    return () => {
      lineChart.destroy();
      pieChart.destroy();
      revenueChart.destroy();
      appointmentTypeChart.destroy();
    };
  }, [appointments]); // Re-run effect when appointments change

  return (
    <div>
      {/* Revenue Summary Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            <i className="bi bi-currency-dollar me-2"></i>
            ملخص الإيرادات
          </h5>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-4">
              <h6>إجمالي الإيرادات</h6>
              <p className="text-success fs-5">
                {revenueData.totalRevenue.toLocaleString("ar-EG")} جنيه
              </p>
            </div>
            <div className="col-md-4">
              <h6>الإيرادات اليومية</h6>
              <p className="text-primary fs-5">
                {revenueData.dailyRevenue.toLocaleString("ar-EG")} جنيه
              </p>
            </div>
            <div className="col-md-4">
              <h6>الإيرادات الأسبوعية</h6>
              <p className="text-info fs-5">
                {revenueData.weeklyRevenue.toLocaleString("ar-EG")} جنيه
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                المواعيد اليومية
              </h5>
            </div>
            <div className="card-body">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                توزيع حالة المرضى
              </h5>
            </div>
            <div className="card-body">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                الإيرادات الأسبوعية
              </h5>
            </div>
            <div className="card-body">
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                أنواع المواعيد
              </h5>
            </div>
            <div className="card-body">
              <canvas ref={appointmentTypeChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NursingDashboardCharts;
