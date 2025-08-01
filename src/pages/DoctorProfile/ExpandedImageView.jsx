import React from 'react';
import { Helmet } from 'react-helmet';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ExpandedImageView = ({ expandedImage, setExpandedImage }) => {
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
      },
    },
  };

  return (
    <AnimatePresence>
      {expandedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Helmet>
            <title>عرض صورة موسعة - نظام المواعيد الطبية</title>
            <meta
              name="description"
              content="عرض الصور الموسعة لشهادات الأطباء أو الملفات الشخصية في نظام المواعيد الطبية."
            />
            <meta name="keywords" content="عرض صورة, شهادات طبية, ملف الطبيب, نظام عيادة, برمجيات طبية" />
            <meta name="robots" content="noindex, follow" />
            <meta name="author" content="نظام إدارة العيادات" />
            <meta property="og:title" content="عرض صورة موسعة - نظام المواعيد الطبية" />
            <meta
              property="og:description"
              content="عرض تفاصيل الصور المرتبطة بملفات الأطباء أو الشهادات الطبية في نظام متقدم لإدارة العيادات."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:locale" content="ar_EG" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="عرض صورة موسعة - نظام المواعيد الطبية" />
            <meta
              name="twitter:description"
              content="عرض الصور الموسعة لشهادات أو ملفات الأطباء بسهولة في نظام المواعيد الطبية."
            />
          </Helmet>

          <motion.div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={e => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              className="absolute -top-12 left-0 text-white bg-[#0097A7] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#006064] transition-colors"
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
  );
};

export default ExpandedImageView;
