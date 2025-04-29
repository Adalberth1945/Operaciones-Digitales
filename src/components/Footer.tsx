import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Mail, Phone, MapPin, Linkedin, Twitter, Github, Instagram, Youtube, Loader, CheckCircle, Star, StarHalf, Lock, Eye, EyeOff } from 'lucide-react';

const TESTIMONIAL_WEBHOOK_URL = 'https://n8n-cloud-digitalops.onrender.com/webhook/Webhook';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [rating, setRating] = useState(5);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Estados para la clave de encriptación
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  
  // Función para verificar la clave de encriptación
  const verifyEncryptionKey = () => {
    const correctKey = "WX1QsJ62h4sTZzjNSKnpENC8Y82CBwsb";
    
    if (encryptionKey === correctKey) {
      setIsKeyVerified(true);
      setKeyError(null);
      // Limpiar el campo de la clave una vez verificada por seguridad
      setEncryptionKey('');
    } else {
      setKeyError("Clave incorrecta. Por favor, introduce la clave proporcionada.");
      setIsKeyVerified(false);
    }
  };
  
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !testimonialText || !consent) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Preparar datos para enviar al webhook - usar el mismo formato de los otros formularios
      const formData = {
        name,
        position,
        message: testimonialText,
        rating,
        consent,
        tipo: "testimonial"
      };
      
      // Simular éxito en caso de error de red
      let simulateSuccess = false;
      
      try {
        // Enviar datos al webhook con un timeout para evitar esperas prolongadas
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
        
        const response = await fetch(TESTIMONIAL_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
          mode: 'cors' // Asegurar que se manejen adecuadamente las solicitudes CORS
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        
        // Registro para depuración
        console.log("Testimonio enviado:", formData);
      } catch (fetchError: any) {
        console.warn("Error al conectar con el webhook:", fetchError.message);
        
        // Almacenar localmente cuando el webhook no está disponible
        const savedTestimonials = JSON.parse(localStorage.getItem('pendingTestimonials') || '[]');
        savedTestimonials.push({
          ...formData,
          date: new Date().toISOString()
        });
        localStorage.setItem('pendingTestimonials', JSON.stringify(savedTestimonials));
        
        // Considerar éxito para UX, pero mostrar mensaje informativo
        simulateSuccess = true;
        setErrorMessage("Guardamos tu testimonio localmente ya que el servidor está temporalmente no disponible.");
      }
      
      // Establecer éxito (real o simulado)
      setSubmitSuccess(true);
      
      // Limpiar campos después de un envío exitoso
      setTimeout(() => {
        setName('');
        setPosition('');
        setTestimonialText('');
        setRating(5);
        setConsent(false);
        setSubmitSuccess(null);
        setErrorMessage(null);
        setIsKeyVerified(false); // Requerir verificación de clave para enviar otro testimonio
      }, 3000);
      
    } catch (error: any) {
      console.error("Error al procesar el testimonio:", error);
      setSubmitSuccess(false);
      setErrorMessage(`Error al enviar: ${error.message}`);
      
      // Resetear estado de error después de un tiempo
      setTimeout(() => {
        setSubmitSuccess(null);
        setErrorMessage(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating selector
  const renderRatingSelector = () => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          className="focus:outline-none"
          aria-label={`${i} estrellas`}
        >
          <Star 
            className={`w-6 h-6 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
          />
        </button>
      );
    }
    
    return (
      <div className="flex space-x-1">
        {stars}
      </div>
    );
  };
  
  return (
    <footer className="bg-gray-950 border-t border-gray-800 relative" itemScope itemType="https://schema.org/Organization">
      {/* Animated gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-cyan-400 mr-2" />
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" itemProp="name">
                  Operaciones Digitales
                </h3>
                <p className="text-xs tracking-wider text-gray-400">SpA</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4" itemProp="description">
              Transformando el futuro empresarial a través de la inteligencia artificial y la automatización avanzada.
            </p>
            <div className="flex space-x-3">
              <motion.a 
                href="https://www.linkedin.com/company/operaciones-digitales/" 
                aria-label="LinkedIn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
                itemProp="sameAs"
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com/op_digitales" 
                aria-label="Twitter/X"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-blue-400 hover:text-white transition-colors duration-300"
                itemProp="sameAs"
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a 
                href="https://github.com/operaciones-digitales" 
                aria-label="GitHub"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-300"
                itemProp="sameAs"
              >
                <Github size={18} />
              </motion.a>
              <motion.a 
                href="https://www.youtube.com/channel/operaciones-digitales" 
                aria-label="YouTube"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-red-600 hover:text-white transition-colors duration-300"
                itemProp="sameAs"
              >
                <Youtube size={18} />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/operaciones.digitales/" 
                aria-label="Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white transition-colors duration-300"
                itemProp="sameAs"
              >
                <Instagram size={18} />
              </motion.a>
            </div>
          </div>
          
          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Servicios</h3>
            <ul className="space-y-2">
              {['Automatización con IA', 'Agentes Inteligentes', 'Transformación Digital', 'Soluciones Personalizadas', 'Big Data & Analytics'].map((service) => (
                <li key={service}>
                  <a href="#servicios" className="text-gray-400 hover:text-cyan-400 transition-colors group flex items-center">
                    <span className="w-0 h-0.5 bg-cyan-500 inline-block group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div itemScope itemType="https://schema.org/PostalAddress">
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyan-400 mr-3 mt-0.5" />
                <a href="https://maps.google.com/?q=Uno+Sur+numero+609+Talca+Chile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <span itemProp="streetAddress">Uno Sur número 609</span>, <span itemProp="addressLocality">Talca</span><br />
                  <span itemProp="addressRegion">Región del Maule</span>, <span itemProp="addressCountry">Chile</span>
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-400 mr-3" />
                <a href="tel:+56948597114" className="text-gray-400 hover:text-cyan-400 transition-colors" itemProp="telephone">
                  +56 9 48597114
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-400 mr-3" />
                <a href="mailto:contacto@digitaloperations.cl" className="text-gray-400 hover:text-cyan-400 transition-colors" itemProp="email">
                  contacto@digitaloperations.cl
                </a>
              </li>
            </ul>
          </div>
          
          {/* Testimonial Submission Form */}
          <div id="compartir-experiencia">
            <h3 className="text-lg font-semibold mb-4 text-white">Comparte Tu Experiencia</h3>
            
            {!isKeyVerified ? (
              <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 mb-3">
                  Para compartir tu experiencia, introduce la clave de acceso proporcionada:
                </p>
                <div className="flex mb-2">
                  <div className="relative w-full">
                    <input
                      type={showKey ? "text" : "password"}
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder="Clave de acceso"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-10 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={verifyEncryptionKey}
                    className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                  >
                    <Lock size={16} className="mr-1" />
                    Verificar
                  </button>
                </div>
                {keyError && (
                  <p className="text-red-400 text-xs mt-1">{keyError}</p>
                )}
                <p className="text-gray-500 text-xs mt-3 italic">
                  Esta clave es proporcionada exclusivamente a clientes y colaboradores para compartir testimonios verificados.
                </p>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleTestimonialSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Cargo / Empresa (opcional)"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="Tu experiencia con nosotros"
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <p className="text-gray-400 text-xs mb-1">Tu valoración:</p>
                  {renderRatingSelector()}
                </div>
                
                <div className="flex items-start mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 text-cyan-600"
                      required
                    />
                  </div>
                  <label htmlFor="consent" className="ml-2 text-xs text-gray-400">
                    Doy mi consentimiento para que mi testimonio aparezca en el sitio web.
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !testimonialText || !consent}
                  className="w-full bg-cyan-500 text-white rounded-md px-3 py-2 hover:bg-cyan-600 transition-colors disabled:bg-gray-600 disabled:text-gray-300 text-sm flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : submitSuccess === true ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    "Enviar Testimonio"
                  )}
                </button>
                
                {submitSuccess === true && (
                  <p className="text-green-400 text-xs">¡Gracias por compartir tu experiencia!</p>
                )}
                {submitSuccess === false && (
                  <p className="text-red-400 text-xs">Hubo un error. Por favor intenta nuevamente.</p>
                )}
                {errorMessage && (
                  <p className="text-yellow-400 text-xs">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 mt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            © {currentYear} Operaciones Digitales SpA. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="/terminos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Términos y Condiciones
            </a>
            <a href="/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;