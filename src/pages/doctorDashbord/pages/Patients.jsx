import styles from "./Patients.module.css";
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
        <div className={styles["patients-container"]}>
            <div className={styles["patients-title"]}>المرضى</div>

            <div className={`bg-gray-100 p-4 rounded-lg shadow-md ${styles["patients-table-container"]}`}>
                <div className={styles["search-inputt"]}>
                    <SearchBar placeholder="ابحث بالاسم أو الرقم ...." />
                </div>

                {/* Desktop Table View */}
                <div className={`bg-white p-4 rounded-2xl hidden md:table w-full ${styles["patients-table"]}`}>
                    <table className={styles["patients-table"]}>
                        <thead>
                            <tr className={styles["patients-table-header"]}>
                                <th>رقم</th>
                                <th>الإسم</th>
                                <th>العمر</th>
                                <th>النوع</th>
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
                                        <span className={`${styles["status-badge"]} ${styles[
                                            patient.status === "مستقر" ? "stable" :
                                            patient.status === "حالة متوسطة" ? "moderate" : "critical"
                                        ]}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className={styles["actions-cell"]}>
                                        <button className={`${styles["action-btn"]} ${styles["view"]}`}><VisibilityIcon /></button>
                                        <button className={`${styles["action-btn"]} ${styles["edit"]}`}><EditIcon /></button>
                                        <button className={`${styles["action-btn"]} ${styles["delete"]}`}><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className={`md:hidden ${styles["patients-cards"]}`}>
                    {patientsData.map((patient) => (
                        <div key={patient.id} className={styles["patient-card"]}>
                            <div className={styles["card-header"]}>
                                <span className={styles["patient-id"]}>#{patient.id}</span>
                                <span className={`${styles["status-badge"]} ${styles[
                                    patient.status === "مستقر" ? "stable" :
                                    patient.status === "حالة متوسطة" ? "moderate" : "critical"
                                ]}`}>
                                    {patient.status}
                                </span>
                            </div>
                            <div className={styles["card-body"]}>
                                <div className={styles["patient-info"]}>
                                    <span className={styles["info-label"]}>الاسم:</span>
                                    <span className={styles["info-value"]}>{patient.name}</span>
                                </div>
                                <div className={styles["patient-info"]}>
                                    <span className={styles["info-label"]}>العمر:</span>
                                    <span className={styles["info-value"]}>{patient.age}</span>
                                </div>
                                <div className={styles["patient-info"]}>
                                    <span className={styles["info-label"]}>النوع:</span>
                                    <span className={styles["info-value"]}>{patient.gender}</span>
                                </div>
                                <div className={styles["patient-info"]}>
                                    <span className={styles["info-label"]}>آخر زيارة:</span>
                                    <span className={styles["info-value"]}>{patient.lastVisit}</span>
                                </div>
                            </div>
                            <div className={styles["card-actions"]}>
                                <button className={`${styles["action-btn"]} ${styles["view"]}`}><VisibilityIcon /></button>
                                <button className={`${styles["action-btn"]} ${styles["edit"]}`}><EditIcon /></button>
                                <button className={`${styles["action-btn"]} ${styles["delete"]}`}><DeleteIcon /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Patients;
