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
  Coordinates,
  UserAccount,
  ClientProfile,
  EmployeeProfile
} from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CAMPAIGNS,
  INITIAL_CHATBOT_CONFIG,
  INITIAL_SAVED_ADDRESSES,
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_CLIENTS,
  DATA_VERSION
} from '../data/mockData';
import {
  fetchBusinessesFromSupabase,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  upsertBusinessInSupabase,
  deleteBusinessInSupabase,
  upsertProductInSupabase,
  deleteProductInSupabase,
  insertOrderInSupabase,
  updateOrderStatusInSupabase,
  testSupabaseConnection,
  seedAllDataToSupabase,
  SUPABASE_URL
} from '../services/supabaseClient';

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

  // Mock Data
  injectMockData: () => void;

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

  // Supabase PostgreSQL Integration
  supabaseStatus: {
    connected: boolean;
    checking: boolean;
    message: string;
    hasTables: boolean;
    tableCounts?: { [tableName: string]: number };
  };
  checkSupabase: () => Promise<void>;
  syncToSupabase: () => Promise<{ success: boolean; message: string }>;

  // Authentication, Accounts & RBAC
  currentUser: UserAccount | null;
  users: UserAccount[];
  clients: ClientProfile[];
  employees: EmployeeProfile[];
  loginAsCorporate: (identifier: string, password: string) => { success: boolean; message: string; role?: Role; user?: UserAccount };
  loginAsClient: (identifier: string, password: string) => { success: boolean; message: string; user?: UserAccount };
  registerClient: (data: { name: string; username: string; email: string; password: string; phone: string; address: string }) => { success: boolean; message: string; user?: UserAccount };
  logout: () => void;
  switchRole: (targetRole: Role) => { allowed: boolean; message?: string };

  // Modals & Intent
  isClientAuthModalOpen: boolean;
  setIsClientAuthModalOpen: (open: boolean) => void;
  isCorporateAuthModalOpen: boolean;
  setIsCorporateAuthModalOpen: (open: boolean) => void;
  clientAuthIntent: 'login' | 'register' | 'order_checkout';
  setClientAuthIntent: (intent: 'login' | 'register' | 'order_checkout') => void;
  isMarketplaceRoute: boolean;
  getMarketplaceShareUrl: () => string;

  // Admin CRUD for Users
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  toggleSuspendUser: (id: string) => void;
  deleteUser: (id: string) => void;

  // Admin CRUD for Clients
  addClient: (client: Omit<ClientProfile, 'id' | 'registeredAt'>) => void;
  updateClient: (id: string, updates: Partial<ClientProfile>) => void;
  toggleSuspendClient: (id: string) => void;
  deleteClient: (id: string) => void;

  // Admin CRUD for Employees
  addEmployee: (employee: Omit<EmployeeProfile, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, updates: Partial<EmployeeProfile>) => void;
  toggleSuspendEmployee: (id: string) => void;
  deleteEmployee: (id: string) => void;
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
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_businesses');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_BUSINESSES.length) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_BUSINESSES;
  });

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);
  const [selectedBusinessForDetail, setSelectedBusinessForDetail] = useState<Business | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_products');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mk_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Users, Employees and Clients State
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_users');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_USERS.length) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => {
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_employees');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_EMPLOYEES.length) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_EMPLOYEES;
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_clients');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_CLIENTS.length) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_CLIENTS;
  });

  // Logged-in User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('mk_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // Modals for Auth
  const [isClientAuthModalOpen, setIsClientAuthModalOpen] = useState(false);
  const [isCorporateAuthModalOpen, setIsCorporateAuthModalOpen] = useState(false);
  const [clientAuthIntent, setClientAuthIntent] = useState<'login' | 'register' | 'order_checkout'>('login');

  // Route Detection for Independent Marketplace Link
  const isMarketplaceRoute = typeof window !== 'undefined' && (
    window.location.pathname.toLowerCase().includes('/marketplace') ||
    window.location.search.toLowerCase().includes('marketplace') ||
    window.location.hash.toLowerCase().includes('marketplace')
  );

  useEffect(() => {
    if (isMarketplaceRoute) {
      setCurrentRole('client');
      setActiveClientTab('explore');
    }
  }, []);

  const getMarketplaceShareUrl = () => {
    if (typeof window === 'undefined') return 'https://conforce.app/marketplace';
    const origin = window.location.origin;
    return `${origin}/marketplace`;
  };

  // Sync users, employees and clients to localStorage
  useEffect(() => {
    localStorage.setItem('mk_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mk_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('mk_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mk_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mk_current_user');
    }
  }, [currentUser]);

  // Authentication Handlers
  const loginAsCorporate = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) &&
        u.password === cleanPass
    );

    if (!user) {
      return {
        success: false,
        message: 'Usuario o contraseña incorrectos. Verifica tus credenciales corporativas.'
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        message: 'Esta cuenta ha sido suspendida por la administración de Con Force.'
      };
    }

    if (user.role === 'client') {
      return {
        success: false,
        message: 'Esta cuenta pertenece a un Cliente. Por favor utiliza el portal de clientes para ingresar.'
      };
    }

    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentRole('admin');
      setActiveAdminTab('overview');
    } else if (user.role === 'seller') {
      setCurrentRole('seller');
      if (user.businessId) {
        setSelectedBusinessId(user.businessId);
      }
      setActiveSellerTab('orders');
    }

    setIsCorporateAuthModalOpen(false);
    return {
      success: true,
      message: `¡Bienvenido de vuelta, ${user.name}!`,
      role: user.role,
      user
    };
  };

  const loginAsClient = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) &&
        u.password === cleanPass
    );

    if (!user) {
      return {
        success: false,
        message: 'Credenciales inválidas. Si aún no tienes cuenta, regístrate como cliente.'
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        message: 'Tu cuenta de cliente se encuentra suspendida temporalmente.'
      };
    }

    if (user.role !== 'client') {
      return {
        success: false,
        message: 'Esta es una cuenta administrativa o de negocio. Usa el Acceso Corporativo.'
      };
    }

    setCurrentUser(user);
    setCurrentRole('client');
    setIsClientAuthModalOpen(false);
    return {
      success: true,
      message: `¡Hola de nuevo, ${user.name}! Sesión iniciada con éxito.`,
      user
    };
  };

  const registerClient = (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    // Check duplicate
    const exists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername
    );

    if (exists) {
      return {
        success: false,
        message: 'Ya existe una cuenta registrada con este correo o nombre de usuario.'
      };
    }

    const newUserId = `usr-client-${Date.now()}`;
    const newUser: UserAccount = {
      id: newUserId,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: data.password,
      role: 'client',
      status: 'active',
      phone: data.phone.trim(),
      address: data.address.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Justo ahora'
    };

    const newClient: ClientProfile = {
      id: `cli-${Date.now()}`,
      userId: newUserId,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: data.phone.trim(),
      address: data.address.trim(),
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setUsers((prev) => [newUser, ...prev]);
    setClients((prev) => [newClient, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('client');
    setIsClientAuthModalOpen(false);

    return {
      success: true,
      message: '¡Tu cuenta ha sido creada exitosamente! Bienvenido a Con Force.',
      user: newUser
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('client');
    setActiveClientTab('explore');
  };

  const switchRole = (targetRole: Role): { allowed: boolean; message?: string } => {
    // Admin has unrestricted access to all roles
    if (currentUser?.role === 'admin') {
      setCurrentRole(targetRole);
      if (targetRole === 'client') setActiveClientTab('explore');
      if (targetRole === 'seller') setActiveSellerTab('orders');
      if (targetRole === 'admin') setActiveAdminTab('overview');
      return { allowed: true };
    }

    // Seller can only enter seller role
    if (currentUser?.role === 'seller') {
      if (targetRole === 'seller') {
        setCurrentRole('seller');
        setActiveSellerTab('orders');
        return { allowed: true };
      }
      return {
        allowed: false,
        message: 'Acceso restringido: Las cuentas de Negocio solo tienen permiso para acceder a su panel de vendedor.'
      };
    }

    // Client can only enter client role
    if (currentUser?.role === 'client') {
      if (targetRole === 'client') {
        setCurrentRole('client');
        setActiveClientTab('explore');
        return { allowed: true };
      }
      setIsCorporateAuthModalOpen(true);
      return {
        allowed: false,
        message: 'Acceso restringido: Para acceder como Negocio o Administrador, ingresa tus credenciales corporativas.'
      };
    }

    // Guest / Not logged in
    if (targetRole === 'client') {
      setCurrentRole('client');
      return { allowed: true };
    }

    // Prompt corporate login
    setIsCorporateAuthModalOpen(true);
    return {
      allowed: false,
      message: 'Debes iniciar sesión con una cuenta de Administrador o Negocio para acceder a este rol.'
    };
  };

  // Admin CRUD for Users
  const addUser = (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newU: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers((prev) => [newU, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const toggleSuspendUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setClients((prev) => prev.filter((c) => c.userId !== id));
    setEmployees((prev) => prev.filter((e) => e.userId !== id));
  };

  // Admin CRUD for Clients
  const addClient = (client: Omit<ClientProfile, 'id' | 'registeredAt'>) => {
    const newC: ClientProfile = {
      ...client,
      id: `cli-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setClients((prev) => [newC, ...prev]);
  };

  const updateClient = (id: string, updates: Partial<ClientProfile>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const toggleSuspendClient = (id: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' }
          : c
      )
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Admin CRUD for Employees
  const addEmployee = (employee: Omit<EmployeeProfile, 'id' | 'createdAt'>) => {
    const newE: EmployeeProfile = {
      ...employee,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEmployees((prev) => [newE, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<EmployeeProfile>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const toggleSuspendEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === 'active' ? 'suspended' : 'active' }
          : e
      )
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // Function to forcefully inject or restore rich test data
  const injectMockData = () => {
    setBusinesses(INITIAL_BUSINESSES);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setSavedAddresses(INITIAL_SAVED_ADDRESSES);
    setChatbotConfig(INITIAL_CHATBOT_CONFIG);
    setUsers(INITIAL_USERS);
    setEmployees(INITIAL_EMPLOYEES);
    setClients(INITIAL_CLIENTS);
    localStorage.setItem('mk_businesses', JSON.stringify(INITIAL_BUSINESSES));
    localStorage.setItem('mk_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('mk_orders', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('mk_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
    localStorage.setItem('mk_saved_addresses', JSON.stringify(INITIAL_SAVED_ADDRESSES));
    localStorage.setItem('mk_chatbot_config', JSON.stringify(INITIAL_CHATBOT_CONFIG));
    localStorage.setItem('mk_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('mk_employees', JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem('mk_clients', JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem('mk_data_version', DATA_VERSION);
  };

  // Ensure current data version is registered
  useEffect(() => {
    localStorage.setItem('mk_data_version', DATA_VERSION);
  }, []);

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

  // Supabase PostgreSQL Integration State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    checking: boolean;
    message: string;
    hasTables: boolean;
    tableCounts?: { [tableName: string]: number };
  }>({
    connected: false,
    checking: true,
    message: 'Conectando con Supabase...',
    hasTables: false
  });

  const checkSupabase = async () => {
    setSupabaseStatus(prev => ({ ...prev, checking: true }));
    const res = await testSupabaseConnection();
    setSupabaseStatus({
      connected: res.connected,
      checking: false,
      message: res.message,
      hasTables: res.hasTables,
      tableCounts: res.tableCounts
    });

    if (res.connected && res.hasTables) {
      try {
        const [remoteBiz, remoteProd, remoteOrders] = await Promise.all([
          fetchBusinessesFromSupabase(),
          fetchProductsFromSupabase(),
          fetchOrdersFromSupabase()
        ]);

        if (remoteBiz && remoteBiz.length > 0) {
          setBusinesses(remoteBiz);
        }
        if (remoteProd && remoteProd.length > 0) {
          setProducts(remoteProd);
        }
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }
      } catch (err) {
        console.warn('Error hydrating state from Supabase:', err);
      }
    }
  };

  const syncToSupabase = async () => {
    const res = await seedAllDataToSupabase({
      businesses,
      products,
      orders,
      campaigns,
      chatbotConfig,
      savedAddresses
    });
    await checkSupabase();
    return res;
  };

  useEffect(() => {
    checkSupabase();
  }, []);

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
    upsertBusinessInSupabase(newBiz);
  };

  const updateBusiness = (id: string, updates: Partial<Business>) => {
    setBusinesses(prev => {
      const updated = prev.map(b => (b.id === id ? { ...b, ...updates } : b));
      const target = updated.find(b => b.id === id);
      if (target) upsertBusinessInSupabase(target);
      return updated;
    });
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    deleteBusinessInSupabase(id);
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    upsertProductInSupabase(newProd);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      const target = updated.find(p => p.id === id);
      if (target) upsertProductInSupabase(target);
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    deleteProductInSupabase(id);
  };

  const toggleOfferOfTheDay = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p =>
        p.id === productId ? { ...p, isOfferOfTheDay: !p.isOfferOfTheDay } : p
      );
      const target = updated.find(p => p.id === productId);
      if (target) upsertProductInSupabase(target);
      return updated;
    });
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
    insertOrderInSupabase(newOrder);

    // Update client profile stats if matching
    if (currentUser?.role === 'client') {
      setClients(prev =>
        prev.map(c =>
          c.userId === currentUser.id || c.email.toLowerCase() === currentUser.email.toLowerCase()
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + newOrder.total
              }
            : c
        )
      );
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    updateOrderStatusInSupabase(orderId, newStatus);
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

        injectMockData,

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
        openExternalNavigation,

        // Supabase Database Integration
        supabaseStatus,
        checkSupabase,
        syncToSupabase,

        // Authentication & RBAC
        currentUser,
        users,
        clients,
        employees,
        loginAsCorporate,
        loginAsClient,
        registerClient,
        logout,
        switchRole,

        // Modals & Links
        isClientAuthModalOpen,
        setIsClientAuthModalOpen,
        isCorporateAuthModalOpen,
        setIsCorporateAuthModalOpen,
        clientAuthIntent,
        setClientAuthIntent,
        isMarketplaceRoute,
        getMarketplaceShareUrl,

        // Admin CRUD for Users
        addUser,
        updateUser,
        toggleSuspendUser,
        deleteUser,

        // Admin CRUD for Clients
        addClient,
        updateClient,
        toggleSuspendClient,
        deleteClient,

        // Admin CRUD for Employees
        addEmployee,
        updateEmployee,
        toggleSuspendEmployee,
        deleteEmployee
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
