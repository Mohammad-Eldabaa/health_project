import React from "react";
import { useFormikContext } from "formik";
import useAuthStore from "../../../store/auth";

export function SubmitButton() {
  const { setFieldValue } = useFormikContext();
  const { CUname, CUaddress, CUphone, CUage } = useAuthStore();

  return (
    <div className="mt-8 flex justify-center ">
      <button
        type="submit"
        style={{ backgroundColor: "#0097A7", padding: " 12px 16px" }}
        className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        احجز الموعد
      </button>
      <button
        onClick={() => {
          setFieldValue("fullName", CUname());
          setFieldValue("address", CUaddress());
          setFieldValue("phoneNumber", CUphone());
          console.log(CUname());
          // setFieldValue("age", 25);
        }}
        style={{ backgroundColor: "#00a72aff", padding: " 12px 16px" }}
        className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        ملئ تلقائى
      </button>
    </div>
  );
}
