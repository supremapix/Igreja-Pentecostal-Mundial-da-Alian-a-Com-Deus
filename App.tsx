
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
  ArrowRight,
  Image as ImageIcon,
  Maximize2
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
  MINISTRIES,
  IMAGES
} from './constants';
import { getDailyVerse, getDailyPrayer } from './services/geminiService';

// --- Components ---

const SmartImage: React.FC<{ 
  imgObj: { src: string; fallback: string }; 
  alt: string; 
  className?: string;
  parallax?: boolean;
}> = ({ imgObj, alt, className = "", parallax = false }) => {
  const [src, setSrc] = useState(imgObj.src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Falha ao carregar: ${imgObj.src}. Usando fallback profissional.`);
      setSrc(imgObj.fallback);
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className} bg-blue-900/10`}>
      {isLoading && (
        <div className="absolute inset-0 bg-blue-900/5 animate-pulse flex items-center justify-center">
          <ImageIcon className="text-blue-300/30" size={32} />
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        className={`
          w-full h-full object-cover transition-all duration-1000
          ${isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
          ${parallax ? 'hover:scale-105' : ''}
        `}
      />
    </div>
  );
};

const IconComponent: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  const icons: Record<string, any> = { Music, Users, Baby, Heart };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} className={className} />;
};

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
        setSpeed(80);
        if (currentText === fullText) {
          setSpeed(3000); 
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setSpeed(40);
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
          <h3 className="text-blue-900 font-black uppercase tracking-widest text-[10px]">Pão Diário</h3>
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
          <div className="h-24 flex items-center justify-center text-gray-300 animate-pulse">Buscando alimento espiritual...</div>
        )}
      </div>

      <div className="bg-blue-900/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-l-8 border-blue-400 transform hover:-translate-y-2 transition-all duration-500 text-white">
        <div className="flex items-center gap-2 mb-4">
          <CloudLightning size={16} className="text-blue-300 animate-bounce" />
          <h3 className="text-blue-100 font-black uppercase tracking-widest text-[10px]">Oração do Dia</h3>
        </div>
        {prayer ? (
          <>
            <h4 className="text-lg font-bold mb-3 text-yellow-400">{prayer.title}</h4>
            <p className="text-sm md:text-base font-light leading-relaxed mb-4 text-blue-50 italic">"{prayer.prayer}"</p>
            <div className="flex justify-end border-t border-white/10 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Amém e Graças a Deus!</span>
            </div>
          </>
        ) : (
          <div className="h-24 flex items-center justify-center text-blue-700 animate-pulse">Intercedendo por você...</div>
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
              <div><p className="font-bold text-sm">Secretaria Digital</p><p className="text-[10px] text-blue-200">Online</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
          </div>
          <div className="p-5 bg-gray-50 h-72 overflow-y-auto space-y-4">
            <div className="bg-white p-4 rounded-2xl text-sm shadow-sm border border-gray-100 font-medium text-blue-900">
              Paz do Senhor! É uma alegria ter você aqui. Como podemos ajudar hoje?
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
        <span className="hidden group-hover:block font-bold pr-2 text-sm">Contatar</span>
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', phone: '', neighborhood: '', message: '' });

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
            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 group-hover:rotate-6 transition-transform">
              <SmartImage imgObj={IMAGES.LOGO} alt="Logo" className="p-1" />
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
            <button onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')} className="bg-blue-900 text-white px-7 py-3 rounded-full hover:bg-blue-800 transition-all shadow-xl font-black uppercase tracking-tighter">Quero Visitar</button>
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
          <SmartImage imgObj={IMAGES.CONGREGATION_PRAISING} alt="Congregação Louvando" className="w-full h-full opacity-50" parallax />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="inline-block px-5 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-8 animate-fade-up">
            <span className="text-yellow-400 font-black text-[9px] md:text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-2">
              <Sparkles size={14} /> Bem-vindo à Casa de Oração para Todos os Povos
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-tight animate-fade-up h-[3.5em] md:h-[3em] lg:h-auto drop-shadow-2xl">
            <Typewriter />
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-up">
            Uma congregação vibrante, fundamentada no poder do Espírito Santo e no amor fraternal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-up">
            <button onClick={() => scrollTo('cultos')} className="w-full sm:w-auto px-10 py-5 bg-yellow-500 text-blue-950 font-black rounded-full hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-2xl group active:scale-95 uppercase text-sm">
              Programação <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`, '_blank')} className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-2xl uppercase text-sm">
              <MessageCircle size={22} className="text-green-400" /> WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* Overlap Content */}
      <section className="relative px-4">
        <DailyInsights />
      </section>

      {/* Leadership */}
      <section id="sobre" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Nossa Liderança" subtitle="Pastores ungidos para guiar e cuidar do povo com amor e autoridade espiritual." />
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-12 md:mt-16">
            <div ref={useReveal()} className="reveal group relative overflow-hidden rounded-[2rem] shadow-2xl bg-blue-900 h-[500px] md:h-[650px]">
              <SmartImage imgObj={IMAGES.FAMILY_2} alt={LEADER_PRESIDENT} className="w-full h-full opacity-80" parallax />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <p className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{LEADER_PRESIDENT} & Família</p>
                <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4">Pastoreio com Amor</h3>
                <p className="text-blue-100 text-base md:text-lg font-light mb-8 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity">Dedicados a levar a palavra profética e a restauração de alianças em todo o mundo.</p>
                <div className="flex gap-4">
                  <a href={SOCIAL_LINKS.instagram} target="_blank" className="p-3 bg-white/10 hover:bg-yellow-500 hover:text-blue-900 rounded-xl transition-all shadow-xl"><Instagram size={20} /></a>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" className="p-3 bg-white/10 hover:bg-blue-600 rounded-xl transition-all shadow-xl"><Facebook size={20} /></a>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div ref={useReveal()} className="reveal bg-blue-50 p-8 md:p-12 rounded-[2.5rem] border border-blue-100 flex-1 flex flex-col justify-center transform transition-all hover:shadow-2xl hover:-translate-y-2">
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-blue-900 mb-6 italic">"Buscai primeiro o Reino de Deus..."</h4>
                <p className="text-lg text-gray-600 font-light leading-relaxed">Nossa história é marcada por milagres e pelo compromisso inabalável com a verdade bíblica. No Serrote do Urubu, somos uma luz que brilha em Petrolina.</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-16 h-1 bg-yellow-500 rounded-full"></div>
                  <span className="font-black text-blue-900 uppercase text-xs tracking-widest">{LEADER_PRESIDENT}</span>
                </div>
              </div>
              <div ref={useReveal()} className="reveal rounded-[2.5rem] overflow-hidden shadow-2xl h-[300px] relative group">
                <SmartImage imgObj={IMAGES.PULPIT_GROUP} alt="Nossa História" className="w-full h-full" parallax />
                <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/20 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h5 className="text-white text-3xl font-serif font-bold drop-shadow-lg mb-2">União & Fé</h5>
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-[0.2em]">Nossa Confraternização</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Gallery Section - Momentos de Glória - CORRIGIDA E ATUALIZADA */}
      <section className="py-24 bg-blue-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle light title="Momentos de Glória" subtitle="Imagens reais que refletem a alegria e a presença manifesta de Deus em nosso meio." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { img: IMAGES.CONGREGATION_PRAISING, title: "Adoração Coletiva" },
              { img: IMAGES.CONGREGATION_SITTING, title: "Comunhão" },
              { img: IMAGES.PULPIT_MEN, title: "Altar Consagrado" },
              { img: IMAGES.PULPIT_GROUP, title: "Liderança Unida" },
              { img: IMAGES.CONGREGATION_SELFIE, title: "Alegria no Templo" },
              { img: IMAGES.FAMILY_1, title: "Famílias no Reino" }
            ].map((item, i) => {
              const revealRef = useReveal();
              return (
                <div 
                  key={i} 
                  ref={revealRef} 
                  className="reveal relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group border border-white/5 bg-blue-900/40"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <SmartImage imgObj={item.img} alt={item.title} className="w-full h-full" parallax />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-60"></div>
                  <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end transform transition-transform group-hover:-translate-y-2">
                    <div>
                      <p className="text-yellow-500 font-black text-[10px] uppercase tracking-widest mb-1">Impacto Real</p>
                      <h4 className="text-white text-xl font-serif font-bold">{item.title}</h4>
                    </div>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/20">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="cultos" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Encontros Marcados" subtitle="Reserve seu tempo para o que realmente importa: Sua comunhão com o Pai." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SCHEDULE.map((item, i) => {
              const revealRef = useReveal();
              return (
                <div key={item.id} ref={revealRef} className="reveal bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 group hover:bg-blue-900 hover:text-white transition-all duration-500 transform hover:-translate-y-4" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="text-yellow-500 font-black mb-6 text-xs uppercase tracking-widest">{item.data}</div>
                  <div className="text-blue-900 text-4xl font-black mb-4 group-hover:text-white">{item.horario}</div>
                  <h4 className="text-blue-900 font-serif text-xl mb-6 group-hover:text-yellow-400">{item.titulo}</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed group-hover:text-blue-100">{item.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regions Focus & Attraction */}
      <section id="regioes" className="py-24 md:py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div ref={useReveal()} className="reveal order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-8 leading-tight">Petrolina e Região,<br /><span className="text-yellow-500">Estamos aqui para você!</span></h2>
              <p className="text-lg text-gray-600 mb-10 font-light leading-relaxed">Localizada no Serrote do Urubu, nossa igreja é um farol para todos os bairros e cidades vizinhas. O caminho é curto para quem busca a eternidade.</p>
              
              <div className="grid gap-6">
                {NEIGHBORHOODS.slice(0, 3).map((b, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all group">
                    <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-all"><MapPin size={24} /></div>
                    <div>
                      <h4 className="font-bold text-blue-900 flex justify-between">
                        {b.nome} <span className="text-[10px] font-black uppercase text-yellow-600">{b.distancia}</span>
                      </h4>
                      <p className="text-sm text-gray-500 font-light mt-1">{b.instrucoes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div ref={useReveal()} className="reveal order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-yellow-500 rounded-[4rem] -rotate-3 blur-2xl opacity-10"></div>
                <div className="relative bg-white p-4 rounded-[4rem] shadow-3xl overflow-hidden">
                  <SmartImage imgObj={IMAGES.CONGREGATION_PRAISING} alt="Congregação" className="rounded-[3rem] h-[400px]" parallax />
                  <div className="absolute -bottom-10 -left-10 bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-2xl hidden md:block animate-bounce-slow">
                    <p className="text-yellow-400 font-black text-xs uppercase mb-1">Capacidade Total</p>
                    <p className="text-2xl font-serif font-bold">Lugar de Multidões</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-900 p-12 rounded-[3rem] shadow-2xl text-white col-span-1 md:col-span-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h4 className="text-3xl font-serif font-bold mb-8 relative z-10">Expandindo o Reino</h4>
              <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                {CITIES.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-6 rounded-2xl bg-white/10 hover:bg-yellow-500 transition-all group/item">
                    <span className="font-bold group-hover/item:text-blue-900">{c.nome}</span>
                    <span className="text-xs font-black bg-white/20 px-4 py-2 rounded-full group-hover/item:bg-blue-900 group-hover/item:text-white">{c.distancia}</span>
                  </div>
                ))}
              </div>
            </div>
            <div id="contato" className="bg-yellow-500 p-12 rounded-[3rem] shadow-2xl text-blue-950 flex flex-col justify-center">
              <div className="w-16 h-16 bg-blue-950 text-white rounded-2xl flex items-center justify-center mb-8"><Sparkles size={32} /></div>
              <h4 className="text-3xl font-serif font-bold mb-6 leading-tight">Deseja um Milagre?</h4>
              <p className="text-blue-900/70 mb-8 font-medium">Deixe seu pedido abaixo. Nossos intercessores clamarão por você agora mesmo.</p>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input required type="text" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} placeholder="Seu Nome" className="w-full bg-blue-900/5 border-b-2 border-blue-950/20 py-3 focus:outline-none focus:border-blue-950 text-blue-950 placeholder-blue-900/40 font-black text-lg transition-all" />
                <textarea required rows={2} value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} placeholder="Seu Clamor..." className="w-full bg-blue-900/5 border-b-2 border-blue-950/20 py-3 focus:outline-none focus:border-blue-950 text-blue-950 placeholder-blue-900/40 font-black text-lg transition-all resize-none"></textarea>
                <button type="submit" className="w-full bg-blue-950 text-white font-black py-5 rounded-2xl hover:bg-blue-800 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">CLAMAR AGORA <Send size={20} /></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16">
                  <SmartImage imgObj={IMAGES.LOGO} alt="Logo" />
                </div>
                <div><h1 className="text-2xl font-black text-blue-900 leading-tight uppercase tracking-tighter">{CHURCH_NAME}</h1><p className="text-xs text-yellow-600 font-black uppercase tracking-[0.2em]">Restaurando Alianças</p></div>
              </div>
              <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md mb-10">Um ministério levantado pelo Senhor para impactar o Serrote do Urubu e toda Petrolina com a glória de Deus.</p>
              <div className="flex gap-5">
                {[{ icon: Instagram, color: '#E1306C' }, { icon: Facebook, color: '#1877F2' }, { icon: Youtube, color: '#FF0000' }].map((item, i) => (
                  <a key={i} href="#" style={{'--hover-color': item.color} as any} className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-2 hover:bg-[var(--hover-color)] shadow-sm`}><item.icon size={28} /></a>
                ))}
              </div>
            </div>

            <div ref={useReveal()} className="reveal">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-[10px] tracking-[0.3em] reveal-child transition-all duration-700">Navegação</h5>
              <ul className="space-y-5 text-gray-400 font-medium">
                {['Início', 'Sobre Nós', 'Nossos Cultos', 'Regiões', 'Contato'].map((l, idx) => (
                  <li key={l} className="reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: `${(idx + 1) * 150}ms` }}>
                    <button onClick={() => scrollTo(l.toLowerCase().split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, ""))} className="hover:text-blue-900 transition-all hover:translate-x-2 flex items-center gap-2 group">
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" /> {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div ref={useReveal()} className="reveal">
              <h5 className="font-black text-blue-900 mb-8 uppercase text-[10px] tracking-[0.3em] reveal-child transition-all duration-700">Fale Conosco</h5>
              <div className="space-y-6 text-gray-500 font-light text-sm md:text-base">
                <p className="flex items-start gap-4 reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '300ms' }}>
                  <MapPin size={24} className="text-yellow-500 shrink-0 mt-1" />
                  <span>{ADDRESS.street}, {ADDRESS.neighborhood}<br />{ADDRESS.city}</span>
                </p>
                <div className="space-y-4">
                  <p className="flex items-center gap-4 group cursor-pointer reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '500ms' }} onClick={() => window.open(`tel:${CONTACTS.phone.replace(/\D/g, '')}`)}>
                    <Phone size={20} className="text-yellow-500 group-hover:rotate-12 transition-transform" /><span className="group-hover:text-blue-900 font-medium transition-colors">{CONTACTS.phone}</span>
                  </p>
                  <p className="flex items-center gap-4 group cursor-pointer reveal-child transition-all duration-700 opacity-0 translate-x-4" style={{ transitionDelay: '700ms' }} onClick={() => window.open(`https://wa.me/${CONTACTS.whatsapp1Raw}`)}>
                    <MessageCircle size={20} className="text-green-500 group-hover:scale-110 transition-transform" /><span className="group-hover:text-blue-900 font-medium transition-colors">{CONTACTS.whatsapp1}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {CHURCH_NAME}. O Reino em Ação.</p>
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
