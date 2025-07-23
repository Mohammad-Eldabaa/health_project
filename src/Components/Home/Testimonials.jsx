import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from "react";
import { FaUserCircle, FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  
  const testimonials = [
    {
      name: "محمد أحمد",
      role: "مريض سابق",
      rating: 3,
      comment: "الدكتور أحمد من أفضل الأطباء الذين تعاملت معهم، شرح وافي ودقيق للحالة وقدم خطة علاج ممتازة."
    },
    {
      name: "سارة خالد",
      role: "مريضة",
      rating: 4,
      comment: "الرعاية المقدمة ممتازة والطبيب محترف جداً في التشخيص والمتابعة، أنصح الجميع به."
    },
    {
      name: "علي محمود",
      role: "مرافق مريض",
      rating: 2,
      comment: "العيادة نظيفة والمواعيد دقيقة، الدكتور متابع لكل التفاصيل ويعطي وقت كافي لكل مريض."
    },
    {
      name: "نورا سعد",
      role: "مريضة",
      rating: 5,
      comment: "تجربة ممتازة من جميع النواحي، الخدمة الذكية في الحجز سهلت علي الكثير."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <section className="py-16 md:py-20 bg-white w-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#B2EBF2] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0097A7] mb-3 md:mb-4">
            آراء عملائنا
          </h2>
          <div className="w-20 md:w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-4 md:mb-5"></div>
          <p className="text-[#757575] text-base md:text-lg max-w-2xl mx-auto">
            تقييمات المرضى الذين استفادوا من خدمات عيادتنا
          </p>
        </motion.div>

        <div className="relative h-[380px] sm:h-[320px] md:h-[280px]">
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center text-[#009688] hover:bg-[#E0F7FA] transition -ml-2 sm:-ml-4"
            aria-label="السابق"
          >
            <FaChevronLeft className="text-sm sm:text-base" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center text-[#009688] hover:bg-[#E0F7FA] transition -mr-2 sm:-mr-4"
            aria-label="التالي"
          >
            <FaChevronRight className="text-sm sm:text-base" />
          </button>

          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 px-2 sm:px-4"
            >
              <div className="bg-[#E0F7FA] rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 h-full">
                <div className="flex-shrink-0 text-[#0097A7]">
                  <FaUserCircle className="text-6xl sm:text-7xl md:text-8xl opacity-80" />
                </div>
                
                <div className="text-center md:text-right flex-1">
                  <FaQuoteLeft className="text-[#009688] text-xl md:text-2xl mb-3 md:mb-4 mx-auto md:mx-0" />
                  
                  <p className="text-[#757575] text-sm sm:text-base md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                    {testimonials[currentIndex].comment}
                  </p>
                  
                  <div className="mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`inline-block mx-0.5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        size={18}
                      />
                    ))}
                  </div>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#212121] mb-1">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-[#0097A7] text-sm md:text-base">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-6 md:mt-8 gap-1.5 md:gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${currentIndex === index ? 'bg-[#009688] w-4 md:w-6' : 'bg-[#B2EBF2] hover:bg-[#80DEEA]'}`}
              aria-label={`انتقل إلى التقييم ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}