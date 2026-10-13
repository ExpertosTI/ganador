import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Send, 
  ShoppingBag, 
  Upload, 
  MessageSquare, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Zap,
  Lock,
  Layers,
  Database,
  MapPin,
  ExternalLink,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BRANCHES = [
  {
    name: 'Sucursal Villa Mella',
    badge: 'Principal',
    address: 'C/ Duarte local 1B (Rotonda, detrás de Mundo Pollo)',
    phone: '(829) 375-9724',
    phoneRaw: '8293759724',
    wsRaw: '18094918466',
    mapsUrl: 'https://maps.app.goo.gl/ATTPp1Hp64KBAFVQ6?g_st=iwb',
  },
  {
    name: 'Sucursal Herrera',
    badge: 'Sto. Dgo. Oeste',
    address: 'Herrera, Santo Domingo Oeste',
    phone: '(809) 356-5794',
    phoneRaw: '8093565794',
    wsRaw: '18093565794',
    mapsUrl: 'https://maps.app.goo.gl/TLm7P4AMbSnM26s3A?g_st=iwb',
  },
  {
    name: 'Sucursal Los Ríos',
    badge: 'Distrito Nacional',
    address: 'Los Ríos, Distrito Nacional',
    phone: '(849) 534-2497',
    phoneRaw: '8495342497',
    wsRaw: '18495342497',
    mapsUrl: 'https://maps.app.goo.gl/829q6Pd1C9eizuiJ6?g_st=iwb',
  },
];

export const ComingSoonLanding = ({
  onOpenCatalog,
  onOpenAdmin,
  onOpenQuoter,
  onOpenStories,
  onOpenChat,
  productsCount = 0
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [staffToolsOpen, setStaffToolsOpen] = useState(false);

  // Countdown timer: Target date 14 days from now
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    // 14 days from fixed baseline or current
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVipSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setIsSubmitting(true);

    try {
      // Save subscriber via backend API if available
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'VIP_COMING_SOON_SIGNUP',
          metadata: { name, phone }
        })
      }).catch(() => {});

      // Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[450px] h-[450px] bg-red-800/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar with Brand & Staff Tools Switcher */}
      <header className="relative z-20 border-b border-white/5 bg-[#07090E]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 p-1 flex items-center justify-center shadow-lg">
            <img src="/ojo-ganador.svg" alt="GANADOR" className="w-full h-full object-contain filter invert" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-black tracking-widest text-lg leading-none uppercase text-white">
              EL OJO GANADOR
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 font-mono">
              elojoganador.com
            </span>
          </div>
        </div>

        {/* Quick Tools Access */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCatalog()}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-red-500" />
            <span>Catálogo Pro</span>
            {productsCount > 0 && (
              <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.2 rounded-full border border-red-500/30 font-mono">
                {productsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onOpenAdmin()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/20 border border-red-500/30 transition-all duration-200"
            title="Cargar catálogo, sincronizar Odoo y herramientas"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Herramientas / Admin</span>
            <span className="xs:hidden">Admin</span>
          </button>
        </div>
      </header>

      {/* Main Coming Soon Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 max-w-4xl mx-auto w-full text-center">
        {/* Eye Logo Spotlight */}
        <div className="mb-6 relative group">
          <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0D111A] border border-white/15 p-4 flex items-center justify-center shadow-2xl shadow-black/80">
            <img 
              src="/ojo-ganador.svg" 
              alt="OJO GANADOR" 
              className="w-full h-full object-contain filter invert opacity-95 group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black shadow">
            DROP 01
          </span>
        </div>

        {/* Brand Headline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-slate-300 uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>¡Fue el ojo que dijo! · Los Mejores Precios</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-[0.95] text-white max-w-3xl mb-3 font-mono">
          EL OJO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">GANADOR</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed mb-4">
          La tienda de moda urbana número uno en Villa Mella, Herrera y Los Ríos. Calzado de colección, combos completos y ofertas exclusivas con envío express y pago contra entrega en todo RD.
        </p>

        {/* 3 Sucursales Oficiales con Google Maps */}
        <div className="w-full max-w-2xl mb-8">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-red-500 font-bold">
              Nuestras 3 Sucursales Físicas en Santo Domingo
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            {BRANCHES.map((b) => (
              <div 
                key={b.name} 
                className="bg-[#0D111A]/80 border border-white/10 hover:border-red-500/40 rounded-xl p-3 flex flex-col justify-between transition-all group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-black text-white group-hover:text-red-400 transition-colors uppercase">
                      {b.name.replace('Sucursal ', '')}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mb-2 flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-[10px]">
                  <a 
                    href={`tel:${b.phoneRaw}`}
                    className="text-slate-300 hover:text-white flex items-center gap-1 font-mono font-bold"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{b.phone}</span>
                  </a>
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 font-bold transition-all"
                  >
                    <span>Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-slate-400">
            <a href="https://www.instagram.com/ojo_ganador" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              📸 <span>@ojo_ganador</span>
            </a>
            <span>•</span>
            <a href="https://www.tiktok.com/@el_ojo_ganador" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              🎵 <span>@el_ojo_ganador</span>
            </a>
            <span>•</span>
            <a href="https://wa.me/18094918466" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              💬 <span>Envíos: (809) 491-8466</span>
            </a>
          </div>
        </div>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md w-full mb-10">
          <div className="bg-[#0D111A]/90 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg">
            <span className="text-2xl sm:text-4xl font-mono font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Días</span>
          </div>
          <div className="bg-[#0D111A]/90 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg">
            <span className="text-2xl sm:text-4xl font-mono font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Horas</span>
          </div>
          <div className="bg-[#0D111A]/90 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg">
            <span className="text-2xl sm:text-4xl font-mono font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Minutos</span>
          </div>
          <div className="bg-[#0D111A]/90 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg border-red-500/20">
            <span className="text-2xl sm:text-4xl font-mono font-black text-red-500">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Seg</span>
          </div>
        </div>

        {/* VIP Access Form */}
        <div className="w-full max-w-md bg-[#0D111A]/70 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
          {!submitted ? (
            <form onSubmit={handleVipSubmit} className="space-y-4">
              <div className="text-left mb-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Lista Prioritaria VIP Drop
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-regístrate para recibir el enlace exclusivo de compra 30 minutos antes del lanzamiento oficial.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full bg-[#07090E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Tu WhatsApp (ej: 809-000-0000)"
                  className="w-full bg-[#07090E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-bold uppercase tracking-wider text-sm text-white shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
              >
                {isSubmitting ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>Asegurar mi Acceso VIP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                ¡Estás en la Lista VIP!
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Te enviaremos el enlace prioritario por WhatsApp en cuanto el drop esté disponible.
              </p>
            </div>
          )}
        </div>

        {/* Staff & Internal Tools Hub (Accessible anytime) */}
        <div className="w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-5 text-left">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Suite de Herramientas del Negocio (Staff & Operación)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              100% Funcional
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Todas las herramientas operativas de GANADOR están activas mientras la página pública se mantiene en preventa.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onOpenCatalog()}
              className="p-3 rounded-xl bg-[#0D111A] hover:bg-[#141A26] border border-white/10 hover:border-red-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors mb-2">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                  Catálogo Pro
                </span>
                <span className="block text-[10px] text-slate-500">
                  {productsCount > 0 ? `${productsCount} modelos` : 'Ver inventario'}
                </span>
              </div>
            </button>

            <button
              onClick={() => onOpenAdmin()}
              className="p-3 rounded-xl bg-[#0D111A] hover:bg-[#141A26] border border-white/10 hover:border-red-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors mb-2">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase group-hover:text-amber-400 transition-colors">
                  Cargar Catálogo
                </span>
                <span className="block text-[10px] text-slate-500">
                  Admin, CSV & Odoo
                </span>
              </div>
            </button>

            <button
              onClick={() => onOpenQuoter()}
              className="p-3 rounded-xl bg-[#0D111A] hover:bg-[#141A26] border border-white/10 hover:border-red-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors mb-2">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">
                  Cotizador
                </span>
                <span className="block text-[10px] text-slate-500">
                  Envíos COD & WA
                </span>
              </div>
            </button>

            <button
              onClick={() => onOpenStories ? onOpenStories() : onOpenAdmin()}
              className="p-3 rounded-xl bg-[#0D111A] hover:bg-[#141A26] border border-white/10 hover:border-red-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors mb-2">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase group-hover:text-blue-400 transition-colors">
                  Subir Medios
                </span>
                <span className="block text-[10px] text-slate-500">
                  Fotos e historias
                </span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2">
          <span>&copy; {new Date().getFullYear()} EL OJO GANADOR. Todos los derechos reservados.</span>
          <a 
            href="https://renace.tech" 
            target="_blank" 
            rel="noreferrer"
            className="text-[9px] font-mono text-zinc-600/50 hover:text-zinc-400 opacity-40 hover:opacity-100 transition-opacity tracking-wider"
            title="Tecnología por RENACE"
          >
            hecho por renace
          </a>
        </div>
      </footer>
    </div>
  );
};
