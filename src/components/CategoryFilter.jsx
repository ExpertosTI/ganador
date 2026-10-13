import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles, Flame, Shirt, Layers, Crown, Zap, Package, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ICON_MAP = {
  Sparkles,
  Flame,
  Shirt,
  Layers,
  Crown,
  Zap,
};

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const { openLiveChat } = useCart();

  return (
    <div id="categories-filter" className="w-full py-3 sm:py-4 px-3 sm:px-4 bg-mvp-black/70 border-b border-mvp-cardHover/50 sticky top-[88px] sm:top-[106px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          
          {/* Botón Chat Asesor En Vivo */}
          <button
            onClick={() => openLiveChat()}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap bg-gradient-to-r from-emerald-600/20 to-teal-500/20 border border-emerald-400/70 text-emerald-300 hover:text-white hover:bg-emerald-500/30 transition-all flex-shrink-0 shadow-sm hover:scale-105"
            title="Abrir Chat con Asesoras en Vivo"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-display tracking-wider uppercase">💬 CHAT EN VIVO</span>
          </button>

          {/* Categorías Standard */}
          {CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-mvp-red text-white shadow-glow-sm scale-105 border border-mvp-red'
                    : 'bg-mvp-card hover:bg-mvp-cardHover text-mvp-silver hover:text-white border border-mvp-cardHover'
                }`}
              >
                <IconComponent
                  size={15}
                  className={isSelected ? 'text-white' : 'text-mvp-red'}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
