import React from "react";
import { useFormik } from "formik";
import drr from "../../../assets/drr.jpeg";
import pitttttt from "../../../assets/pitttttt.png";
import { NavLink } from "react-router-dom";
import { loginSchema } from "../../../forms/schema";
import useAuthStore from "../../../store/auth";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log("Login Data:", values);
      login(values, () => {
        navigate("/");
      });
    },
  });

  return (
    <div className="w-full min-h-screen font-[Cairo] flex flex-col md:flex-row">
      {/* صورة الدكتور */}
      <div className="hidden md:block w-1/3 h-screen">
        <img src={drr} alt="صورة الدكتور" className="w-full h-full object-cover" />
      </div>

      {/* الجزء التاني فيه الخلفية والفورم */}
      <div className="relative w-full md:w-2/3 flex items-center justify-center p-6">
        {/* الخلفية */}
        <img
          src={pitttttt}
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* الفورم - هنا التركيز على مطابقة التنسيقات الأصلية */}
        <div className="relative z-10 w-full max-w-md  bg-opacity-90 p-8 rounded ">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل الدخول</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-right">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-right ${formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1 text-right">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-right">كلمة المرور</label>
              <input
                type="password"
                name="password"
                placeholder="أدخل كلمة المرور"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-right ${formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1 text-right">{formik.errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-sm text-right">
              <NavLink
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                هل نسيت كلمة المرور؟
              </NavLink>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-30 bg-blue-600"
            >
              تسجيل الدخول
            </button>

            {/* Create account link */}
            <div className="text-center mt-4 text-sm">
              <span className="text-gray-600">ليس لديك حساب؟ </span>
              <NavLink
                to="/register"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                إنشاء حساب جديد
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}