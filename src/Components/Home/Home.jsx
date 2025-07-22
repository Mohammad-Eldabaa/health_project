
import Style from './Home.module.css'
import { TypeAnimation } from 'react-type-animation';
import { motion , AnimatePresence } from 'framer-motion';
import { useEffect, useState } from "react";
import { FaStethoscope,FaPhone,FaVideo, FaFileMedicalAlt, FaBell, FaEnvelope, FaWhatsapp, FaClock, FaMapMarkerAlt ,
   FaClinicMedical, FaHeartbeat, FaLungs, FaBrain, FaXRay,FaQuoteLeft,  FaChevronLeft, FaChevronRight ,  FaUserMd, FaCalendarAlt,FaShieldAlt, FaStar, FaMobileAlt } from 'react-icons/fa';



import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function Home() {

  // our team section code 
   const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const testimonials = [
    {
      name: "محمد أحمد",
      role: "مريض سابق",
      rating: 5,
      comment: "الدكتور أحمد من أفضل الأطباء الذين تعاملت معهم، شرح وافي ودقيق للحالة وقدم خطة علاج ممتازة.",
      image: "/src/assets/img/doctor-ahmed.jpg"
    },
    {
      name: "سارة خالد",
      role: "مريضة",
      rating: 4,
      comment: "الرعاية المقدمة ممتازة والطبيب محترف جداً في التشخيص والمتابعة، أنصح الجميع به.",
      image: "/src/assets/img/doctor-sara.jpg"
    },
    {
      name: "علي محمود",
      role: "مرافق مريض",
      rating: 5,
      comment: "العيادة نظيفة والمواعيد دقيقة، الدكتور متابع لكل التفاصيل ويعطي وقت كافي لكل مريض.",
      image: "/src/assets/img/doctor-lmya.jpg"
    },
    {
      name: "يوسف عبدالله",
      role: "مريضة",
      rating: 5,
      comment: "تجربة ممتازة من جميع النواحي، الخدمة الذكية في الحجز سهلت علي الكثير.",
      image: "/src/assets/img//doctor-yousef.jpg"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

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
      x: direction > 0 ? 1000 : -1000,
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
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  // end our team section code


  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5
  });

  const stats = [
    { number: 12, title: "سنوات الخبرة" },
    
    { number: 10000, title: "مريض راضٍ" },
    { number: "24/7", title: "خدمة الطوارئ" }
  ];



  // const doctors = [
  //   {
  //     name: "د. أحمد عبد العزيز",
  //     specialty: "استشاري الباطنة والقلب",
  //     image: "/src/assets/img/doctor-ahmed.jpg",
  //     bio: "خبرة 15 عاماً في تشخيص وعلاج أمراض القلب والجهاز الهضمي، حاصل على البورد الأمريكي في الطب الباطني.",
  //     profileLink: "/doctors/ahmed-abdulaziz"
  //   },
  //   {
  //     name: "د. سارة خالد",
  //     specialty: "استشارية طب الأطفال",
  //     image: "/src/assets/img/doctor-sara.jpg",
  //     bio: "متخصصة في حديثي الولادة والرعاية الصحية للأطفال، حاصلة على شهادة الزمالة البريطانية في طب الأطفال.",
  //     profileLink: "/doctors/sara-khaled"
  //   },
  //   {
  //     name: "د. يوسف هشام",
  //     specialty: "جراح تجميل الأسنان",
  //     image: "/src/assets/img/doctor-yousef.jpg",
  //     bio: "خبير في زراعة وتجميل الأسنان باستخدام أحدث التقنيات العالمية، عضو الجمعية الأمريكية لجراحي الأسنان.",
  //     profileLink: "/doctors/youssef-abdullah"
  //   },
  //   {
  //     name: "د. لمى فاروق",
  //     specialty: "استشارية الجلدية",
  //     image: "/src/assets/img/doctor-lmya.jpg",
  //     bio: "متخصصة في علاج الأمراض الجلدية والليزر والتجميل غير الجراحي، حاصلة على الماجستير من جامعة هارفارد.",
  //     profileLink: "/doctors/lama-farouk"
  //   }
  // ];
  const features = [
    {
      icon: <FaClock className="text-3xl" />,
      title: "طوارئ 24/7",
      description: "خدمة طوارئ متاحة على مدار الساعة طوال أيام الأسبوع مع فريق طبي متخصص"
    },
    {
      icon: <FaUserMd className="text-3xl" />,
      title: "أطباء معتمدون",
      description: "فريق من الأطباء الاستشاريين الحاصلين على أعلى الشهادات والتدريبات العالمية"
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "حجوزات أونلاين",
      description: "نظام حجز إلكتروني متطور يمكنك من اختيار الطبيب والموعد المناسبين بسهولة"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "بيئة نظيفة وآمنة",
      description: "عيادة مطابقة لأعلى معايير النظافة والتعقيم لضمان سلامة المرضى"
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "جودة الخدمة",
      description: "التزامنا بتقديم أفضل رعاية طبية وفق أحدث البروتوكولات العالمية"
    },
    {
      icon: <FaClinicMedical className="text-3xl" />,
      title: "تكنولوجيا متطورة",
      description: "أجهزة طبية حديثة وتقنيات تشخيصية متقدمة لنتائج دقيقة"
    }
  ];
 const doctor = {
    name: "د. أحمد عبد العزيز",
    specialty: "استشاري باطنة وأمراض قلب",
    image: "/src/assets/img/doctor-ahmed.jpg",
    bio: "طبيب استشاري بأمراض الباطنة والقلب، حاصل على البورد الأمريكي في الطب الباطني والزمالة البريطانية في أمراض القلب. يتمتع بخبرة تزيد عن 15 عاماً في تشخيص وعلاج الحالات الحرجة والمزمنة.",
    services: [
      {
        title: "الكشف الطبي العام",
        icon: <FaStethoscope className="text-3xl" />,
        description: "فحص شامل وتشخيص دقيق للحالات العامة مع وضع خطة علاجية متكاملة"
      },
      {
        title: "أمراض القلب",
        icon: <FaHeartbeat className="text-3xl" />,
        description: "تشخيص وعلاج أمراض القلب والشرايين وارتفاع ضغط الدم"
      },
      {
        title: "أمراض الصدر",
        icon: <FaLungs className="text-3xl" />,
        description: "علاج أمراض الجهاز التنفسي والرئتين والربو الشعبي"
      },
      {
        title: "الضغط والسكري",
        icon: <FaClinicMedical className="text-3xl" />,
        description: "متابعة وعلاج حالات الضغط والسكري والدهون بالدم"
      },
      {
        title: "الفحوصات الدورية",
        icon: <FaXRay className="text-3xl" />,
        description: "برامج فحص دوري شامل للكبار مع تحليل النتائج"
      },
      {
        title: "الاستشارات الطبية",
        icon: <FaBrain className="text-3xl" />,
        description: "استشارات طبية متخصصة عن بعد لمتابعة الحالات"
      }
    ],
    smartFeatures: [
      {
        title: "حجز مواعيد أونلاين",
        icon: <FaCalendarAlt className="text-2xl" />
      },
      {
        title: "استشارات عن بعد",
        icon: <FaMobileAlt className="text-2xl" />
      },
      {
        title: "متابعة النتائج",
        icon: <FaClinicMedical className="text-2xl" />
      },
      {
        title: "تذكير بالمواعيد",
        icon: <FaUserMd className="text-2xl" />
      }
    ]
  };

  return (
    <>


      <section className='hero w-screen h-screen overflow-x-hidden'>
        <div className="relative w-screen h-screen overflow-hidden">
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/src/assets/video/bgVideo.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Overlay with primary-dark color */}
          <div className="absolute top-0 left-0 w-full h-full opacity-15 bg-[#0097A7] z-10"></div>

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <TypeAnimation
              sequence={[
                'مرحبا بك في عيادتنا',
                4000,
                '',
                1000,
                'صحتك هي أولويتنا',
                4000,
                '',
                1000,
              ]}
              wrapper="h1"
              cursor={true}
              repeat={Infinity}
              speed={1}
              deletionSpeed={30}
              className="text-3xl md:text-5xl text-white font-bold text-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white text-lg md:text-xl pt-6 mb-6 max-w-xl"
            >
              صحتك هي أولويتنا نحن هنا لتقديم الرعاية الصحية التي تحتاجها <br /> استمتع بتجربة طبية مبتكرة وسهلة الاستخدام
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#212121] px-8 py-3 rounded-lg text-lg  hover:text-white hover:bg-[#0097A7] transition duration-300 shadow-md"
              >
                احجز موعدك الآن <i className="fa-solid fa-calendar-check"></i>
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.0,
                  backgroundColor: "#009688",
                  borderColor: "transparent"
                }}
                whileTap={{ scale: 1 }}
                className="bg-transparent border-2  text-white px-8 py-3 rounded-lg text-lg hover:bg-[#009688] hover:border-[#009688]  transition duration-100 shadow-md"
              >
                اتصل بنا <i className="fa-solid  fa-phone"></i>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Clinic Section - Updated */}
      {/* Modern Full-Width About Clinic Section */}
      <section className="py-20 w-screen overflow-x-hidden bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#0097A7] mb-4">حول العيادة</h2>
            <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full"></div>
          </motion.div>

          <div className="flex flex-col gap-8 md:flex-row items-center mb-16">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <div className="bg-[#E0F7FA] p-8 rounded-xl shadow-sm border border-[#B2EBF2]">
                <h3 className="text-2xl font-bold text-[#0097A7] mb-4">نظرة عامة</h3>
                <p className="text-[#757575] leading-relaxed text-lg">
                  عيادة الشفاء مركز طبي متكامل يقدم رعاية صحية عالية الجودة منذ عام 2010. نتميز بفريق طبي متخصص وبيئة علاجية مجهزة بأحدث التقنيات الطبية، مع التركيز على الراحة النفسية للمرضى وتقديم خدمة شخصية.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 md:pl-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 12, label: "سنوات الخبرة", color: "bg-[#B2EBF2]" },
                  { value: 5, label: "تخصص طبي", color: "bg-[#80DEEA]" },
                  { value: 10000, label: "مريض راضٍ", color: "bg-[#4DD0E1]" },
                  { value: "24/7", label: "خدمة طوارئ", color: "bg-[#26C6DA]" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className={`${item.color} p-4 rounded-lg text-center shadow-sm`}
                  >
                    <div className="text-[#00838F] font-bold text-2xl mb-1">
                      {typeof item.value === 'number' ? (
                        <CountUp
                          end={item.value}
                          duration={3}
                          separator={item.value >= 1000 ? "," : ""}
                          suffix={index !== 3 ? "+" : ""}
                        />
                      ) : (
                        item.value
                      )}
                    </div>
                    <div className="text-[#006064]">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#E0F7FA] p-8 rounded-xl shadow-sm border border-[#B2EBF2]"
            >
              <h3 className="text-2xl font-bold text-[#0097A7] mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-[#00838F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                ما نقدمه
              </h3>
              <ul className="space-y-3 text-[#757575]">
                {[
                  "استشارات وفحوصات طبية شاملة",
                  "تشخيصات دقيقة بأحدث الأجهزة",
                  "برامج علاجية متكاملة",
                  "متابعة الأمراض المزمنة",
                  "خدمات وقائية وتوعوية",
                  "عيادات تخصصية متنوعة"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-[#009688] mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#E0F7FA] p-8 rounded-xl shadow-sm border border-[#B2EBF2]"
            >
              <h3 className="text-2xl font-bold text-[#0097A7] mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-[#00838F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                مهمتنا وقيمنا
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#00838F] mb-2">مهمتنا:</h4>
                  <p className="text-[#757575]">
                    تقديم رعاية صحية شاملة تعتمد على أحدث المعايير العالمية مع الحفاظ على القيم الإنسانية والاهتمام بكل مريض كفرد له احتياجاته الخاصة.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#00838F] mb-2">قيمنا:</h4>
                  <ul className="grid grid-cols-2 gap-2 text-[#757575]">
                    {[
                      "الجودة والتميز",
                      "النزاهة",
                      "الشفافية",
                      "التركيز على المريض",
                      "الابتكار",
                      "المسؤولية"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-[#009688] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/*//=========================== doctor services ===========================*/}
      <section className="py-20 bg-[#E0F7FA] relative w-screen overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#00BCD4] blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-[#009688] blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 xl:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[#0097A7] mb-2">
            خدمات {doctor.name}
          </h2>
          <p className="text-xl xl:text-2xl text-[#009688] mb-4">{doctor.specialty}</p>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto mb-6"></div>
          <p className="text-[#757575] max-w-4xl mx-auto text-lg xl:text-xl leading-relaxed">
            يقدم الدكتور مجموعة متكاملة من الخدمات الطبية بأعلى معايير الجودة والكفاءة الطبية
          </p>
        </motion.div>

        {/* Doctor Profile & Services */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mb-16">
          {/* Doctor Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3 xl:w-2/5"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="h-64 xl:h-72 bg-gradient-to-r from-[#00BCD4] to-[#009688] flex items-center justify-center relative">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-48 h-48 xl:w-56 xl:h-56 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>
              <div className="p-6 xl:p-8">
                <h3 className="text-2xl xl:text-3xl font-bold text-[#212121] mb-2">{doctor.name}</h3>
                <p className="text-[#009688] text-lg xl:text-xl mb-4">{doctor.specialty}</p>
                <p className="text-[#757575] mb-6 xl:mb-8 leading-relaxed">{doctor.bio}</p>
                <div className="flex justify-center">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="inline-block bg-[#009688] text-white px-8 py-3 rounded-lg hover:bg-[#00897B] transition shadow-md"
                  >
                    عرض الملف الشخصي الكامل
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="lg:w-2/3 xl:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {doctor.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full"
              >
                <div className="p-6 xl:p-7 flex-grow">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] flex items-center justify-center text-[#0097A7] mx-auto"
                  >
                    {service.icon}
                  </motion.div>

                  <h3 className="text-xl xl:text-2xl font-bold text-[#212121] mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-[#757575] mb-4 text-center xl:text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-center mt-2 pt-4 border-t border-[#B2EBF2]">
                    <div className="w-10 h-10 rounded-full bg-[#E0F7FA] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#009688]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <span className="text-sm xl:text-base text-[#0097A7] mr-3">حجز إلكتروني</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Smart Clinic Features */}
        <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.5, duration: 0.6 }}
  className="bg-gradient-to-br from-[#0097A7] to-[#009688]  shadow-2xl overflow-hidden text-white"
>
  <div className="p-8 xl:p-10 flex flex-col md:flex-row items-center">
    {/* Icon Section */}
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="md:w-1/3 mb-8 md:mb-0 flex justify-center"
    >
      <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-xl bg-white bg-opacity-20 flex items-center justify-center shadow-inner">
        <FaMobileAlt className="text-4xl xl:text-5xl text-[#009688]" />
      </div>
    </motion.div>

    {/* Features Section */}
    <div className="md:w-2/3 md:pl-8">
      <motion.h3
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl xl:text-3xl font-bold mb-6 text-center md:text-right"
      >
        الخدمات الذكية للعيادة
      </motion.h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        {[
          {
            title: "حجز مواعيد أونلاين",
            icon: <FaCalendarAlt className="text-2xl xl:text-3xl" />,
            desc: "احجز موعدك بسهولة في أي وقت"
          },
          {
            title: "استشارات عن بعد",
            icon: <FaVideo className="text-2xl xl:text-3xl" />,
            desc: "تواصل مع طبيبك عبر الفيديو"
          },
          {
            title: "متابعة النتائج",
            icon: <FaFileMedicalAlt className="text-2xl xl:text-3xl" />,
            desc: "اطلع على نتائجك أونلاين"
          },
          {
            title: "تذكير بالمواعيد",
            icon: <FaBell className="text-2xl xl:text-3xl" />,
            desc: "تذكيرات تلقائية بمواعيدك"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            className="flex flex-col items-center text-center p-4 xl:p-5 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-300 cursor-default"
          >
            <div className="w-14 h-14 xl:w-16 hover:bg-[#009688] hover:text-[#B2EBF2] xl:h-16 mb-3 flex items-center justify-center text-[#009688] bg-[#B2EBF2] bg-opacity-20 rounded-full">
              {feature.icon}
            </div>
            <h4 className="font-semibold text-[#212121] mb-1 xl:text-lg">{feature.title}</h4>
            <p className="text-xs xl:text-sm text-[#757575] text-opacity-80">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</motion.div>
      </div>
    </section>

{/* end of doctor services */}

{/* start of our team section ===========================*/}

    <section className="py-20 bg-white relative w-screen overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#B2EBF2] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">
            آراء عملائنا
          </h2>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-5"></div>
          <p className="text-[#757575] max-w-2xl mx-auto text-lg">
            تقييمات المرضى الذين استفادوا من خدمات عيادتنا
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative h-[400px] md:h-[300px]">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-[#009688] hover:bg-[#E0F7FA] transition -ml-5"
            aria-label="السابق"
          >
            <FaChevronLeft />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-[#009688] hover:bg-[#E0F7FA] transition -mr-5"
            aria-label="التالي"
          >
            <FaChevronRight />
          </button>

          {/* Animated Slides */}
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <div className="bg-[#E0F7FA] rounded-2xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 h-full">
                {/* Patient Image */}
                <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                    loading="lazy"
                  />
                </div>
                
                {/* Testimonial Content */}
                <div className="text-center md:text-right flex-1">
                  <FaQuoteLeft className="text-[#009688] text-2xl mb-4 mx-auto md:mx-0" />
                  
                  <p className="text-[#757575] text-lg mb-6 max-w-2xl mx-auto md:mx-0">
                    {testimonials[currentIndex].comment}
                  </p>
                  
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`inline-block ${i < testimonials[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#212121]">{testimonials[currentIndex].name}</h3>
                  <p className="text-[#0097A7]">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-[#009688] w-6' : 'bg-[#B2EBF2] hover:bg-[#80DEEA]'}`}
              aria-label={`انتقل إلى التقييم ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>

{/* end of our team section */}


      <section className="py-20 bg-[#E0F7FA] w-screen relative overflow-x-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00BCD4] opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">
              تواصل معنا
            </h2>
            <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-5"></div>
            <p className="text-[#757575] max-w-2xl mx-auto text-lg">
              نحن هنا لمساعدتك في أي وقت، زورنا أو تواصل معنا عبر أي من وسائل الاتصال التالية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white  shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-[#212121] mb-6 flex items-center">
                <FaMapMarkerAlt className="text-[#009688] mr-3" />
                معلومات الاتصال
              </h3>

              {/* Address */}
              <div className="mb-8">
                <h4 className="font-bold text-[#0097A7] mb-3">عنوان العيادة:</h4>
                <p className="text-[#757575]">
                  شارع الملك كليان امبابي كفرالزيات الغربيه
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                    <FaPhone className="text-[#009688] " />
                  </div>
                  <div className="ms-2">
                    <h4 className="font-bold text-[#0097A7] mb-1">الهاتف:</h4>
                    <a href="tel:+201144045412" className="text-[#757575] hover:text-[#00BCD4] transition">
                      201144045412+
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                    <FaEnvelope className="text-[#009688]" />
                  </div>
                  <div className="ms-2">
                    <h4 className="font-bold text-[#0097A7] mb-1">البريد الإلكتروني:</h4>
                    <a href="mailto:ahmedelbedewy21@gmail.com" className="text-[#757575] hover:text-[#00BCD4] transition">
                      ahmedelbedewy21gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                    <FaWhatsapp className="text-[#009688]" />
                  </div>
                  <div className="ms-2">
                    <h4 className="font-bold text-[#0097A7] mb-1">واتساب:</h4>
                    <a href="https://wa.me/201144045412" className="text-[#757575] hover:text-[#00BCD4] transition">
                      201144045412+
                    </a>
                  </div>
                </div>

                {/* <div className="flex items-start">
                <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                  <FaClock className="text-[#009688]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0097A7] mb-1">ساعات العمل:</h4>
                  <ul className="text-[#757575] space-y-1">
                    <li>الأحد - الخميس: 8 صباحاً - 10 مساءً</li>
                    <li>الجمعة: 4 عصراً - 10 مساءً</li>
                    <li>السبت: إجازة</li>
                    <li className="text-[#009688] font-medium mt-2">طوارئ 24/7: 0500123456</li>
                  </ul>
                </div>
              </div> */}
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white  shadow-lg overflow-hidden"
            >
              <div className="h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6882.352282472555!2d30.813265526634097!3d30.82240805369998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5a2a8b6a42dbf%3A0x8ccc7a75d594b012!2z2YjZhNi52Kkg2KfZhNio2LnYsSDYp9mE2LTYsdin2LEg2KfZhNio2LmI2YTZiNmFINin2YTYudin2YTZhSDYp9mE2YXYs9mK!5e0!3m2!1sar!2seg!4v1620000000000!5m2!1sar!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen=""
                  loading="lazy"

                />


                {/* Map Overlay Info */}
                {/* <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-[#009688] mr-2" />
                  <span className="text-[#212121] font-medium">عيادة الشفاء</span>
                </div>
              </div> */}
              </div>
            </motion.div>
          </div>

          {/* Emergency Contact */}
          <motion.div

            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 bg-gradient-to-r  from-[#0097A7] to-[#009688]  shadow-xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">للحالات الطارئة فقط</h3>
            <p className="text-xl mb-6">خدمة الطوارئ متاحة 24 ساعة طوال أيام الأسبوع</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="tel:0500123456"
                className="flex items-center bg-white text-[#009688]  px-6 py-3 rounded-lg font-bold hover:text-white hover:bg-[#009688] transition"
              >
                <FaPhone className="mr-2  me-2" />
                0402596012
              </a>
              <a
                href="https://wa.me/+201144045412"
                className="flex items-center bg-white text-[#009688] px-6 py-3 rounded-lg font-bold hover:text-white hover:bg-[#0097A7] transition"
              >
                <FaWhatsapp className="mr-2 me-2" />
                واتساب الطوارئ
              </a>
            </div>
          </motion.div>
        </div>
      </section>




      <section className="py-20 bg-white relative w-screen overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#B2EBF2] opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">
              لماذا تختار عيادتنا؟
            </h2>
             <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-5"></div>
            <p className="text-[#757575] max-w-2xl mx-auto text-lg">
              نقدم تجربة طبية فريدة تجمع بين التميز الطبي والرعاية الإنسانية
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#E0F7FA] overflow-hidden"
              >
                <div className="p-6">
                  {/* Icon with Animated Background */}
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#00BCD4] to-[#009688] flex items-center justify-center text-white"
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-xl font-bold text-[#212121] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#757575]">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-[#00BCD4] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 bg-gradient-to-r from-[#0097A7] to-[#009688]  shadow-xl p-8 text-white"
          >
            <div ref={ref} >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="p-4">
                    {typeof stat.number === 'number' ? (
                      <div className="text-3xl font-bold mb-2">
                        {inView && (
                          <CountUp
                            end={stat.number}
                            duration={3}
                            separator=","
                          />
                        )}+
                      </div>
                    ) : (
                      <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    )}
                    <div>{stat.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  )
}
