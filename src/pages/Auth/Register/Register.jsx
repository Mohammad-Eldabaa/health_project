import React from "react";
import dr from "../../../assets/dr.jpeg";
import pitttttt from "../../../assets/pitttttt.png";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { NavLink } from "react-bootstrap";
import { useFormik } from "formik";
import { logInAndRegisterSchema } from "../../../forms/schema/index.js";
import "./register.css";
export default function Register() {
  const state = [
    "البحيرة",
    "الإسكندرية",
    "الغربية",
    "الإسماعيلية",
    "الأقصر",
    "البحر الأحمر",
    "الجيزة",
    "الدقهلية",
    "السويس",
    "الشرقية",
    "الفيوم",
    "القاهرة",
    "القليوبية",
    "المنوفية",
    "المنيا",
    "الوادي الجديد",
    "بني سويف",
    "بورسعيد",
    "أسيوط",
    "جنوب سيناء",
    "دمياط",
    "سوهاج",
    "شمال سيناء",
    "قنا",
    "كفر الشيخ",
    "مطروح",
    "أسوان",
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      state: "",
    },
    validationSchema: logInAndRegisterSchema,
    onSubmit: (values) => {
      console.log("Register Data:", values);
    },
  });

  return (
    <div className="container-fluid register-container">
      <div className="row min-vh-100 ">
        <div
          className="col-12 col-md-8 position-relative p-0 d-flex align-items-center justify-content-center"
          style={{ maxHeight: "100vh" }}
        >
          <img src={pitttttt} alt="bg" className="bg-img" />
          <div className="overlay-content text-center">
            <h2 className="main-title">انشاء حساب </h2>
            <div className="form-container text-end mx-auto">
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>الاسم بالكامل </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    placeholder="ادخل اسمك بالكامل"
                    isInvalid={formik.touched.name && !!formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} className="mb-2">
                  <Form.Label>البريد الالكتروني </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="ادخل بريدك الالكتروني .. "
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      placeholder="ادخل كلمة المرور "
                      isInvalid={
                        formik.touched.password && !!formik.errors.password
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>تأكيد كلمة المرور ..</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      placeholder="تأكيد كلمة المرور"
                      isInvalid={
                        formik.touched.confirmPassword &&
                        !!formik.errors.confirmPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-2">
                  <Form.Label>العنوان</Form.Label>
                  <Form.Control
                    name="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    isInvalid={
                      formik.touched.address && !!formik.errors.address
                    }
                    placeholder="اكتب عنوانك هنا"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>المحافظة</Form.Label>
                    <Form.Select
                      name="state"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.state}
                      isInvalid={formik.touched.state && !!formik.errors.state}
                    >
                      <option>اختر المحافظة</option>
                      {state.map((gov, index) => (
                        <option key={index} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.state}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>المدينة</Form.Label>
                    <Form.Control
                      name="city"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                      isInvalid={formik.touched.city && !!formik.errors.city}
                      placeholder="ادخل مدينتك"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <div className="text-center mt-2">
                  <Button variant="primary" type="submit">
                    سجل الآن
                  </Button>
                </div>

                <div className="text-center mt-2">
                  <p>
                    لديك حساب بالفعل؟{" "}
                    <NavLink href="/" className="text-primary fw-bold">
                      سجل الدخول
                    </NavLink>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>

        <div className="col-md-4 d-none d-md-block p-0">
          <img src={dr} alt="صورة الدكتور" className="full-img" />
        </div>
      </div>
    </div>
  );
}
