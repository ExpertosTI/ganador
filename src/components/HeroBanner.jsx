import React, { useState, useEffect } from 'react';
import { Flame, Zap, ShieldCheck, Truck, Sparkles, ArrowRight, Gift, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { trackBannerClick } from '../utils/tracker';

export const HeroBanner = ({ onSelectCategory }) => {
  const { setIsWheelOpen, setIsCheckoutOpen } = useCart();

  // Countdown timer for hero flash deal
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num) => String(num).padStart(2, '0');

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-mvp-card via-mvp-black to-mvp-black border-b border-mvp-cardHover py-6 sm:py-10 px-4">
      {/* Background glow effects */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-mvp-red/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-red-900/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Dominican Streetwear Headline & Call to action */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-mvp-red/20 to-black/40 border border-mvp-red/40 px-3.5 py-1.5 rounded-full">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mvp-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mvp-red"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                🔥 LO MÁS NUEVO 2026 // LA VERDADERA GRASA EN RD
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-[0.95]">
              VISTE EL FLOW <span className="text-gradient-red">DE LAS 3 B</span>
            </h1>

            {/* Subtitle with Dominican 3B Brand Value */}
            <p className="text-mvp-silver/90 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <strong className="text-amber-400 font-bold">¡Bueno, Bonito y Barato! </strong>
              Los Tenis más duros de la calle: Jordan, Adidas Campus, Reebok y Combos de Boxers.
              <strong className="text-white font-semibold"> ¡Pides hoy y pagas en efectivo cuando el delivery llegue a tu casa!</strong>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => {
                  trackBannerClick('ver_ofertas_combos', { category: 'combos' });
                  onSelectCategory('combos');
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-mvp-red via-mvp-crimson to-mvp-darkRed hover:from-mvp-crimson hover:to-mvp-red text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-glow-red hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Zap size={17} className="fill-yellow-300 text-yellow-300" />
                <span>VER OFERTAS Y COMBOS</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  trackBannerClick('girar_ruleta_hero');
                  setIsWheelOpen(true);
                }}
                className="px-5 py-3.5 rounded-xl bg-mvp-card hover:bg-mvp-cardHover border border-mvp-cardHover hover:border-mvp-red/50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
              >
                <Gift size={16} className="text-amber-400" />
                <span>Girar Ruleta (-30% OFF)</span>
              </button>
            </div>

            {/* Dominican Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-mvp-cardHover/60 text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5">
                <Truck size={18} className="text-mvp-red flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Entrega Rápida</span>
                  <span className="text-[11px] text-mvp-muted">2 a 4h en Santo Domingo</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5">
                <ShieldCheck size={18} className="text-mvp-neonGreen flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Pago Seguro</span>
                  <span className="text-[11px] text-mvp-muted">Pagas al recibir en mano</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5">
                <Sparkles size={18} className="text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Calidad 100%</span>
                  <span className="text-[11px] text-mvp-muted">Garantía en cada pinta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Flash Deal Promo Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-mvp-card to-mvp-dark border border-mvp-red/40 p-4 sm:p-5 shadow-card-dark overflow-hidden group">
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-mvp-red text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  <Flame size={14} className="fill-white animate-flame" />
                  <span>OFERTA RELÁMPAGO DE HOY</span>
                </div>
                
                {/* Live Countdown Clock */}
                <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg border border-mvp-cardHover text-xs font-mono text-mvp-silver">
                  <Clock size={13} className="text-mvp-red" />
                  <span>{formatDigits(timeLeft.hours)}:{formatDigits(timeLeft.minutes)}:{formatDigits(timeLeft.seconds)}</span>
                </div>
              </div>

              {/* Product preview layout */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 bg-black/50">
                <img
                  src="/img/drop-1.jpg"
                  alt="Jordan 5 Retro"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-mvp-red text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-lg">
                  -42% OFF
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-mvp-black/85 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-mvp-muted block font-semibold">TENIS MÁS VENDIDO</span>
                    <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px]">Jordan 5 Retro "Street OG"</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-mvp-muted line-through block">RD$ 4,200</span>
                    <span className="text-sm sm:text-base font-black text-mvp-red">RD$ 2,450</span>
                  </div>
                </div>
              </div>

              {/* Progress bar of stock */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-300 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    ¡Pocas unidades disponibles a este precio!
                  </span>
                  <span className="text-mvp-red font-bold">Alta Demanda</span>
                </div>
                <div className="w-full bg-mvp-dark rounded-full h-2.5 overflow-hidden border border-mvp-cardHover">
                  <div className="bg-gradient-to-r from-amber-500 via-mvp-red to-mvp-crimson h-full rounded-full w-[94%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
