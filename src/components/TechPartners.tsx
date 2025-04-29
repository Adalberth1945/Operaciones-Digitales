import React, { useEffect, useRef, useState } from 'react'; // Importamos useState
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lista de socios tecnológicos con logos
const techPartners = [
  { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/OpenAI_logo.svg' },
  { name: 'Anthropic', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Anthropic_Logo.svg' },
  { name: 'Gemini', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg' },
  { name: 'DeepSeek', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/DeepSeek_Logo.svg' },
  { name: 'Mistral AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Mistral_AI_logo.svg' },
  { name: 'Hugging Face', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Hugging_Face_logo.svg' },
  { name: 'Stability AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Stability_AI_logo.svg' },
  { name: 'n8n', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/N8n-logo-new.svg' },
  { name: 'Perplexity AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg' }
  // Puedes añadir más aquí
];

// Duplicar logos para el scroll continuo
const allPartners = [...techPartners, ...techPartners];

const TechPartnersMarquee: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Estado para rastrear qué imágenes han fallado en cargar
  // Usamos un mapa con clave única (nombre+índice) para manejar duplicados en allPartners
  const [failedLogos, setFailedLogos] = useState<{ [key: string]: boolean }>({});

  // Función para manejar el error de carga de la imagen
  const handleImageError = (name: string, index: number) => {
    setFailedLogos(prev => ({
      ...prev,
      [`${name}-${index}`]: true // Usamos una clave única para este partner específico en el array duplicado
    }));
    console.warn(`Error loading logo for: ${name}`); // Opcional: log del error en consola
  };


  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none z-0';
    const ctx = canvas.getContext('2d');
    scroll.appendChild(canvas);

    const resizeCanvas = () => {
      if (canvas && scroll) {
        canvas.width = scroll.offsetWidth;
        canvas.height = scroll.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: { x: number; y: number; size: number; speedX: number; color: string; }[] = [];
    const particleCount = 30;
    const colors = ['#67e8f9', '#a78bfa', '#93c5fd', '#38bdf8'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, speedX: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        particle.x += particle.speedX;
        if (particle.x > canvas.width) { particle.x = 0; }
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
    };
  }, []);


  return (
    <section ref={ref} className="py-16 relative overflow-hidden bg-gray-950">
      {/* Background gradient and shapes */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 opacity-80"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-800/10 rounded-full mix-blend-screen filter blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-800/10 rounded-full mix-blend-screen filter blur-xl"></div>
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-blue-800/10 rounded-full mix-blend-screen filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tecnologías <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Aliadas</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Colaboramos con las plataformas más innovadoras para ofrecerte soluciones de vanguardia
          </p>
        </motion.div>
      </div>

      {/* Scrolling banner */}
      <div
        ref={scrollRef}
        className="relative w-full overflow-hidden py-8 bg-gray-900/30 backdrop-blur-sm border-y border-gray-800/50 z-10"
      >
         {/* Contenedor de los logos con la animación de scroll */}
         {/* Añadimos z-index para asegurar que los logos estén sobre el canvas */}
        <div className="flex animate-marquee will-change-transform relative z-20">
          {allPartners.map((partner, index) => (
            <motion.div
              key={`${partner.name}-${index}`} // Usamos nombre+índice como key única
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0 mx-6 sm:mx-10 w-24 sm:w-32 h-24 sm:h-32 relative group z-30"
            >
              {/* Capas de efectos hover internos */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 to-purple-600/0 rounded-xl group-hover:from-cyan-600/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyan-500/10 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] filter blur-sm"></div>

              {/* Contenedor de la imagen o el fallback */}
              <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-gray-900/50 border border-gray-800 group-hover:border-cyan-800/50 transition-all duration-300">
                {/* Condicional: Si falló la carga, mostrar fallback; si no, mostrar imagen */}
                {failedLogos[`${partner.name}-${index}`] ? (
                  // Fallback: Mostrar iniciales o nombre
                  <span className="text-gray-400 text-sm font-semibold text-center break-words p-1">
                     {/* Intentar iniciales, si no, el nombre */}
                     {partner.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2) || partner.name}
                  </span>
                ) : (
                  // Imagen normal
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-w-full max-h-full object-contain filter brightness-[0.95] contrast-[1.05]"
                    onError={() => handleImageError(partner.name, index)} // <-- Manejador de error
                  />
                )}
              </div>
              {/* Nombre del socio debajo del logo */}
              <p className="text-center text-xs sm:text-sm text-gray-400 mt-2 font-medium">{partner.name}</p>
            </motion.div>
          ))}
        </div>
        {/* Fades a los lados, colocados después en el DOM para que se dibujen encima */}
        {/* Fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent pointer-events-none"></div>
        {/* Fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent pointer-events-none"></div>

      </div>
    </section>
  );
};

export default TechPartnersMarquee;