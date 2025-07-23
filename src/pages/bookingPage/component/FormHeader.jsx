import React from "react";

export function FormHeader() {
  return (
    <div
      className="px-4 py-4"
      style={{
        backgroundColor: "#00BCD4",
        borderRadius: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      <h2 className="h4 fw-semibold text-white mb-2">معلومات المريض</h2>
      <p className="text-white-50">يرجى ملء بياناتك لحجز موعد</p>
    </div>
  );
}
