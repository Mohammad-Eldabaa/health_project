import React from "react";
import { Calendar } from "lucide-react";
import { Field, ErrorMessage } from "formik";
export function BookingDataInput() {
  return (
    <div className="col-md-6">
      <label className="form-label text-dark">
        <Calendar
          className="p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        التاريخ المفضل *
      </label>
      <Field
        type="date"
        name="bookingDate"
        required
        min={new Date().toISOString().split("T")[0]}
        className="form-control"
        style={{ direction: "rtl", height: "50px" }}
      />
      <ErrorMessage
        name="bookingDate"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
