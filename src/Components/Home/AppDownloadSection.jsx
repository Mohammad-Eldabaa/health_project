import { motion } from "framer-motion";
import { FaMobileAlt, FaBell, FaCalendarAlt, FaDownload, FaApple, FaGooglePlay } from 'react-icons/fa';
import QRCode from "react-qr-code";

const AppDownloadSection = () => {
  return (
    <section className="py-16 bg-[#E0F7FA] w-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00BCD4] opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Content */}
            <div className="md:w-1/2 p-8 md:p-10 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0097A7] mb-4">
                حمل تطبيق العيادة الذكية
              </h2>
              <p className="text-[#757575] mb-6">
                تواصل مع الدكتور مباشرة، احجز مواعيدك، تابع حالتك الصحية وحصل على نصائح طبية من خلال تطبيقنا.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[#00BCD4] to-[#009688] p-3 rounded-lg mr-4">
                    <FaMobileAlt className="text-white text-2xl" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-[#212121]  text-lg">سهولة التواصل</h3>
                    <p className="text-[#757575]">محادثة مباشرة مع الطبيب عبر التطبيق</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[#00BCD4] to-[#009688] p-3 rounded-lg mr-4">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-[#212121] text-lg">حجز المواعيد</h3>
                    <p className="text-[#757575]">احجز موعدك في أي وقت ومن أي مكان</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[#00BCD4] to-[#009688] p-3 rounded-lg mr-4">
                    <FaBell className="text-white text-2xl" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-[#212121] text-lg">متابعة مستمرة</h3>
                    <p className="text-[#757575]">تذكيرات بالمواعيد والجرعات الدوائية</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="bg-[#009688] text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <FaApple className="text-xl" />
                  <span>App Store</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="bg-[#212121] text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <FaGooglePlay className="text-xl" />
                  <span>Google Play</span>
                </motion.a>
              </div>
            </div>

            {/* Right Side - QR Code */}
            <div className="md:w-1/2 bg-gradient-to-br from-[#0097A7] to-[#009688] p-8 md:p-10 flex flex-col items-center justify-center">
              <div className="text-center text-white mb-6">
                <h3 className="text-xl md:text-2xl font-bold mb-2">مسح الكود للتحميل</h3>
                <p className="text-[#B2EBF2]">استخدم كاميرا هاتفك لمسح QR Code</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <QRCode 
                  value="https://yourclinicapp.com/download" 
                  size={180}
                  level="H"
                  fgColor="#009688"
                  bgColor="#ffffff"
                />
              </div>

              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownloadSection;