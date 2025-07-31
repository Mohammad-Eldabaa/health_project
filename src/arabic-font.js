import { jsPDF } from "jspdf";
import "jspdf-autotable";

const arabicFont = () => {
  const doc = new jsPDF();

    doc.addFont(
    "https://fonts.googleapis.com/css2?family=Amiri&display=swap",
    "Amiri",
    "normal"
  );

  return doc;
};

export default arabicFont;