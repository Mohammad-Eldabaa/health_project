import React from "react";
import { Stethoscope } from "lucide-react";

export function BookingPageHeader() {
  return (
    <div className="py-5 px-3" style={{ backgroundColor: "#0097A7" }}>
      <div className="container text-center">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <h1 className="h3 fw-bold text-white ms-3 mb-0">
            عيادة الرعاية الصحية
          </h1>
          <Stethoscope size={32} className="text-white" />
        </div>
        <p className="fs-5" style={{ color: "#E0F2F1" }}>
          احجز موعدك
        </p>
      </div>
    </div>
  );
}
