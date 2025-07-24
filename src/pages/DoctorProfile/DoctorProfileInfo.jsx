import React, { useState, useRef } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaLanguage, FaUserMd, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

const DoctorProfileInfo = ({ profile, setProfile, editMode, variants }) => {
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState('');
    const imageInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                setProfile({ ...profile, image: imageData });
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

    return (
        <>
            <div className="relative flex flex-col items-center p-6">
                <motion.div
                    className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg"
                    style={{
                        background: 'linear-gradient(135deg, #0097A7 0%, #006064 100%)'
                    }}
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
                        className="absolute bottom-4 right-39 md:right-94 bg-[#006064] text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-[#00838F] transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaCamera />
                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </motion.label>
                )}
            </div>

            <div className="text-center pb-6 border-b border-gray-200 px-6">
                {editingField === 'name' ? (
                    <motion.div className="mb-4" variants={variants}>
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
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
                        variants={variants}
                    >
                        <h2 className="text-3xl font-bold text-[#0097A7]">{profile.name}</h2>
                        {editMode && (
                            <motion.button
                                className="text-[#0097A7] hover:text-[#006064] transition-colors"
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
                    <motion.div className="mb-4" variants={variants}>
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
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
                        variants={variants}
                    >
                        <p className="text-xl text-[#0097A7] font-medium relative pb-2">
                            {profile.specialty}
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#4DD0E1] rounded-full"></span>
                        </p>
                        {editMode && (
                            <motion.button
                                className="text-[#0097A7] hover:text-[#006064] transition-colors"
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
                <motion.div className="p-6" variants={variants}>
                    <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7] min-h-[120px]"
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
                    variants={variants}
                >
                    <p className="text-gray-600 text-lg leading-relaxed text-center">{profile.bio}</p>
                    {editMode && (
                        <motion.button
                            className="mt-4 text-[#0097A7] hover:text-[#006064] transition-colors"
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
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#0097A7] to-[#006064] text-white rounded-lg shadow"
                        variants={variants}
                        custom={index}
                    >
                        <div className="text-2xl">{item.icon}</div>
                        {editingField === item.field ? (
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className="w-full px-3 py-1 bg-[#006064] border border-[#0097A7] rounded text-white"
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
                                        className="text-[#B2EBF2] hover:text-white transition-colors"
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
        </>
    );
};

export default DoctorProfileInfo;