
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle, 
  ChevronRight,
  Send,
  Heart,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  Sparkles,
  CloudLightning
} from 'lucide-react';
import { 
  CHURCH_NAME, 
  LEADER_PRESIDENT, 
  LEADER_VP, 
  CONTACTS, 
  ADDRESS, 
  SCHEDULE, 
  NEIGHBORHOODS, 
  CITIES,
  SOCIAL_LINKS,
  HERO_PHRASES
} from './constants';
import { getDailyVerse, getDailyPrayer } from './services/geminiService';

// --- Intersection Observer Hook for Scroll Animations ---
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

// --- Subcomponents ---

const Typewriter: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = HERO_PHRASES[currentPhraseIndex];
      
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setSpeed(150);
        
        if (currentText === fullText) {
          setSpeed(2000); // Wait before start deleting
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setSpeed(75);
        
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
          setSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, speed]);

  return (
    <span className="text-yellow-400 min-h-[1.2em] inline-block">
      {currentText}
      <span className="animate-pulse border-r-4 border-yellow-400 ml-1 h-8 md:h-12 inline-block align-middle"></span>
    </span>
  );
};

const DailyInsights: React.FC = () => {
  const [verse, setVerse] = useState<any>(null);
  const [prayer, setPrayer] = useState<any>(null);
  const revealRef = useReveal();

  useEffect(() => {
    getDailyVerse().then(setVerse);
    getDailyPrayer().then(setPrayer);
  }, []);

  return (
    <div ref={revealRef} className="reveal grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4 -mt-20 md:-mt-24 relative z-20">
      {/* Versículo Card */}
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-l-8 border-yellow-500 transform hover:-translate-y-2 transition-all duration-500">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-yellow-500 animate-pulse" />
          <h3 className="text-blue-900 font-black uppercase tracking-widest text-[10px]">Versículo do Dia</h3>
        </div>
        {verse ? (
          <>
            <p className="text-lg md:text-xl font-serif text-blue-900 italic mb-4 leading-relaxed">"{verse.verse}"</p>
            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
              <span className="font-black text-yellow-600 text-sm tracking-tighter">{verse.reference}</span>
              <p className="text-[11px] text-gray-500 max-w-[180px] text-right font-medium italic">{verse.reflection}</p>
            </div>
          </>
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-300 animate-pulse">Carregando palavra...</div>
        )}
      </div>

      {/* Oração Card */}
      <div className="bg-blue-900/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-l-8 border-blue-400 transform hover:-translate-y-2 transition-all duration-500 text-white">
        <div className="flex items-center gap-2 mb-4">
          <CloudLightning size={16} className="text-blue-300 animate-bounce" />
          <h3 className="text-blue-100 font-black uppercase tracking-widest text-[10px]">Oração do Dia</h3>
        </div>
        {prayer ? (
          <>
            <h4 className="text-lg font-bold mb-3 text-yellow-400">{prayer.title}</h4>
            <p className="text-sm md:text-base font-light leading-relaxed mb-4 text-blue-50 italic">
              "{prayer.prayer}"
            </p>
            <div className="flex justify-end border-t border-white/10 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Amém</span>
            </div>
          </>
        ) : (
          <div className="h-24 flex items-center justify-center text-blue-700 animate-pulse">Buscando intercessão...</div>
        )}
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => {
  const revealRef = useReveal();
  return (
    <div ref={revealRef} className="reveal text-center mb-16 px-4">
      <h2 className={`text-3xl md:text-5xl font-serif font-bold ${light ? 'text-white' : 'text-blue-900'} mb-6 tracking-tight leading-tight`}>
        {title}
      </h2>
      {subtitle && <p className={`max-w-2xl mx-auto text-base md:text-lg ${light ? 'text-blue-100' : 'text-gray-600 font-light'}`}>{subtitle}</p>}
      <div className={`w-20 md:w-24 h-1.5 mx-auto mt-8 rounded-full ${light ? 'bg-yellow-400' : 'bg-yellow-500 shadow-lg shadow-yellow-500/30'}`}></div>
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "🕒 Horários de cultos", msg: "Olá! Gostaria de saber os horários dos cultos." },
    { label: "📍 Localização", msg: "Olá! Como faço para chegar na igreja?" },
    { label: "🙏 Pedidos de oração", msg: "Olá! Gostaria de deixar um pedido de oração." },
    { label: "🗣️ Falar com um líder", msg: "Olá! Gostaria de conversar com um dos pastores/líderes." },
  ];

  const handleRedirect = (msg: string) => {
    const url = `https://wa.me/${CONTACTS.whatsapp1Raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-[2rem] shadow-2xl mb-4 w-72 md:w-80 overflow-hidden border border-gray-100 animate-fade-up">
          <div className="bg-blue-900 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-black text-blue-900 shadow-inner">A</div>
              <div>
                <p className="font-bold text-sm">Atendente Virtual</p>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online agora
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
          </div>
          <div className="p-5 bg-gray-50 h-72 overflow-y-auto space-y-4">
            <div className="bg-white p-4 rounded-2xl text-sm shadow-sm border border-gray-100 font-medium text-blue-900 leading-relaxed">
              Paz do Senhor! Bem-vindo à <strong>{CHURCH_NAME}</strong>. Como o Espírito Santo pode te tocar hoje?
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleRedirect(opt.msg)}
                  className="w-full text-left p-3.5 text-xs bg-white text-blue-900 rounded-xl border border-gray-100 hover:border-blue-900 hover:bg-blue-50 transition-all shadow-sm flex items-center justify-between group font-bold"
                >
                  {opt.label}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white p-4 md:p-5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group relative overflow-hidden"
      >
        <div className="absolute inset-0 btn-shimmer opacity-30"></div>
        <MessageCircle size={28} />
        <span className="hidden group-hover:block font-bold pr-2 text-sm">Atendimento</span>
      </button>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', neighborhood: '', message: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${formState.name}, moro em ${formState.neighborhood}. ${formState.message}`;
    const url = `https://wa.me/${CONTACTS.whatsapp1Raw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-yellow-200 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('inicio')}>
            <div className="bg-blue-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-900/20">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-black text-blue-900 leading-tight uppercase tracking-tighter">Igreja Pentecostal Mundial</h1>
              <p className="text-[10px] text-yellow-600 font-black uppercase tracking-widest">Aliança Com Deus</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-10 font-bold text-[10px] lg:text-xs uppercase tracking-widest text-gray-500">
            {['Início', 'Sobre', 'Cultos', 'Localização', 'Contato'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} 
                className="hover:text-blue-900 transition-colors relative group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')}
              className="bg-blue-900 text-white px-5 lg:px-7 py-3 rounded-full hover:bg-blue-800 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              FALAR AGORA
            </button>
          </div>

          <button className="md:hidden p-2 text-blue-900 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b shadow-2xl p-6 flex flex-col gap-4 animate-fade-up">
            {['Início', 'Sobre', 'Cultos', 'Localização', 'Contato'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                className="text-left py-4 px-6 rounded-2xl hover:bg-blue-50 text-blue-900 font-bold text-lg border border-transparent hover:border-blue-100 transition-all"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')}
              className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black shadow-2xl mt-4 active:scale-95 transition-transform"
            >
              PEDIR ORAÇÃO AGORA
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header id="inicio" className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-950">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1920&auto=format&fit=crop" 
            alt="Congregação" 
            className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-block px-5 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-8 animate-fade-up" style={{animationDelay: '0.1s'}}>
            <span className="text-yellow-400 font-black text-[9px] md:text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-2">
              <Sparkles size={14} className="shrink-0" /> Seja Bem-vindo à Casa do Pai
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 md:mb-8 leading-[1.1] animate-fade-up h-[3.5em] md:h-[2.5em] lg:h-auto" style={{animationDelay: '0.3s'}}>
            <Typewriter />
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-up" style={{animationDelay: '0.5s'}}>
            Uma comunidade pentecostal comprometida com a verdade bíblica e o agir sobrenatural do Espírito Santo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-up" style={{animationDelay: '0.7s'}}>
            <button 
              onClick={() => scrollTo('cultos')}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-yellow-500 text-blue-950 font-black rounded-full hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 group shadow-2xl active:scale-95"
            >
              PROGRAMAÇÃO <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
            >
              <MessageCircle size={22} className="text-green-400" /> WHATSAPP
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity hidden md:block" onClick={() => scrollTo('sobre')}>
          <div className="w-1 h-12 bg-gradient-to-b from-yellow-500 to-transparent rounded-full mx-auto"></div>
        </div>
      </header>

      {/* Daily Insights Component (Verse + Prayer Overlap) */}
      <section className="relative px-4">
        <DailyInsights />
      </section>

      {/* Leadership Section */}
      <section id="sobre" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle 
            title="Nossa Liderança" 
            subtitle="Conheça aqueles que, guiados pelo Espírito, pastoreiam nossa amada congregação."
          />
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-12 md:mt-16">
            {[
              { name: LEADER_PRESIDENT, role: "Presidente", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", desc: "Dedicado ao ensino da palavra e ao avanço do Reino." },
              { name: LEADER_VP, role: "Vice-Presidente", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", desc: "Uma voz de profecia e cuidado pastoral para as famílias." }
            ].map((leader, i) => {
              const revealRef = useReveal();
              return (
                <div key={i} ref={revealRef} className="reveal group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-2xl bg-blue-900 h-[500px] md:h-[600px]">
                  <img src={leader.img} alt={leader.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/20 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.3em] mb-3">{leader.role}</p>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">{leader.name}</h3>
                    <p className="text-blue-100 text-base md:text-lg font-light mb-8 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">{leader.desc}</p>
                    <div className="flex gap-4">
                      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-yellow-500 hover:text-blue-900 rounded-2xl transition-all shadow-xl"><Instagram size={20} /></a>
                      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-blue-600 rounded-2xl transition-all shadow-xl"><Facebook size={20} /></a>
                      <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-red-600 rounded-2xl transition-all shadow-xl"><Youtube size={20} /></a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-24 md:mt-32 grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              { icon: Users, title: "Missão", text: "Levar a luz do Evangelho e transformar Petrolina através do amor incondicional de Jesus." },
              { icon: Heart, title: "Visão", text: "Ser uma família espiritual onde todos são acolhidos, restaurados e capacitados para o propósito." },
              { icon: Calendar, title: "Valores", text: "Fundamentados na oração, santidade bíblica e comunhão fervorosa entre os irmãos." }
            ].map((item, i) => {
              const revealRef = useReveal();
              return (
                <div key={i} ref={revealRef} className="reveal text-center group px-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-blue-100 group-hover:bg-blue-900 group-hover:text-white transition-all duration-500">
                    <item.icon size={32} />
                  </div>
                  <h4 className="text-xl md:text-2xl font-serif font-bold text-blue-900 mb-4">{item.title}</h4>
                  <p className="text-sm md:text-lg text-gray-500 leading-relaxed font-light">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="cultos" className="py-24 md:py-32 bg-blue-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle 
            light 
            title="Horários de Culto" 
            subtitle="Momentos proféticos de adoração, milagres e ensinamento da Palavra."
          />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SCHEDULE.map((item, i) => {
              const revealRef = useReveal();
              return (
                <div 
                  key={item.id} 
                  ref={revealRef}
                  className="reveal bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 transition-all duration-500 transform hover:scale-105 hover:bg-white/15 hover:shadow-3xl group cursor-default"
                  style={{transitionDelay: `${i * 100}ms`}}
                >
                  <div className="text-yellow-400 font-black mb-6 tracking-widest text-[11px] uppercase">{item.data}</div>
                  <div className="text-white text-3xl md:text-4xl font-black mb-4">{item.horario}</div>
                  <h4 className="text-white font-serif text-xl md:text-2xl mb-6 group-hover:text-yellow-400 transition-colors leading-tight">{item.titulo}</h4>
                  <p className="text-blue-200 text-sm md:text-base leading-relaxed group-hover:text-white transition-colors font-light">
                    {item.descricao}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-16 md:mt-20 text-center">
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')}
              className="w-full sm:w-auto bg-white text-blue-950 px-8 md:px-12 py-4 md:py-5 rounded-full font-black shadow-2xl hover:bg-yellow-500 transition-all inline-flex items-center justify-center gap-3 transform hover:scale-110 active:scale-95 group"
            >
              <Phone size={24} className="group-hover:rotate-12 transition-transform" /> AGENDAR VISITA
            </button>
          </div>
        </div>
      </section>

      {/* Locations & Contact */}
      <section id="localizacao" className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle 
            title="Onde Estamos" 
            subtitle="Localizados no coração do Serrote do Urubu, prontos para receber você."
          />

          <div className="grid lg:grid-cols-3 gap-12 md:gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white p-4 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 h-[400px] md:h-[550px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-900 flex items-center justify-center flex-col p-8 md:p-12 text-center text-white">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-500 text-blue-950 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 animate-bounce shadow-2xl shadow-yellow-500/20">
                    <MapPin size={32} />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4">{ADDRESS.street}</h4>
                  <p className="text-lg md:text-xl text-blue-200 mb-8 md:mb-10 max-w-md font-light">{ADDRESS.neighborhood}, {ADDRESS.city}</p>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS.street + ', ' + ADDRESS.neighborhood + ', ' + ADDRESS.city)}`, '_blank')}
                    className="bg-white text-blue-950 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black hover:bg-yellow-500 transition-all flex items-center gap-3 shadow-2xl"
                  >
                    ABRIR GPS <ExternalLink size={20} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100">
                  <h4 className="text-xl md:text-2xl font-serif font-bold text-blue-900 mb-8 flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div> Bairros Próximos
                  </h4>
                  <ul className="space-y-6 md:space-y-8">
                    {NEIGHBORHOODS.map((b, i) => (
                      <li key={i} className="group border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-base md:text-lg">{b.nome}</span>
                          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full uppercase">{b.distancia}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 font-light">{b.instrucoes}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100">
                  <h4 className="text-xl md:text-2xl font-serif font-bold text-blue-900 mb-8 flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div> Atendemos Também
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {CITIES.map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-4 md:p-5 rounded-2xl bg-gray-50 hover:bg-blue-900 hover:text-white transition-all duration-300 group shadow-sm">
                        <span className="font-bold text-gray-700 group-hover:text-white">{c.nome}</span>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full group-hover:bg-white/10 group-hover:text-yellow-400">{c.distancia}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="contato" className="bg-blue-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-3xl text-white">
              <h4 className="text-3xl md:text-4xl font-serif font-bold mb-10">Pedido de Oração</h4>
              <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-2">Seu Nome</label>
                  <input required type="text" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} placeholder="Como se chama?" className="w-full bg-white/5 border-b border-white/10 py-3 focus:outline-none focus:border-yellow-500 text-white placeholder-white/20 transition-all font-light" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-2">WhatsApp</label>
                  <input required type="tel" value={formState.phone} onChange={(e) => setFormState({...formState, phone: e.target.value})} placeholder="(87) 00000-0000" className="w-full bg-white/5 border-b border-white/10 py-3 focus:outline-none focus:border-yellow-500 text-white placeholder-white/20 transition-all font-light" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-2">Sua Mensagem</label>
                  <textarea required rows={4} value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} placeholder="Como podemos interceder por você?" className="w-full bg-white/5 border-b border-white/10 py-3 focus:outline-none focus:border-yellow-500 text-white placeholder-white/20 transition-all font-light resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black py-5 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 group">
                  ENVIAR PEDIDO <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 md:pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 md:gap-20 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-900 p-2 md:p-3 rounded-2xl">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-base md:text-lg font-black text-blue-900 leading-tight uppercase tracking-tighter">{CHURCH_NAME}</h1>
                  <p className="text-[9px] md:text-xs text-yellow-600 font-black uppercase tracking-[0.2em]">Aliança Com Deus</p>
                </div>
              </div>
              <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed max-w-md mb-10">
                Uma voz que clama no deserto, restaurando o altar da adoração em cada coração e guiando Petrolina à salvação.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, link: SOCIAL_LINKS.instagram, color: 'hover:bg-pink-600' },
                  { icon: Facebook, link: SOCIAL_LINKS.facebook, color: 'hover:bg-blue-700' },
                  { icon: Youtube, link: SOCIAL_LINKS.youtube, color: 'hover:bg-red-600' }
                ].map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-500 transform hover:scale-110 ${item.color} shadow-sm`}>
                    <item.icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            <div ref={useReveal()} className="reveal transition-all duration-1000 opacity-0 translate-y-8 active:opacity-100 active:translate-y-0">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Menu Rápido</h5>
              <ul className="space-y-4 md:space-y-5 text-sm md:text-base text-gray-400 font-medium">
                {['Início', 'Sobre Nós', 'Nossos Cultos', 'Localização', 'Contato'].map((l, idx) => (
                  <li key={l} className="reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: `${(idx + 1) * 150}ms` }}>
                    <button onClick={() => scrollTo(l.toLowerCase().split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} className="hover:text-blue-900 transition-all hover:translate-x-2 flex items-center gap-2 group">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /> {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div ref={useReveal()} className="reveal transition-all duration-1000 opacity-0 translate-y-8 active:opacity-100 active:translate-y-0">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Fale Conosco</h5>
              <div className="space-y-5 md:space-y-6 text-gray-500 font-light text-sm md:text-lg">
                <p className="flex items-start gap-4 reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '200ms' }}>
                  <MapPin size={24} className="text-yellow-500 shrink-0 mt-1" />
                  <span>{ADDRESS.street}, {ADDRESS.neighborhood}<br />{ADDRESS.city}</span>
                </p>
                <div className="space-y-3">
                  <p className="flex items-center gap-4 group cursor-pointer reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '400ms' }} onClick={() => window.open(`tel:${CONTACTS.phone.replace(/\D/g, '')}`)}>
                    <Phone size={20} className="text-yellow-500 group-hover:rotate-12 transition-transform" />
                    <span className="group-hover:text-blue-900 transition-colors font-medium">{CONTACTS.phone}</span>
                  </p>
                  <p className="flex items-center gap-4 group cursor-pointer reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '600ms' }} onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`)}>
                    <MessageCircle size={20} className="text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-blue-900 transition-colors font-medium">{CONTACTS.whatsapp1}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {CHURCH_NAME}. Todos os direitos reservados.</p>
            <p className="flex items-center gap-2">
              Desenvolvido <span className="text-red-500 animate-heartbeat"><Heart size={18} fill="currentColor" /></span> por{' '}
              <a href="https://supremasite.com.br" target="_blank" rel="noopener noreferrer" className="font-black text-blue-900 hover:text-yellow-600 transition-colors flex items-center gap-2 group">
                Suprema Sites Express <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Component */}
      <Chatbot />
      
      {/* Global Style for reveal child animations */}
      <style>{`
        .reveal.active .reveal-child {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

export default App;
