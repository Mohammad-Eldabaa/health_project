import React, { useState, useRef, useEffect } from 'react';
import { FaUserMd, FaPhone, FaMapMarkerAlt, FaClock, FaLanguage, FaBriefcase, FaGraduationCap, FaEdit, FaSave, FaTimes, FaStar, FaCamera, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './DoctorProfile.css';

// Variants for animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.5
        }
    },
    hover: {
        scale: 1.02,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        transition: {
            duration: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 120
        }
    }
};

const expandVariants = {
    hidden: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    },
    visible: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 25
        }
    }
};

const OptimizedImage = ({ src, alt, className, placeholder: Placeholder = FaUserMd, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <>
            {(!loaded || error || !src) && (
                <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-300`}>
                    <Placeholder className="text-5xl" />
                </div>
            )}
            {src && (
                <motion.img
                    src={src}
                    alt={alt}
                    className={`${className} ${!loaded || error ? 'opacity-0 absolute' : 'opacity-100 relative'} object-cover`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    loading="lazy"
                    onClick={onClick}
                />
            )}
        </>
    );
};

const DoctorProfile = () => {
    const loadData = () => {
        const savedData = localStorage.getItem('doctorProfileData');
        if (!savedData) return null;

        try {
            return JSON.parse(savedData);
        } catch (error) {
            console.error('Failed to parse saved data:', error);
            return null;
        }
    };

    const initialData = {
        profile: {
            name: 'د. أحمد محمد علي',
            specialty: 'استشاري القلب والأوعية الدموية',
            phone: '+20 122 345 6789',
            address: '15 شارع التحرير، الدقي، الجيزة',
            workingHours: 'من السبت إلى الخميس: 9 صباحًا - 9 مساءً',
            languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
            bio: 'دكتوراه في أمراض القلب والأوعية الدموية مع أكثر من 15 عامًا من الخبرة في تشخيص وعلاج أمراض القلب.',
            image: null
        },
        experiences: [
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
        ],
        certificates: [
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
        ],
        ratings: [
            { id: 1, patient: 'محمد عبدالله', rating: 5, comment: 'طبيب ممتاز ومحترف جدًا' },
            { id: 2, patient: 'أميرة محمد', rating: 4, comment: 'شرح واضح وعلاج فعال' },
            { id: 3, patient: 'أحمد علي', rating: 4, comment: 'تشخيص دقيق وعلاج ناجح' },
            { id: 4, patient: 'سارة محمود', rating: 3, comment: 'جيد ولكن الانتظار طويل' },
            { id: 5, patient: 'خالد عمر', rating: 1, comment: 'لم يعجبني التعامل' }
        ]
    };

    const savedData = loadData();
    const [profile, setProfile] = useState(savedData?.profile || initialData.profile);
    const [experiences, setExperiences] = useState(savedData?.experiences || initialData.experiences);
    const [certificates, setCertificates] = useState(savedData?.certificates || initialData.certificates);
    const [ratings] = useState(initialData.ratings);
    const [editMode, setEditMode] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState('');
    const [expandedCertificates, setExpandedCertificates] = useState([]);
    const [expandedExperiences, setExpandedExperiences] = useState([]);
    const [newCertificate, setNewCertificate] = useState({ name: '', institution: '', year: '', image: null });
    const [newExperience, setNewExperience] = useState({ position: '', hospital: '', period: '', description: '' });
    const [showCertificateForm, setShowCertificateForm] = useState(false);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    const imageInputRef = useRef(null);
    const certificateInputRef = useRef(null);

    useEffect(() => {
        const dataToSave = {
            profile,
            experiences,
            certificates
        };
        localStorage.setItem('doctorProfileData', JSON.stringify(dataToSave));
    }, [profile, experiences, certificates]);

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;

                if (field === 'profile') {
                    setProfile({ ...profile, image: imageData });
                } else if (field === 'newCertificate') {
                    setNewCertificate({ ...newCertificate, image: imageData });
                } else {
                    setCertificates(certificates.map(cert =>
                        cert.id === field ? { ...cert, image: imageData } : cert
                    ));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const startEditing = (field, value) => {
        setEditingField(field);
        setTempValue(typeof value === 'object' ? value.join(', ') : value);
    };

    const saveEdit = () => {
        if (editingField === 'languages') {
            setProfile({ ...profile, languages: tempValue.split(',').map(lang => lang.trim()) });
        } else {
            setProfile({ ...profile, [editingField]: tempValue });
        }
        setEditingField(null);
    };

    const cancelEdit = () => {
        setEditingField(null);
    };

    const toggleCertificate = (id) => {
        setExpandedCertificates(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleExperience = (id) => {
        setExpandedExperiences(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleImageExpansion = (imageUrl) => {
        setExpandedImage(expandedImage === imageUrl ? null : imageUrl);
    };

    const addCertificate = () => {
        if (newCertificate.name.trim()) {
            setCertificates([...certificates, { ...newCertificate, id: Date.now() }]);
            setNewCertificate({ name: '', institution: '', year: '', image: null });
            setShowCertificateForm(false);
            if (certificateInputRef.current) {
                certificateInputRef.current.value = '';
            }
        }
    };

    const removeCertificate = (id) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const addExperience = () => {
        if (newExperience.position.trim()) {
            setExperiences([...experiences, { ...newExperience, id: Date.now() }]);
            setNewExperience({ position: '', hospital: '', period: '', description: '' });
            setShowExperienceForm(false);
        }
    };

    const removeExperience = (id) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <motion.span key={i} whileHover={{ scale: 1.2 }}>
                <FaStar className={`transition-all duration-300 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            </motion.span>
        ));
    };

    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            style={{ direction: 'rtl', fontFamily: "'Tajawal', sans-serif" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="flex justify-between items-center mb-8 p-6 rounded-xl bg-[#26A69A] text-white shadow-lg"
                variants={itemVariants}
            >
                <h1 className="text-2xl font-bold">البروفايل الطبي</h1>
                <div className="flex gap-4">
                    <motion.button
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg ${editMode ? 'text-[#26A69A] hover:bg-[#00695C]' : 'bg-[#00695C] hover:bg-[#004D40]'} text-[#00695C] font-medium transition-all hover:shadow-md`}
                        onClick={() => setEditMode(!editMode)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {editMode ? <><FaSave /> حفظ التغييرات</> : <><FaEdit /> تعديل البروفايل</>}
                    </motion.button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <motion.div
                        className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                    >
                        <div className="relative flex flex-col items-center p-6">
                            <motion.div
                                className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#26A69A] shadow-lg"
                                whileHover={{ scale: 1.05 }}
                            >
                                <OptimizedImage
                                    src={profile.image}
                                    alt={profile.name}
                                    className="w-full h-full"
                                    placeholder={FaUserMd}
                                />
                            </motion.div>
                            {editMode && (
                                <motion.label
                                    className="absolute bottom-4 right-39 md:right-94 bg-[#00695C] text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-[#004D40] transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaCamera />
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        onChange={(e) => handleImageUpload(e, 'profile')}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </motion.label>
                            )}
                        </div>

                        <div className="text-center pb-6 border-b border-gray-200 px-6">
                            {editingField === 'name' ? (
                                <motion.div className="mb-4" variants={itemVariants}>
                                    <input
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                    />
                                    <div className="flex justify-center gap-2 mt-2">
                                        <motion.button
                                            onClick={saveEdit}
                                            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaSave /> حفظ
                                        </motion.button>
                                        <motion.button
                                            onClick={cancelEdit}
                                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaTimes />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="flex justify-center items-center gap-3 mb-4"
                                    variants={itemVariants}
                                >
                                    <h2 className="text-3xl font-bold text-[#26A69A]">{profile.name}</h2>
                                    {editMode && (
                                        <motion.button
                                            className="text-[#26A69A] hover:text-[#00695C] transition-colors"
                                            onClick={() => startEditing('name', profile.name)}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaEdit />
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}

                            {editingField === 'specialty' ? (
                                <motion.div className="mb-4" variants={itemVariants}>
                                    <input
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                    />
                                    <div className="flex justify-center gap-2 mt-2">
                                        <motion.button
                                            onClick={saveEdit}
                                            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaSave />
                                        </motion.button>
                                        <motion.button
                                            onClick={cancelEdit}
                                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaTimes />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="flex justify-center items-center gap-3 mb-6"
                                    variants={itemVariants}
                                >
                                    <p className="text-xl text-[#26A69A] font-medium relative pb-2">
                                        {profile.specialty}
                                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-green-400 rounded-full"></span>
                                    </p>
                                    {editMode && (
                                        <motion.button
                                            className="text-[#26A69A] hover:text-[#00695C] transition-colors"
                                            onClick={() => startEditing('specialty', profile.specialty)}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaEdit />
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {editingField === 'bio' ? (
                            <motion.div className="p-6" variants={itemVariants}>
                                <textarea
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] min-h-[120px]"
                                />
                                <div className="flex justify-between gap-2 mt-2">
                                    <motion.button
                                        onClick={saveEdit}
                                        className="px-3 py-1 bg-green-100 text-green-600 rounded-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaSave />
                                    </motion.button>
                                    <motion.button
                                        onClick={cancelEdit}
                                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaTimes />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex flex-col items-center p-6"
                                variants={itemVariants}
                            >
                                <p className="text-gray-600 text-lg leading-relaxed text-center">{profile.bio}</p>
                                {editMode && (
                                    <motion.button
                                        className="mt-4 text-[#26A69A] hover:text-[#00695C] transition-colors"
                                        onClick={() => startEditing('bio', profile.bio)}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaEdit />
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            {[
                                { icon: <FaPhone />, field: 'phone', value: profile.phone },
                                { icon: <FaMapMarkerAlt />, field: 'address', value: profile.address },
                                { icon: <FaClock />, field: 'workingHours', value: profile.workingHours },
                                { icon: <FaLanguage />, field: 'languages', value: profile.languages.join(', ') }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.field}
                                    className="flex items-center gap-4 p-4 bg-[#26A69A] text-white rounded-lg shadow"
                                    variants={itemVariants}
                                    custom={index}
                                >
                                    <div className="text-2xl">{item.icon}</div>
                                    {editingField === item.field ? (
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                className="w-full px-3 py-1 bg-[#00695C] border border-[#26A69A] rounded text-white"
                                            />
                                            <div className="flex justify-between gap-2 mt-2">
                                                <motion.button
                                                    onClick={saveEdit}
                                                    className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaSave />
                                                </motion.button>
                                                <motion.button
                                                    onClick={cancelEdit}
                                                    className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaTimes />
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span>{item.field === 'languages' ? profile.languages.join('، ') : item.value}</span>
                                            {editMode && (
                                                <motion.button
                                                    className="text-[#26A69A] hover:text-[#00695C] transition-colors"
                                                    onClick={() => startEditing(item.field, item.field === 'languages' ? profile.languages : item.value)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FaEdit />
                                                </motion.button>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-[#26A69A] flex items-center gap-2">
                                    <FaBriefcase /> الخبرات العملية
                                </h3>
                                {editMode && (
                                    <motion.button
                                        className="flex items-center gap-1 px-4 py-2 text-[#26A69A] rounded-lg hover:bg-[#004D40] transition-colors"
                                        onClick={() => setShowExperienceForm(!showExperienceForm)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaPlus /> {showExperienceForm ? 'إلغاء' : 'إضافة خبرة'}
                                    </motion.button>
                                )}
                            </div>

                            <AnimatePresence>
                                {showExperienceForm && (
                                    <motion.div
                                        className="bg-[#E0F7FA] p-4 rounded-lg mb-6"
                                        variants={expandVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">المسمى الوظيفي:</label>
                                            <input
                                                type="text"
                                                value={newExperience.position}
                                                onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                                placeholder="مثال: استشاري القلب"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">اسم المستشفى/المؤسسة:</label>
                                            <input
                                                type="text"
                                                value={newExperience.hospital}
                                                onChange={(e) => setNewExperience({ ...newExperience, hospital: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                                placeholder="مثال: مستشفى القاهرة الجديدة"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">الفترة الزمنية:</label>
                                            <input
                                                type="text"
                                                value={newExperience.period}
                                                onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                                placeholder="مثال: 2020 - حتى الآن"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">وصف الخبرة:</label>
                                            <textarea
                                                value={newExperience.description}
                                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] min-h-[100px]"
                                                placeholder="وصف مختصر للمهام والمسؤوليات"
                                            />
                                        </div>
                                        <motion.button
                                            className="w-full py-2 bg-[#26A69A] text-white rounded-lg"
                                            onClick={addExperience}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            حفظ الخبرة
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={exp.id}
                                        className="bg-[#26A69A] p-4 rounded-lg border border-gray-200"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={index}
                                        whileHover="hover"
                                    >
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleExperience(exp.id)}
                                        >
                                            <h4 className="font-semibold text-gray-800">{exp.position}</h4>
                                            <div className="flex items-center gap-2">
                                                {editMode && (
                                                    <motion.button
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeExperience(exp.id);
                                                        }}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FaTrash />
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    className="text-[#26A69A] hover:text-[#00695C] transition-colors"
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {expandedExperiences.includes(exp.id) ?
                                                        <FaChevronUp /> : <FaChevronDown />}
                                                </motion.button>
                                            </div>
                                        </div>
                                        <p className="text-white mt-1">{exp.hospital} | {exp.period}</p>

                                        <AnimatePresence>
                                            {expandedExperiences.includes(exp.id) && (
                                                <motion.div
                                                    className="pt-3 mt-3 border-t border-gray-200"
                                                    variants={expandVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                >
                                                    <p className="text-white">{exp.description}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-[#26A69A] flex items-center gap-2">
                                    <FaGraduationCap /> الشهادات والمؤهلات
                                </h3>
                                {editMode && (
                                    <motion.button
                                        className="flex items-center gap-1 px-4 py-2  text-[#26A69A] rounded-lg hover:bg-[#004D40] transition-colors"
                                        onClick={() => setShowCertificateForm(!showCertificateForm)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaPlus /> {showCertificateForm ? 'إلغاء' : 'إضافة شهادة'}
                                    </motion.button>
                                )}
                            </div>

                            <AnimatePresence>
                                {showCertificateForm && (
                                    <motion.div
                                        className="bg-[#E0F7FA] p-4 rounded-lg mb-6"
                                        variants={expandVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">اسم الشهادة:</label>
                                            <input
                                                type="text"
                                                value={newCertificate.name}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                                placeholder="مثال: دكتوراه في أمراض القلب"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">اسم المؤسسة:</label>
                                            <input
                                                type="text"
                                                value={newCertificate.institution}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, institution: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                                placeholder="مثال: جامعة القاهرة"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">سنة الحصول:</label>
                                            <input
                                                type="text"
                                                value={newCertificate.year}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, year: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A]"
                                                placeholder="مثال: 2015"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">صورة الشهادة:</label>
                                            <motion.label
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00695C] text-white rounded-lg cursor-pointer hover:bg-[#004D40] transition-colors w-max"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaCamera /> {newCertificate.image ? 'تغيير الصورة' : 'اختر صورة'}
                                                <input
                                                    type="file"
                                                    ref={certificateInputRef}
                                                    onChange={(e) => handleImageUpload(e, 'newCertificate')}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </motion.label>
                                            {newCertificate.image && (
                                                <div className="mt-3 text-center">
                                                    <motion.img
                                                        src={newCertificate.image}
                                                        alt="معاينة صورة الشهادة"
                                                        className="max-w-full max-h-40 rounded border border-gray-300 cursor-pointer mx-auto"
                                                        onClick={() => toggleImageExpansion(newCertificate.image)}
                                                        whileHover={{ scale: 1.02 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <motion.button
                                            className="w-full py-2 bg-[#26A69A] text-white rounded-lg"
                                            onClick={addCertificate}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            حفظ الشهادة
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certificates.map((cert, index) => (
                                    <motion.div
                                        key={cert.id}
                                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={index}
                                        whileHover="hover"
                                    >
                                        <div className="flex gap-4">
                                            {cert.image ? (
                                                <motion.div
                                                    className="w-24 h-24 rounded overflow-hidden border border-gray-200 cursor-pointer flex-shrink-0"
                                                    onClick={() => toggleImageExpansion(cert.image)}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <img
                                                        src={cert.image}
                                                        alt={cert.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="w-24 h-24 bg-[#E0F7FA] rounded flex items-center justify-center text-[#26A69A] flex-shrink-0">
                                                    <FaGraduationCap className="text-3xl" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-gray-600 text-sm truncate">{cert.institution}</span>
                                                    <span className="text-[#26A69A] font-medium">{cert.year}</span>
                                                </div>
                                                {editMode && (
                                                    <div className="flex justify-between items-center mt-3">
                                                        <motion.label
                                                            className="text-[#00695C] hover:text-[#004D40] cursor-pointer"
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FaCamera />
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleImageUpload(e, cert.id)}
                                                                accept="image/*"
                                                                className="hidden"
                                                            />
                                                        </motion.label>
                                                        <motion.button
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeCertificate(cert.id);
                                                            }}
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FaTrash />
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-1">
                    <motion.div
                        className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-[#26A69A] flex items-center gap-2">
                                <FaStar /> تقييمات المرضى
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {ratings.map((rating, index) => (
                                <motion.div
                                    key={rating.id}
                                    className="bg-[#26A69A] p-4 rounded-lg border border-gray-200 hover:bg-[#409a91] transition-colors"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-800">{rating.patient}</span>
                                        <div className="flex gap-1">
                                            {renderStars(rating.rating)}
                                        </div>
                                    </div>
                                    <p className="text-white text-sm">{rating.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-4 bg-[#26A69A] text-white flex items-center justify-center gap-4">
                            <div className="flex gap-1">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <span className="font-medium">{averageRating.toFixed(1)} ({ratings.length} تقييم)</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                        onClick={() => setExpandedImage(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative max-w-4xl max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.button
                                className="absolute -top-12 left-0 text-red-500  w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                onClick={() => setExpandedImage(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes />
                            </motion.button>
                            <motion.img
                                src={expandedImage}
                                alt="صورة موسعة"
                                className="max-w-full max-h-[80vh] rounded-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DoctorProfile;