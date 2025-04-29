import React, { useEffect } from 'react';
import Header from './components/Header';
import Services from './components/Services';
import AppointmentBooking from './components/AppointmentBooking';
import Testimonials from './components/Testimonials';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import RobotAnimation from './components/RobotAnimation';
import Parallax3DEffect from './components/Parallax3DEffect';
import TechPartners from './components/TechPartners';
import WorkflowAnimation from './components/WorkflowAnimation';
import { motion } from 'framer-motion';

function App() {
  // Implement structured data for service offerings
  useEffect(() => {
    // Add dynamic structured data for services
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Service",
          "position": 1,
          "name": "Automatización de procesos con IA",
          "description": "Eliminamos el trabajo manual repetitivo y optimizamos tus operaciones diarias usando inteligencia artificial adaptada a tu negocio.",
          "provider": {
            "@type": "Organization",
            "name": "Operaciones Digitales SpA"
          }
        },
        {
          "@type": "Service",
          "position": 2,
          "name": "Implementación de agentes inteligentes",
          "description": "Incorporamos asistentes virtuales que agilizan tus procesos, respondiendo consultas, procesando información y aprendiendo con cada interacción.",
          "provider": {
            "@type": "Organization",
            "name": "Operaciones Digitales SpA"
          }
        },
        {
          "@type": "Service",
          "position": 3,
          "name": "Consultoría en transformación digital",
          "description": "Te guiamos en la modernización de tu empresa con un plan a medida que incorpora tecnologías innovadoras adaptadas a tus necesidades específicas.",
          "provider": {
            "@type": "Organization",
            "name": "Operaciones Digitales SpA"
          }
        }
      ]
    };

    // Add schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(serviceSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Header />
        <main>
          {/* Hero Section with improved spacing */}
          <section className="min-h-[calc(100vh-80px)] flex items-center pt-20 pb-16 md:pt-24 md:pb-24" aria-label="Introducción">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="md:w-1/2 md:pr-8">
                  <Parallax3DEffect depth={15}>
                    <motion.h1 
                      className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      Impulsamos el <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">futuro</span> con IA aplicada
                    </motion.h1>
                  </Parallax3DEffect>
                  <motion.p 
                    className="text-gray-300 text-xl mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Transformamos empresas mediante soluciones avanzadas de inteligencia artificial y automatización que optimizan procesos y potencian resultados.
                  </motion.p>
                  <motion.div 
                    className="flex flex-wrap gap-4 sm:flex-nowrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <a href="#servicios" className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-base sm:text-lg hover:scale-105">
                      Descubre Cómo
                    </a>
                    <a href="#agenda" className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2 border-cyan-500 text-cyan-400 rounded-full font-medium hover:bg-cyan-500/10 transition-all text-base sm:text-lg hover:scale-105">
                      Agenda una Demo
                    </a>
                  </motion.div>
                </div>
                <motion.div 
                  className="md:w-1/2 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Parallax3DEffect depth={25} perspective={1200}>
                    <div className="relative w-full h-80 sm:h-96 md:h-[500px] flex items-center justify-center">
                      <RobotAnimation className="scale-150 sm:scale-[1.75]" />
                    </div>
                  </Parallax3DEffect>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Workflow Animation Section */}
          <section className="py-10" aria-label="Transformación de Procesos">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Transformamos el Caos en Orden</span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Optimizamos tus procesos de negocio, convirtiendo flujos desordenados en sistemas eficientes y automatizados. 
              
                </p>
              </motion.div>
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 mb-16">
                <WorkflowAnimation className="h-72 md:h-96" />
              </div>
            </div>
          </section>
          
          <Services />
          <TechPartners />
          <AppointmentBooking />
          <Testimonials />
          <AboutUs />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;