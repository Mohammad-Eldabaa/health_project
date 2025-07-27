import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DoctorProfileHeader from './DoctorProfileHeader';
import DoctorProfileInfo from './DoctorProfileInfo';
import DoctorExperience from './DoctorExperience';
import DoctorCertificates from './DoctorCertificates';
import DoctorRatings from './DoctorRatings';
import ExpandedImageView from './ExpandedImageView';
import './DoctorProfile.css';

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
    experiences: [
      {
        id: 1,
        position: 'استشاري القلب والأوعية الدموية',
        hospital: 'مستشفى القاهرة الجديدة',
        period: '2020 - حتى الآن',
        description: 'تشخيص وعلاج حالات القلب المعقدة وإجراء القسطرة القلبية',
      },
      {
        id: 2,
        position: 'طبيب قلب أول',
        hospital: 'مستشفى الجامعة',
        period: '2015 - 2020',
        description: 'علاج المرضى الداخليين والإشراف على الأطباء المقيمين',
      },
    ],
    certificates: [
      {
        id: 1,
        name: 'دكتوراه في أمراض القلب',
        institution: 'جامعة القاهرة',
        year: '2014',
        image: null,
      },
      {
        id: 2,
        name: 'زمالة الكلية الملكية للأطباء',
        institution: 'لندن، المملكة المتحدة',
        year: '2012',
        image: null,
      },
    ],
    ratings: [
      { id: 1, patient: 'محمد عبدالله', rating: 5, comment: 'طبيب ممتاز ومحترف جدًا' },
      { id: 2, patient: 'أميرة محمد', rating: 4, comment: 'شرح واضح وعلاج فعال' },
      { id: 3, patient: 'أحمد علي', rating: 4, comment: 'تشخيص دقيق وعلاج ناجح' },
      { id: 4, patient: 'سارة محمود', rating: 3, comment: 'جيد ولكن الانتظار طويل' },
      { id: 5, patient: 'خالد عمر', rating: 1, comment: 'لم يعجبني التعامل' },
    ],
  };

  const savedData = loadData();
  const [experiences, setExperiences] = useState(savedData?.experiences || initialData.experiences);
  const [certificates, setCertificates] = useState(savedData?.certificates || initialData.certificates);
  const [ratings] = useState(initialData.ratings);
  const [editMode, setEditMode] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const dataToSave = {
      experiences,
      certificates,
    };
    localStorage.setItem('doctorProfileData', JSON.stringify(dataToSave));
  }, [experiences, certificates]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
      },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-[#E0F7FA]"
      style={{
        direction: 'rtl',
        fontFamily: "'Tajawal', sans-serif",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DoctorProfileHeader editMode={editMode} setEditMode={setEditMode} variants={itemVariants} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <DoctorProfileInfo editMode={editMode} variants={itemVariants} />

            <DoctorExperience
              experiences={experiences}
              setExperiences={setExperiences}
              editMode={editMode}
              variants={itemVariants}
              cardVariants={cardVariants}
            />

            <DoctorCertificates
              certificates={certificates}
              setCertificates={setCertificates}
              editMode={editMode}
              setExpandedImage={setExpandedImage}
              variants={itemVariants}
              cardVariants={cardVariants}
            />
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <DoctorRatings ratings={ratings} variants={cardVariants} itemVariants={itemVariants} />
        </div>
      </div>

      <ExpandedImageView expandedImage={expandedImage} setExpandedImage={setExpandedImage} />
    </motion.div>
  );
};

export default DoctorProfile;
