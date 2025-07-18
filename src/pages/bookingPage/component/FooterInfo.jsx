import React from "react";

export function FooterInfo() {
  return (
    <div className="mt-5 text-center">
      <div className="bg-white rounded-4 p-4 shadow">
        <h3 className="fs-5 fw-semibold mb-3" style={{ color: "#212121" }}>
          معلومات مهمة
        </h3>
        <div className="row text-secondary small">
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <strong>ساعات العمل:</strong>
            <br />
            الاثنين-الجمعة: 8:00 ص - 6:00 م
            <br />
            السبت: 9:00 ص - 2:00 م
          </div>
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <strong>الطوارئ:</strong>
            <br />
            للحالات العاجلة، اتصل على
            <br />
            (555) 123-4567
          </div>
          <div className="col-12 col-md-4">
            <strong>التأكيد:</strong>
            <br />
            سنتصل بك خلال 24 ساعة
            <br />
            لتأكيد موعدك
          </div>
        </div>
      </div>
    </div>
  );
}
