import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Lightbulb, Target, Zap, Users } from 'lucide-react';
import Parallax3DEffect from './Parallax3DEffect';

const values = [
  {
    icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
    title: 'Innovación Constante',
    description: 'Exploramos continuamente nuevas tecnologías y metodologías para ofrecer soluciones de vanguardia.'
  },
  {
    icon: <Target className="w-8 h-8 text-red-400" />,
    title: 'Precisión y Excelencia',
    description: 'Nos comprometemos con los más altos estándares de calidad en cada proyecto que emprendemos.'
  },
  {
    icon: <Zap className="w-8 h-8 text-cyan-400" />,
    title: 'Agilidad y Adaptabilidad',
    description: 'Nos adaptamos rápidamente a nuevos desafíos y necesidades cambiantes del mercado.'
  },
  {
    icon: <Users className="w-8 h-8 text-green-400" />,
    title: 'Enfoque en las Personas',
    description: 'Creemos que la tecnología debe servir a las personas, no al revés.'
  }
];

// Datos para las estadísticas animadas
const projectStats = [
  { label: 'Proyectos', value: 27, color: 'cyan', suffix: '+', duration: 2.5 },
  { label: 'Satisfacción', value: 100, color: 'purple', suffix: '%', duration: 2.8 },
  { label: 'Expertos', value: 4, color: 'indigo', suffix: '+', duration: 2.2 }
];

// Componente para contador animado
const CountUp = ({ end, duration = 2.5, suffix = '', color = 'cyan' }: { end: number, duration?: number, suffix?: string, color?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const easeOutQuad = (t: number) => t * (2 - t);
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = easeOutQuad(progress);
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    if (inView) {
      animationFrame = requestAnimationFrame(updateCount);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, end, duration]);
  
  const getColorClass = () => {
    switch(color) {
      case 'cyan': return 'text-cyan-400';
      case 'purple': return 'text-purple-400';
      case 'indigo': return 'text-indigo-400';
      default: return 'text-cyan-400';
    }
  };
  
  return (
    <div ref={ref} className={`${getColorClass()} text-3xl font-bold`}>
      {count}{suffix}
    </div>
  );
};

// Imágenes para el slider
const teamImages = [
  "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/7147647/pexels-photo-7147647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];

const AboutUs: React.FC = () => {
  const [refTitle, inViewTitle] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [refContent, inViewContent] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [refValues, inViewValues] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [refStats, inViewStats] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Estado para el slider de imágenes
  const [currentImage, setCurrentImage] = useState(0);
  
  // Cambiar automáticamente las imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % teamImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="nosotros" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={refTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={inViewTitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Parallax3DEffect>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Sobre <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Nosotros</span>
            </h2>
          </Parallax3DEffect>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Somos un equipo apasionado de expertos en inteligencia artificial, aprendizaje automático y desarrollo de software que busca revolucionar la forma en que las pequeñas y medianas empresas operan.
          </p>
        </motion.div>
        
        {/* Estadísticas destacadas - Visible en TODAS las pantallas */}
        <motion.div
          ref={refStats}
          initial={{ opacity: 0, y: 20 }}
          animate={inViewStats ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">Nuestros Resultados</h3>
          <div className="grid grid-cols-3 gap-2 md:gap-4 lg:max-w-3xl lg:mx-auto">
            {projectStats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700 transition-all hover:bg-gray-700/50 hover:border-gray-600">
                <CountUp 
                  end={stat.value} 
                  color={stat.color} 
                  suffix={stat.suffix}
                  duration={stat.duration}
                />
                <div className="text-gray-300 text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20">
          <motion.div
            ref={refContent}
            initial={{ opacity: 0, x: -50 }}
            animate={inViewContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <Parallax3DEffect depth={10}>
              <h3 className="text-2xl font-bold mb-4 sm:mb-6">Nuestra Misión</h3>
            </Parallax3DEffect>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              Nuestra misión es democratizar el acceso a tecnologías avanzadas de IA y automatización, permitiendo que empresas de todos los tamaños aprovechen el poder de la inteligencia artificial para transformar sus operaciones y crear valor extraordinario.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
            Fundada en 2022 por un equipo de ingenieros con sólida experiencia profesional, Operaciones Digitales SpA se especializa en desarrollar soluciones de inteligencia artificial y automatización. Nuestra visión es impulsar proyectos innovadores que resuelvan los principales desafíos de nuestros clientes, desde la toma manual de registros hasta la digitalización y automatización completa de procesos de negocio.
            </p>
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
              <button className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-sm sm:text-base">
                Conoce al Equipo
              </button>
              <button className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 border border-cyan-500 text-cyan-400 rounded-full font-medium hover:bg-cyan-500/10 transition-all text-sm sm:text-base">
                Únete a Nosotros
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inViewContent ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-80 sm:h-96 min-h-[300px] rounded-xl overflow-hidden group bg-gray-900/50 border border-gray-800"
          >
            <Parallax3DEffect depth={15}>
              {/* Slider de imágenes del equipo */}
              {teamImages.map((img, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: currentImage === index ? 1 : 0,
                    scale: currentImage === index ? 1 : 1.1
                  }}
                  transition={{ 
                    opacity: { duration: 1 },
                    scale: { duration: 1.2 }
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={img} 
                    alt={`Equipo de Operaciones Digitales ${index + 1}`} 
                    className="w-full h-full object-cover object-center rounded-xl transform transition-transform duration-500"
                  />
                </motion.div>
              ))}
              
              {/* Indicadores del slider */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {teamImages.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImage === index ? 'w-6 bg-cyan-400' : 'w-2 bg-white/50'
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent opacity-50"></div>
              
              {/* Stats Overlay - Visible en ambas versiones (desktop y móvil) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 grid grid-cols-3 gap-4 z-10">
                {projectStats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inViewContent ? { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.5 + index * 0.2, duration: 0.6 }
                    } : {}}
                    className="text-center bg-gray-800/60 p-2 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                  >
                    <CountUp 
                      end={stat.value} 
                      color={stat.color} 
                      suffix={stat.suffix}
                      duration={stat.duration}
                    />
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Efecto de tecnología digital */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-full grid grid-cols-10 grid-rows-10 opacity-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: Math.random() > 0.7 ? 0.8 : 0,
                        transition: { 
                          duration: 0.2, 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          delay: Math.random() * 5 
                        }
                      }}
                      className="border border-cyan-400"
                    />
                  ))}
                </div>
              </div>
            </Parallax3DEffect>
          </motion.div>
        </div>
        
        <motion.div
          ref={refValues}
          initial={{ opacity: 0, y: 30 }}
          animate={inViewValues ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mt-8 sm:mt-0"
        >
          <Parallax3DEffect>
            <h3 className="text-2xl font-bold mb-8 sm:mb-10 text-center">Nuestros Valores</h3>
          </Parallax3DEffect>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inViewValues ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 text-center hover:bg-gray-800/60 transition-colors duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-800 rounded-full">{value.icon}</div>
                </div>
                <h4 className="text-lg font-semibold mb-2">{value.title}</h4>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;