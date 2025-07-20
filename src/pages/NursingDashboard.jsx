import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NursingDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    doctor: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prev) => [...prev, { ...formData, id: Date.now() }]);
    setFormData({ patientName: "", doctor: "", date: "", time: "", notes: "" });
  };

  const handleCancel = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <div className="container-fluid min-vh-100 p-0" dir="rtl">
      <div className="row g-0">
        {/* الشريط الجانبي */}
        <div
          className="col-md-3 col-lg-2 d-md-block text-white sidebar collapse"
          style={{ backgroundColor: "#0097A7" }}
        >
          <div className="position-sticky pt-3">
            <h2 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white px-3">
              <i className="bi bi-hospital me-2"></i>
              <span className="fs-4">لوحة التمريض</span>
            </h2>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <a href="#" className="nav-link active" aria-current="page">
                  <i className="bi bi-speedometer2 me-2"></i>
                  لوحة التحكم
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-calendar-plus me-2"></i>
                  إضافة موعد
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-calendar-week me-2"></i>
                  الجدول
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-people me-2"></i>
                  المرضى
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  تسجيل الخروج
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <main
          className="col-md-9 col-lg-10 ms-sm-auto px-md-4"
          style={{ backgroundColor: "#B2EBF2" }}
        >
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">
              <i className="bi bi-speedometer2 me-2"></i>
              لوحة سكرتارية
            </h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-calendar-week me-1"></i>اليوم
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-calendar-range me-1"></i>الأسبوع
                </button>
              </div>
            </div>
          </div>

          {/* نموذج إضافة موعد */}
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-plus me-2"></i>
                إضافة موعد
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="patientName" className="form-label">
                      اسم المريض
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="doctor" className="form-label">
                      الطبيب
                    </label>
                    <select
                      className="form-select"
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر طبيبًا</option>
                      <option value="Dr. Fadl">د. فضل</option>
                      <option value="Dr. Youssef">د. يوسف</option>
                      <option value="Dr. Ramdan">د. رمضان</option>
                      <option value="Dr. Brown">د. براون</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label">
                      التاريخ
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="time" className="form-label">
                      الوقت
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="notes" className="form-label">
                      ملاحظات
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn text-white"
                      style={{ backgroundColor: "#0097A7" }}
                    >
                      <i className="bi bi-save me-1"></i>
                      إضافة الموعد
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* قائمة المواعيد */}
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                المواعيد المجدولة
              </h5>
            </div>
            <div className="card-body">
              {appointments.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  لا توجد مواعيد مجدولة بعد.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">المريض</th>
                        <th scope="col">الطبيب</th>
                        <th scope="col">التاريخ</th>
                        <th scope="col">الوقت</th>
                        <th scope="col">الملاحظات</th>
                        <th scope="col">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
                          <td>
                            <i className="bi bi-person-circle me-2"></i>
                            {appt.patientName}
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">
                              <i className="bi bi-activity me-1"></i>
                              {appt.doctor}
                            </span>
                          </td>
                          <td>
                            {new Date(appt.date).toLocaleDateString("ar-EG")}
                          </td>
                          <td>{appt.time}</td>
                          <td>
                            {appt.notes || (
                              <span className="text-muted">
                                لا توجد ملاحظات
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() => handleCancel(appt.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              إلغاء
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NursingDashboard;
