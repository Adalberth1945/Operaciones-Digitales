import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Star } from 'lucide-react';
import Parallax3DEffect from './Parallax3DEffect';

const testimonials = [
  {
    name: 'Carlos Méndez',
    position: 'CEO',
    quote: 'La implementación de agentes de IA en nuestro servicio al cliente aumentó la satisfacción en un 45% y redujo los tiempos de respuesta en un 60%.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5
  },
  {
    name: 'Ana Sánchez',
    position: 'CTO',
    quote: 'El sistema de automatización que desarrollaron transformó completamente nuestros procesos internos, ahorrando más de 120 horas mensuales de trabajo manual.',
    image: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5
  },
  {
    name: 'Javier Rodríguez',
    position: 'Director de Operaciones',
    quote: 'Su consultoría en transformación digital nos ayudó a identificar áreas de mejora que ni siquiera sabíamos que existían. La inversión se recuperó en solo 6 meses.',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4
  },
  {
    name: 'Lucía Fernández',
    position: 'Head of Data.',
    quote: 'Las soluciones de análisis predictivo implementadas han sido clave para anticiparnos a tendencias del mercado y tomar decisiones estratégicas más acertadas.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5
  }
];

const TestimonialCard: React.FC<{
  name: string;
  position: string;
  quote: string;
  image: string;
  rating: number;
  index: number;
}> = ({ name, position, quote, image, rating, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Estado para la animación del hover
  const [isHovered, setIsHovered] = React.useState(false);
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2
      }
    }
  };
  
  // Renderizar estrellas
  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="relative z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Parallax3DEffect depth={7} perspective={1000}>
        <motion.div 
          className={`bg-gray-900/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 relative group hover:bg-gray-800/60 transition-colors duration-300 h-full`}
          animate={isHovered ? { y: -8 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative">
            <Quote className="w-10 h-10 text-purple-500 opacity-40 absolute -top-2 -left-2" />
            <div className="flex items-center mb-4">
              <div className="relative mr-4">
                <img
                  src={image}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                />
                {/* Efecto de brillo animado alrededor de la imagen */}
                <motion.div
                  className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-sm opacity-0 group-hover:opacity-60"
                  animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div>
                <h4 className="font-semibold text-white">{name}</h4>
                <p className="text-gray-400 text-sm">{position}</p>
                <div className="flex mt-1">
                  {renderStars()}
                </div>
              </div>
            </div>
            <p className="text-gray-300 italic text-sm sm:text-base relative">
              {quote}
              {/* Comilla al final */}
              <Quote className="w-8 h-8 text-purple-500 opacity-20 absolute -bottom-6 right-0 rotate-180" />
            </p>
          </div>
          
          {/* Partículas animadas que aparecen al hacer hover */}
          {isHovered && (
            <>
              <motion.div 
                className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  y: [0, -20],
                  x: [0, 10]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-0 left-10 w-2 h-2 rounded-full bg-purple-400"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  y: [0, -30],
                  x: [0, -15]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div 
                className="absolute bottom-10 right-10 w-1 h-1 rounded-full bg-indigo-400"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  y: [0, -15],
                  x: [0, 5]
                }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </motion.div>
      </Parallax3DEffect>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="testimonios" className="py-16 sm:py-20 relative">
      {/* Background blurred elements */}
      <div className="absolute top-20 left-10 w-60 h-60 bg-purple-600/10 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-600/10 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Parallax3DEffect>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Lo que <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Dicen</span> Nuestros Clientes
            </h2>
          </Parallax3DEffect>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nuestras soluciones de IA y automatización han transformado empresas en diversos sectores, generando resultados medibles y significativos.
          </p>
        </motion.div>
        
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              position={testimonial.position}
              quote={testimonial.quote}
              image={testimonial.image}
              rating={testimonial.rating}
              index={index}
            />
          ))}
        </div>
        
        {/* CTA para agregar testimonio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.8, duration: 0.6 } 
          } : {}}
          className="mt-12 text-center"
        >
          <a 
            href="#compartir-experiencia" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-1"
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Comparte tu Experiencia
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;