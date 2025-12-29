
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
  Sparkles
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
  SOCIAL_LINKS
} from './constants';
import { getDailyVerse } from './services/geminiService';

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

const DailyVerse: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const revealRef = useReveal();

  useEffect(() => {
    getDailyVerse().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div ref={revealRef} className="reveal bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-l-8 border-yellow-500 max-w-2xl mx-auto -mt-16 relative z-10">
      <h3 className="text-blue-900 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
        <Sparkles size={14} className="text-yellow-500" /> Versículo do Dia
      </h3>
      <p className="text-xl font-serif text-blue-900 italic mb-3">"{data.verse}"</p>
      <div className="flex justify-between items-end">
        <span className="font-bold text-yellow-600">{data.reference}</span>
        <p className="text-sm text-gray-600 max-w-xs text-right italic">{data.reflection}</p>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => {
  const revealRef = useReveal();
  return (
    <div ref={revealRef} className="reveal text-center mb-16">
      <h2 className={`text-4xl md:text-5xl font-serif font-bold ${light ? 'text-white' : 'text-blue-900'} mb-4 tracking-tight`}>
        {title}
      </h2>
      {subtitle && <p className={`max-w-2xl mx-auto text-lg ${light ? 'text-blue-100' : 'text-gray-600 font-light'}`}>{subtitle}</p>}
      <div className={`w-24 h-1.5 mx-auto mt-8 rounded-full ${light ? 'bg-yellow-400' : 'bg-yellow-500 shadow-lg shadow-yellow-500/30'}`}></div>
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
        <div className="bg-white rounded-3xl shadow-2xl mb-4 w-80 overflow-hidden border border-gray-100 animate-fade-up">
          <div className="bg-blue-900 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-blue-900 shadow-inner">A</div>
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
            <div className="bg-white p-4 rounded-2xl text-sm shadow-sm border border-gray-100">
              Paz do Senhor! Bem-vindo à <strong>{CHURCH_NAME}</strong>. Como podemos abençoar sua vida hoje?
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleRedirect(opt.msg)}
                  className="w-full text-left p-3.5 text-xs bg-white text-blue-900 rounded-xl border border-gray-100 hover:border-blue-900 hover:bg-blue-50 transition-all shadow-sm flex items-center justify-between group"
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
        className="bg-green-500 hover:bg-green-600 text-white p-4.5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group relative overflow-hidden"
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
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('inicio')}>
            <div className="bg-blue-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-900/20">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-blue-900 leading-tight uppercase tracking-tighter">Igreja Pentecostal Mundial</h1>
              <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest">Aliança Com Deus</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 font-bold text-xs uppercase tracking-widest text-gray-500">
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
              className="bg-blue-900 text-white px-7 py-3 rounded-full hover:bg-blue-800 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
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
              className="w-full bg-blue-900 text-white py-5 rounded-2xl font-bold shadow-2xl mt-4 active:scale-95 transition-transform"
            >
              PEDIR ORAÇÃO AGORA
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header id="inicio" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-950">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1920&auto=format&fit=crop" 
            alt="Congregação" 
            className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block px-6 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-8 animate-fade-up" style={{animationDelay: '0.1s'}}>
            <span className="text-yellow-400 font-bold text-xs tracking-[0.4em] uppercase flex items-center gap-2">
              <Sparkles size={14} /> Seja Bem-vindo à Casa do Pai
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] animate-fade-up" style={{animationDelay: '0.3s'}}>
            Firmando sua Aliança <br className="hidden md:block" /> com <span className="text-yellow-400">o Criador.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-up" style={{animationDelay: '0.5s'}}>
            Uma comunidade de fé comprometida com a verdade bíblica e o agir sobrenatural do Espírito Santo em Petrolina.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up" style={{animationDelay: '0.7s'}}>
            <button 
              onClick={() => scrollTo('cultos')}
              className="w-full sm:w-auto px-10 py-5 bg-yellow-500 text-blue-950 font-black rounded-full hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-yellow-500/20 active:scale-95"
            >
              VER PROGRAMAÇÃO <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')}
              className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
            >
              <MessageCircle size={22} className="text-green-400" /> WHATSAPP
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => scrollTo('sobre')}>
          <div className="w-1 h-12 bg-gradient-to-b from-yellow-500 to-transparent rounded-full mx-auto"></div>
        </div>
      </header>

      {/* Daily Verse Component */}
      <section className="px-4">
        <DailyVerse />
      </section>

      {/* Leadership Section */}
      <section id="sobre" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle 
            title="Nossa Liderança" 
            subtitle="Conheça aqueles que, guiados pelo Espírito, pastoreiam nossa amada congregação."
          />
          
          <div className="grid md:grid-cols-2 gap-16 mt-16">
            {[
              { name: LEADER_PRESIDENT, role: "Presidente", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", desc: "Dedicado ao ensino da palavra e ao avanço do Reino." },
              { name: LEADER_VP, role: "Vice-Presidente", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", desc: "Uma voz de profecia e cuidado pastoral para as famílias." }
            ].map((leader, i) => {
              const revealRef = useReveal();
              return (
                <div key={i} ref={revealRef} className="reveal group relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-blue-900 h-[600px]">
                  <img src={leader.img} alt={leader.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/20 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-[0.3em] mb-3">{leader.role}</p>
                    <h3 className="text-4xl font-serif font-bold mb-4">{leader.name}</h3>
                    <p className="text-blue-100 text-lg font-light mb-8 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">{leader.desc}</p>
                    <div className="flex gap-4">
                      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white/10 hover:bg-yellow-500 hover:text-blue-900 rounded-2xl transition-all shadow-xl"><Instagram size={22} /></a>
                      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white/10 hover:bg-blue-600 rounded-2xl transition-all shadow-xl"><Facebook size={22} /></a>
                      <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white/10 hover:bg-red-600 rounded-2xl transition-all shadow-xl"><Youtube size={22} /></a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-32 grid md:grid-cols-3 gap-16">
            {[
              { icon: Users, title: "Missão", text: "Levar a luz do Evangelho e transformar Petrolina através do amor incondicional de Jesus." },
              { icon: Heart, title: "Visão", text: "Ser uma família espiritual onde todos são acolhidos, restaurados e capacitados para o propósito." },
              { icon: Calendar, title: "Valores", text: "Fundamentados na oração, santidade bíblica e comunhão fervorosa entre os irmãos." }
            ].map((item, i) => {
              const revealRef = useReveal();
              return (
                <div key={i} ref={revealRef} className="reveal text-center group">
                  <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-blue-100 group-hover:bg-blue-900 group-hover:text-white group-hover:-rotate-12 transition-all duration-500">
                    <item.icon size={36} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-blue-900 mb-4">{item.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-lg font-light">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="cultos" className="py-32 bg-blue-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle 
            light 
            title="Horários de Culto" 
            subtitle="Momentos proféticos de adoração, milagres e ensinamento da Palavra."
          />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SCHEDULE.map((item, i) => {
              const revealRef = useReveal();
              return (
                <div 
                  key={item.id} 
                  ref={revealRef}
                  className="reveal bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 transition-all duration-500 transform hover:scale-105 hover:bg-white/15 hover:shadow-3xl hover:shadow-yellow-500/10 group cursor-default"
                  style={{transitionDelay: `${i * 100}ms`}}
                >
                  <div className="text-yellow-400 font-black mb-6 tracking-widest text-sm uppercase">{item.data}</div>
                  <div className="text-white text-4xl font-black mb-4">{item.horario}</div>
                  <h4 className="text-white font-serif text-2xl mb-6 group-hover:text-yellow-400 transition-colors leading-tight">{item.titulo}</h4>
                  <p className="text-blue-200 text-base leading-relaxed group-hover:text-white transition-colors font-light">
                    {item.descricao}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-20 text-center">
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')}
              className="bg-white text-blue-950 px-12 py-5 rounded-full font-black shadow-2xl hover:bg-yellow-500 hover:text-blue-950 transition-all inline-flex items-center gap-3 transform hover:scale-110 active:scale-95 group"
            >
              <Phone size={24} className="group-hover:rotate-12 transition-transform" /> AGENDAR UMA VISITA
            </button>
          </div>
        </div>
      </section>

      {/* Locations & Neighborhoods */}
      <section id="localizacao" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle 
            title="Onde Estamos" 
            subtitle="Localizados no coração do Serrote do Urubu, prontos para receber você e sua família."
          />

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white p-5 rounded-[3rem] shadow-2xl border border-gray-100 h-[550px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-900 group-hover:bg-blue-950 transition-colors duration-700 flex items-center justify-center flex-col p-12 text-center text-white">
                  <div className="w-24 h-24 bg-yellow-500 text-blue-950 rounded-[2rem] flex items-center justify-center mb-8 animate-bounce shadow-2xl shadow-yellow-500/20">
                    <MapPin size={48} />
                  </div>
                  <h4 className="text-3xl font-serif font-bold mb-4">{ADDRESS.street}</h4>
                  <p className="text-xl text-blue-200 mb-10 max-w-md font-light">{ADDRESS.neighborhood}, {ADDRESS.city}</p>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS.street + ', ' + ADDRESS.neighborhood + ', ' + ADDRESS.city)}`, '_blank')}
                    className="bg-white text-blue-950 px-10 py-5 rounded-2xl font-black hover:bg-yellow-500 transition-all flex items-center gap-3 shadow-2xl active:scale-95 group/map"
                  >
                    ABRIR GPS <ExternalLink size={20} className="group-hover/map:translate-x-1 group-hover/map:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                  <h4 className="text-2xl font-serif font-bold text-blue-900 mb-8 flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div> Bairros Próximos
                  </h4>
                  <ul className="space-y-8">
                    {NEIGHBORHOODS.map((b, i) => (
                      <li key={i} className="group cursor-default border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-lg group-hover:text-blue-900 transition-colors">{b.nome}</span>
                          <span className="text-xs font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full uppercase tracking-tighter">{b.distancia}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-light group-hover:text-gray-700 transition-colors">{b.instrucoes}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                  <h4 className="text-2xl font-serif font-bold text-blue-900 mb-8 flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div> Atendemos Também
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {CITIES.map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-gray-50 hover:bg-blue-900 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-lg">
                        <span className="font-bold text-gray-700 group-hover:text-white">{c.nome}</span>
                        <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full group-hover:bg-white/10 group-hover:text-yellow-400">{c.distancia}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="contato" className="bg-blue-950 rounded-[3rem] p-12 shadow-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
              <h4 className="text-4xl font-serif font-bold mb-10">Pedido de Oração</h4>
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="group">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-3 group-focus-within:text-yellow-500 transition-colors">Seu Nome</label>
                  <input 
                    required
                    type="text" 
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    placeholder="Como se chama?" 
                    className="w-full bg-white/5 border-b border-white/10 px-0 py-3 focus:outline-none focus:border-yellow-500 text-white placeholder-white/20 transition-all text-lg font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-3">WhatsApp</label>
                  <input 
                    required
                    type="tel" 
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    placeholder="(87) 00000-0000" 
                    className="w-full bg-white/5 border-b border-white/10 px-0 py-3 focus:outline-none focus:border-yellow-500 text-white placeholder-white/20 transition-all text-lg font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-3">Sua Mensagem</label>
                  <textarea 
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    placeholder="Conte-nos como podemos orar por você..." 
                    className="w-full bg-white/5 border-b border-white/10 px-0 py-3 focus:outline-none focus:border-yellow-500 text-white placeholder-white/20 transition-all text-lg font-light resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black py-6 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 group"
                >
                  ENVIAR NO WHATSAPP <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>

              <div className="mt-16 pt-16 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.open(`tel:${CONTACTS.phone.replace(/\D/g, '')}`)}>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-blue-950 transition-all duration-300">
                    <Phone size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Telefone Direto</p>
                    <p className="text-xl font-bold">{CONTACTS.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`)}>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                    <MessageCircle size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">WhatsApp Sede</p>
                    <p className="text-xl font-bold">{CONTACTS.whatsapp1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-20 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-8 group cursor-pointer" onClick={() => scrollTo('inicio')}>
                <div className="bg-blue-900 p-3 rounded-2xl group-hover:rotate-6 transition-transform shadow-xl">
                  <svg className="w-10 h-10 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-black text-blue-900 leading-tight uppercase tracking-tighter">{CHURCH_NAME}</h1>
                  <p className="text-xs text-yellow-600 font-black uppercase tracking-[0.2em]">Aliança Com Deus</p>
                </div>
              </div>
              <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md mb-10">
                Uma voz que clama no deserto, preparando o caminho do Senhor e restaurando o altar da adoração em cada coração.
              </p>
              <div className="flex gap-5">
                {[
                  { icon: Instagram, link: SOCIAL_LINKS.instagram, color: 'hover:bg-pink-600' },
                  { icon: Facebook, link: SOCIAL_LINKS.facebook, color: 'hover:bg-blue-700' },
                  { icon: Youtube, link: SOCIAL_LINKS.youtube, color: 'hover:bg-red-600' }
                ].map((item, i) => (
                  <a 
                    key={i}
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 ${item.color} shadow-sm hover:shadow-2xl`}
                  >
                    <item.icon size={28} />
                  </a>
                ))}
              </div>
            </div>

            {/* Menu Rápido com Animação */}
            <div ref={useReveal()} className="reveal">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-xs tracking-[0.3em]">Menu Rápido</h5>
              <ul className="space-y-5 text-base text-gray-400 font-medium">
                {['Início', 'Sobre Nós', 'Nossos Cultos', 'Localização', 'Contato'].map((l, idx) => (
                  <li key={l} style={{ transitionDelay: `${idx * 100}ms` }}>
                    <button 
                      onClick={() => scrollTo(l.toLowerCase().split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} 
                      className="hover:text-blue-900 transition-all hover:translate-x-2 flex items-center gap-2 group"
                    >
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /> {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Onde Estamos com Animação */}
            <div ref={useReveal()} className="reveal">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-xs tracking-[0.3em]">Onde Estamos</h5>
              <div className="space-y-6 text-gray-500 font-light">
                <p className="flex items-start gap-4 text-lg">
                  <MapPin size={24} className="text-yellow-500 shrink-0 mt-1" />
                  <span>{ADDRESS.street}, {ADDRESS.neighborhood}<br />{ADDRESS.city}</span>
                </p>
                <div className="space-y-3">
                  <p className="flex items-center gap-4 text-lg group cursor-pointer" onClick={() => window.open(`tel:${CONTACTS.phone.replace(/\D/g, '')}`)}>
                    <Phone size={20} className="text-yellow-500 group-hover:rotate-12 transition-transform" />
                    <span className="group-hover:text-blue-900 transition-colors font-medium">{CONTACTS.phone}</span>
                  </p>
                  <p className="flex items-center gap-4 text-lg group cursor-pointer" onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`)}>
                    <MessageCircle size={20} className="text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-blue-900 transition-colors font-medium">{CONTACTS.whatsapp1}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} {CHURCH_NAME}. Vida e Aliança.</p>
            <p className="flex items-center gap-2">
              Desenvolvido <span className="text-red-500 animate-heartbeat"><Heart size={18} fill="currentColor" /></span> por{' '}
              <a 
                href="https://supremasite.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-black text-blue-900 hover:text-yellow-600 transition-colors flex items-center gap-2 group"
              >
                Suprema Sites Express <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Component */}
      <Chatbot />
    </div>
  );
};

export default App;
