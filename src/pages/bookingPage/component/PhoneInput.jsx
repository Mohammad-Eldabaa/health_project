import { Phone } from "lucide-react";
import { Field, ErrorMessage } from "formik";

export function PhoneInput() {
  return (
    <div className="col-md-6">
      <label className="form-label text-dark">
        <Phone
          className="p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        رقم الهاتف *
      </label>
      <Field
        type="tel"
        name="phoneNumber"
        required
        className="form-control text-end"
        placeholder="أدخل رقم هاتفك"
        style={{ direction: "rtl", height: "50px" }}
      />
      <ErrorMessage
        name="phoneNumber"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
