import React from "react";
import { Body } from "./component/Body";
import "bootstrap/dist/css/bootstrap.min.css";
import { BookingPageHeader } from "./component/BookingPageHeader.jsx";
import { FooterInfo } from "./component/FooterInfo.jsx";
import { Schema, formData, handleSubmit } from "./schema.js";

export default function ClinicBookingPageArabic() {
  return (
    <div style={{ backgroundColor: "#B2EBF2", minHeight: "100vh" }} dir="rtl">
      <BookingPageHeader />
      <div className="container py-5 w-75">
        <Body formData={formData} handleSubmit={handleSubmit} Schema={Schema} />
        <FooterInfo />
      </div>
    </div>
  );
}
