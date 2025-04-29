import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bot, Cpu, Database, BrainCircuit, LineChart, Workflow, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Parallax3DEffect from './Parallax3DEffect';

const services = [
  {
    icon: <BrainCircuit className="w-10 h-10 text-cyan-400" />,
    title: 'Automatización de procesos con IA',
    description: 'Eliminamos el trabajo manual repetitivo y optimizamos tus operaciones diarias usando inteligencia artificial adaptada a tu negocio.',
    detailedDescription: [
      'Automatización de flujos de trabajo mediante modelos de IA adaptados a tu negocio',
      'Reducción de hasta un 70% en tareas manuales repetitivas',
      'Identificación y predicción de patrones para optimizar decisiones operativas',
      'Integración con sistemas existentes como CRM, ERP y plataformas de gestión',
      'Análisis en tiempo real de datos operacionales para mejora continua'
    ],
    industryExamples: [
      {
        industry: 'Distribución Mayorista',
        description: 'Desarrollamos un sistema cerrado para gestionar pedidos entre un mayorista y sus distribuidores, eliminando errores de registro y reduciendo el tiempo de procesamiento en un 60%.'
      },
      {
        industry: 'Industria Forestal',
        description: 'Creamos un servicio de automatización de registro de rollizos con una app, SharePoint y Power BI, permitiendo generar reportes automatizados y optimizar el control de inventario.'
      },
      {
        industry: 'Agricultura',
        description: 'Implementamos una solución para consultores agrícolas que automatiza los registros de floración y genera informes predictivos, ahorrando 15 horas semanales de trabajo administrativo.'
      }
    ],
    caseStudy: 'Una empresa de logística redujo su tiempo de procesamiento de pedidos en un 85% e incrementó su precisión al 99.8% gracias a nuestro sistema de automatización con IA predictiva.',
    keywords: ['automatización IA', 'optimización procesos', 'flujos de trabajo IA', 'reducción tareas manuales', 'integración sistemas IA']
  },
  {
    icon: <Bot className="w-10 h-10 text-purple-500" />,
    title: 'Implementación de agentes inteligentes',
    description: 'Incorporamos asistentes virtuales que agilizan tus procesos, respondiendo consultas, procesando información y aprendiendo con cada interacción.',
    detailedDescription: [
      'Agentes virtuales entrenados con modelos LLM de última generación',
      'Adaptación contextual y aprendizaje continuo basado en interacciones',
      'Capacidad multimodal para procesar texto, voz e imágenes',
      'Integración con canales de comunicación existentes (web, móvil, redes sociales)',
      'Análisis de sentimiento y personalización de respuestas'
    ],
    industryExamples: [
      {
        industry: 'Centro de Salud',
        description: 'Desarrollamos un asistente virtual para un centro de kinesiología que gestiona citas, envía recordatorios y recopila información del paciente antes de las consultas, mejorando la satisfacción del cliente en un 40%.'
      },
      {
        industry: 'Pequeño Comercio',
        description: 'Implementamos un chatbot para una tienda local que responde consultas sobre productos, disponibilidad y precios, atendiendo más de 200 consultas diarias sin intervención humana.'
      },
      {
        industry: 'Servicio Técnico',
        description: 'Creamos un asistente que guía a los clientes en la resolución de problemas técnicos básicos, reduciendo las visitas técnicas innecesarias en un 35%.'
      }
    ],
    caseStudy: 'Un banco implementó nuestros agentes inteligentes para atención al cliente, logrando resolver el 82% de consultas sin intervención humana y reduciendo tiempos de espera de 15 minutos a segundos.',
    keywords: ['agentes IA', 'asistentes virtuales', 'chatbots inteligentes', 'modelos LLM', 'atención automatizada']
  },
  {
    icon: <Workflow className="w-10 h-10 text-blue-500" />,
    title: 'Consultoría en transformación digital',
    description: 'Te guiamos en la modernización de tu empresa con un plan a medida que incorpora tecnologías innovadoras adaptadas a tus necesidades específicas.',
    detailedDescription: [
      'Auditoría tecnológica y diagnóstico de madurez digital',
      'Diseño de hoja de ruta personalizada para transformación digital',
      'Selección e implementación de tecnologías emergentes para ventaja competitiva',
      'Formación y capacitación de equipos en nuevas tecnologías',
      'Medición de impacto y ROI de iniciativas digitales'
    ],
    industryExamples: [
      {
        industry: 'Pequeña Empresa Industrial',
        description: 'Desarrollamos una estrategia de transformación digital para una carpintería, digitalizando su catálogo y proceso de pedidos, lo que aumentó sus ventas en un 25%.'
      },
      {
        industry: 'Consultora',
        description: 'Implementamos herramientas de trabajo colaborativo y automatización de informes para una consultora, reduciendo en 20 horas mensuales el tiempo dedicado a tareas administrativas.'
      },
      {
        industry: 'Oficina Contable',
        description: 'Diseñamos un sistema de gestión documental y procesamiento automático de facturas para una oficina contable, reduciendo errores en un 90% y acelerando el cierre mensual.'
      }
    ],
    caseStudy: 'Una PyME manufacturera aumentó su productividad en un 35% y expandió su presencia en mercados internacionales tras implementar nuestra estrategia de transformación digital.',
    keywords: ['transformación digital', 'modernización empresarial', 'innovación tecnológica', 'consultoría digital', 'hoja de ruta digital']
  },
  {
    icon: <Cpu className="w-10 h-10 text-indigo-500" />,
    title: 'Desarrollo de soluciones personalizadas',
    description: 'Creamos aplicaciones y sistemas hechos a medida que resuelven exactamente tus problemas específicos, como un traje de sastre digital para tu negocio.',
    detailedDescription: [
      'Desarrollo de software a medida con integración de componentes de IA',
      'Arquitecturas escalables basadas en microservicios y cloud-native',
      'Interfaces de usuario intuitivas diseñadas bajo principios de UX/UI avanzados',
      'Sistemas de procesamiento de lenguaje natural aplicados a dominios específicos',
      'Soluciones de visión computacional para análisis automático de imágenes y video'
    ],
    industryExamples: [
      {
        industry: 'Prevención de Riesgos',
        description: 'Desarrollamos una aplicación móvil para prevencionistas de riesgos que digitaliza formularios, captura evidencia fotográfica y genera informes automáticos, reduciendo el tiempo de documentación en un 75%.'
      },
      {
        industry: 'Clínica Dental',
        description: 'Creamos un sistema de gestión de pacientes con recordatorios automáticos y seguimiento post-tratamiento, reduciendo las cancelaciones en un 40%.'
      },
      {
        industry: 'Distribuidora Regional',
        description: 'Implementamos un sistema de gestión de rutas e inventario para una distribuidora, optimizando recorridos y reduciendo costos de combustible en un 30%.'
      }
    ],
    caseStudy: 'Desarrollamos un sistema de inspección visual automatizado que redujo los defectos de fabricación en un 65% para una empresa industrial, generando ahorros de más de $500,000 anuales.',
    keywords: ['desarrollo software IA', 'aplicaciones a medida', 'soluciones personalizadas', 'sistemas de visión IA', 'desarrollo apps Chile']
  },
  {
    icon: <Database className="w-10 h-10 text-pink-500" />,
    title: 'Big Data & Analytics',
    description: 'Convertimos tus datos en información valiosa para la toma de decisiones, identificando patrones y oportunidades que impulsan el crecimiento de tu negocio.',
    detailedDescription: [
      'Arquitecturas de datos modernas diseñadas para procesamiento a gran escala',
      'Implementación de data lakes y data warehouses optimizados',
      'Modelos predictivos y prescriptivos basados en machine learning',
      'Visualización interactiva de datos para facilitar la toma de decisiones',
      'Integración de fuentes de datos heterogéneas para análisis unificado'
    ],
    industryExamples: [
      {
        industry: 'Cultivos Agrícolas',
        description: 'Implementamos un sistema de análisis de datos climáticos e históricos de producción para predecir rendimientos y optimizar el uso de recursos en cultivos frutales.'
      },
      {
        industry: 'Pequeño Retail',
        description: 'Desarrollamos un dashboard de análisis de ventas e inventario para una cadena local de tiendas, permitiendo identificar productos de alta rotación y optimizar compras.'
      },
      {
        industry: 'Gimnasio',
        description: 'Creamos un sistema de análisis del comportamiento de socios, identificando patrones de asistencia y preferencias para personalizar ofertas y reducir la deserción en un 25%.'
      }
    ],
    caseStudy: 'Una cadena minorista implementó nuestra solución de analytics y obtuvo un incremento del 28% en conversión de ventas al poder predecir patrones de compra y optimizar su inventario y ofertas.',
    keywords: ['big data Chile', 'análisis predictivo', 'business intelligence', 'data lakes', 'visualización datos']
  },
  {
    icon: <LineChart className="w-10 h-10 text-teal-400" />,
    title: 'Optimización de rendimiento',
    description: 'Identificamos y eliminamos cuellos de botella en tus procesos, mejorando la eficiencia operativa para que puedas hacer más con menos recursos.',
    detailedDescription: [
      'Análisis profundo de procesos para identificar ineficiencias y oportunidades',
      'Modelado matemático para optimización de recursos y tiempos',
      'Sistemas de recomendación para mejora continua basados en IA',
      'Monitoreo en tiempo real de KPIs operacionales críticos',
      'Soluciones predictivas para mantenimiento y prevención de fallos'
    ],
    industryExamples: [
      {
        industry: 'Taller Mecánico',
        description: 'Implementamos un sistema de gestión de citas y recursos que optimizó la asignación de bahías y técnicos, aumentando la cantidad de servicios diarios en un 35%.'
      },
      {
        industry: 'Empresa de Transportes',
        description: 'Desarrollamos un algoritmo de optimización de rutas que redujo los tiempos de entrega en un 28% y disminuyó el consumo de combustible.'
      },
      {
        industry: 'Pequeña Fábrica',
        description: 'Creamos un sistema de monitoreo de producción que identificó cuellos de botella y permitió reorganizar el flujo de trabajo, aumentando la producción en un 40% sin inversión adicional.'
      }
    ],
    caseStudy: 'Una planta industrial redujo su consumo energético en 23% y sus costos de mantenimiento en 40% tras implementar nuestro sistema de optimización y mantenimiento predictivo.',
    keywords: ['optimización procesos', 'eficiencia operativa', 'mantenimiento predictivo', 'monitoreo KPI', 'optimización recursos']
  }
];

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  detailedDescription: string[];
  industryExamples: { industry: string; description: string }[];
  caseStudy: string;
  keywords?: string[];
  index: number;
}> = ({ icon, title, description, detailedDescription, industryExamples, caseStudy, keywords, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    // Reset examples view when collapsing
    if (isExpanded) {
      setShowExamples(false);
    }
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  const handleScrollToContact = () => {
    // Opcionalmente cerrar la expansión después de hacer clic
    // setIsExpanded(false);
    const contactSection = document.getElementById('agenda');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative overflow-hidden"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 hover:bg-gray-800/60 transition-all duration-300 border border-gray-800 hover:border-cyan-900/50 group relative ${isExpanded ? 'ring-2 ring-cyan-500/50' : ''}`}
        style={{
          backgroundImage: isHovering 
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(103, 232, 249, 0.15), transparent 180px)` 
            : 'none'
        }}
        itemScope
        itemType="https://schema.org/Service"
      >
        {/* Hidden microdata for SEO */}
        <meta itemProp="serviceType" content={title} />
        <div itemProp="provider" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="Operaciones Digitales SpA" />
          <meta itemProp="url" content="https://remarkable-unicorn-584591.netlify.app/" />
        </div>
        
        {/* Keywords for SEO */}
        {keywords && (
          <div className="hidden">
            {keywords.map((keyword, idx) => (
              <span key={idx}>{keyword}</span>
            ))}
          </div>
        )}
        
        {/* Spotlight overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: isHovering 
              ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.12), transparent 60%)` 
              : 'none'
          }}
        ></div>
        
        <div className="mb-4 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-gray-950 rounded-lg p-4 w-fit">
            {icon}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300" itemProp="name">{title}</h3>
          <button 
            onClick={toggleExpand}
            className="p-1 bg-gray-800 rounded-full hover:bg-cyan-900/50 transition-colors duration-300 mt-1"
            aria-label={isExpanded ? "Ver menos" : "Ver más"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
        <p className="text-gray-400 mb-2" itemProp="description">{description}</p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-700">
                {!showExamples ? (
                  <>
                    <h4 className="text-gray-300 font-medium mb-2">¿Qué incluye?</h4>
                    <ul className="space-y-2">
                      {detailedDescription.map((item, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.1 }}
                          className="flex items-start"
                        >
                          <ArrowRight className="w-4 h-4 text-cyan-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={toggleExamples}
                      className="mt-6 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex justify-center items-center transition-colors"
                    >
                      Ver ejemplos en diferentes industrias
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-gray-300 font-medium">Soluciones por industria</h4>
                      <button 
                        onClick={toggleExamples}
                        className="text-gray-400 hover:text-white text-sm flex items-center"
                      >
                        <span className="mr-1">Volver</span>
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {industryExamples.map((example, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="bg-gray-800/60 p-3 rounded-lg border-l-2"
                          style={{ borderColor: idx === 0 ? '#67e8f9' : idx === 1 ? '#a78bfa' : '#fb7185' }}
                        >
                          <h5 className="text-white text-sm font-medium mb-1">{example.industry}</h5>
                          <p className="text-gray-400 text-sm">{example.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="mt-6 bg-gray-800/60 p-3 rounded-lg border-l-2 border-cyan-500">
                  <h4 className="text-white text-sm font-medium mb-1">Caso de éxito destacado</h4>
                  <p className="text-gray-400 text-sm italic">{caseStudy}</p>
                </div>
                
                <a 
                  href="#agenda"
                  onClick={handleScrollToContact}
                  className="mt-4 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg text-sm hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 w-full flex justify-center items-center"
                >
                  Solicitar información personalizada
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="servicios" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Parallax3DEffect>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Nuestros <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Servicios</span>
            </h2>
          </Parallax3DEffect>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Soluciones a medida que transforman tu empresa, sin importar su tamaño o industria. Creamos trajes digitales a la medida de tus necesidades específicas.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              icon={service.icon} 
              title={service.title} 
              description={service.description}
              detailedDescription={service.detailedDescription}
              industryExamples={service.industryExamples}
              caseStudy={service.caseStudy}
              keywords={service.keywords}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;