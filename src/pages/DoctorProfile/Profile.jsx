import React, { useState, useRef } from 'react';
import { FaUserMd, FaPhone, FaMapMarkerAlt, FaClock, FaLanguage, FaBriefcase, FaGraduationCap, FaEdit, FaSave, FaTimes, FaStar, FaCamera, FaTrash } from 'react-icons/fa';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const [profile, setProfile] = useState({
        name: 'د. أحمد محمد علي',
        specialty: 'استشاري القلب والأوعية الدموية',
        phone: '+20 122 345 6789',
        address: '15 شارع التحرير، الدقي، الجيزة',
        workingHours: 'من السبت إلى الخميس: 9 صباحًا - 9 مساءً',
        languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
        bio: 'دكتوراه في أمراض القلب والأوعية الدموية مع أكثر من 15 عامًا من الخبرة في تشخيص وعلاج أمراض القلب.',
        image: null
    });

    const [editableSections, setEditableSections] = useState({
        basicInfo: true,
        contactInfo: true,
        certificates: true,
        experiences: true,
        ratings: false
    });

    const [experiences, setExperiences] = useState([
        {
            id: 1,
            position: 'استشاري القلب والأوعية الدموية',
            hospital: 'مستشفى القاهرة الجديدة',
            period: '2020 - حتى الآن',
            description: 'تشخيص وعلاج حالات القلب المعقدة وإجراء القسطرة القلبية'
        },
        {
            id: 2,
            position: 'طبيب قلب أول',
            hospital: 'مستشفى الجامعة',
            period: '2015 - 2020',
            description: 'علاج المرضى الداخليين والإشراف على الأطباء المقيمين'
        }
    ]);

    const [certificates, setCertificates] = useState([
        {
            id: 1,
            name: 'دكتوراه في أمراض القلب',
            institution: 'جامعة القاهرة',
            year: '2014',
            image: null
        },
        {
            id: 2,
            name: 'زمالة الكلية الملكية للأطباء',
            institution: 'لندن، المملكة المتحدة',
            year: '2012',
            image: null
        }
    ]);

    const [ratings, setRatings] = useState([
        { id: 1, patient: 'محمد عبدالله', rating: 5, comment: 'طبيب ممتاز ومحترف جدًا' },
        { id: 2, patient: 'أميرة محمد', rating: 4, comment: 'شرح واضح وعلاج فعال' },
        { id: 3, patient: 'أميرة محمد', rating: 4, comment: 'شرح واضح وعلاج فعال' },
        { id: 4, patient: 'أميرة محمد', rating: 3, comment: 'شرح واضح وعلاج فعال' },
        { id: 5, patient: 'أميرة محمد', rating: 1, comment: 'شرح سئئ وعلاج فعال' }
    ]);

    const [editMode, setEditMode] = useState(false);
    const [newCertificate, setNewCertificate] = useState({ name: '', institution: '', year: '', image: null });
    const [newExperience, setNewExperience] = useState({ position: '', hospital: '', period: '', description: '' });
    const imageInputRef = useRef(null);
    const certificateInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile({ ...profile, image: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleLanguagesChange = (e) => {
        const languages = e.target.value.split(',').map(lang => lang.trim());
        setProfile({ ...profile, languages });
    };

    const addCertificate = () => {
        if (newCertificate.name.trim()) {
            setCertificates([...certificates, { ...newCertificate, id: Date.now() }]);
            setNewCertificate({ name: '', institution: '', year: '', image: null });
            if (certificateInputRef.current) {
                certificateInputRef.current.value = '';
            }
        }
    };

    const removeCertificate = (id) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const handleCertificateImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewCertificate({ ...newCertificate, image: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const addExperience = () => {
        if (newExperience.position.trim()) {
            setExperiences([...experiences, { ...newExperience, id: Date.now() }]);
            setNewExperience({ position: '', hospital: '', period: '', description: '' });
        }
    };

    const removeExperience = (id) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? 'star filled' : 'star'} />
        ));
    };

    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    return (
        <div className="doctor-profile-container">
            <div className="profile-header">
                <h1>البروفايل الطبي</h1>
                <button
                    className={`edit-toggle-btn ${editMode ? 'active' : ''}`}
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? <><FaSave /> حفظ التغييرات</> : <><FaEdit /> تعديل البروفايل</>}
                </button>
            </div>

            <div className="profile-layout">
                <div className="profile-view">
                    <div className="profile-card">
                        <div className="profile-image-container">
                            {profile.image ? (
                                <img src={profile.image} alt={profile.name} className="profile-image" />
                            ) : (
                                <div className="profile-image-placeholder">
                                    <FaUserMd />
                                </div>
                            )}
                            {editMode && editableSections.basicInfo && (
                                <label className="image-upload-btn">
                                    <FaCamera />
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="profile-info">
                            <h2 className="doctor-name">{profile.name}</h2>
                            <p className="doctor-specialty">{profile.specialty}</p>

                            {editMode && editableSections.basicInfo ? (
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleProfileChange}
                                    className="edit-bio"
                                    placeholder="أدخل السيرة الذاتية"
                                />
                            ) : (
                                <p className="doctor-bio">{profile.bio}</p>
                            )}

                            <div className="contact-grid">
                                <div className="contact-item">
                                    <FaPhone className="contact-icon" />
                                    {editMode && editableSections.contactInfo ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{profile.phone}</span>
                                    )}
                                </div>

                                <div className="contact-item">
                                    <FaMapMarkerAlt className="contact-icon" />
                                    {editMode && editableSections.contactInfo ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={profile.address}
                                            onChange={handleProfileChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{profile.address}</span>
                                    )}
                                </div>

                                <div className="contact-item">
                                    <FaClock className="contact-icon" />
                                    {editMode && editableSections.contactInfo ? (
                                        <input
                                            type="text"
                                            name="workingHours"
                                            value={profile.workingHours}
                                            onChange={handleProfileChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{profile.workingHours}</span>
                                    )}
                                </div>

                                <div className="contact-item">
                                    <FaLanguage className="contact-icon" />
                                    {editMode && editableSections.contactInfo ? (
                                        <input
                                            type="text"
                                            value={profile.languages.join(', ')}
                                            onChange={handleLanguagesChange}
                                            className="edit-input"
                                            placeholder="أدخل اللغات مفصولة بفاصلة"
                                        />
                                    ) : (
                                        <span>{profile.languages.join('، ')}</span>
                                    )}
                                </div>
                            </div>

                            <div className="experiences-list">
                                {experiences.map(exp => (
                                    <div key={exp.id} className="experience-item">
                                        <div className="experience-header">
                                            <h4>{exp.position}</h4>
                                            {editMode && editableSections.experiences && (
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeExperience(exp.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                        <p className="experience-hospital">{exp.hospital} | {exp.period}</p>
                                        <p className="experience-description">{exp.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="certificates-grid">
                                {certificates.map(cert => (
                                    <div key={cert.id} className="certificate-item">
                                        {cert.image ? (
                                            <img src={cert.image} alt={cert.name} className="certificate-image" />
                                        ) : (
                                            <div className="certificate-image-placeholder">
                                                <FaGraduationCap />
                                            </div>
                                        )}
                                        <div className="certificate-details">
                                            <h4>{cert.name}</h4>
                                            <p>{cert.institution} - {cert.year}</p>
                                        </div>
                                        {editMode && editableSections.certificates && (
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeCertificate(cert.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ratings-sidebar">
                    <div className="profile-card">
                        <h3 className="section-title">
                            <FaStar /> تقييمات المرضى
                        </h3>
                        <div className="ratings-list">
                            {ratings.map(rating => (
                                <div key={rating.id} className="rating-item">
                                    <div className="rating-header">
                                        <div className="patient-rating">
                                            <span className="patient-name">{rating.patient}</span>
                                            <div className="stars">{renderStars(rating.rating)}</div>
                                        </div>
                                    </div>
                                    <p className="rating-comment">{rating.comment}</p>
                                </div>
                            ))}
                        </div>
                        <div className="average-rating">
                            {renderStars(Math.round(averageRating))}
                            <span>{averageRating.toFixed(1)} ({ratings.length} تقييم)</span>
                        </div>
                    </div>
                </div>

                {editMode && (
                    <div className="edit-panel">
                        <h3 className="edit-panel-title">لوحة التحكم</h3>

                        <div className="edit-controls">
                            <h4>الأقسام القابلة للتعديل:</h4>
                            {Object.entries(editableSections).map(([section, editable]) => (
                                <label key={section} className="edit-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={editable}
                                        onChange={() => setEditableSections({
                                            ...editableSections,
                                            [section]: !editable
                                        })}
                                    />
                                    <span>
                                        {section === 'basicInfo' && 'المعلومات الأساسية'}
                                        {section === 'contactInfo' && 'معلومات التواصل'}
                                        {section === 'certificates' && 'الشهادات'}
                                        {section === 'experiences' && 'الخبرات'}
                                        {section === 'ratings' && 'التقييمات'}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {editableSections.experiences && (
                            <div className="edit-section">
                                <h4>إضافة خبرة جديدة:</h4>
                                <div className="edit-form-group">
                                    <label>المسمى الوظيفي:</label>
                                    <input
                                        type="text"
                                        value={newExperience.position}
                                        onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                                        placeholder="مثال: استشاري القلب"
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>اسم المستشفى/المؤسسة:</label>
                                    <input
                                        type="text"
                                        value={newExperience.hospital}
                                        onChange={(e) => setNewExperience({ ...newExperience, hospital: e.target.value })}
                                        placeholder="مثال: مستشفى القاهرة الجديدة"
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>الفترة الزمنية:</label>
                                    <input
                                        type="text"
                                        value={newExperience.period}
                                        onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                                        placeholder="مثال: 2020 - حتى الآن"
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>وصف الخبرة:</label>
                                    <textarea
                                        value={newExperience.description}
                                        onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                        placeholder="وصف مختصر للمهام والمسؤوليات"
                                    />
                                </div>
                                <button className="add-btn" onClick={addExperience}>
                                    إضافة خبرة
                                </button>
                            </div>
                        )}

                        {editableSections.certificates && (
                            <div className="edit-section">
                                <h4>إضافة شهادة جديدة:</h4>
                                <div className="edit-form-group">
                                    <label>اسم الشهادة:</label>
                                    <input
                                        type="text"
                                        value={newCertificate.name}
                                        onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                                        placeholder="مثال: دكتوراه في أمراض القلب"
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>اسم المؤسسة:</label>
                                    <input
                                        type="text"
                                        value={newCertificate.institution}
                                        onChange={(e) => setNewCertificate({ ...newCertificate, institution: e.target.value })}
                                        placeholder="مثال: جامعة القاهرة"
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>سنة الحصول:</label>
                                    <input
                                        type="text"
                                        value={newCertificate.year}
                                        onChange={(e) => setNewCertificate({ ...newCertificate, year: e.target.value })}
                                        placeholder="مثال: 2015"
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>صورة الشهادة:</label>
                                    <label className="file-upload-btn">
                                        <FaCamera /> اختر صورة
                                        <input
                                            type="file"
                                            ref={certificateInputRef}
                                            onChange={handleCertificateImageUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    {newCertificate.image && (
                                        <div className="image-preview">
                                            <img src={newCertificate.image} alt="معاينة صورة الشهادة" />
                                        </div>
                                    )}
                                </div>
                                <button className="add-btn" onClick={addCertificate}>
                                    إضافة شهادة
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorProfile;