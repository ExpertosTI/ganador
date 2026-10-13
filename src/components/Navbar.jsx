import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Flame, 
  Gift, 
  Search, 
  MapPin, 
  Settings, 
  CheckCircle2, 
  User, 
  Users, 
  Crown,
  Heart,
  Volume2,
  VolumeX,
  MessageSquare,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PROMO_MESSAGES = [
  { tag: '🇩🇴 ENVÍOS RD', text: 'Envíos express el mismo día en Santo Domingo y a todo RD con Pago Contra Entrega (COD)' },
  { tag: '🔥 CALIDAD G5', text: 'Tenis Jordan, Adidas Campus, Asics y Louis Vuitton con caja original garantizada' },
  { tag: '⚡ 2 A 4 HORAS', text: 'Entregas ultra rápidas en Gran Santo Domingo y Distrito Nacional' },
  { tag: '🎁 30% OFF', text: 'Gira la Ruleta de la Suerte y gana descuentos inmediatos en tu primera orden' },
  { tag: '🛡️ GARANTÍA', text: 'Pagas en efectivo al mensajero cuando recibas y verifiques tu mercancía en mano' },
];

export const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { 
    itemsCount, 
    wishlist,
    setIsWishlistOpen,
    soundEnabled,
    setSoundEnabled,
    setIsCartOpen, 
    setIsWheelOpen, 
    setIsTrackerOpen, 
    setIsAdminOpen,
    openLiveChat,
    currency, 
    setCurrency, 
    activeCoupon 
  } = useCart();

  const { currentUser, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);

  // Rotating Promo Banner every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const currentPromo = PROMO_MESSAGES[promoIndex];

  return (
    <header className="sticky top-0 z-40 w-full bg-mvp-black/95 backdrop-blur-md border-b border-mvp-cardHover">
      {/* Top Ticker / Promo Bar with Dynamic Rotation */}
      <div className="bg-gradient-to-r from-mvp-red via-mvp-darkRed to-mvp-crimson text-white py-1.5 px-3 text-xs font-semibold overflow-hidden transition-all">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2 animate-fade-in key={promoIndex}">
            <span className="bg-white text-mvp-red text-[10px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase flex-shrink-0 shadow-sm">
              {currentPromo.tag}
            </span>
            <span className="truncate text-[11px] sm:text-xs font-medium">
              {currentPromo.text}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* VIP Club / Wheel Trigger */}
            <button
              onClick={() => setIsWheelOpen(true)}
              className="flex items-center gap-1 text-[11px] font-black text-amber-300 hover:text-white bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded-full border border-amber-400/40 transition-all animate-pulse"
            >
              <Gift size={12} className="text-amber-400" />
              <span>{activeCoupon ? '30% OFF Activo' : 'Girar Ruleta (-30%)'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white/80 hover:text-white transition-colors"
              title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Currency Switcher */}
            <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/20 text-[10px]">
              <button
                onClick={() => setCurrency('DOP')}
                className={`px-1.5 py-0.5 rounded-full transition-all ${
                  currency === 'DOP' ? 'bg-white text-mvp-black font-black' : 'text-white/70 hover:text-white'
                }`}
              >
                RD$
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1.5 py-0.5 rounded-full transition-all ${
                  currency === 'USD' ? 'bg-white text-mvp-black font-black' : 'text-white/70 hover:text-white'
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Brand Logo & Live Chat button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img 
                src="/ojo-ganador.svg" 
                alt="GANADOR" 
                className="w-full h-full object-contain filter invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-black tracking-widest text-base sm:text-lg text-white leading-none">
                EL OJO GANADOR
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-red-500 font-mono">
                elojoganador.com
              </span>
            </div>
          </a>

          {/* DESTACADO PÚBLICO: CHAT EN VIVO CON ASESORA */}
          <button
            onClick={() => openLiveChat()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-emerald-500/30 border-2 border-emerald-400/80 hover:border-emerald-300 text-emerald-300 hover:text-white text-xs font-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-105"
            title="Chat en Vivo con Asesoras"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <MessageSquare size={14} className="text-emerald-400" />
            <span className="font-display tracking-wider uppercase text-xs sm:text-xs">Chat en Vivo</span>
          </button>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar por marca, tenis, combos, color..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-mvp-dark border border-mvp-cardHover rounded-full py-1.5 pl-9 pr-8 text-xs text-white placeholder-mvp-muted focus:outline-none focus:border-mvp-red transition-all"
            />
            <Search className="absolute left-3 top-2 text-mvp-muted" size={14} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-mvp-muted hover:text-white bg-mvp-cardHover px-1.5 rounded-full"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Toggle for Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-xl bg-mvp-dark border border-mvp-cardHover text-mvp-silver hover:text-white"
            aria-label="Buscar"
          >
            <Search size={16} />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 rounded-xl bg-mvp-dark border border-mvp-cardHover hover:border-mvp-red/50 text-mvp-silver hover:text-white text-xs transition-all"
            title="Mis Favoritos"
          >
            <Heart size={16} className={wishlist.length > 0 ? 'text-mvp-red fill-mvp-red/20' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-mvp-red text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Live Order Tracker Button */}
          <button
            onClick={() => setIsTrackerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-mvp-dark border border-mvp-cardHover hover:border-mvp-red/50 text-mvp-silver hover:text-white text-xs font-semibold transition-all"
            title="Rastrear mi pedido"
          >
            <MapPin size={13} className="text-mvp-red" />
            <span>Rastrear</span>
          </button>

          {/* Customer Profile / Login Button */}
          {currentUser ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-mvp-dark border border-emerald-500/40 hover:border-emerald-400 text-white text-xs font-bold transition-all shadow-sm group"
              title={`Mi Cuenta (${currentUser.name})`}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-emerald-400"
              />
              <span className="hidden md:inline max-w-[80px] truncate text-emerald-300 group-hover:text-white">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-mvp-dark border border-mvp-cardHover hover:border-mvp-red/50 text-mvp-silver hover:text-white text-xs font-bold transition-all group"
              title="Iniciar Sesión / Crear Cuenta"
            >
              <User size={15} className="text-mvp-red group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-display tracking-wider text-[11px]">ENTRAR</span>
            </button>
          )}

          {/* Admin Gear Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-xl bg-mvp-dark border border-mvp-cardHover hover:border-mvp-silver/40 text-mvp-muted hover:text-white text-xs transition-all"
            title="Panel de Administración, Odoo y Whaticket"
          >
            <Settings size={16} />
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-mvp-red hover:bg-mvp-darkRed text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={17} />
            <span className="hidden sm:inline font-display tracking-wider text-sm sm:text-base">CARRITO</span>
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-mvp-red text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-mvp-black shadow-md animate-bounce-subtle">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 pb-3 pt-1 border-t border-mvp-cardHover/50 bg-mvp-dark/95">
          <div className="relative w-full">
            <input
              type="text"
              autoFocus
              placeholder="Buscar marcas, tenis, combos, hoodies..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-mvp-black border border-mvp-cardHover rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-mvp-muted focus:outline-none focus:border-mvp-red"
            />
            <Search className="absolute left-3.5 top-2.5 text-mvp-muted" size={15} />
          </div>
        </div>
      )}
    </header>
  );
};
