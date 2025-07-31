import React from 'react';

const PrintPrescription = React.forwardRef(({ patientName, today, notes, selectedMeds }, ref) => {
  return (
    <div ref={ref} className="p-6" dir="rtl" style={{ fontFamily: 'Arial' }}>
      <h1 className="text-2xl font-bold text-center mb-4">روشتة طبية</h1>
      <div className="mb-4">
        <p className="font-bold">اسم المريض: {patientName}</p>
        <p className="font-bold">التاريخ: {today}</p>
      </div>
      
      <h2 className="text-xl font-bold mb-2">التشخيص/الملاحظات:</h2>
      <p className="mb-4">{notes || 'لا توجد ملاحظات'}</p>
      
      <h2 className="text-xl font-bold mb-2">الأدوية الموصوفة:</h2>
      <ul className="list-decimal pr-4">
        {selectedMeds.map((med, index) => (
          <li key={index} className="mb-2">
            <p className="font-bold">{med.name}</p>
            <p>الجرعة: {med.dosage}</p>
            <p>المدة: {med.duration}</p>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 text-center">
        <p className="font-bold">توقيع الطبيب: ________________</p>
      </div>
    </div>
  );
});
PrintPrescription.displayName = 'PrintPrescription'; 

export default PrintPrescription;