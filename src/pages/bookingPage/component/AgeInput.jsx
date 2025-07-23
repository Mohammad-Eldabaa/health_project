import React from "react";
import { Calendar } from "lucide-react";
import { Field, ErrorMessage } from "formik";
export function AgeInput() {
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
        العمر *
      </label>
      <Field
        type="number"
        name="age"
        required
        min="1"
        max="120"
        className="form-control text-end"
        placeholder="أدخل عمرك"
        style={{ direction: "rtl", height: "50px" }}
      />
      <ErrorMessage
        name="age"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
