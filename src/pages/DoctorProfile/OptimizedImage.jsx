import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserMd } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OptimizedImage = ({ src, alt, className, placeholder: Placeholder = FaUserMd, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <Helmet>
        <title>{alt ? `${alt} - صورة محسنة` : 'صورة محسنة - نظام المواعيد الطبية'}</title>
        <meta name="description" content="عرض صورة محسنة لملفات الأطباء أو الشهادات الطبية في نظام المواعيد الطبية." />
        <meta name="keywords" content="صورة محسنة, ملف الطبيب, شهادات طبية, نظام عيادة, برمجيات طبية" />
        <meta name="robots" content="noindex, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content={alt ? `${alt} - صورة محسنة` : 'صورة محسنة - نظام المواعيد الطبية'} />
        <meta
          property="og:description"
          content="عرض صور محسنة بكفاءة لملفات الأطباء أو الشهادات في نظام متقدم لإدارة العيادات."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={alt ? `${alt} - صورة محسنة` : 'صورة محسنة - نظام المواعيد الطبية'} />
        <meta
          name="twitter:description"
          content="عرض صور محسنة لملفات الأطباء أو الشهادات بسهولة في نظام المواعيد الطبية."
        />
      </Helmet>

      {(!loaded || error || !src) && (
        <div
          className={`${className} flex items-center justify-center bg-gradient-to-br from-[#0097A7] to-[#006064] text-white`}
        >
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

export default OptimizedImage;
