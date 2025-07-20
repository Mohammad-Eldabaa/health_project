import React from "react";
import { MapPin } from "lucide-react";
import { Field, ErrorMessage } from "formik";

export function AddressInput() {
  return (
    <div className="col-12">
      <label className="form-label text-dark">
        <MapPin
          className=" p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        العنوان *
      </label>
      <Field
        type="text"
        name="address"
        required
        className="form-control text-end"
        placeholder="أدخل عنوانك الكامل"
        style={{ direction: "rtl", height: "50px" }}
      />
      <ErrorMessage
        name="address"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
