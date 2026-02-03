import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CalendarIcon, LocationMarkerIcon, AwardIcon, ChevronDownIcon, MailIcon, DevicePhoneMobileIcon, InstagramIcon, LeafIcon, GlobeIcon, BeakerIcon, BookOpenIcon, AcademicCapIcon, TrendingUpIcon, ChainIcon, BugIcon } from '../components/icons/Icons';
import AnimatedSection from '../components/AnimatedSection';
import CountdownTimer from '../components/CountdownTimer';

const InfoCard: React.FC<{ icon: React.ElementType, children: React.ReactNode, title: string }> = ({ icon: Icon, children, title }) => (
    <div className="bg-white border border-gray-200/80 rounded-lg p-6 w-full text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-center mb-4">
            <div className="bg-primary-gold/10 p-3 rounded-full">
                <Icon className="w-8 h-8 text-primary-gold" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-dark-text mb-3">{title}</h3>
        <div className="text-gray-600 space-y-2">
            {children}
        </div>
    </div>
);

const Accordion: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200/80 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 font-semibold text-dark-text hover:bg-gray-50 transition-colors rounded-lg text-left"
            >
                <span className="text-lg">{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-2 text-gray-600 border-t border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>I Simposio Internacional sobre Biodiversidad y Biotecnología Vegetal 2026 | Varadero, Cuba</title>
                <meta name="description" content="Únete al primer simposio internacional sobre biodiversidad y biotecnología vegetal. Inscripciones abiertas." />
                <meta name="keywords" content="simposio, biodiversidad, biotecnología vegetal, Cuba, Varadero, conferencia científica, botánica" />
                <meta property="og:title" content="I Simposio Internacional sobre Biodiversidad y Biotecnología Vegetal 2026" />
                <meta property="og:description" content="Únete al primer simposio internacional en Varadero, Cuba. 1 de febrero 2026." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://tusitio.com" />
            </Helmet>



            {/* Hero Section */}
            <section
                className="min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 flex flex-col justify-center items-center text-center p-4 sm:p-6 lg:p-8 pb-28 md:pb-32 relative overflow-hidden bg-white scroll-mt-20 list-none"
                style={{ paddingTop: '2rem', listStyle: 'none' }}
            >
                {/* Decorative elements - más sutiles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-gold/3 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-blue/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                        <div className="absolute top-10 right-20 w-2 h-2 bg-primary-gold/20 rounded-full"></div>
                        <div className="absolute bottom-32 left-16 w-3 h-3 bg-primary-gold/15 rounded-full"></div>
                        <div className="absolute top-40 left-32 w-1.5 h-1.5 bg-secondary-blue/20 rounded-full"></div>
                        <div className="absolute bottom-48 right-40 w-2.5 h-2.5 bg-primary-gold/10 rounded-full"></div>
                    </div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Logo con efecto de resplandor */}
                    <div className="relative mb-8 sm:mb-10">
                        <div className="absolute inset-0 bg-primary-gold/5 rounded-full blur-2xl scale-110 animate-pulse-slow"></div>
                        <img
                            src="/logo.png"
                            alt="Logo Simposio Biodiversidad y Biotecnología Vegetal"
                            className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 mx-auto object-contain animate-fade-in drop-shadow-2xl"
                        />
                    </div>

                    {/* Badge de edición */}
                    <div className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in border border-primary-gold/20">
                        <span className="w-2 h-2 bg-primary-gold rounded-full animate-pulse"></span>
                        Primera Edición 2026
                    </div>

                    {/* Título principal con gradiente */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-dark-text animate-fade-in px-4 mb-6">
                        <span className="block mb-2">I Simposio Internacional sobre</span>
                        <span className="block bg-gradient-to-r from-primary-gold via-yellow-500 to-primary-gold bg-clip-text text-transparent">
                            Biodiversidad y Biotecnología Vegetal
                        </span>
                    </h1>

                    <div className="inline-block animate-fade-in mb-6" style={{ animationDelay: '0.2s' }}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/20 to-yellow-600/20 blur-xl"></div>
                            <h2 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary-gold via-yellow-500 to-yellow-700">
                                "SYMBIŌSIS 2026"
                            </h2>
                        </div>
                        <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium tracking-wide">
                            Conectando Ciencia y Naturaleza
                        </p>
                    </div>

                    {/* Línea decorativa */}
                    <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-gold/50"></div>
                        <div className="w-2 h-2 bg-primary-gold/30 rounded-full"></div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-gold/50"></div>
                    </div>


                    {/* Descripción breve */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in leading-relaxed px-4" style={{ animationDelay: '0.4s' }}>
                        Únete a investigadores y estudiantes de todo el mundo en un encuentro único dedicado al futuro de la biodiversidad y las novedades de la biotecnología vegetal.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <Link
                            to="/register"
                            className="group relative inline-flex items-center gap-2 bg-white text-primary-gold font-semibold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full border-2 border-primary-gold hover:bg-primary-gold hover:text-white transition-all transform hover:scale-105"
                            aria-label="Inscríbete al simposio ahora"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></span>
                            <span className="relative">INSCRÍBETE AHORA</span>
                            <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>

                    {/* Stats o highlights */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-gold mb-1">8</div>
                            <div className="text-xs sm:text-sm text-gray-600">Comisiones</div>
                        </div>
                        <div className="text-center border-x border-gray-200">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-gold mb-1">3</div>
                            <div className="text-xs sm:text-sm text-gray-600">Días de Ciencia</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-gold mb-1">∞</div>
                            <div className="text-xs sm:text-sm text-gray-600">Oportunidades</div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator mejorado */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-xs text-gray-400 font-medium">Descubre más</span>
                    <svg className="w-6 h-6 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>


            <div className="space-y-12 md:space-y-20 mt-12 md:mt-20">
                {/* Information Key Cards */}
                <AnimatedSection className="flex flex-col md:flex-row gap-4 sm:gap-6 px-4 sm:px-0">
                    <InfoCard icon={CalendarIcon} title="Fechas Importantes">
                        <p><strong>Inscripciones:</strong> 15 de febrero al 15 de abril</p>
                    </InfoCard>
                    <InfoCard icon={LocationMarkerIcon} title="Ubicación">
                        <p>Edificio Varona</p>
                        <p>Universidad de la Habana</p>
                        <a href="https://maps.app.goo.gl/A2Rrh2tYeC1fn7bP8" target="_blank" rel="noopener noreferrer" className="text-secondary-blue font-semibold hover:underline flex items-center justify-center gap-1">
                            <LocationMarkerIcon className="w-4 h-4" />
                            Ver mapa
                        </a>
                    </InfoCard>
                    <InfoCard icon={AwardIcon} title="Beneficios">
                        <p>Certificado de Participación</p>
                        <p>Premiación a Mejores Trabajos</p>
                        <p>Oportunidades de Networking</p>
                    </InfoCard>
                </AnimatedSection>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-12 text-dark-text">Información detallada</h2>

                <AnimatedSection className="px-4 sm:px-0">
                    <Accordion title="Sobre el Simposio">
                        <p>Un encuentro científico para explorar el futuro de la biodiversidad vegetal. El simposio reunirá a investigadores, estudiantes y profesionales para compartir los últimos avances en conservación, genética y biotecnología aplicada. Espera tres días de ciencia, innovación y colaboración internacional.</p>
                    </Accordion>
                </AnimatedSection>

                {/* Comisiones Section */}
                <AnimatedSection id="comisiones" className="px-4 sm:px-0">

                    <Accordion title="Comisiones del Simposio">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: "Biología Animal", icon: BugIcon },
                                { name: "Biología Vegetal", icon: LeafIcon },
                                { name: "Funcionamiento de Ecosistemas, Medio Ambiente y Cambio Climático", icon: GlobeIcon },
                                { name: "Biotecnología Vegetal", icon: ChainIcon },
                                { name: "Potencialidades de Los Extractos Vegetales", icon: BeakerIcon },
                                { name: "Optimización de Productos Vegetales", icon: TrendingUpIcon },
                                { name: "Historia y Personalidades de la Biotecnología vegetal", icon: BookOpenIcon },
                                { name: "Colegio Universitario", icon: AcademicCapIcon }
                            ].map((commission, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-primary-gold group flex flex-col items-center text-center h-full">
                                    <div className="bg-primary-gold/10 p-4 rounded-full mb-4 group-hover:bg-primary-gold group-hover:text-white transition-colors duration-300">
                                        <commission.icon className="w-8 h-8 text-primary-gold group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-primary-gold transition-colors duration-300">
                                        {commission.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </Accordion>
                </AnimatedSection>

                {/* About the Event */}


                {/* Patrocinadores Section */}
                <AnimatedSection id="patrocinadores" className="text-center px-4 sm:px-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-dark-text mb-8 sm:mb-12">Patrocinadores</h2>
                    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-8 sm:py-12 px-4 sm:px-6 rounded-xl border border-gray-200">
                        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 transition-all duration-500">
                            {/* Placeholder para logos de patrocinadores */}
                            {[1, 2, 3, 4].map((sponsor) => (
                                <div
                                    key={sponsor}
                                    className="group relative"
                                >
                                    <div className="w-32 h-20 sm:w-40 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md">
                                        <img
                                            src={`/sponsors/sponsor${sponsor}.png`}
                                            alt={`Patrocinador ${sponsor}`}
                                            className="max-w-full max-h-full object-contain p-4 opacity-70 group-hover:opacity-100 transition-opacity"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = `<span class="text-gray-400 font-semibold text-sm">Patrocinador ${sponsor}</span>`;
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-gray-500 text-sm">
                            ¿Interesado en patrocinar? <a href="#contacto" className="text-primary-gold font-semibold hover:underline">Contáctanos</a>
                        </p>
                    </div>
                </AnimatedSection>

                {/* Countdown CTA */}
                <AnimatedSection className="text-center px-4 sm:px-0">
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-dark-text">¡ No pierdas tiempo !</h2>
                    <p className="mb-8 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        El período de inscripción para el simposio finaliza pronto. Asegura tu lugar para ser parte de este encuentro científico único.
                    </p>
                    <CountdownTimer targetDate="2026-04-15T23:59:59" />
                    <Link
                        to="/register"
                        className="mt-10 inline-block bg-primary-gold text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-lg hover:bg-yellow-700 transition-all transform hover:scale-105"
                        aria-label="Inscríbete al simposio"
                    >
                        INSCRÍBETE AHORA
                    </Link>
                </AnimatedSection>

                {/* Contact */}
                <AnimatedSection id="contacto" className="text-center px-4 sm:px-0">
                    <h2 className="text-2xl font-bold text-dark-text mb-6">Contacto</h2>
                    <p className="text-gray-600 mb-6 max-w-xl mx-auto text-sm sm:text-base">
                        ¿Tienes preguntas? Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        <a
                            href="mailto:symbiosis.contacto12@gmail.com"
                            className="p-3 bg-gray-100 rounded-full hover:bg-primary-gold hover:text-white transition-all transform hover:scale-110 shadow-sm hover:shadow-md"
                            aria-label="Enviar correo electrónico"
                        >
                            <MailIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </a>
                        <a
                            href="tel:+53123456789"
                            className="p-3 bg-gray-100 rounded-full hover:bg-primary-gold hover:text-white transition-all transform hover:scale-110 shadow-sm hover:shadow-md"
                            aria-label="Llamar por teléfono"
                        >
                            <DevicePhoneMobileIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </a>
                        <a
                            href="https://instagram.com/simposio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-gray-100 rounded-full hover:bg-primary-gold hover:text-white transition-all transform hover:scale-110 shadow-sm hover:shadow-md"
                            aria-label="Seguir en Instagram"
                        >
                            <InstagramIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </a>
                    </div>
                    <div className="mt-8 text-gray-600 text-sm sm:text-base">
                        <p><strong>Email:</strong> <br />symbiosis.contacto12@gmail.com</p>
                        <br />
                        <p><strong>Teléfonos:</strong> <br /> +5356680418 <br /> +5354547503 <br /> +5359390323</p>
                    </div>
                </AnimatedSection>

            </div>


        </>
    );
};

export default HomePage;
