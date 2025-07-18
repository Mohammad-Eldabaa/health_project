import React from "react";
import { FileText } from "lucide-react";
import { Field, ErrorMessage } from "formik";
export function NotesInput() {
  return (
    <div className="col-12">
      <label className="form-label text-dark">
        <FileText
          className="p-1"
          size={28}
          style={{
            color: "#009688",
          }}
        />
        ملاحظات إضافية
      </label>
      <Field
        as="textarea"
        name="notes"
        rows="4"
        className="form-control text-end"
        placeholder="يرجى وصف الأعراض أو أي مخاوف محددة..."
      />
      <ErrorMessage
        name="notes"
        component="div"
        className="text-danger small mt-1"
      />
    </div>
  );
}
