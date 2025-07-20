import React from "react";
import { IdCard } from "lucide-react";
import { Field, ErrorMessage } from "formik";

export function NationalId() {
  return (
    <div className="col-12">
      <label className="form-label text-dark">
        <IdCard
          className=" p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        الرقم القومى *
      </label>
      <Field
        type="text"
        name="nationalId"
        required
        className="form-control text-end"
        placeholder="أدخل رقمك القومي"
        style={{ direction: "rtl", height: "50px" }}
      />
      <ErrorMessage
        name="nationalId"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
