import React from "react";
import { SubmitButton } from "./SubmitButton";
import { NotesInput } from "./NotesInput";
import { VisitTypeInput } from "./VisitTypeInput";
import { BookingDataInput } from "./BookingDataInput";
import { PhoneInput } from "./PhoneInput.jsx";
import { AgeInput } from "./AgeInput.jsx";
import { AddressInput } from "./AddressInput.jsx";
import { NameInput } from "./NameInput.jsx";
import { FormHeader } from "./FormHeader.jsx";
import { Formik, Form } from "formik";
import { NationalId } from "./National_ID.jsx";

export function Body({ formData, handleSubmit, Schema }) {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <FormHeader />
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        <Form>
          <div className="row g-4">
            <NameInput />
            <AddressInput />
            <NationalId />
            <AgeInput />
            <PhoneInput />
            <BookingDataInput />
            <VisitTypeInput />

            <NotesInput />
          </div>

          <div className="mt-5 text-center">
            <SubmitButton />
          </div>
        </Form>
      </Formik>
    </div>
  );
}
