import React from "react";
import { Field, ErrorMessage } from "formik";
import { User } from "lucide-react";

export function NameInput() {
  return (
    <div className="col-12">
      <label className="form-label text-dark">
        <User
          className="p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        الاسم الكامل *
      </label>
      <Field
        type="text"
        name="fullName"
        required
        className="form-control text-end"
        placeholder="أدخل اسمك الكامل"
        style={{ direction: "rtl", height: "50px" }}
      />
      <ErrorMessage
        name="fullName"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
