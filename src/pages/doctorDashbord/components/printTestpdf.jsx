const PrintPreview = ({ patientName, tests }) => {
  return (
    <div className="p-10 font-sans text-right bg-white text-black print:text-black">
      <h2 className="text-2xl font-bold mb-4">تقرير التحاليل</h2>
      <p><strong>اسم المريض:</strong> {patientName}</p>
      <p><strong>التاريخ:</strong> {new Date().toLocaleDateString()}</p>

      <table className="w-full mt-6 border border-gray-300">
        <thead className="bg-gray-100">
          <tr className="text-sm text-center">
            <th className="p-2 border">اسم التحليل</th>
            <th className="p-2 border">المدة المتوقعة</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, idx) => (
            <tr key={idx} className="text-sm text-center">
              <td className="p-2 border">{test.name}</td>
              <td className="p-2 border">{test.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10">
        <p>توقيع الطبيب: ____________________</p>
      </div>
    </div>
  );
};

export default PrintPreview;
