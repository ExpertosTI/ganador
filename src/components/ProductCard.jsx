import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Zap, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  trackProductView,
  trackProductClick,
  trackCustomerAction,
  trackWishlistToggle,
  trackSizeSelect,
  trackColorSelect,
} from '../utils/tracker';

export const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart, setSelectedProduct, formatMoney, toggleFavorite, isFavorite, promptQuickOrder } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '40 (8)');
  
  const initialVariant = product.variants?.[0];
  const [selectedColor, setSelectedColor] = useState(
    initialVariant
      ? { name: initialVariant.code, image: initialVariant.image, variantId: initialVariant.id, sku: initialVariant.sku }
      : (product.colors?.[0] || { name: 'Original', image: product.images?.[0] })
  );

  const displayImage = selectedColor?.image || product.images?.[0];
  const isLiked = isFavorite(product.id);
  const totalStock = product.stockLeft ?? product.qtyAvailable ?? product.stock ?? 0;


  const handleCardClick = () => {
    trackProductClick(product, 'card_view_details');
    setSelectedProduct({ ...product, initialColor: selectedColor });
  };

  const handleBuyClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    trackProductClick(product, 'card_buy_button');
    trackCustomerAction('whatsapp_buy_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      selectedSize,
      selectedColor: selectedColor?.name,
    });
    promptQuickOrder(
      {
        ...product,
        selectedImage: displayImage,
        images: [displayImage, ...(product.images || [])],
        sku: selectedColor?.sku || product.sku,
      },
      selectedSize,
      selectedColor
    );
  };

  const handleFavoriteToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    trackWishlistToggle(product, !isLiked);
    toggleFavorite(product.id);
  };

  // View Mode 3: Ultra Compact Single-Row List (Listado Rápido del Día)
  if (viewMode === 'compact') {
    return (
      <div 
        onClick={handleCardClick}
        className="group bg-mvp-card hover:bg-mvp-cardHover border border-white/5 hover:border-mvp-red/50 rounded-xl px-2.5 sm:px-3.5 py-2 transition-all flex items-center justify-between gap-2.5 sm:gap-3 shadow-sm cursor-pointer"
      >
        {/* Left: Thumbnail & Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-black/50 flex-shrink-0 relative border border-white/10">
            <img
              src={displayImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {product.discountPercent && (
              <span className="absolute top-0.5 left-0.5 bg-mvp-red text-white text-[8px] font-black px-1 rounded">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] uppercase font-mono font-bold text-mvp-red truncate">
                {product.category || 'Catálogo'}
              </span>
              {totalStock > 0 && totalStock <= 5 && (
                <span className="text-[9px] text-amber-400 font-semibold truncate">
                  • Pocas cantidades disponibles
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-mvp-red transition-colors">
              {product.name}
            </h4>
          </div>
        </div>

        {/* Right: Price & Quick Order */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-black text-white font-mono">
              {formatMoney(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-[9px] text-slate-500 line-through font-mono">
                {formatMoney(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleBuyClick}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-mvp-red hover:bg-mvp-darkRed text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shadow transition-all active:scale-95"
            title="Pedir por WhatsApp o Carrito"
          >
            <Zap size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="hidden sm:inline">Pedir</span>
          </button>
        </div>
      </div>
    );
  }

  // View Mode 2: Horizontal List View (Distraction-Free)
  if (viewMode === 'list') {
    return (
      <div className="group bg-mvp-card hover:bg-mvp-cardHover border border-mvp-cardHover hover:border-mvp-red/40 rounded-2xl p-2.5 sm:p-3.5 transition-all flex items-center gap-3 sm:gap-4 shadow-md">
        {/* Product Thumbnail */}
        <div 
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 cursor-pointer"
          onClick={handleCardClick}
        >
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercent && (
            <div className="absolute top-1 left-1 bg-black/80 text-mvp-neonGreen text-[9px] font-black px-1.5 py-0.5 rounded">
              -{product.discountPercent}%
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-mvp-red truncate">
                {product.category || 'Sneakers'}
              </span>
              <button
                onClick={handleFavoriteToggle}
                className="p-1 text-slate-400 hover:text-white"
                title="Guardar favorito"
              >
                <Heart size={14} className={isLiked ? 'text-mvp-red fill-mvp-red' : ''} />
              </button>
            </div>

            <h3
              onClick={handleCardClick}
              className="text-xs sm:text-sm font-bold text-white line-clamp-2 cursor-pointer group-hover:text-mvp-red transition-colors leading-tight"
            >
              {product.name}
            </h3>

            {totalStock > 0 && totalStock <= 5 && (
              <span className="text-[10px] text-amber-400 font-bold block mt-0.5">
                🔥 Pocas cantidades disponibles
              </span>
            )}
          </div>

          {/* Pricing and Action */}
          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/5 mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-slate-500 line-through font-mono">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleBuyClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-mvp-red to-mvp-darkRed hover:from-mvp-crimson hover:to-mvp-red text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md active:scale-95"
            >
              <Zap size={13} className="fill-yellow-400 text-yellow-400" />
              <span>Pedir</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View Mode 1: 2-Column Responsive Card (Clean & Compact)
  return (
    <div className="group relative bg-mvp-card hover:bg-mvp-cardHover border border-mvp-cardHover hover:border-mvp-red/40 rounded-2xl p-2.5 sm:p-3.5 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-glow-sm">
      {/* Product Image Area */}
      <div 
        className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-black/40 cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.tag && (
            <div className="bg-gradient-to-r from-mvp-red to-mvp-darkRed text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
              {product.tag}
            </div>
          )}
          {product.variants && product.variants.length > 1 && (
            <div className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
              <span>🎨 {product.variants.length} Colores</span>
            </div>
          )}
        </div>

        {/* Top Right: Favorite Button & Discount Badge */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <button
            onClick={handleFavoriteToggle}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isLiked ? 'bg-mvp-red text-white scale-110' : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
            }`}
            title="Guardar en favoritos"
          >
            <Heart size={14} className={isLiked ? 'fill-white' : ''} />
          </button>

          {product.discountPercent && (
            <div className="bg-black/80 border border-white/20 text-mvp-neonGreen text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
              -{product.discountPercent}%
            </div>
          )}
        </div>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Eye size={14} /> Vista Rápida
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={13} className="fill-amber-400" />
              <span className="font-bold">{product.rating || '5.0'}</span>
              <span className="text-mvp-muted text-[11px]">({product.reviewsCount || 42})</span>
            </div>
            {totalStock > 0 && totalStock <= 5 && (
              <span className="text-[10px] text-amber-400 font-bold">
                🔥 Pocas cantidades disponibles
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="text-sm font-bold text-white group-hover:text-mvp-red transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Variant swatches preview */}
          {product.variants && product.variants.length > 1 ? (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {product.variants.map((v) => {
                  const isSelected = selectedColor?.variantId === v.id || selectedColor?.name === v.code;
                  return (
                    <button
                      key={v.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor({ name: v.code, image: v.image, variantId: v.id, sku: v.sku });
                        trackColorSelect(v.code, product);
                      }}
                      title={v.code}
                      className={`relative w-8 h-8 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        isSelected ? 'border-mvp-red scale-110 shadow-glow-sm' : 'border-white/20 hover:border-white/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={v.image} alt={v.code} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-mvp-muted truncate mt-0.5">
                Color: <strong className="text-white">{selectedColor?.name || ''}</strong>
              </div>
            </div>
          ) : product.colors && product.colors.length > 1 ? (
            <div className="flex items-center gap-1.5 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                    trackColorSelect(color.name, product);
                  }}
                  title={color.name}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor?.name === color.name ? 'ring-2 ring-mvp-red scale-110' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              <span className="text-[10px] text-mvp-muted ml-1 truncate max-w-[80px]">
                {selectedColor?.name}
              </span>
            </div>
          ) : null}

          {/* Size Pills */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                    trackSizeSelect(size, product);
                  }}
                  className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                    selectedSize === size
                      ? 'bg-mvp-red text-white border-mvp-red font-bold'
                      : 'bg-mvp-dark text-mvp-silver border-mvp-cardHover hover:border-white/40'
                  }`}
                >
                  {size}
                </button>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-mvp-muted self-center">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Add to Cart */}
        <div className="pt-2 border-t border-mvp-cardHover/60 space-y-2 mt-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-mvp-muted line-through">
              {formatMoney(product.originalPrice)}
            </span>
            <span className="text-base sm:text-lg font-black text-white">
              {formatMoney(product.price)}
            </span>
          </div>

          <button
            onClick={handleBuyClick}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-mvp-red to-mvp-darkRed hover:from-mvp-crimson hover:to-mvp-red text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <Zap size={15} className="fill-yellow-400 text-yellow-400" />
            <span>Pedir / Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
