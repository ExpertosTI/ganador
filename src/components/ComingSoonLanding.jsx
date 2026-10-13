import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShoppingBag,
  Upload,
  Calculator,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Database,
  MapPin,
  Phone,
  Navigation,
  Star,
  Truck,
  ShieldCheck,
  Lock,
  X,
  MessageCircle,
  Instagram,
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ───────────────────────── DATA ───────────────────────── */

const WA_MAIN = '18094918466';

const BRANCHES = [
  {
    id: 'villa-mella',
    name: 'Villa Mella',
    tag: 'Principal',
    address: 'C/ Duarte local 1B, La Rotonda (detrás de Mundo Pollo)',
    phone: '(829) 375-9724',
    phoneRaw: '8293759724',
    rating: '4.3',
    reviews: '212',
    mapsUrl: 'https://maps.app.goo.gl/ATTPp1Hp64KBAFVQ6?g_st=iwb',
    embed: 'https://maps.google.com/maps?q=El%20Ojo%20Ganador%20Villa%20Mella%20Santo%20Domingo&z=15&output=embed',
  },
  {
    id: 'herrera',
    name: 'Herrera',
    tag: 'Sto. Dgo. Oeste',
    address: 'Herrera, Santo Domingo Oeste · Entrega a domicilio',
    phone: '(849) 436-9724',
    phoneRaw: '8494369724',
    rating: '4.4',
    reviews: '20',
    mapsUrl: 'https://maps.app.goo.gl/TLm7P4AMbSnM26s3A?g_st=iwb',
    embed: 'https://maps.google.com/maps?q=El%20Ojo%20Ganador%20Herrera%20Santo%20Domingo&z=15&output=embed',
  },
  {
    id: 'los-rios',
    name: 'Los Ríos',
    tag: 'Distrito Nacional',
    address: 'Los Ríos, Distrito Nacional · Al por mayor y al detalle',
    phone: '(849) 534-2497',
    phoneRaw: '8495342497',
    rating: '4.3',
    reviews: '—',
    mapsUrl: 'https://maps.app.goo.gl/829q6Pd1C9eizuiJ6?g_st=iwb',
    embed: 'https://maps.google.com/maps?q=El%20Ojo%20Ganador%20Los%20Rios%20Santo%20Domingo&z=15&output=embed',
  },
];

const DROPS = [
  { img: '/img/drop-1.jpg', name: 'Retro High', price: '1,790', tag: 'Hot' },
  { img: '/img/drop-2.jpg', name: 'Dunk Low', price: '990', tag: '2x' },
  { img: '/img/drop-3.jpg', name: 'Flow Completo', price: '1,790', tag: 'Combo' },
  { img: '/img/drop-4.jpg', name: 'Jeans Alta Gama', price: '990', tag: 'Nuevo' },
  { img: '/img/drop-5.jpg', name: 'Combo + Gorra', price: '1,990', tag: 'Gratis' },
  { img: '/img/drop-6.jpg', name: 'Air Force', price: '1,290', tag: 'Clásico' },
  { img: '/img/drop-7.jpg', name: 'Croki', price: '690', tag: 'Oferta' },
  { img: '/img/drop-8.jpg', name: 'Retro 11', price: '1,890', tag: 'Drop' },
];

const MOSAIC = Array.from({ length: 16 }, (_, i) => `/img/drop-${i + 1}.jpg`);

const TICKER = [
  'FUE EL OJO QUE DIJO',
  'LOS MEJORES PRECIOS',
  'ENVÍOS A TODO EL PAÍS',
  'PAGO CONTRA ENTREGA',
  'AL POR MAYOR Y AL DETALLE',
  'VILLA MELLA · HERRERA · LOS RÍOS',
];

/* ───────────────────────── HOOKS ───────────────────────── */

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.og-reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const useCountdown = (days = 14) => {
  const target = useRef(Date.now() + days * 864e5);
  const calc = () => {
    const d = Math.max(0, target.current - Date.now());
    return {
      d: Math.floor(d / 864e5),
      h: Math.floor((d / 36e5) % 24),
      m: Math.floor((d / 6e4) % 60),
      s: Math.floor((d / 1e3) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

const pad = (n) => String(n).padStart(2, '0');

/* ───────────────────────── PIECES ───────────────────────── */

const Ticker = ({ reverse = false, accent = false }) => (
  <div
    className={`relative overflow-hidden border-y ${
      accent ? 'bg-[#FF1E27] border-[#FF1E27] text-black' : 'bg-black border-white/10 text-white'
    } py-3 select-none`}
  >
    <div
      className={`flex w-max og-marquee whitespace-nowrap`}
      style={reverse ? { animationDirection: 'reverse' } : undefined}
    >
      {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
        <span key={i} className="font-display text-2xl sm:text-3xl tracking-wide px-6 flex items-center gap-6">
          {t}
          <span className={accent ? 'text-black/60' : 'text-[#FF1E27]'}>✦</span>
        </span>
      ))}
    </div>
  </div>
);

const SectionLabel = ({ n, children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-mono text-[11px] text-[#FF1E27] tracking-[0.3em]">{n}</span>
    <span className="h-px w-10 bg-[#FF1E27]/60" />
    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400">{children}</span>
  </div>
);

/* ───────────────────────── MAIN ───────────────────────── */

export const ComingSoonLanding = ({
  onOpenCatalog,
  onOpenAdmin,
  onOpenQuoter,
  onOpenStories,
  productsCount = 0,
}) => {
  useReveal();
  const t = useCountdown(14);
  const heroRef = useRef(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Mouse spotlight on hero
  const onMove = useCallback((e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleVipSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'VIP_COMING_SOON_SIGNUP', metadata: { name, phone } }),
      }).catch(() => {});
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ['#FF1E27', '#FFB800', '#ffffff'] });
    } finally {
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const waLink = (msg) => `https://wa.me/${WA_MAIN}?text=${encodeURIComponent(msg)}`;
  const branch = BRANCHES[activeBranch];

  return (
    <div className="relative bg-[#050608] text-white font-sans overflow-x-hidden selection:bg-[#FF1E27] selection:text-white">
      {/* ═════════ NAV ═════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 py-2.5' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <img src="/ojo-ganador.svg" alt="El Ojo Ganador" className="w-9 h-9 object-contain invert group-hover:rotate-12 transition-transform" />
            <span className="font-display text-2xl tracking-wider leading-none">
              EL OJO <span className="text-[#FF1E27]">GANADOR</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
            <a href="#drops" className="hover:text-white transition-colors">Drops</a>
            <a href="#sucursales" className="hover:text-white transition-colors">Sucursales</a>
            <a href="#vip" className="hover:text-white transition-colors">Lista VIP</a>
          </nav>
          <a
            href={waLink('¡Hola El Ojo Ganador! 👁️ Quiero ver lo nuevo.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-[#FF1E27] hover:text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Escríbenos</span>
          </a>
        </div>
      </header>

      {/* ═════════ HERO ═════════ */}
      <section
        id="top"
        ref={heroRef}
        onMouseMove={onMove}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden og-grain"
        style={{ '--mx': '50%', '--my': '40%' }}
      >
        {/* Animated sneaker mosaic */}
        <div className="absolute inset-0 -rotate-6 scale-125 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 opacity-40">
          {Array.from({ length: 6 }).map((_, col) => (
            <div key={col} className={`flex-col gap-3 ${col % 2 ? 'og-col-down' : 'og-col-up'} ${col < 3 ? 'flex' : col === 3 ? 'hidden sm:flex' : 'hidden lg:flex'}`}>
              {(() => {
                const rotated = [...MOSAIC.slice(col * 2), ...MOSAIC.slice(0, col * 2)];
                return [...rotated, ...rotated];
              })().map((src, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900">
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover grayscale-[30%]" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,6,8,0.55)_0%,rgba(5,6,8,0.92)_60%,#050608_100%)]" />
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-300"
          style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), rgba(255,30,39,0.22), transparent 60%)' }}
        />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#050608] to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 text-center pt-24 pb-16">
          {/* Eye */}
          <div className="relative mx-auto mb-8 w-28 h-28 sm:w-36 sm:h-36">
            <svg viewBox="0 0 200 200" className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] og-spin-slow opacity-70">
              <defs>
                <path id="og-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text className="fill-white/60 font-mono" style={{ fontSize: 11, letterSpacing: 6 }}>
                <textPath href="#og-circle">FUE EL OJO QUE DIJO • LOS MEJORES PRECIOS • </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 rounded-full bg-black border border-white/15 og-eye-pulse flex items-center justify-center p-5">
              <img src="/ojo-ganador.svg" alt="Logo El Ojo Ganador" className="w-full h-full object-contain invert" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1E27] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1E27]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-300">
              Nueva tienda online · {pad(t.d)}d {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
            </span>
          </div>

          <h1 className="font-display leading-[0.82] tracking-tight">
            <span className="block text-[18vw] sm:text-[14vw] lg:text-[11rem] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              EL OJO
            </span>
            <span className="block text-[18vw] sm:text-[14vw] lg:text-[11rem] bg-gradient-to-b from-[#FF4A52] via-[#FF1E27] to-[#8A0A10] bg-clip-text text-transparent">
              GANADOR
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-2xl font-semibold text-zinc-200">
            “Los mejores precios, <span className="text-[#FFB800]">fue el ojo que dijo.</span>”
          </p>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Tenis, jeans y flows completos. 3 sucursales en Santo Domingo y envíos a todo RD con pago contra entrega.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#vip"
              className="group relative inline-flex items-center gap-3 bg-[#FF1E27] hover:bg-white hover:text-black px-8 py-4 rounded-full font-black uppercase tracking-wider text-sm shadow-[0_0_40px_-5px_rgba(255,30,39,0.7)] transition-all"
            >
              Entrar a la lista VIP
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#sucursales"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-white bg-white/5 backdrop-blur-md font-bold uppercase tracking-wider text-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-[#FF1E27]" />
              Ver sucursales
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <a href="#drops" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <span className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
            <span className="w-1 h-2 rounded-full bg-current og-scroll-dot" />
          </span>
        </a>
      </section>

      {/* ═════════ TICKER ═════════ */}
      <div className="-rotate-1 scale-105 relative z-20">
        <Ticker accent />
      </div>

      {/* ═════════ DROPS ═════════ */}
      <section id="drops" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="og-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <SectionLabel n="01">Lo que se está moviendo</SectionLabel>
              <h2 className="font-display text-6xl sm:text-8xl leading-[0.85]">
                DROPS <span className="og-stroke">DE LA</span>
                <br />
                SEMANA
              </h2>
            </div>
            <p className="text-zinc-400 max-w-sm text-sm">
              Precios de calle, calidad alta gama. Si lo viste en TikTok, aquí está. Desliza 👉
            </p>
          </div>
        </div>

        <div className="og-reveal flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-5 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4">
          {DROPS.map((d, i) => (
            <a
              key={i}
              href={waLink(`¡Hola! 👁️ Me interesa: ${d.name} (RD$ ${d.price}). ¿Tienen mi talla?`)}
              target="_blank"
              rel="noreferrer"
              className="group relative snap-start shrink-0 w-[72vw] sm:w-[340px] aspect-[3/4] rounded-[28px] overflow-hidden bg-zinc-900 border border-white/10"
            >
              <img src={d.img} alt={d.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <span className="absolute top-4 left-4 bg-[#FF1E27] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                {d.tag}
              </span>
              <span className="absolute top-4 right-4 font-mono text-[11px] text-white/60">{pad(i + 1)}</span>
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl leading-none">{d.name}</h3>
                  <p className="font-mono text-xs text-zinc-400 mt-1">Pedir por WhatsApp</p>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-zinc-400">RD$</span>
                  <span className="font-display text-4xl text-[#FFB800] leading-none">{d.price}</span>
                </div>
              </div>
              <div className="absolute inset-x-5 bottom-5 h-0.5 bg-[#FF1E27] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </a>
          ))}
        </div>
      </section>

      {/* ═════════ STATS ═════════ */}
      <section className="relative border-y border-white/10 bg-[#0A0B0F]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
          {[
            { big: '148K', small: 'Seguidores en TikTok', sub: '@el_ojo_ganador', href: 'https://www.tiktok.com/@el_ojo_ganador' },
            { big: '25K+', small: 'Comunidad en Instagram', sub: '@ojo_ganador', href: 'https://www.instagram.com/ojo_ganador' },
            { big: '4.3★', small: 'Reseñas en Google', sub: '212+ opiniones', href: BRANCHES[0].mapsUrl },
            { big: '03', small: 'Sucursales físicas', sub: 'Santo Domingo', href: '#sucursales' },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="og-reveal group p-8 sm:p-10 hover:bg-white/[0.03] transition-colors"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-6xl sm:text-7xl leading-none group-hover:text-[#FF1E27] transition-colors">{s.big}</span>
              <span className="block mt-2 text-sm font-semibold text-zinc-200">{s.small}</span>
              <span className="block font-mono text-[11px] text-zinc-500 mt-1">{s.sub}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ═════════ SUCURSALES ═════════ */}
      <section id="sucursales" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="og-reveal mb-12">
            <SectionLabel n="02">Pasa por la tienda</SectionLabel>
            <h2 className="font-display text-6xl sm:text-8xl leading-[0.85]">
              3 SUCURSALES.
              <br />
              <span className="text-[#FF1E27]">UN SOLO OJO.</span>
            </h2>
          </div>

          <div className="og-reveal grid lg:grid-cols-[1fr_1.3fr] gap-6">
            {/* Selector */}
            <div className="flex flex-col gap-3">
              {BRANCHES.map((b, i) => {
                const active = i === activeBranch;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBranch(i)}
                    className={`group text-left rounded-3xl border p-6 transition-all duration-300 ${
                      active
                        ? 'bg-[#FF1E27] border-[#FF1E27] shadow-[0_20px_60px_-20px_rgba(255,30,39,0.8)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${active ? 'text-white/80' : 'text-zinc-500'}`}>
                          {pad(i + 1)} · {b.tag}
                        </span>
                        <h3 className="font-display text-4xl sm:text-5xl leading-none mt-1">{b.name}</h3>
                        <p className={`text-sm mt-2 ${active ? 'text-white/90' : 'text-zinc-400'}`}>{b.address}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${active ? 'bg-black/25' : 'bg-white/5'}`}>
                        <Star className="w-3 h-3 fill-current text-[#FFB800]" /> {b.rating}
                      </span>
                    </div>
                    <div className={`grid transition-all duration-300 ${active ? 'grid-rows-[1fr] mt-5' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden flex flex-wrap gap-2">
                        <a
                          href={b.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Cómo llegar
                        </a>
                        <a
                          href={`tel:${b.phoneRaw}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-white/25 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> {b.phone}
                        </a>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live map */}
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 min-h-[380px] lg:min-h-full bg-zinc-900">
              <iframe
                key={branch.id}
                title={`Mapa El Ojo Ganador ${branch.name}`}
                src={branch.embed}
                className="absolute inset-0 w-full h-full og-map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[32px]" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-[#FF1E27] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-2xl leading-none truncate">El Ojo Ganador {branch.name}</p>
                    <p className="font-mono text-[11px] text-zinc-400 truncate">{branch.phone}</p>
                  </div>
                </div>
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 bg-white text-black px-4 py-2.5 rounded-full text-xs font-black uppercase hover:bg-[#FF1E27] hover:text-white transition-colors"
                >
                  Abrir <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Perks */}
          <div className="og-reveal grid sm:grid-cols-3 gap-3 mt-6">
            {[
              { icon: Truck, t: 'Envíos a todo RD', d: 'Delivery en Santo Domingo y al interior.' },
              { icon: ShieldCheck, t: 'Pago contra entrega', d: 'Pagas cuando lo tienes en la mano.' },
              { icon: ShoppingBag, t: 'Por mayor y detalle', d: 'Precios especiales para revendedores.' },
            ].map(({ icon: Icon, t: tt, d }, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <Icon className="w-6 h-6 text-[#FFB800] shrink-0" />
                <div>
                  <p className="font-bold text-sm">{tt}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker reverse />

      {/* ═════════ VIP ═════════ */}
      <section id="vip" className="relative py-24 sm:py-36 overflow-hidden og-grain">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,30,39,0.35),transparent_60%)]" />
        <img src="/ojo-ganador.svg" alt="" aria-hidden className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] opacity-[0.04] invert pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 text-center og-reveal">
          <SectionLabel n="03">Acceso anticipado</SectionLabel>
          <h2 className="font-display text-6xl sm:text-8xl leading-[0.85]">
            QUE EL OJO
            <br />
            <span className="text-[#FF1E27]">TE VEA PRIMERO</span>
          </h2>
          <p className="mt-5 text-zinc-400 max-w-md mx-auto">
            Déjanos tu WhatsApp y recibe los drops y ofertas antes que nadie cuando abramos la tienda online.
          </p>

          {/* Countdown */}
          <div className="mt-10 flex justify-center gap-2 sm:gap-4">
            {[
              [t.d, 'Días'],
              [t.h, 'Horas'],
              [t.m, 'Min'],
              [t.s, 'Seg'],
            ].map(([v, l], i) => (
              <div key={l} className="w-20 sm:w-28">
                <div className={`font-display text-5xl sm:text-7xl leading-none tabular-nums ${i === 3 ? 'text-[#FF1E27]' : ''}`}>{pad(v)}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            {!submitted ? (
              <form onSubmit={handleVipSubmit} className="flex flex-col sm:flex-row gap-2 p-2 rounded-[28px] sm:rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl">
                <input
                  id="vip-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="flex-1 min-w-0 bg-transparent px-5 py-3.5 text-sm placeholder-zinc-500 focus:outline-none"
                />
                <input
                  id="vip-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp 809-000-0000"
                  className="flex-1 min-w-0 bg-transparent px-5 py-3.5 text-sm placeholder-zinc-500 focus:outline-none sm:border-l border-white/10"
                />
                <button
                  id="vip-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 bg-[#FF1E27] hover:bg-white hover:text-black px-6 py-3.5 rounded-full font-black uppercase text-xs tracking-wider transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'Enviando…' : 'Quiero entrar'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 p-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">¡Listo! El ojo ya te tiene en la mira. Te escribimos por WhatsApp.</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-zinc-400">
            <a href="https://www.instagram.com/ojo_ganador" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition-all" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.tiktok.com/@el_ojo_ganador" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition-all font-black text-xs" aria-label="TikTok">
              TT
            </a>
            <a href={waLink('¡Hola El Ojo Ganador! 👁️')} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all" aria-label="WhatsApp">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═════════ FOOTER ═════════ */}
      <footer className="relative border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
          <div className="font-display text-[22vw] lg:text-[16rem] leading-[0.8] text-white/[0.04] select-none text-center -mb-6">
            EL OJO GANADOR
          </div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <span>© {new Date().getFullYear()} El Ojo Ganador · elojoganador.com</span>
            <div className="flex items-center gap-4">
              <button
                id="staff-access"
                onClick={() => setStaffOpen(true)}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
              >
                <Lock className="w-3 h-3" /> Staff
              </button>
              <a
                href="https://renace.tech"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[9px] tracking-wider text-zinc-700 opacity-40 hover:opacity-100 hover:text-zinc-400 transition-opacity"
              >
                hecho por renace
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═════════ STAFF DRAWER (discreto) ═════════ */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${staffOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!staffOpen}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setStaffOpen(false)} />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-[#0B0C10] border-l border-white/10 p-6 flex flex-col transition-transform duration-500 ${
            staffOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF1E27]">Panel interno</span>
              <h3 className="font-display text-4xl leading-none mt-1">HERRAMIENTAS</h3>
            </div>
            <button onClick={() => setStaffOpen(false)} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition-all" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { icon: ShoppingBag, label: 'Catálogo Pro', sub: productsCount > 0 ? `${productsCount} modelos` : 'Inventario y ventas', fn: onOpenCatalog },
              { icon: Database, label: 'Cargar catálogo', sub: 'Admin, CSV y Odoo', fn: onOpenAdmin },
              { icon: Calculator, label: 'Cotizador', sub: 'Envíos COD y WhatsApp', fn: onOpenQuoter },
              { icon: Upload, label: 'Subir medios', sub: 'Fotos e historias', fn: onOpenStories || onOpenAdmin },
            ].map(({ icon: Icon, label, sub, fn }) => (
              <button
                key={label}
                onClick={() => {
                  setStaffOpen(false);
                  fn && fn();
                }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FF1E27]/60 hover:bg-[#FF1E27]/10 text-left transition-all"
              >
                <span className="w-11 h-11 rounded-xl bg-white/5 group-hover:bg-[#FF1E27] flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-sm">{label}</span>
                  <span className="block text-xs text-zinc-500">{sub}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <p className="mt-auto font-mono text-[10px] text-zinc-600 leading-relaxed">
            Acceso solo para el personal de El Ojo Ganador. Las acciones protegidas solicitan clave.
          </p>
        </aside>
      </div>

      {/* Floating WhatsApp */}
      <a
        href={waLink('¡Hola El Ojo Ganador! 👁️ Quiero información.')}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-[0_10px_40px_-5px_rgba(16,185,129,0.7)] hover:scale-110 transition-all"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};
