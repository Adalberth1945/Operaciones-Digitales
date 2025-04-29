import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Users, MessageSquare, CheckCircle, Loader, Mail, Video } from 'lucide-react';
import Parallax3DEffect from './Parallax3DEffect';

// Constants for calendar display
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const HOURS = ['9:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

// Get current date info for calendar generation with Santiago timezone
const getChileDate = () => {
  const options = { timeZone: 'America/Santiago' };
  const now = new Date();
  
  // Get the Chile formatted date
  const chileDate = new Date(now.toLocaleString('en-US', options));
  return chileDate;
};

const today = getChileDate();
const currentMonth = today.toLocaleString('es-ES', { month: 'long' });
const currentYear = today.getFullYear();

// Contact modes
type ContactMode = 'email' | 'meeting';

const AppointmentBooking: React.FC = () => {
  // Form data state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  
  // Meeting specific state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Form mode state
  const [contactMode, setContactMode] = useState<ContactMode>('email');
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submissionType, setSubmissionType] = useState<ContactMode>('email');
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Generate dates for the next 5 working days based on Chile timezone
  const generateDates = () => {
    const dates = [];
    let currentDate = getChileDate(); // Use Chile's current date
    
    while (dates.length < 5) {
      currentDate.setDate(currentDate.getDate() + 1);
      // Skip weekends (0 is Sunday, 6 is Saturday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push({
          day: currentDate.getDate(),
          date: new Date(currentDate),
          dayName: DAYS[dates.length] // Map to Lun, Mar, etc.
        });
      }
    }
    
    return dates;
  };

  const dates = generateDates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }
    
    // Para el modo reunión, verificar que haya seleccionado fecha y hora
    if (contactMode === 'meeting' && (!selectedDate || !selectedTime)) {
      alert("Por favor seleccione fecha y hora para la reunión");
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionType(contactMode);
    
    try {
      const webhookUrl = 'https://n8n-cloud-digitalops.onrender.com/webhook/Webhook';
      
      let formData;
      
      if (contactMode === 'email') {
        formData = {
          name,
          email,
          company,
          message,
          tipo: "email"
        };
      } else {
        // Formatear la fecha para mostrarla en un formato más amigable
        const dateObj = new Date(selectedDate!);
        const formattedDate = dateObj.toLocaleDateString('es-CL'); // Usar formato chileno
        
        formData = {
          name,
          email,
          company,
          message,
          date: formattedDate,
          time: selectedTime,
          tipo: "reunión"
        };
      }
      
      console.log("Enviando datos:", formData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("Respuesta recibida:", await response.json());
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
    setSelectedDate(null);
    setSelectedTime(null);
    setSubmitSuccess(null);
    setContactMode('email'); // Restablecer al modo predeterminado
  };

  // Verificar si el formulario está listo para ser enviado
  const isFormValid = () => {
    if (!name || !email) return false;
    if (contactMode === 'meeting' && (!selectedDate || !selectedTime)) return false;
    return true;
  };

  // Obtener nombre del mes en español con primera letra mayúscula
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <section id="agenda" className="py-16 sm:py-20 relative">
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
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Contáctanos</span>
            </h2>
          </Parallax3DEffect>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Envíanos tu consulta o programa una reunión personalizada con nuestros especialistas para explorar cómo podemos transformar tu negocio.
          </p>
        </motion.div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-gray-800 shadow-xl max-w-4xl mx-auto">
          {submitSuccess === true ? (
            <div className="p-5 sm:p-6 rounded-lg bg-green-900/20 flex flex-col items-center text-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {submissionType === 'meeting' ? '¡Solicitud de Reunión Recibida!' : '¡Consulta Enviada!'}
              </h3>
              <p className="text-gray-300 mb-6">
                {submissionType === 'meeting' ? (
                  <>
                    Gracias por agendar una demostración con nosotros. Hemos recibido tu solicitud para el día {new Date(selectedDate!).toLocaleDateString('es-CL')} a las {selectedTime}. 
                    Te contactaremos pronto para confirmar los detalles.
                  </>
                ) : (
                  <>
                    Hemos recibido tu consulta y nos pondremos en contacto contigo a la brevedad posible 
                    a través del correo electrónico proporcionado: {email}.
                  </>
                )}
              </p>
              <button
                onClick={resetForm}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-sm sm:text-base"
              >
                {submissionType === 'meeting' ? 'Solicitar otra cita' : 'Enviar otra consulta'}
              </button>
            </div>
          ) : submitSuccess === false ? (
            <div className="p-5 sm:p-6 rounded-lg bg-red-900/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-900/40 flex items-center justify-center mb-4">
                <span className="text-red-400 text-3xl sm:text-4xl">!</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ha ocurrido un error</h3>
              <p className="text-gray-300 mb-6">
                Lo sentimos, no pudimos procesar tu solicitud. Por favor intenta nuevamente o contáctanos directamente.
              </p>
              <button
                onClick={() => setSubmitSuccess(null)}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-sm sm:text-base"
              >
                Intentar nuevamente
              </button>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {/* Selector de modo de contacto */}
              <div className="flex justify-center mb-2">
                <div className="bg-gray-800/80 p-1 rounded-full inline-flex">
                  <button
                    onClick={() => setContactMode('email')}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full flex items-center transition-all text-sm ${
                      contactMode === 'email' 
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white' 
                        : 'hover:bg-gray-700/60 text-gray-300'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Enviar Consulta
                  </button>
                  <button
                    onClick={() => setContactMode('meeting')}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full flex items-center transition-all text-sm ${
                      contactMode === 'meeting' 
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white' 
                        : 'hover:bg-gray-700/60 text-gray-300'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Agendar Reunión
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Calendar Section - Solo visible en modo reunión */}
                {contactMode === 'meeting' && (
                  <div>
                    <div className="mb-5 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                        Selecciona una fecha
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {capitalizeFirstLetter(currentMonth)} {currentYear}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2 mb-6 sm:mb-8">
                      {dates.map((date, index) => (
                        <Parallax3DEffect key={index} depth={7} perspective={500}>
                          <button
                            onClick={() => setSelectedDate(date.date.toISOString())}
                            className={`p-2 sm:p-3 rounded-lg text-center transition-all duration-200 ${
                              selectedDate === date.date.toISOString()
                                ? 'bg-cyan-500 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            <div className="text-xs mb-1">{date.dayName}</div>
                            <div className="text-base sm:text-lg font-semibold">{date.day}</div>
                          </button>
                        </Parallax3DEffect>
                      ))}
                    </div>
                    
                    <div className="mb-5 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                        Selecciona una hora
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {HOURS.map((time) => (
                        <Parallax3DEffect key={time} depth={5} perspective={500}>
                          <button
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-lg text-center transition-all duration-200 ${
                              selectedTime === time
                                ? 'bg-cyan-500 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        </Parallax3DEffect>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Form Section - Se extiende a todo el ancho en modo email */}
                <div className={contactMode === 'email' ? 'col-span-2' : ''}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-cyan-400" />
                      Tus datos
                    </h3>
                    
                    <div className={contactMode === 'email' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                          Nombre completo <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                          Correo electrónico <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1 text-cyan-400" />
                        {contactMode === 'email' ? 'Tu consulta' : '¿En qué podemos ayudarte?'} 
                        {contactMode === 'email' && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={contactMode === 'email' ? 5 : 3}
                        required={contactMode === 'email'}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      ></textarea>
                    </div>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!isFormValid() || isSubmitting}
                      className={`w-full px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium transition-all ${
                        isFormValid() && !isSubmitting
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      } flex justify-center items-center text-sm sm:text-base`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        contactMode === 'email' ? 'Enviar Consulta' : 'Agendar Reunión'
                      )}
                    </motion.button>
                    
                    {contactMode === 'meeting' && selectedDate && selectedTime && (
                      <p className="text-sm text-cyan-400 text-center mt-2">
                        Has seleccionado: {new Date(selectedDate).toLocaleDateString('es-CL')} a las {selectedTime}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppointmentBooking;