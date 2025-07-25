import React, { useContext } from "react";
import { AppointmentContext } from "./AppointmentContext";
import NursingSidebar from "./NursingSidebar";

const NursingAppointmentList = () => {
  const { appointments, cancelAppointment } = useContext(AppointmentContext);

  return (
    <div className="container-fluid min-vh-100 p-0" dir="rtl">
      <div className="row g-0">
        {/* Sidebar */}
        <NursingSidebar />

        {/* Main Content */}
        <main
          className="col-md-9 col-lg-10 ms-sm-auto px-md-4"
          style={{ backgroundColor: "#B2EBF2" }}
        >
          <nav className="navbar navbar-expand-md navbar-light bg-light d-md-none">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>
          <div className="card mt-3">
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
                        <th scope="col">الرقم</th>
                        <th scope="col">المريض</th>
                        <th scope="col">نوع الكشف</th>
                        <th scope="col">الهاتف</th>
                        <th scope="col">العنوان</th>
                        <th scope="col">التاريخ</th>
                        <th scope="col">الوقت</th>
                        <th scope="col">الملاحظات</th>
                        <th scope="col">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt, index) => (
                        <tr key={appt.id}>
                          <td>
                            <i className="bi bi-person-circle me-2"></i>
                            {index + 1}
                          </td>
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
                            <span className="badge bg-info text-dark">
                              <i className="bi bi-activity me-1"></i>
                              {appt.patientNumber}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">
                              <i className="bi bi-activity me-1"></i>
                              {appt.patientAddress}
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
                              onClick={() => cancelAppointment(appt.id)}
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

export default NursingAppointmentList;
