import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className='hero h-screen '>
      <div className="relative h-screen ">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/src/assets/video/bgVideo.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute top-0 left-0 w-full h-full opacity-15 bg-[#0097A7] z-10"></div>

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
              className="bg-white text-[#212121] px-8 py-3 rounded-lg text-lg hover:text-white hover:bg-[#0097A7] transition duration-300 shadow-md"
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
              className="bg-transparent border-2 text-white px-8 py-3 rounded-lg text-lg hover:bg-[#009688] hover:border-[#009688] transition duration-100 shadow-md"
            >
              اتصل بنا <i className="fa-solid fa-phone"></i>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}