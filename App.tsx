
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
  CloudLightning,
  Music,
  Baby,
  ArrowRight
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
  HERO_PHRASES,
  MINISTRIES
} from './constants';
import { getDailyVerse, getDailyPrayer } from './services/geminiService';

// --- Icon Mapping Helper ---
const IconComponent: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  const icons: Record<string, any> = { Music, Users, Baby, Heart };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} className={className} />;
};

// --- Intersection Observer Hook ---
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

// --- Typewriter Effect ---
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
        setSpeed(100);
        
        if (currentText === fullText) {
          setSpeed(3000); 
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setSpeed(50);
        
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
      <span className="animate-pulse border-r-4 border-yellow-400 ml-1 h-8 md:h-12 lg:h-16 inline-block align-middle"></span>
    </span>
  );
};

// --- Daily Insights Section ---
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
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-l-8 border-yellow-500 transform hover:-translate-y-2 transition-all duration-500">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-yellow-500 animate-pulse" />
          <h3 className="text-blue-900 font-black uppercase tracking-widest text-[10px]">Palavra para hoje</h3>
        </div>
        {verse ? (
          <>
            <p className="text-lg md:text-xl font-serif text-blue-900 italic mb-4 leading-relaxed">"{verse.verse}"</p>
            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
              <span className="font-black text-yellow-600 text-sm">{verse.reference}</span>
              <p className="text-[11px] text-gray-500 max-w-[180px] text-right font-medium italic">{verse.reflection}</p>
            </div>
          </>
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-300 animate-pulse">Inspirando sua alma...</div>
        )}
      </div>

      <div className="bg-blue-900/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-l-8 border-blue-400 transform hover:-translate-y-2 transition-all duration-500 text-white">
        <div className="flex items-center gap-2 mb-4">
          <CloudLightning size={16} className="text-blue-300 animate-bounce" />
          <h3 className="text-blue-100 font-black uppercase tracking-widest text-[10px]">Intercessão Diária</h3>
        </div>
        {prayer ? (
          <>
            <h4 className="text-lg font-bold mb-3 text-yellow-400">{prayer.title}</h4>
            <p className="text-sm md:text-base font-light leading-relaxed mb-4 text-blue-50 italic">"{prayer.prayer}"</p>
            <div className="flex justify-end border-t border-white/10 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Em Nome de Jesus, Amém!</span>
            </div>
          </>
        ) : (
          <div className="h-24 flex items-center justify-center text-blue-700 animate-pulse">Conectando ao trono da graça...</div>
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
    { label: "📍 Localização exata", msg: "Olá! Como faço para chegar na igreja?" },
    { label: "🙏 Pedidos de oração", msg: "Olá! Gostaria de deixar um pedido de oração." },
    { label: "🗣️ Atendimento Pastoral", msg: "Olá! Gostaria de uma orientação espiritual." },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-[2rem] shadow-2xl mb-4 w-72 md:w-80 overflow-hidden border border-gray-100 animate-fade-up">
          <div className="bg-blue-900 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-black text-blue-900 shadow-inner">A</div>
              <div><p className="font-bold text-sm">Secretaria Digital</p><p className="text-[10px] text-blue-200">Disponível agora</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
          </div>
          <div className="p-5 bg-gray-50 h-72 overflow-y-auto space-y-4">
            <div className="bg-white p-4 rounded-2xl text-sm shadow-sm border border-gray-100 font-medium text-blue-900">
              Paz do Senhor! Como podemos ser uma bênção para sua vida hoje? Escolha uma opção abaixo:
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}?text=${encodeURIComponent(opt.msg)}`, '_blank')}
                  className="w-full text-left p-3.5 text-xs bg-white text-blue-900 rounded-xl border border-gray-100 hover:border-blue-900 hover:bg-blue-50 transition-all shadow-sm flex items-center justify-between group font-bold"
                >
                  {opt.label} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-green-500 hover:bg-green-600 text-white p-4 md:p-5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group overflow-hidden">
        <div className="absolute inset-0 btn-shimmer opacity-30"></div>
        <MessageCircle size={28} />
        <span className="hidden group-hover:block font-bold pr-2 text-sm">Fale Conosco</span>
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', neighborhood: '', message: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${formState.name}, moro em ${formState.neighborhood}. Desejo oração por: ${formState.message}`;
    window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}?text=${encodeURIComponent(text)}`, '_blank');
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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('inicio')}>
            <div className="bg-blue-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-900/20">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-black text-blue-900 leading-tight uppercase">Igreja Pentecostal Mundial</h1>
              <p className="text-[10px] text-yellow-600 font-black uppercase tracking-widest">Aliança Com Deus</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-10 font-bold text-[10px] lg:text-xs uppercase tracking-widest text-gray-500">
            {['Início', 'Sobre', 'Cultos', 'Regiões', 'Contato'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} className="hover:text-blue-900 transition-colors relative group py-2">
                {item} <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <button onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')} className="bg-blue-900 text-white px-7 py-3 rounded-full hover:bg-blue-800 transition-all shadow-xl">VOU VISITAR</button>
          </div>
          <button className="md:hidden p-2 text-blue-900 hover:bg-gray-100 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b shadow-2xl p-6 flex flex-col gap-4 animate-fade-up">
            {['Início', 'Sobre', 'Cultos', 'Regiões', 'Contato'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} className="text-left py-4 px-6 rounded-2xl hover:bg-blue-50 text-blue-900 font-bold text-lg border border-transparent hover:border-blue-100 transition-all">
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <header id="inicio" className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-950">
          <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1920&auto=format&fit=crop" alt="Igreja" className="w-full h-full object-cover opacity-40 animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-block px-5 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-8 animate-fade-up">
            <span className="text-yellow-400 font-black text-[9px] md:text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-2">
              <Sparkles size={14} /> Bem-vindo à Aliança Com Deus
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-tight animate-fade-up h-[3.5em] md:h-[3em] lg:h-auto">
            <Typewriter />
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-up">
            Um lugar de cura, restauração e onde o poder de Deus é manifesto em cada coração de Petrolina.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-up">
            <button onClick={() => scrollTo('regioes')} className="w-full sm:w-auto px-10 py-5 bg-yellow-500 text-blue-950 font-black rounded-full hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-2xl group">
              ONDE ESTAMOS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')} className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-2xl">
              <MessageCircle size={22} className="text-green-400" /> WHATSAPP
            </button>
          </div>
        </div>
      </header>

      {/* Daily Content Overlap */}
      <section className="relative px-4">
        <DailyInsights />
      </section>

      {/* Leadership */}
      <section id="sobre" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Nossa Liderança" subtitle="Pastores que amam a Deus e cuidam do povo com temor e sabedoria." />
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-12 md:mt-16">
            {[
              { name: LEADER_PRESIDENT, role: "Presidente", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", desc: "Um homem de oração e palavra profética, liderando a Aliança com Deus." },
              { name: LEADER_VP, role: "Vice-Presidente", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", desc: "Uma mulher guerreira, dedicada ao ministério de mulheres e famílias." }
            ].map((leader, i) => {
              const revealRef = useReveal();
              return (
                <div key={i} ref={revealRef} className="reveal group relative overflow-hidden rounded-[2rem] shadow-2xl bg-blue-900 h-[500px] md:h-[600px]">
                  <img src={leader.img} alt={leader.name} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white transform group-hover:-translate-y-2 transition-transform">
                    <p className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{leader.role}</p>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">{leader.name}</h3>
                    <p className="text-blue-100 text-base md:text-lg font-light mb-8 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity">{leader.desc}</p>
                    <div className="flex gap-4">
                      <a href="#" className="p-3 bg-white/10 hover:bg-yellow-500 hover:text-blue-900 rounded-xl transition-all"><Instagram size={20} /></a>
                      <a href="#" className="p-3 bg-white/10 hover:bg-blue-600 rounded-xl transition-all"><Facebook size={20} /></a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ministries Staggered Reveal */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Nossos Ministérios" subtitle="Onde você pode servir e crescer espiritualmente conosco." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MINISTRIES.map((m, i) => {
              const revealRef = useReveal();
              return (
                <div key={i} ref={revealRef} className="reveal bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:bg-blue-900 hover:text-white transition-all duration-500 transform hover:-translate-y-3">
                  <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:text-yellow-400 transition-colors">
                    <IconComponent name={m.icon} size={32} />
                  </div>
                  <h4 className="text-xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">{m.title}</h4>
                  <p className="text-sm font-light text-gray-500 group-hover:text-blue-100 transition-colors leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="cultos" className="py-24 md:py-32 bg-blue-950 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle light title="Agenda de Vitória" subtitle="Dias e horários que mudarão sua história para sempre." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SCHEDULE.map((item, i) => {
              const revealRef = useReveal();
              return (
                <div key={item.id} ref={revealRef} className="reveal bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/10 transition-all hover:bg-white/15 hover:shadow-3xl group" style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="text-yellow-400 font-black mb-6 text-[11px] uppercase tracking-widest">{item.data}</div>
                  <div className="text-white text-3xl font-black mb-4">{item.horario}</div>
                  <h4 className="text-white font-serif text-xl mb-6 group-hover:text-yellow-400">{item.titulo}</h4>
                  <p className="text-blue-200 text-sm font-light leading-relaxed group-hover:text-white transition-colors">{item.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regions Focus */}
      <section id="regioes" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-8 leading-tight">Petrolina e Região,<br /><span className="text-yellow-500">Jesus está te chamando!</span></h2>
              <p className="text-lg text-gray-600 mb-10 font-light leading-relaxed">Não importa onde você mora, nossa igreja está de portas abertas para você. No Serrote do Urubu, construímos um refúgio espiritual para todos que buscam a presença de Deus.</p>
              <div className="space-y-6">
                <div className="flex gap-6 p-6 bg-blue-50 rounded-3xl border border-blue-100 group hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><MapPin size={28} /></div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Acesso Facilitado</h4>
                    <p className="text-sm text-gray-500">Estamos em uma localização privilegiada, com fácil acesso pelas principais vias da região.</p>
                  </div>
                </div>
                <div className="flex gap-6 p-6 bg-yellow-50 rounded-3xl border border-yellow-100 group hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-yellow-500 text-blue-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Users size={28} /></div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Ambiente Familiar</h4>
                    <p className="text-sm text-gray-500">Venha como você está. Aqui você encontrará amigos que se tornarão irmãos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-yellow-500 rounded-[3rem] rotate-3 transform group-hover:rotate-0 transition-transform duration-700"></div>
                <img src="https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=1000&auto=format&fit=crop" alt="Petrolina" className="relative z-10 rounded-[3rem] shadow-2xl group-hover:-translate-x-3 group-hover:-translate-y-3 transition-transform duration-700" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
              <h4 className="text-2xl font-serif font-bold text-blue-900 mb-10">Bairros Atendidos</h4>
              <div className="grid gap-6">
                {NEIGHBORHOODS.map((b, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-gray-50 pb-6 group cursor-default">
                    <div className="max-w-[70%]">
                      <span className="block font-black text-gray-800 text-lg mb-1 group-hover:text-blue-900 transition-colors">{b.nome}</span>
                      <p className="text-sm text-gray-500 font-light group-hover:text-gray-700">{b.instrucoes}</p>
                    </div>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-4 py-2 rounded-full uppercase tracking-tighter">{b.distancia}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-10">
              <div className="bg-blue-900 p-10 rounded-[3rem] shadow-2xl text-white">
                <h4 className="text-2xl font-serif font-bold mb-8">Cidades Vizinhas</h4>
                <div className="grid gap-4">
                  {CITIES.map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/10 group hover:bg-yellow-500 transition-all duration-300">
                      <span className="font-bold group-hover:text-blue-900">{c.nome}</span>
                      <span className="text-xs font-black bg-white/10 px-3 py-1.5 rounded-full group-hover:bg-blue-900 group-hover:text-white">{c.distancia}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div id="contato" className="bg-yellow-500 p-10 rounded-[3rem] shadow-2xl text-blue-950">
                <h4 className="text-2xl font-serif font-bold mb-6">Pedido de Oração</h4>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input required type="text" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} placeholder="Seu Nome" className="w-full bg-white/20 border-b border-blue-950/20 py-3 focus:outline-none focus:border-blue-950 text-blue-950 placeholder-blue-900/50 font-bold" />
                  <input required type="tel" value={formState.phone} onChange={(e) => setFormState({...formState, phone: e.target.value})} placeholder="WhatsApp" className="w-full bg-white/20 border-b border-blue-950/20 py-3 focus:outline-none focus:border-blue-950 text-blue-950 placeholder-blue-900/50 font-bold" />
                  <textarea required rows={3} value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} placeholder="Sua Mensagem de Fé" className="w-full bg-white/20 border-b border-blue-950/20 py-3 focus:outline-none focus:border-blue-950 text-blue-950 placeholder-blue-900/50 font-bold resize-none"></textarea>
                  <button type="submit" className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-blue-800 transition-all shadow-xl flex items-center justify-center gap-3">CLAME CONOSCO <Send size={20} /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-900 p-3 rounded-2xl shadow-xl"><svg className="w-10 h-10 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg></div>
                <div><h1 className="text-xl font-black text-blue-900 leading-tight uppercase">{CHURCH_NAME}</h1><p className="text-xs text-yellow-600 font-black uppercase tracking-[0.2em]">Aliança Com Deus</p></div>
              </div>
              <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md mb-10">Uma comunidade viva, restaurando sonhos e vidas através do Evangelho puro e simples de nosso Senhor Jesus Cristo.</p>
              <div className="flex gap-4">
                {[{ icon: Instagram, color: 'pink-600' }, { icon: Facebook, color: 'blue-700' }, { icon: Youtube, color: 'red-600' }].map((item, i) => (
                  <a key={i} href="#" className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-2 hover:bg-${item.color}`}><item.icon size={28} /></a>
                ))}
              </div>
            </div>

            {/* Menu Rápido with Reveal Child Animation */}
            <div ref={useReveal()} className="reveal">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-[10px] tracking-[0.3em] reveal-child transition-all duration-700" style={{ transitionDelay: '100ms' }}>Menu Rápido</h5>
              <ul className="space-y-5 text-gray-400 font-medium text-sm md:text-base">
                {['Início', 'Sobre Nós', 'Nossos Cultos', 'Regiões', 'Contato'].map((l, idx) => (
                  <li key={l} className="reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: `${(idx + 2) * 150}ms` }}>
                    <button onClick={() => scrollTo(l.toLowerCase().split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} className="hover:text-blue-900 transition-all hover:translate-x-2 flex items-center gap-2 group">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" /> {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fale Conosco with Reveal Child Animation */}
            <div ref={useReveal()} className="reveal">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-[10px] tracking-[0.3em] reveal-child transition-all duration-700" style={{ transitionDelay: '200ms' }}>Fale Conosco</h5>
              <div className="space-y-6 text-gray-500 font-light text-sm md:text-base">
                <p className="flex items-start gap-4 reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '400ms' }}>
                  <MapPin size={24} className="text-yellow-500 shrink-0 mt-1" />
                  <span>{ADDRESS.street}, {ADDRESS.neighborhood}<br />{ADDRESS.city}</span>
                </p>
                <div className="space-y-4">
                  <p className="flex items-center gap-4 group cursor-pointer reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '600ms' }} onClick={() => window.open(`tel:${CONTACTS.phone.replace(/\D/g, '')}`)}>
                    <Phone size={20} className="text-yellow-500 group-hover:rotate-12 transition-transform" /><span className="group-hover:text-blue-900 font-medium transition-colors">{CONTACTS.phone}</span>
                  </p>
                  <p className="flex items-center gap-4 group cursor-pointer reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '800ms' }} onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`)}>
                    <MessageCircle size={20} className="text-green-500 group-hover:scale-110 transition-transform" /><span className="group-hover:text-blue-900 font-medium transition-colors">{CONTACTS.whatsapp1}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {CHURCH_NAME}. Todos os direitos reservados.</p>
            <p className="flex items-center gap-2">
              Desenvolvido <span className="text-red-500 animate-heartbeat"><Heart size={18} fill="currentColor" /></span> por{' '}
              <a href="https://supremasite.com.br" target="_blank" className="font-black text-blue-900 hover:text-yellow-600 transition-colors flex items-center gap-1 group">
                Suprema Sites Express <ExternalLink size={12} />
              </a>
            </p>
          </div>
        </div>
      </footer>

      <Chatbot />
      
      <style>{`
        .reveal.active .reveal-child { opacity: 1; transform: translateX(0); }
        .hover\\:bg-pink-600:hover { background-color: #db2777 !important; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8 !important; }
        .hover\\:bg-red-600:hover { background-color: #dc2626 !important; }
      `}</style>
    </div>
  );
};

export default App;
