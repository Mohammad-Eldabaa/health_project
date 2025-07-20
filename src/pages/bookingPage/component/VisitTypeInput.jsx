import React from "react";
import { Clock } from "lucide-react";
import { Field, ErrorMessage } from "formik";
export function VisitTypeInput() {
  return (
    <div className="col-md-6">
      <label className="form-label text-dark">
        <Clock
          className="p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        نوع الزيارة *
      </label>
      <Field
        as="select"
        name="visitType"
        required
        className="form-select text-end"
        style={{ direction: "rtl", height: "50px" }}
      >
        <option value="">اختر نوع الزيارة</option>
        <option value="general-checkup">فحص عام</option>
        <option value="consultation">استشارة</option>
        <option value="follow-up">زيارة متابعة</option>
        <option value="emergency">طوارئ</option>
        <option value="routine-screening">فحص دوري</option>
        <option value="specialist-referral">إحالة إلى أخصائي</option>
      </Field>
      <ErrorMessage
        name="visitType"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
