import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StoriesBar } from './components/StoriesBar';
import { HeroBanner } from './components/HeroBanner';
import { FlashDeals } from './components/FlashDeals';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickProductActionModal } from './components/QuickProductActionModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SpinWheel } from './components/SpinWheel';
import { OrderTracker } from './components/OrderTracker';
import { AdminModal } from './components/AdminModal';
import { StaffManualModal } from './components/StaffManualModal';
import { StaffPortal } from './components/StaffPortal';
import { StoryUploadManager } from './components/StoryUploadManager';
import { WishlistModal } from './components/WishlistModal';
import { LiveWhaticketChat } from './components/LiveWhaticketChat';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SocialProofToast } from './components/SocialProofToast';
import { SocialFeed } from './components/SocialFeed';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ComingSoonLanding } from './components/ComingSoonLanding';
import { PRODUCTS as STATIC_PRODUCTS } from './data/products';
import { useCart } from './context/CartContext';
import { Sparkles, LayoutGrid, List, Menu, Search, X, Smartphone } from 'lucide-react';

import { trackPageView, trackSearchQuery, trackCategoryClick, initSessionTracking } from './utils/tracker';

const normalizeText = (text) => {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .trim();
};

// Spanish phonetic & acoustic normalization for common typos (v/b, c/s/z, h, y/ll)
const phoneticKey = (word) => {
  return String(word || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/v/g, 'b')
    .replace(/z/g, 's')
    .replace(/c(?=[ei])/g, 's')
    .replace(/k/g, 'c')
    .replace(/qu(?=[ei])/g, 'c')
    .replace(/h/g, '')
    .replace(/y(?=[aeiou]|$)/g, 'll')
    .replace(/m(?=[pb])/g, 'n');
};

// Fast Levenshtein distance with early exit
const levenshtein = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 3;

  const d = [];
  for (let j = 0; j <= b.length; j++) d[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(d[j - 1] + cost, d[j] + 1, prev + 1);
      d[j - 1] = prev;
      prev = val;
    }
    d[b.length] = prev;
  }
  return d[b.length];
};

// Domain-specific fashion synonyms and root stems
const getSearchStems = (queryWord) => {
  const stems = new Set([queryWord]);
  if (queryWord.endsWith('es') && queryWord.length > 3) stems.add(queryWord.slice(0, -2));
  else if (queryWord.endsWith('s') && queryWord.length > 2) stems.add(queryWord.slice(0, -1));

  if (queryWord.includes('verm') || queryWord.includes('berm')) {
    stems.add('bermuda'); stems.add('bermudas'); stems.add('short'); stems.add('shorts');
  }
  if (queryWord.includes('patal') || queryWord.includes('pantal')) {
    stems.add('pantalon'); stems.add('pantalones'); stems.add('jean'); stems.add('jeans');
  }
  if (queryWord.includes('poloc') || queryWord === 'polo' || queryWord.includes('tshirt') || queryWord.includes('t-shirt') || queryWord.includes('camiset')) {
    stems.add('poloche'); stems.add('polocher'); stems.add('polo'); stems.add('t-shirt'); stems.add('camiseta');
  }
  if (queryWord.includes('suer') || queryWord.includes('hood') || queryWord.includes('abrig')) {
    stems.add('suera'); stems.add('hoodie'); stems.add('abrigo'); stems.add('sueter');
  }
  if (queryWord.includes('teni') || queryWord.includes('sneaker') || queryWord.includes('zapat')) {
    stems.add('tenis'); stems.add('sneakers'); stems.add('zapatos'); stems.add('calzado');
  }
  if (queryWord.includes('gorr') || queryWord.includes('cap')) {
    stems.add('gorra'); stems.add('gorras'); stems.add('cap');
  }
  return Array.from(stems);
};

// Check whether a query token matches a product's name, sku, tag, or category
const isTokenMatch = (queryToken, product, targetWords, targetText) => {
  if (!queryToken) return true;

  const isNumericOrShort = /^\d+$/.test(queryToken) || queryToken.length <= 2;

  if (isNumericOrShort) {
    // Discrete token/word boundary matching for numbers or short model codes (e.g. 5, 4, 11, 12, 1)
    // NEVER match arbitrary substrings inside unrelated words like "calidad g5" or prices.
    const nameNorm = normalizeText(product.name || '');
    const tagNorm = normalizeText(product.tag || '');
    const skuNorm = normalizeText(product.sku || '');

    const boundaryRegex = new RegExp(`(^|[^a-z0-9])${queryToken}([^a-z0-9]|$)`, 'i');
    return boundaryRegex.test(nameNorm) || boundaryRegex.test(tagNorm) || boundaryRegex.test(skuNorm);
  }

  // Alphanumeric / Word Token Matching
  if (targetText.includes(queryToken)) return true;

  const stems = getSearchStems(queryToken);
  for (const stem of stems) {
    if (targetText.includes(stem)) return true;
  }

  if (queryToken.length >= 3) {
    const pQuery = phoneticKey(queryToken);
    for (const tWord of targetWords) {
      if (!tWord || tWord.length < 3) continue;
      if (tWord === queryToken || tWord.includes(queryToken) || queryToken.includes(tWord)) return true;

      const pTarget = phoneticKey(tWord);
      if (pQuery === pTarget) return true;

      const maxDist = queryToken.length >= 6 ? 2 : (queryToken.length >= 4 ? 1 : 0);
      if (maxDist > 0) {
        if (levenshtein(pQuery, pTarget) <= maxDist) return true;
        if (levenshtein(queryToken, tWord) <= maxDist) return true;
      }
    }
  }
  return false;
};

export const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('ganador_view_mode') || localStorage.getItem('mvpflow_view_mode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('ganador_view_mode', mode);
    } catch {
      // ignore
    }
  };
  const [isComingSoonMode, setIsComingSoonMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('store') === '1' || params.get('full') === '1') {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  });
  const [allProducts, setAllProducts] = useState(STATIC_PRODUCTS);
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);
  const [isStoriesUploadOpen, setIsStoriesUploadOpen] = useState(false);

  const { 
    itemsCount, 
    setIsAdminOpen, 
    setIsManualOpen, 
    setIsWhaticketChatOpen,
    setCatalogProducts
  } = useCart();

  // Initialize catalog products for real-time favorites
  useEffect(() => {
    if (setCatalogProducts) {
      setCatalogProducts(STATIC_PRODUCTS);
    }
  }, [setCatalogProducts]);

  // Load products from API on mount
  const fetchProductsFromApi = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
          if (setCatalogProducts) setCatalogProducts(data);
        }
      }
    } catch {
      // Fallback to static products
    }
  }, [setCatalogProducts]);

  useEffect(() => {
    initSessionTracking();
    trackPageView('/', 'GANADOR | Official Store & Drops');
    fetchProductsFromApi();
  }, [fetchProductsFromApi]);

  // Sync Odoo handler (Secure: Backend uses server-side .env credentials)
  const handleSyncOdoo = useCallback(async () => {
    const adminToken = sessionStorage.getItem('ganador_admin_token') || sessionStorage.getItem('mvpflow_admin_token') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const res = await fetch('/api/odoo/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.success && data.products) {
      setAllProducts(data.products);
      if (setCatalogProducts) setCatalogProducts(data.products);
      return data;
    }
    throw new Error(data.message || 'Error al sincronizar con Odoo');
  }, [setCatalogProducts]);

  useEffect(() => {
    // Check URL parameters for Staff / Admin / Chat / Stories routes
    const url = window.location.href.toLowerCase();
    
    // /admin or #admin
    if (url.includes('/admin') || url.includes('admin=') || url.includes('#admin') || url.includes('/odoo') || url.includes('odoo=')) {
      setIsAdminOpen(true);
    }
    // /catalogo, /cotizador, /staff, #catalogo
    if (
      url.includes('/catalogo') ||
      url.includes('catalogo=') ||
      url.includes('#catalogo') ||
      url.includes('/cotizador') ||
      url.includes('cotizador=') ||
      url.includes('#cotizador') ||
      url.includes('/staff') ||
      url.includes('staff=') ||
      url.includes('#staff')
    ) {
      setIsStaffPortalOpen(true);
    }
    // /subir-historias, /historias, /subir-video
    if (
      url.includes('/subir-historias') ||
      url.includes('subir-historias=') ||
      url.includes('#subir-historias') ||
      url.includes('/historias') ||
      url.includes('#historias') ||
      url.includes('/subir-video')
    ) {
      setIsStoriesUploadOpen(true);
    }
    // /manual
    if (url.includes('/manual') || url.includes('manual=') || url.includes('#manual')) {
      setIsManualOpen(true);
    }
    // /chat
    if (url.includes('/chat') || url.includes('chat=') || url.includes('#chat')) {
      setIsWhaticketChatOpen(true);
    }
  }, [setIsAdminOpen, setIsManualOpen, setIsWhaticketChatOpen]);

  // Filter public storefront: Show all independent products individually (no variant grouping)
  const webPublishedProducts = useMemo(() => {
    return allProducts.filter((product) => product.isPublishedWeb !== false);
  }, [allProducts]);

  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  // Helper: Detect whether a product is a combo or an offer/discount
  const isComboOrOffer = useCallback((product) => {
    if (product.category === 'combos') return true;
    if (product.isFlashDeal) return true;
    if (product.discountPercent && Number(product.discountPercent) > 0) return true;
    if (product.originalPrice && Number(product.originalPrice) > Number(product.price)) return true;
    const tag = (product.tag || '').toLowerCase();
    if (tag.includes('oferta') || tag.includes('combo') || tag.includes('deal') || tag.includes('sale') || tag.includes('descuento') || tag.includes('promo')) return true;
    return false;
  }, []);

  // Track category selection telemetry
  const handleSelectCategory = useCallback((cat) => {
    setSelectedCategory(cat);
    trackCategoryClick(cat);
  }, []);

  // Fast client-side category and accent/typo-tolerant global search filter
  const filteredProducts = useMemo(() => {
    const rawQ = normalizeText(searchQuery);
    if (!rawQ) {
      return webPublishedProducts.filter((product) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'combos') return isComboOrOffer(product);
        return product.category === selectedCategory;
      });
    }

    // Expand concatenated queries like "jordan5" -> "jordan 5"
    const expandedQ = rawQ
      .replace(/([a-z]+)(\d+)/g, '$1 $2')
      .replace(/(\d+)([a-z]+)/g, '$1 $2')
      .trim();

    const queryTokens = expandedQ.split(/\s+/).filter(Boolean);

    return webPublishedProducts.filter((product) => {
      // If user is searching, query matches globally across all categories
      const matchesCategory =
        isSearching ||
        selectedCategory === 'all' ||
        (selectedCategory === 'combos' ? isComboOrOffer(product) : product.category === selectedCategory);

      if (!matchesCategory) return false;

      const nameNorm = normalizeText(product.name || '');
      const catNorm = normalizeText(product.category || '');
      const tagNorm = normalizeText(product.tag || '');
      const skuNorm = normalizeText(product.sku || '');

      // Priority 1: Direct full query match on name, sku or tag
      if (
        nameNorm.includes(rawQ) ||
        nameNorm.includes(expandedQ) ||
        tagNorm.includes(rawQ) ||
        skuNorm.includes(rawQ)
      ) {
        return true;
      }

      // Priority 2: Safe tokenized match across name, category, tag, and sku
      const targetText = `${nameNorm} ${catNorm} ${tagNorm} ${skuNorm}`;
      const targetWords = targetText.split(/\s+/).filter(Boolean);

      return queryTokens.every((token) =>
        isTokenMatch(token, product, targetWords, targetText)
      );
    });
  }, [webPublishedProducts, selectedCategory, searchQuery, isSearching, isComboOrOffer]);

  // Telemetry: Track search queries to capture customer interest & zero-result demand
  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) return;
    const timer = setTimeout(() => {
      trackSearchQuery(searchQuery, filteredProducts.length, selectedCategory);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredProducts.length, selectedCategory]);

  if (isComingSoonMode) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans">
        <ComingSoonLanding
          onOpenCatalog={() => setIsStaffPortalOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenQuoter={() => setIsStaffPortalOpen(true)}
          onOpenStories={() => setIsStoriesUploadOpen(true)}
          onOpenChat={() => setIsWhaticketChatOpen(true)}
          productsCount={allProducts.length}
        />

        {/* Floating Switcher to preview complete store */}
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setIsComingSoonMode(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-400 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
            title="Ver vista previa de la tienda comercial completa"
          >
            <span>👁️ Vista Previa Tienda</span>
          </button>
        </div>

        {/* Operational Modals (Active & Functional) */}
        <ProductDetailModal />
        <QuickProductActionModal />
        <CartDrawer />
        <CheckoutModal />
        <SpinWheel />
        <OrderTracker />
        <AdminModal onProductUpdated={fetchProductsFromApi} />
        <StaffManualModal />
        <StaffPortal 
          isOpen={isStaffPortalOpen} 
          onClose={() => setIsStaffPortalOpen(false)} 
          allProducts={allProducts} 
          onSyncOdoo={handleSyncOdoo} 
        />
        {isStoriesUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl my-auto max-h-[92vh] overflow-y-auto">
              <StoryUploadManager isOpen={true} onClose={() => setIsStoriesUploadOpen(false)} />
            </div>
          </div>
        )}
        <WishlistModal />
        <LiveWhaticketChat />
        <AuthModal />
        <UserProfileModal />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mvp-black text-mvp-silver font-sans selection:bg-mvp-red selection:text-white pb-20 sm:pb-0">
      {/* Top Banner to return to Coming Soon */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-black border-b border-red-500/20 px-4 py-1.5 flex items-center justify-between text-xs">
        <span className="text-slate-300 font-bold">
          ⚡ MODO VISTA PREVIA TIENDA (Página pública en modo Coming Soon)
        </span>
        <button
          onClick={() => setIsComingSoonMode(true)}
          className="text-red-400 hover:text-white font-black underline uppercase text-[11px]"
        >
          Volver a Coming Soon
        </button>
      </div>

      {/* Header & Navigation */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* When the user is NOT searching: Show curated visual home sections */}
      {!isSearching && (
        <>
          {/* Top Instagram-style Stories with live sales pulse */}
          <StoriesBar onSelectCategory={handleSelectCategory} />

          {/* Hero Interactive Banner */}
          <HeroBanner onSelectCategory={handleSelectCategory} />

          {/* Flash Deals with Urgency Countdown */}
          <FlashDeals products={allProducts} />

          {/* Category Filter Bar */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </>
      )}

      {/* Main Storefront Catalog / Focused Search Results */}
      <main id="catalog" className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* If searching: Clean Search Results Header */}
        {isSearching ? (
          <div className="bg-mvp-card/90 border border-mvp-red/40 rounded-2xl p-3.5 sm:p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-mvp-red/20 border border-mvp-red/30 flex items-center justify-center text-mvp-red flex-shrink-0">
                <Search size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-white">
                  Buscando: <span className="text-mvp-red">"{searchQuery}"</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-mvp-muted">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* 3 Views Segmented Pill */}
              <div className="flex items-center bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleSetViewMode('compact')}
                  className={`p-1.5 sm:p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    viewMode === 'compact'
                      ? 'bg-mvp-red text-white shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Listado Compacto (1 fila)"
                  aria-label="Listado Compacto"
                >
                  <Menu size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSetViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    viewMode === 'list'
                      ? 'bg-mvp-red text-white shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Lista Detallada"
                  aria-label="Lista Detallada"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSetViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    viewMode === 'grid'
                      ? 'bg-mvp-red text-white shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Cuadrícula (2 Columnas)"
                  aria-label="Cuadrícula 2 Columnas"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              {/* Clear Search Button */}
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <X size={14} />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Catalog Header with "Listado del Día" & 3-views toggle matching user reference */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6 bg-mvp-card/40 border border-white/5 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-sm flex-shrink-0">
                <Smartphone size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                  Listado del Día
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    WhatsApp Activo
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px]">{filteredProducts.length} modelos</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              {/* 3-View Mode Pill (Menu / List / Grid) */}
              <div className="flex items-center bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleSetViewMode('compact')}
                  className={`p-1.5 sm:p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    viewMode === 'compact'
                      ? 'bg-mvp-red text-white shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Listado Compacto (1 fila)"
                  aria-label="Listado Compacto"
                >
                  <Menu size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSetViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    viewMode === 'list'
                      ? 'bg-mvp-red text-white shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Lista Detallada"
                  aria-label="Lista Detallada"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSetViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    viewMode === 'grid'
                      ? 'bg-mvp-red text-white shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Cuadrícula (2 Columnas)"
                  aria-label="Cuadrícula 2 Columnas"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              {/* Quick Search Focus Button */}
              <button
                type="button"
                onClick={() => {
                  const searchInput = document.querySelector('input[type="search"], input[placeholder*="Buscar"]');
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                title="Buscar productos"
                aria-label="Buscar productos"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Products Grid, List, or Compact */}
        {filteredProducts.length === 0 ? (
          <div className="bg-mvp-card/50 border border-mvp-cardHover rounded-3xl p-8 sm:p-12 text-center space-y-3 my-6">
            <p className="text-sm sm:text-base font-bold text-white">No encontramos productos para "{searchQuery}".</p>
            <p className="text-xs text-slate-400">Verifica que el nombre esté bien escrito o prueba con otra categoría.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-mvp-red text-white text-xs font-bold uppercase tracking-wider hover:bg-mvp-darkRed transition-colors"
            >
              Ver Catálogo Completo
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'compact'
              ? 'flex flex-col gap-1.5 sm:gap-2 max-w-3xl mx-auto'
              : viewMode === 'list'
              ? 'flex flex-col gap-2.5 sm:gap-3 max-w-2xl mx-auto'
              : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6'
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </main>

      {/* Community Social Feed (only when not searching to keep it clean) */}
      {!isSearching && <SocialFeed />}

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Interactive Modals */}
      <ProductDetailModal />
      <QuickProductActionModal />
      <CartDrawer />
      <CheckoutModal />
      <SpinWheel />
      <OrderTracker />
      <AdminModal onProductUpdated={fetchProductsFromApi} />
      <StaffManualModal />
      <StaffPortal 
        isOpen={isStaffPortalOpen} 
        onClose={() => setIsStaffPortalOpen(false)} 
        allProducts={allProducts} 
        onSyncOdoo={handleSyncOdoo} 
      />
      {isStoriesUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto max-h-[92vh] overflow-y-auto">
            <StoryUploadManager isOpen={true} onClose={() => setIsStoriesUploadOpen(false)} />
          </div>
        </div>
      )}
      <WishlistModal />
      <LiveWhaticketChat />
      <AuthModal />
      <UserProfileModal />
      <SocialProofToast />
      <FloatingWhatsApp />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
};

export default App;
