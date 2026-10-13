import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  Zap, 
  Navigation, 
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RD_PROVINCES, getZoneByProvince, getShippingCost } from '../data/locationsRD';

export const CheckoutModal = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotalDOP,
    couponDiscountDOP,
    activeCoupon,
    setCurrentTrackingId,
    setIsTrackerOpen,
    formatMoney,
  } = useCart();

  if (!isCheckoutOpen) return null;

  // Ultra-simplified form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [provinceId, setProvinceId] = useState('dn');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_cod');
  const GPS_STORAGE_KEY = 'ganador_gps_location';
  const [gpsLocation, setGpsLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(GPS_STORAGE_KEY) || localStorage.getItem('mvpflow_gps_location');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsToast, setGpsToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const selectedProvince = RD_PROVINCES.find((p) => p.id === provinceId) || RD_PROVINCES[0];
  const selectedZone = getZoneByProvince(provinceId);
  const rawShipping = getShippingCost(provinceId);
  const shippingFee = activeCoupon?.freeShipping ? 0 : rawShipping;
  const totalToPay = Math.max(0, subtotalDOP - couponDiscountDOP + shippingFee);

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      setGpsToast('⚠️ Tu navegador no soporta geolocalización.');
      setTimeout(() => setGpsToast(null), 3000);
      return;
    }
    setIsGettingGps(true);
    setGpsToast('📡 Obteniendo tu ubicación...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsLocation(loc);
        setIsGettingGps(false);
        setGpsToast('✅ ¡Ubicación guardada! Se adjuntará al pedido.');
        setTimeout(() => setGpsToast(null), 3500);
        try { localStorage.setItem(GPS_STORAGE_KEY, JSON.stringify(loc)); } catch {}
      },
      () => {
        setIsGettingGps(false);
        setGpsToast('❌ No se pudo obtener la ubicación. Verifica los permisos.');
        setTimeout(() => setGpsToast(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleClearGPS = () => {
    setGpsLocation(null);
    try { localStorage.removeItem(GPS_STORAGE_KEY); } catch {}
    setGpsToast('🗑️ Ubicación GPS borrada.');
    setTimeout(() => setGpsToast(null), 2500);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormError('Por favor completa tu nombre, teléfono y dirección de entrega.');
      return;
    }

    setIsSubmitting(true);
    const trackingId = `MVP-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      trackingId,
      createdAt: new Date().toISOString(),
      status: 'received',
      customer: {
        name: name.trim(),
        phone: phone.trim(),
      },
      shipping: {
        provinceId,
        provinceName: selectedProvince.name,
        zoneName: selectedZone.name,
        estimatedDelivery: selectedZone.estimatedDelivery,
        municipality: selectedProvince.municipalities[0] || 'Centro',
        address: address.trim(),
        gpsLocation,
      },
      payment: {
        method: paymentMethod,
        subtotal: subtotalDOP,
        discount: couponDiscountDOP,
        couponCode: activeCoupon?.code || null,
        shippingFee,
        total: totalToPay,
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.images[0],
      })),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      // Offline fallback: save locally immediately
      const existing = JSON.parse(localStorage.getItem('ganador_orders') || localStorage.getItem('mvpflow_orders') || '[]');
      existing.unshift(orderPayload);
      localStorage.setItem('ganador_orders', JSON.stringify(existing));
    }

    setIsSubmitting(false);
    clearCart();
    setIsCheckoutOpen(false);
    setCurrentTrackingId(trackingId);
    setIsTrackerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-mvp-card via-mvp-dark to-mvp-black border-2 border-mvp-red/60 rounded-3xl shadow-glow-red overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-mvp-cardHover bg-mvp-dark flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-mvp-red fill-mvp-red" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                Completar Pedido (Pagas al Recibir)
              </h2>
              <span className="text-[11px] text-mvp-neonGreen font-bold block">
                ⚡ Entrega Rápida en República Dominicana
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-mvp-muted hover:text-white rounded-lg hover:bg-mvp-card transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {/* Nombre */}
          <div>
            <label className="text-[11px] text-white font-bold block mb-1">
              ¿A nombre de quién entregamos? *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Nombre y Apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-mvp-black border border-mvp-cardHover focus:border-mvp-red rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-mvp-muted focus:outline-none"
              />
              <User size={14} className="absolute left-3 top-3 text-mvp-muted" />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-[11px] text-white font-bold block mb-1">
              WhatsApp / Teléfono para coordinar *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="Ej: 809-555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-mvp-black border border-mvp-cardHover focus:border-mvp-red rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-mvp-muted focus:outline-none font-mono"
              />
              <Phone size={14} className="absolute left-3 top-3 text-mvp-muted" />
            </div>
          </div>

          {/* Provincia / Ciudad */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] text-white font-bold">
                Provincia / Ciudad *
              </label>
              <button
                type="button"
                onClick={handleCaptureGPS}
                className="text-[10px] text-mvp-neonGreen font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-mvp-neonGreen/30"
              >
                <Navigation size={10} className={isGettingGps ? 'animate-spin' : ''} />
                <span>{gpsLocation ? '📍 GPS Adjunto' : '📍 Marcar mi GPS'}</span>
              </button>
            </div>
            <select
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value)}
              className="w-full bg-mvp-black border border-mvp-cardHover focus:border-mvp-red rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              {RD_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name} {prov.fee === 0 ? '(Envío Gratis)' : `(+RD$ ${prov.fee})`}
                </option>
              ))}
            </select>
          </div>

          {/* Dirección Exacta */}
          <div>
            <label className="text-[11px] text-white font-bold block mb-1">
              Sector, Calle, Número y Referencia *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Ej: Piantini, Calle El Sol #24, Edif. Apto 3B (Frente a la farmacia)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-mvp-black border border-mvp-cardHover focus:border-mvp-red rounded-xl p-2.5 text-xs text-white placeholder-mvp-muted focus:outline-none"
            />
          </div>

          {/* Mini-mapa GPS */}
          {gpsLocation && (
            <div className="bg-mvp-black border border-mvp-neonGreen/40 rounded-xl p-3 flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-mvp-neonGreen/15 flex items-center justify-center">
                <MapPin size={18} className="text-mvp-neonGreen" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-mvp-neonGreen mb-0.5">📍 GPS Marcado & Guardado</p>
                <p className="text-[10px] text-mvp-silver font-mono truncate">
                  {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                </p>
                <a
                  href={`https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-400 underline font-semibold"
                >
                  Ver en Google Maps ↗
                </a>
              </div>
              <button
                type="button"
                onClick={handleClearGPS}
                className="shrink-0 text-mvp-muted hover:text-red-400 text-[10px] font-bold transition-colors px-1.5"
                title="Borrar GPS"
              >
                ✕
              </button>
            </div>
          )}

          {/* Toast GPS */}
          {gpsToast && (
            <div className="bg-mvp-card border border-white/20 text-white text-[11px] font-semibold px-3 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
              <Navigation size={12} className="text-mvp-neonGreen shrink-0" />
              <span>{gpsToast}</span>
            </div>
          )}

          {/* Método de Pago Rápido */}
          <div className="bg-mvp-black/60 p-2.5 rounded-xl border border-mvp-cardHover flex items-center justify-between text-xs">
            <span className="text-mvp-silver font-semibold flex items-center gap-1">
              💵 <strong>Pago al Recibir:</strong> Efectivo o Transferencia
            </span>
            <span className="text-mvp-neonGreen font-bold text-[11px]">✓ Confirmado</span>
          </div>

          {/* Resumen Total */}
          <div className="bg-mvp-dark p-3 rounded-xl border border-mvp-cardHover space-y-1 text-xs">
            <div className="flex justify-between text-mvp-silver">
              <span>{cart.length} prenda(s):</span>
              <span className="font-bold text-white">{formatMoney(subtotalDOP)}</span>
            </div>
            {couponDiscountDOP > 0 && (
              <div className="flex justify-between text-mvp-neonGreen font-semibold">
                <span>Descuento ({activeCoupon.code}):</span>
                <span>-{formatMoney(couponDiscountDOP)}</span>
              </div>
            )}
            <div className="flex justify-between text-mvp-silver">
              <span className="flex items-center gap-1">
                <Truck size={12} className="text-mvp-red" />
                <span>Envío:</span>
              </span>
              <span>{shippingFee === 0 ? <strong className="text-mvp-neonGreen">GRATIS</strong> : formatMoney(shippingFee)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1.5 border-t border-mvp-cardHover">
              <span className="font-black text-xs text-white uppercase">TOTAL A PAGAR:</span>
              <span className="text-base sm:text-lg font-black text-mvp-red">{formatMoney(totalToPay)}</span>
            </div>
          </div>

          {/* Form Validation Error Message */}
          {formError && (
            <div className="text-xs font-bold text-rose-300 bg-rose-950/80 border border-rose-500/40 p-2.5 rounded-xl animate-fade-in text-center">
              {formError}
            </div>
          )}

          {/* Botón de Confirmación */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mvp-red via-mvp-crimson to-mvp-darkRed text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-glow-red hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Confirmando...</span>
            ) : (
              <>
                <Zap size={16} className="fill-yellow-300 text-yellow-300" />
                <span>CONFIRMAR PEDIDO (PAGO EN PUERTA)</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1 text-[10px] text-mvp-muted">
            <ShieldCheck size={12} className="text-mvp-neonGreen" />
            <span>Sin pago previo. Revisas tu ropa y pagas al mensajero.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
