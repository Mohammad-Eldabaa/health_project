// src/arabic-font.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const arabicFont = () => {
  const doc = new jsPDF();

  // Add Arabic font (you need to have the Amiri font files)
  doc.addFont(
    "https://fonts.googleapis.com/css2?family=Amiri&display=swap",
    "Amiri",
    "normal"
  );

  return doc;
};

export default arabicFont;
