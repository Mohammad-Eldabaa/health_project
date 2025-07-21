import React from "react";
import { useFormik } from "formik";
import drr from "../../../assets/drr.jpeg";
import "./login.css";
import pitttttt from "../../../assets/pitttttt.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import { loginSchema } from "../../../forms/schema";
import useAuthStore from "../../../store/auth";

export default function Login() {
  const { login } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log("Login Data:", values);
      login(values.email, values.password);
    },
  });

  return (
    <div className="container-fluid login-container">
      <div className="row min-vh-100">
        <div className="col-md-4 d-none d-md-block p-0">
          <img src={drr} alt="صورة الدكتور" className="full-img" />
        </div>

        <div className="col-12 col-md-8 position-relative p-0 d-flex align-items-center justify-content-center">
          <img src={pitttttt} alt="bg" className="bg-img" />

          <div className="overlay-content">
            <h2 className="main-title mb-5 text-center">تسجيل الدخول</h2>

            <div className="form-container mx-auto">
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>كلمة المرور</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="أدخل كلمة المرور"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.password && !!formik.errors.password
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="mb-3">
                  <Form.Text
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                  >
                    هل نسيت كلمة المرور؟
                  </Form.Text>
                </div>

                <Button type="submit" variant="primary" className="w-100">
                  تسجيل الدخول
                </Button>

                <div className="text-center mt-3">
                  <span>ليس لديك حساب؟ </span>
                  <NavLink
                    to="/register"
                    className="text-primary"
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    إنشاء حساب جديد
                  </NavLink>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
