import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Business,
  Product,
  Order,
  CartItem,
  WhatsAppCampaign,
  ChatbotConfig,
  SavedAddress,
  OrderStatus,
  Coordinates
} from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CAMPAIGNS,
  INITIAL_CHATBOT_CONFIG,
  INITIAL_SAVED_ADDRESSES
} from '../data/mockData';

interface AppContextType {
  // Navigation & Roles
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeClientTab: string;
  setActiveClientTab: (tab: string) => void;
  activeSellerTab: string;
  setActiveSellerTab: (tab: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;

  // Businesses
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  selectedBusinessId: string;
  setSelectedBusinessId: (id: string) => void;
  currentSellerBusiness: Business | undefined;
  addBusiness: (biz: Omit<Business, 'id'>) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  selectedBusinessForDetail: Business | null;
  setSelectedBusinessForDetail: (biz: Business | null) => void;

  // Products
  products: Product[];
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleOfferOfTheDay: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;

  // Location
  userLocation: Coordinates | null;
  userAddressLabel: string;
  isLocating: boolean;
  locationPermissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  detectUserLocation: () => void;
  setUserCustomLocation: (coords: Coordinates, label: string) => void;
  savedAddresses: SavedAddress[];
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (id: string) => void;

  // WhatsApp & Chatbot
  chatbotConfig: ChatbotConfig;
  updateChatbotConfig: (updates: Partial<ChatbotConfig>) => void;
  campaigns: WhatsAppCampaign[];
  addCampaign: (campaign: Omit<WhatsAppCampaign, 'id' | 'sentCount' | 'openRate' | 'clickRate' | 'date'>) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  openWhatsAppWithPrompt: (initialQuery?: string, targetBizId?: string) => void;
  whatsappInitialPrompt: string;

  // PWA
  deferredInstallPrompt: any;
  isAppInstalled: boolean;
  installPWA: () => void;
  showInstallBanner: boolean;
  setShowInstallBanner: (show: boolean) => void;

  // Utilities
  calculateDistance: (destCoords: Coordinates) => number;
  openExternalNavigation: (coords: Coordinates, app: 'google_maps' | 'waze') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default coordinates: CDMX Center (fallback if no GPS)
const DEFAULT_CENTER_COORDS: Coordinates = { lat: 19.4120, lng: -99.1650 };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Roles & View Tabs
  const [currentRole, setCurrentRole] = useState<Role>('client');
  const [activeClientTab, setActiveClientTab] = useState<string>('explore');
  const [activeSellerTab, setActiveSellerTab] = useState<string>('orders');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');

  // Business State
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('mk_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);
  const [selectedBusinessForDetail, setSelectedBusinessForDetail] = useState<Business | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mk_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mk_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // WhatsApp & Chatbot
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>(() => {
    const saved = localStorage.getItem('mk_chatbot_config');
    return saved ? JSON.parse(saved) : INITIAL_CHATBOT_CONFIG;
  });

  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>(() => {
    const saved = localStorage.getItem('mk_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappInitialPrompt, setWhatsappInitialPrompt] = useState('');

  // Location State
  const [userLocation, setUserLocation] = useState<Coordinates | null>(DEFAULT_CENTER_COORDS);
  const [userAddressLabel, setUserAddressLabel] = useState<string>('Ubicación actual detectada');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('prompt');

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem('mk_saved_addresses');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_ADDRESSES;
  });

  // PWA Install State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('mk_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('mk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mk_chatbot_config', JSON.stringify(chatbotConfig));
  }, [chatbotConfig]);

  useEffect(() => {
    localStorage.setItem('mk_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('mk_saved_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Deep Link URL Query Param Parser
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const bizId = params.get('id');
      const filter = params.get('filter');

      if (view === 'business' && bizId) {
        const found = businesses.find(b => b.id === bizId);
        if (found) {
          setSelectedBusinessForDetail(found);
          setCurrentRole('client');
          setActiveClientTab('explore');
        }
      } else if (filter) {
        setCurrentRole('client');
        setActiveClientTab('explore');
      }
    } catch (e) {
      // url param parsing ignore
    }
  }, [businesses]);

  // PWA beforeinstallprompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Request & Auto-Detect Geolocation on Mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermissionStatus('denied');
      setUserLocation(DEFAULT_CENTER_COORDS);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setUserAddressLabel('GPS: Tu ubicación actual en tiempo real');
        setLocationPermissionStatus('granted');
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable, using metropolitan center fallback:', err.message);
        setUserLocation(DEFAULT_CENTER_COORDS);
        setUserAddressLabel('Centro Urbano (Aproximado)');
        setLocationPermissionStatus('denied');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const setUserCustomLocation = (coords: Coordinates, label: string) => {
    setUserLocation(coords);
    setUserAddressLabel(label);
  };

  // Distance calculation in Kilometers (Haversine formula)
  const calculateDistance = (dest: Coordinates): number => {
    if (!userLocation) return 1.2;
    const R = 6371; // km
    const dLat = ((dest.lat - userLocation.lat) * Math.PI) / 180;
    const dLon = ((dest.lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((dest.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return Math.round(dist * 10) / 10;
  };

  // Open external routing (Google Maps or Waze)
  const openExternalNavigation = (coords: Coordinates, app: 'google_maps' | 'waze') => {
    if (app === 'google_maps') {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const url = `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // PWA Install Action
  const installPWA = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
        setShowInstallBanner(false);
      }
      setDeferredInstallPrompt(null);
    } else {
      alert('Para instalar la App en tu móvil:\n1. En iOS Safari: Toca el botón Compartir y elige "Agregar al inicio".\n2. En Android Chrome: Toca el menú (3 puntos) y elige "Instalar aplicación".');
    }
  };

  // Business CRUD
  const addBusiness = (bizData: Omit<Business, 'id'>) => {
    const newBiz: Business = {
      ...bizData,
      id: `biz-${Date.now()}`
    };
    setBusinesses(prev => [newBiz, ...prev]);
  };

  const updateBusiness = (id: string, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const toggleOfferOfTheDay = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isOfferOfTheDay: !p.isOfferOfTheDay } : p))
    );
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Justo ahora'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      // If adding from another business, notify/replace or allow
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, businessId: product.businessId }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Address
  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    setSavedAddresses(prev => [newAddr, ...prev]);
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  };

  // WhatsApp helper
  const openWhatsAppWithPrompt = (initialQuery = '', targetBizId?: string) => {
    setWhatsappInitialPrompt(initialQuery);
    if (targetBizId) {
      const biz = businesses.find(b => b.id === targetBizId);
      if (biz) setSelectedBusinessForDetail(biz);
    }
    setIsWhatsAppModalOpen(true);
  };

  const updateChatbotConfig = (updates: Partial<ChatbotConfig>) => {
    setChatbotConfig(prev => ({ ...prev, ...updates }));
  };

  const addCampaign = (campaignData: Omit<WhatsAppCampaign, 'id' | 'sentCount' | 'openRate' | 'clickRate' | 'date'>) => {
    const newCamp: WhatsAppCampaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      sentCount: Math.floor(1800 + Math.random() * 4000),
      openRate: Math.round((88 + Math.random() * 9) * 10) / 10,
      clickRate: Math.round((28 + Math.random() * 15) * 10) / 10,
      date: new Date().toISOString().split('T')[0]
    };
    setCampaigns(prev => [newCamp, ...prev]);
  };

  const currentSellerBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0];

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeClientTab,
        setActiveClientTab,
        activeSellerTab,
        setActiveSellerTab,
        activeAdminTab,
        setActiveAdminTab,

        businesses,
        setBusinesses,
        selectedBusinessId,
        setSelectedBusinessId,
        currentSellerBusiness,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        selectedBusinessForDetail,
        setSelectedBusinessForDetail,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleOfferOfTheDay,

        orders,
        createOrder,
        updateOrderStatus,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotalCount,

        userLocation,
        userAddressLabel,
        isLocating,
        locationPermissionStatus,
        detectUserLocation,
        setUserCustomLocation,
        savedAddresses,
        addSavedAddress,
        deleteSavedAddress,

        chatbotConfig,
        updateChatbotConfig,
        campaigns,
        addCampaign,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        openWhatsAppWithPrompt,
        whatsappInitialPrompt,

        deferredInstallPrompt,
        isAppInstalled,
        installPWA,
        showInstallBanner,
        setShowInstallBanner,

        calculateDistance,
        openExternalNavigation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
