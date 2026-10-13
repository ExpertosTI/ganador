import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Phone, 
  MapPin, 
  Instagram, 
  MessageCircle, 
  Zap, 
  Heart,
  Clock,
  Navigation
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer = ({ onSelectCategory }) => {
  const { setIsTrackerOpen, setIsWheelOpen, setIsAdminOpen, setIsManualOpen, setIsQuickRepliesOpen } = useCart();

  return (
    <footer className="bg-mvp-black border-t border-mvp-cardHover/80 text-mvp-silver text-xs pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 border-b border-mvp-cardHover/60">
          <div className="flex items-center gap-3.5 bg-mvp-card/50 p-4 rounded-2xl border border-mvp-cardHover">
            <div className="w-12 h-12 rounded-xl bg-mvp-red/10 border border-mvp-red/30 flex items-center justify-center text-mvp-red flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase">Envíos a todo RD</h4>
              <p className="text-mvp-muted text-[11px]">2 a 4h en Santo Domingo y 24-48h al interior con COD.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-mvp-card/50 p-4 rounded-2xl border border-mvp-cardHover">
            <div className="w-12 h-12 rounded-xl bg-mvp-neonGreen/10 border border-mvp-neonGreen/30 flex items-center justify-center text-mvp-neonGreen flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase">Pago Contra Entrega (COD)</h4>
              <p className="text-mvp-muted text-[11px]">Pagas en efectivo cuando el delivery llegue a tu casa.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-mvp-card/50 p-4 rounded-2xl border border-mvp-cardHover">
            <div className="w-12 h-12 rounded-xl bg-mvp-gold/10 border border-mvp-gold/30 flex items-center justify-center text-mvp-gold flex-shrink-0">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase">Garantía de Calidad G5</h4>
              <p className="text-mvp-muted text-[11px]">Cambio de talla inmediato y satisfacción 100% garantizada.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand & Location Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/10">
                <img src="/ojo-ganador.svg" alt="EL OJO GANADOR" className="w-full h-full object-contain filter invert" />
              </div>
              <div>
                <span className="text-xs font-black text-white block uppercase font-mono tracking-wider">EL OJO GANADOR</span>
                <span className="text-[10px] text-red-500 font-bold uppercase">Official Store · Drops Exclusivos</span>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-1 text-[11px]">
              <span className="font-bold text-white block uppercase tracking-wider text-[10px] text-red-500 font-mono">
                📍 3 Sucursales Oficiales:
              </span>
              <div className="space-y-1">
                <a 
                  href="https://maps.app.goo.gl/ATTPp1Hp64KBAFVQ6?g_st=iwb" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between text-slate-300 hover:text-white group border-b border-white/5 pb-1"
                >
                  <span>1. Villa Mella (Rotonda)</span>
                  <span className="text-red-400 font-mono text-[10px] underline">Ver Maps</span>
                </a>
                <a 
                  href="https://maps.app.goo.gl/TLm7P4AMbSnM26s3A?g_st=iwb" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between text-slate-300 hover:text-white group border-b border-white/5 pb-1"
                >
                  <span>2. Herrera (Sto. Dgo. Oeste)</span>
                  <span className="text-red-400 font-mono text-[10px] underline">Ver Maps</span>
                </a>
                <a 
                  href="https://maps.app.goo.gl/829q6Pd1C9eizuiJ6?g_st=iwb" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between text-slate-300 hover:text-white group"
                >
                  <span>3. Los Ríos (Distrito Nacional)</span>
                  <span className="text-red-400 font-mono text-[10px] underline">Ver Maps</span>
                </a>
              </div>
            </div>

            <p className="text-mvp-silver/80 text-[11px] flex items-center gap-1.5 pt-1">
              <Clock size={14} className="text-amber-400 flex-shrink-0" />
              <span><em>"Los mejores precios, fue el ojo que dijo"</em></span>
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/ojo_ganador"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-mvp-dark hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-white flex items-center justify-center transition-all border border-mvp-cardHover"
                title="Instagram @ojo_ganador"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.tiktok.com/@el_ojo_ganador"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-mvp-dark hover:bg-black text-white flex items-center justify-center transition-all border border-mvp-cardHover text-[10px] font-black"
                title="TikTok @el_ojo_ganador"
              >
                TT
              </a>
              <a
                href="https://wa.me/18293759724"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-mvp-dark hover:bg-emerald-600 text-white flex items-center justify-center transition-all border border-mvp-cardHover"
                title="WhatsApp (829) 375-9724"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Categorías & Modelos</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onSelectCategory('sneakers')} className="hover:text-mvp-red transition-colors text-left">
                  👟 Tenis Jordan & Retro High
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('sneakers')} className="hover:text-mvp-red transition-colors text-left">
                  🔥 Tenis & Sneakers Exclusivos
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('combos')} className="hover:text-mvp-red transition-colors text-left">
                  👑 Flow Completo ($1,790)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('combos')} className="hover:text-mvp-red transition-colors text-left">
                  👖 Jeans Alta Gama ($990)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('combos')} className="hover:text-mvp-red transition-colors text-left">
                  🧢 Combos con Gorra Gratis ($1,990)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Direct Contacts */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Contacto Directo</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="tel:8293759724" className="hover:text-mvp-red transition-colors flex items-center gap-1.5 text-white font-bold font-mono">
                  <Phone size={13} className="text-emerald-400" />
                  <span>(829) 375-9724 (Villa Mella)</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/18094918466" target="_blank" rel="noreferrer" className="hover:text-mvp-red transition-colors flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <MessageCircle size={13} />
                  <span>WS Envíos: (809) 491-8466</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/ojo_ganador" target="_blank" rel="noreferrer" className="hover:text-mvp-red transition-colors flex items-center gap-1 text-amber-400 font-bold">
                  📸 @ojo_ganador · @el_ojo_ganador
                </a>
              </li>
              <li>
                <button onClick={() => setIsTrackerOpen(true)} className="hover:text-mvp-red transition-colors">
                  📦 Rastrear Mi Pedido en Vivo
                </button>
              </li>
              <li>
                <button onClick={() => setIsWheelOpen(true)} className="hover:text-mvp-red transition-colors">
                  🎁 Ruleta de Descuentos VIP
                </button>
              </li>
              <li>
                <a
                  href="/catalogo.html"
                  className="text-emerald-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold font-mono text-[11px] pt-1"
                >
                  <img src="/catalogo-symbol.svg" alt="Símbolo" className="w-3.5 h-3.5 rounded" />
                  <span>🚀 Abrir App de Catálogo Independiente</span>
                </a>
              </li>
              <li>
                <button onClick={() => setIsAdminOpen(true)} className="text-mvp-muted hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px] pt-1">
                  ⚙️ Panel de Administración CMS
                </button>
              </li>
              <li>
                <button onClick={() => setIsQuickRepliesOpen(true)} className="text-amber-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px]">
                  💬 Banco de Respuestas Rápidas (Whaticket)
                </button>
              </li>
              <li>
                <button onClick={() => setIsManualOpen(true)} className="text-mvp-red hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px]">
                  🔒 Manual de Capacitación Whaticket (Staff)
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Location Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Formas de Pago</h4>
            <p className="text-[11px] text-mvp-muted">
              Pagas al recibir en efectivo con el delivery, o por transferencia bancaria en RD.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-mvp-dark border border-mvp-cardHover px-2 py-1 rounded text-[10px] text-white font-bold">
                💵 Efectivo al Recibir
              </span>
              <span className="bg-mvp-dark border border-mvp-cardHover px-2 py-1 rounded text-[10px] text-white font-bold">
                🏦 Banreservas
              </span>
              <span className="bg-mvp-dark border border-mvp-cardHover px-2 py-1 rounded text-[10px] text-white font-bold">
                🏦 Banco Popular
              </span>
              <span className="bg-mvp-dark border border-mvp-cardHover px-2 py-1 rounded text-[10px] text-white font-bold">
                🏦 Banco BHD
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-mvp-cardHover/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-mvp-muted">
          <p>© {new Date().getFullYear()} EL OJO GANADOR (elojoganador.com) • Todos los derechos reservados.</p>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <span>Drops exclusivos en RD</span>
            <span className="text-zinc-700">·</span>
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
        </div>
      </div>
    </footer>
  );
};
