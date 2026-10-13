import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Zap, Check, Flame, MessageSquare, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  trackProductView,
  trackProductClick,
  trackCustomerAction,
  trackSizeSelect,
  trackColorSelect,
  trackProductModalDuration,
} from '../utils/tracker';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCheckoutOpen, formatMoney, openWhaticketWithProduct, openDirectWhatsAppForProduct } = useCart();
  const { currentUser, setIsAuthModalOpen } = useAuth();

  // Declare all hooks unconditionally at top level to satisfy Rules of Hooks
  const [selectedSize, setSelectedSize] = useState('40 (8)');
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      trackProductView(selectedProduct);

      const initialVariant = selectedProduct.variants?.[0];
      const defaultColor =
        selectedProduct.initialColor ||
        (initialVariant
          ? { name: initialVariant.code, image: initialVariant.image, variantId: initialVariant.id, sku: initialVariant.sku }
          : (selectedProduct.colors?.[0] || { name: 'Original', image: selectedProduct.images?.[0] }));

      setSelectedSize(selectedProduct.sizes?.[0] || '40 (8)');
      setSelectedColor(defaultColor);

      let imgIdx = 0;
      if (defaultColor?.image && Array.isArray(selectedProduct.images)) {
        const idx = selectedProduct.images.indexOf(defaultColor.image);
        imgIdx = idx >= 0 ? idx : 0;
      }
      setActiveImageIndex(imgIdx);
      setQuantity(1);
      setReviewComment('');
      setReviewSuccess(false);
    }
  }, [selectedProduct]);

  // Track real time spent viewing product details
  useEffect(() => {
    if (!selectedProduct?.id) return;
    const openTime = Date.now();
    const prod = selectedProduct;

    return () => {
      const dur = Math.max(1, Math.round((Date.now() - openTime) / 1000));
      trackProductModalDuration(prod, dur);
    };
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const handleBuyNow = () => {
    trackProductClick(selectedProduct, 'modal_checkout_cod_click');
    const itemToAdd = {
      ...selectedProduct,
      image: selectedColor?.image || selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0],
      selectedImage: selectedColor?.image || selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0],
      sku: selectedColor?.sku || selectedProduct.sku,
    };
    addToCart(itemToAdd, selectedSize, selectedColor?.name || 'Original', quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCartOnly = () => {
    const itemToAdd = {
      ...selectedProduct,
      image: selectedColor?.image || selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0],
      selectedImage: selectedColor?.image || selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0],
      sku: selectedColor?.sku || selectedProduct.sku,
    };
    addToCart(itemToAdd, selectedSize, selectedColor?.name || 'Original', quantity);
    setSelectedProduct(null);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!reviewComment.trim()) return;

    const newRev = {
      user: `${currentUser.name} (${currentUser.username})`,
      rating: userRating,
      date: 'Hace un momento',
      comment: reviewComment.trim(),
    };

    setSubmittedReviews([newRev, ...submittedReviews]);
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const allReviews = [...submittedReviews, ...(selectedProduct.reviews || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-mvp-card via-mvp-dark to-mvp-black border border-mvp-red/50 rounded-3xl shadow-glow-red overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 p-2 text-mvp-muted hover:text-white bg-mvp-black/70 rounded-full hover:bg-mvp-cardHover transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Gallery Column */}
            <div className="space-y-3">
              {/* Main Photo */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/60 border border-mvp-cardHover">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.discountPercent && (
                  <div className="absolute top-3 left-3 bg-mvp-red text-white text-xs font-black px-2.5 py-1 rounded-md shadow">
                    -{selectedProduct.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx ? 'border-mvp-red scale-105 shadow-glow-sm' : 'border-mvp-cardHover opacity-60'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="space-y-4">
              {/* Tag & Rating */}
              <div className="flex items-center justify-between">
                {selectedProduct.tag && (
                  <span className="bg-mvp-red/20 border border-mvp-red/50 text-mvp-red text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedProduct.tag}
                  </span>
                )}

                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <span className="font-black">{selectedProduct.rating}</span>
                  <span className="text-mvp-muted">({allReviews.length} reseñas)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 p-3 bg-mvp-black/60 rounded-xl border border-mvp-cardHover">
                <span className="text-2xl sm:text-3xl font-black text-mvp-red">
                  {formatMoney(selectedProduct.price)}
                </span>
                <span className="text-sm text-mvp-muted line-through">
                  {formatMoney(selectedProduct.originalPrice)}
                </span>
                <span className="bg-mvp-neonGreen/20 text-mvp-neonGreen text-xs font-bold px-2 py-0.5 rounded ml-auto">
                  Ahorras {formatMoney(selectedProduct.originalPrice - selectedProduct.price)}
                </span>
              </div>

              {/* Variant / Color Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 1 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-mvp-silver uppercase tracking-wider block">
                      Color / Variante: <span className="text-white font-bold">{selectedColor?.name}</span>
                    </label>
                    <span className="text-[11px] text-mvp-muted">{selectedProduct.variants.length} colores disponibles</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                    {selectedProduct.variants.map((v) => {
                      const isSelected = selectedColor?.variantId === v.id || selectedColor?.name === v.code;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedColor({ name: v.code, image: v.image, variantId: v.id, sku: v.sku });
                            trackColorSelect(v.code, selectedProduct);
                            const imgIdx = (selectedProduct.images || []).indexOf(v.image);
                            if (imgIdx !== -1) setActiveImageIndex(imgIdx);
                          }}
                          className={`relative rounded-xl overflow-hidden border-2 p-1.5 transition-all flex flex-col items-center gap-1.5 ${
                            isSelected ? 'border-mvp-red bg-mvp-card shadow-glow-sm scale-105' : 'border-mvp-cardHover bg-mvp-dark/80 opacity-70 hover:opacity-100 hover:border-white/40'
                          }`}
                        >
                          <img src={v.image} alt={v.code} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg" />
                          <span className="text-[10px] font-bold text-white truncate max-w-[70px] text-center">{v.code}</span>
                          {v.stock > 0 && v.stock <= 5 && (
                            <span className="text-[9px] text-amber-400 font-semibold">Pocas cantidades</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : selectedProduct.colors && selectedProduct.colors.length > 1 ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-mvp-silver uppercase tracking-wider block">
                    Color: <span className="text-white font-normal">{selectedColor?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          trackColorSelect(color.name, selectedProduct);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          selectedColor?.name === color.name
                            ? 'bg-mvp-card border-mvp-red text-white shadow-glow-sm'
                            : 'bg-mvp-dark border-mvp-cardHover text-mvp-muted hover:border-white/40'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Size Selector */}
              {selectedProduct.sizes && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-mvp-silver uppercase tracking-wider">
                      Talla Seleccionada: <strong className="text-white">{selectedSize}</strong>
                    </span>
                    <span className="text-mvp-red font-semibold">Guía de Tallas Urbanas</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          trackSizeSelect(size, selectedProduct);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                          selectedSize === size
                            ? 'bg-mvp-red text-white border-mvp-red shadow-glow-sm scale-105'
                            : 'bg-mvp-dark text-mvp-silver border-mvp-cardHover hover:border-white/40'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-mvp-silver uppercase tracking-wider">Cantidad:</label>
                <div className="flex items-center bg-mvp-dark border border-mvp-cardHover rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-white hover:text-mvp-red font-black"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-white hover:text-mvp-red font-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Call to action buttons */}
              <div className="space-y-2.5 pt-2">
                {/* 1. Direct WhatsApp */}
                <button
                  onClick={() => {
                    const prod = selectedProduct;
                    trackProductClick(prod, 'modal_whatsapp_buy_click');
                    trackCustomerAction('whatsapp_buy_click', {
                      productId: prod.id,
                      productName: prod.name,
                      category: prod.category,
                      price: prod.price,
                      source: 'modal_detail',
                    });
                    setSelectedProduct(null);
                    openDirectWhatsAppForProduct(prod, selectedSize, selectedColor?.name || 'Original');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={17} className="fill-white text-emerald-500" />
                  <span>💬 Pedir Directo por WhatsApp</span>
                </button>

                {/* 2. Add to Cart & Keep Shopping */}
                <button
                  onClick={() => {
                    trackProductClick(selectedProduct, 'modal_add_to_cart_click');
                    trackCustomerAction('add_to_cart', {
                      productId: selectedProduct.id,
                      productName: selectedProduct.name,
                      category: selectedProduct.category,
                      price: selectedProduct.price,
                      quantity,
                      source: 'modal_detail',
                    });
                    handleAddToCartOnly();
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#141824] hover:bg-[#1E2436] border border-white/10 hover:border-mvp-red/40 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag size={16} className="text-mvp-red" />
                  <span>🛒 Seguir Comprando (Agregar al Carrito)</span>
                </button>

                {/* 3. Direct COD Checkout */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 text-mvp-silver hover:text-white font-semibold text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>Pagar en la web con Pago Contra Entrega (COD)</span>
                </button>
              </div>

              {/* Trust Badges in Modal */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-mvp-muted border-t border-mvp-cardHover">
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-mvp-red" />
                  <span>Envío Express a todo RD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-mvp-neonGreen" />
                  <span>Pagas al recibir en casa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Features Section */}
          <div className="border-t border-mvp-cardHover/80 pt-4 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Descripción del Modelo</h3>
            <p className="text-xs sm:text-sm text-mvp-silver/80 leading-relaxed">
              {selectedProduct.description}
            </p>

            {selectedProduct.features && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {selectedProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-mvp-silver bg-mvp-dark/60 p-2 rounded-lg border border-mvp-cardHover/50">
                    <Check size={14} className="text-mvp-neonGreen flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-mvp-cardHover/80 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Reseñas Verificadas de Compradores
              </h3>
              <span className="text-xs text-mvp-gold font-bold">100% Clientes Reales RD</span>
            </div>

            {/* Submit Review Box */}
            <form onSubmit={handleReviewSubmit} className="bg-mvp-dark/80 p-3.5 rounded-2xl border border-mvp-cardHover space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Deja tu calificación:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        size={16}
                        className={star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-mvp-muted'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={currentUser ? 'Escribe tu opinión sobre la tela, talla y delivery...' : 'Inicia sesión para opinar...'}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="flex-1 bg-mvp-black border border-mvp-cardHover focus:border-mvp-red rounded-xl px-3 py-2 text-xs text-white placeholder-mvp-muted focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-mvp-red hover:bg-mvp-darkRed text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <Send size={13} />
                  <span>Publicar</span>
                </button>
              </div>

              {reviewSuccess && (
                <p className="text-xs text-mvp-neonGreen font-semibold">
                  ¡Gracias por tu reseña! Ha sido añadida a la prenda.
                </p>
              )}
            </form>

            <div className="space-y-2">
              {allReviews.map((rev, idx) => (
                <div key={idx} className="bg-mvp-dark/50 p-3 rounded-xl border border-mvp-cardHover/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{rev.user}</span>
                    <span className="text-[10px] text-mvp-muted">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={11} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-mvp-silver/90">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
