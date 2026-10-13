import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotalDOP,
    totalSavingsDOP,
    couponDiscountDOP,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    formatMoney,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 4500;
  const progressToFreeShipping = Math.min(100, Math.round((subtotalDOP / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalDOP);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage(res);
    if (res.success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const finalTotal = Math.max(0, subtotalDOP - couponDiscountDOP);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-mvp-black border-l border-mvp-cardHover shadow-2xl flex flex-col justify-between h-full">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-mvp-cardHover bg-mvp-dark flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-mvp-red" />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Tu Carrito de Compras</h2>
              <span className="text-xs bg-mvp-red/20 text-mvp-red px-2 py-0.5 rounded-full font-bold">
                {cart.length} prendas
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-mvp-muted hover:text-white rounded-xl hover:bg-mvp-card transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-mvp-card p-3 border-b border-mvp-cardHover flex-shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1 text-mvp-silver">
                <Truck size={14} className="text-mvp-red" />
                {progressToFreeShipping >= 100 ? (
                  <strong className="text-mvp-neonGreen font-bold">¡ENVÍO GRATIS DESBLOQUEADO! 🎉</strong>
                ) : (
                  <>Agrega <strong>{formatMoney(remainingForFreeShipping)}</strong> para Envío Gratis</>
                )}
              </span>
              <span className="text-mvp-red font-bold">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-mvp-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-mvp-neonGreen h-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-mvp-card flex items-center justify-center text-mvp-muted">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Tu carrito está vacío</h3>
                  <p className="text-xs text-mvp-muted mt-1">Explora nuestros tenis y prendas y viste con la verdadera grasa.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-mvp-red text-white text-xs font-bold uppercase tracking-wider hover:bg-mvp-darkRed transition-colors shadow-glow-sm"
                >
                  Ver Todos los Modelos
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-mvp-card border border-mvp-cardHover rounded-2xl p-3 flex gap-3 items-center group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.selectedImage || item.image || item.images?.[0]}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-black flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-snug">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-mvp-muted my-1">
                      <span className="bg-mvp-dark px-1.5 py-0.5 rounded border border-mvp-cardHover">
                        Talla: <strong className="text-white">{item.selectedSize}</strong>
                      </span>
                      {item.selectedColor && (
                        <span className="bg-mvp-dark px-1.5 py-0.5 rounded border border-mvp-cardHover truncate">
                          {item.selectedColor}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-black text-mvp-red">
                        {formatMoney(item.price * item.quantity)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center bg-mvp-dark border border-mvp-cardHover rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-mvp-silver hover:text-white font-black text-xs active:bg-mvp-card"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-mvp-silver hover:text-white font-black text-xs active:bg-mvp-card"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-mvp-muted hover:text-red-400 p-1.5 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-3 sm:p-4 bg-mvp-dark border-t border-mvp-cardHover space-y-3 flex-shrink-0 pb-6 sm:pb-4">
              {/* Coupon Input */}
              <div className="space-y-1">
                {activeCoupon ? (
                  <div className="flex items-center justify-between bg-mvp-neonGreen/10 border border-mvp-neonGreen/40 p-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-mvp-neonGreen font-bold truncate">
                      <Tag size={14} className="flex-shrink-0" />
                      <span className="truncate">{activeCoupon.description}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-mvp-muted hover:text-red-400 font-bold px-1 flex-shrink-0"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código (ej: VIP30)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-mvp-black border border-mvp-cardHover rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-mvp-muted focus:outline-none focus:border-mvp-red"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-mvp-card hover:bg-mvp-cardHover border border-mvp-cardHover text-white text-xs font-bold rounded-xl transition-colors flex-shrink-0"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p className={`text-[11px] font-semibold ${couponMessage.success ? 'text-mvp-neonGreen' : 'text-red-400'}`}>
                    {couponMessage.message}
                  </p>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1 text-xs text-mvp-silver">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">{formatMoney(subtotalDOP)}</span>
                </div>

                {totalSavingsDOP > 0 && (
                  <div className="flex justify-between text-mvp-gold font-semibold">
                    <span>Ahorro en Descuentos:</span>
                    <span>-{formatMoney(totalSavingsDOP)}</span>
                  </div>
                )}

                {couponDiscountDOP > 0 && (
                  <div className="flex justify-between text-mvp-neonGreen font-semibold">
                    <span>Descuento ({activeCoupon.code}):</span>
                    <span>-{formatMoney(couponDiscountDOP)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-mvp-cardHover">
                  <span className="uppercase">Total a Pagar (COD):</span>
                  <span className="text-base sm:text-lg text-mvp-red">{formatMoney(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-mvp-red to-mvp-darkRed hover:from-mvp-crimson hover:to-mvp-red text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-glow-red transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap size={16} className="fill-yellow-300 text-yellow-300" />
                <span>PEDIR AHORA (PAGO CONTRA ENTREGA)</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-mvp-muted text-center">
                <ShieldCheck size={12} className="text-mvp-neonGreen" />
                <span>Pagas en efectivo cuando el delivery llegue a tu puerta.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
