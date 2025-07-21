import "./Patients.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBar from "../components/SearchBar";

const Patients = () => {
    const patientsData = [
        { id: 1, name: "أحمد علي", age: 30, gender: "ذكر", phone: "0123456789", address: "القاهرة", lastVisit: "2025-07-10", status: "مستقر" },
        { id: 2, name: "محمد أحمد", age: 25, gender: "ذكر", phone: "0123456788", address: "الجيزة", lastVisit: "2025-07-09", status: "مستقر" },
        { id: 3, name: "سارة محمود", age: 28, gender: "أنثى", phone: "0123456787", address: "الإسكندرية", lastVisit: "2025-07-08", status: "حالة متوسطة" },
        { id: 4, name: "فاطمة خالد", age: 35, gender: "أنثى", phone: "0123456786", address: "المنصورة", lastVisit: "2025-07-07", status: "حالة حرجة" },
        { id: 5, name: "علي حسين", age: 40, gender: "ذكر", phone: "0123456785", address: "أسوان", lastVisit: "2025-07-06", status: "مستقر" },
    ];

    return (
        <div className="patients-container">
            <div className="patients-title">المرضى</div>
            <div className="patients-table-container bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="search-inputt">
                    <SearchBar placeholder="ابحث بالاسم أو الرقم ...." />
                </div>

                {/* Desktop Table View */}
                <div className=" bg-white p-4 rounded-2xl hidden md:table w-full">

                <table className="patients-table hidden md:table  ">
                    <thead>
                        <tr className="patients-table-header">
                            <th>رقم </th>
                            <th>الإسم</th>
                            <th>العمر</th>
                            <th>الجنس</th>
                            <th>رقم الهاتف</th>
                            <th>العنوان</th>
                            <th>آخر زيارة</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientsData.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.id}</td>
                                <td>{patient.name}</td>
                                <td>{patient.age}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.phone}</td>
                                <td>{patient.address}</td>
                                <td>{patient.lastVisit}</td>
                                <td>
                                    <span className={`status-badge ${patient.status === "مستقر" ? "stable" : patient.status === "حالة متوسطة" ? "moderate" : "critical"}`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="action-btn view"><VisibilityIcon /></button>
                                    <button className="action-btn edit"><EditIcon /></button>
                                    <button className="action-btn delete"><DeleteIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                                </div>


                {/* Mobile Cards View */}
                <div className="md:hidden patients-cards">
                    {patientsData.map((patient) => (
                        <div key={patient.id} className="patient-card">
                            <div className="card-header">
                                <span className="patient-id">#{patient.id}</span>
                                <span className={`status-badge ${patient.status === "مستقر" ? "stable" : patient.status === "حالة متوسطة" ? "moderate" : "critical"}`}>
                                    {patient.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="patient-info">
                                    <span className="info-label">الاسم:</span>
                                    <span className="info-value">{patient.name}</span>
                                </div>
                                <div className="patient-info">
                                    <span className="info-label">العمر:</span>
                                    <span className="info-value">{patient.age}</span>
                                </div>
                                <div className="patient-info">
                                    <span className="info-label">الجنس:</span>
                                    <span className="info-value">{patient.gender}</span>
                                </div>
                                <div className="patient-info">
                                    <span className="info-label">آخر زيارة:</span>
                                    <span className="info-value">{patient.lastVisit}</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="action-btn view"><VisibilityIcon /></button>
                                <button className="action-btn edit"><EditIcon /></button>
                                <button className="action-btn delete"><DeleteIcon /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Patients;