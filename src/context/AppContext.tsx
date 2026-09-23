import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Business,
  BusinessCategory,
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
  EmployeeProfile,
  FailedSearchRecord,
  BoostPlan
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
  INITIAL_FAILED_SEARCHES,
  DATA_VERSION
} from '../data/mockData';
import {
  fetchBusinessesFromSupabase,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  fetchUsersFromSupabase,
  fetchClientsFromSupabase,
  checkUserExistsInSupabase,
  verifyUserCredentialsInSupabase,
  upsertBusinessInSupabase,
  deleteBusinessInSupabase,
  upsertProductInSupabase,
  deleteProductInSupabase,
  insertOrderInSupabase,
  updateOrderStatusInSupabase,
  testSupabaseConnection,
  seedAllDataToSupabase,
  updateUserInSupabase,
  deleteUserInSupabase,
  insertUserInSupabase,
  insertClientInSupabase,
  insertBusinessInSupabase,
  clearAllSampleDataFromSupabase,
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

  // Mock Data & System Cleansing
  injectMockData: () => void;
  clearAllSampleData: () => Promise<{ success: boolean; message: string }>;
  restoreSampleData: () => void;
  isMockDataCleared: boolean;
  isClearingData: boolean;

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
  serviceFeeRate: number;
  cartServiceFee: number;

  // Demand Radar & Search Intelligence
  failedSearches: FailedSearchRecord[];
  recordFailedSearch: (term: string) => void;
  updateFailedSearchStatus: (id: string, status: FailedSearchRecord['status'], notes?: string) => void;
  deleteFailedSearch: (id: string) => void;

  // Boost Ads for Sellers
  boostProduct: (productId: string, planId: string, days: number) => { success: boolean; message: string };

  // Web Assistant (Native in-app Chatbot)
  isWebAssistantOpen: boolean;
  setIsWebAssistantOpen: (open: boolean) => void;
  openWebAssistantWithPrompt: (initialPrompt?: string) => void;
  webAssistantInitialPrompt: string;

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
  loginAsCorporate: (identifier: string, password: string) => Promise<{ success: boolean; message: string; role?: Role; user?: UserAccount }>;
  loginAsClient: (identifier: string, password: string) => Promise<{ success: boolean; message: string; user?: UserAccount }>;
  registerClient: (data: { name: string; username: string; email: string; password: string; phone: string; address: string }) => Promise<{ success: boolean; message: string; user?: UserAccount }>;
  registerBusiness: (data: {
    businessName: string;
    category: string;
    address: string;
    logo?: string;
    banner?: string;
    phone: string;
    description?: string;
    rifOrNit?: string;
    ownerName: string;
    username: string;
    email: string;
    password: string;
    ownerPhone?: string;
    isSponsor?: boolean;
  }) => Promise<{ success: boolean; message: string; business?: Business; user?: UserAccount }>;
  upgradeClientToBusiness: (data: {
    businessName: string;
    category: string;
    address: string;
    logo?: string;
    banner?: string;
    phone: string;
    description?: string;
    rifOrNit?: string;
    isSponsor?: boolean;
  }) => Promise<{ success: boolean; message: string; business?: Business; user?: UserAccount }>;
  logout: () => void;
  switchRole: (targetRole: Role) => { allowed: boolean; message?: string };

  // Modals & Intent
  isClientAuthModalOpen: boolean;
  setIsClientAuthModalOpen: (open: boolean) => void;
  isCorporateAuthModalOpen: boolean;
  setIsCorporateAuthModalOpen: (open: boolean) => void;
  isRegisterBusinessModalOpen: boolean;
  setIsRegisterBusinessModalOpen: (open: boolean) => void;
  isRegisteringAsSponsor: boolean;
  setIsRegisteringAsSponsor: (open: boolean) => void;
  openBusinessRegistration: (forClientUpgrade?: boolean, asSponsor?: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  clientAuthIntent: 'login' | 'register' | 'order_checkout';
  setClientAuthIntent: (intent: 'login' | 'register' | 'order_checkout') => void;
  isMarketplaceRoute: boolean;
  currentRoute: 'marketplace' | 'corporate';
  navigateToRoute: (route: 'marketplace' | 'corporate') => void;
  navigateToHome: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  getMarketplaceShareUrl: () => string;
  getCorporateShareUrl: () => string;

  // Admin CRUD for Users
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, updates: Partial<UserAccount>) => Promise<void>;
  toggleSuspendUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  syncAllUsersToSupabase: () => Promise<{ success: boolean; count: number; message: string }>;

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

  // Cleared Mock Data Persistent Tracking - Defaults to TRUE so system starts clean for real testing
  const [isMockDataCleared, setIsMockDataCleared] = useState<boolean>(() => {
    const saved = localStorage.getItem('mk_mock_data_cleared');
    if (saved === null) {
      // First load: enable clean mode by default as requested by user
      localStorage.setItem('mk_mock_data_cleared', 'true');
      return true;
    }
    return saved !== 'false';
  });
  const [isClearingData, setIsClearingData] = useState<boolean>(false);

  // Business State
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_businesses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_businesses');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_BUSINESSES;
  });

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_businesses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed[0]?.id) return parsed[0].id;
        } catch (e) {}
      }
      return '';
    }
    return INITIAL_BUSINESSES[0]?.id || '';
  });
  const [selectedBusinessForDetail, setSelectedBusinessForDetail] = useState<Business | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_products');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const saved = localStorage.getItem('mk_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Users, Employees and Clients State
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    const masterAdmin = INITIAL_USERS.find(u => u.username === 'admin_master') || {
      id: 'usr-admin-master',
      name: 'Administrador Master Con Force',
      username: 'admin_master',
      email: 'admin_master@conforce.com',
      password: 'Chevropar#1970',
      role: 'admin' as Role,
      status: 'active' as const,
      department: 'Dirección General',
      phone: '+58 412 1234567',
      createdAt: '2026-01-01',
      lastLogin: '2026-09-21 18:00'
    };
    if (isCleared) {
      const saved = localStorage.getItem('mk_users');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (!parsed.some(u => u.username === 'admin_master')) {
              parsed.unshift(masterAdmin);
            }
            return parsed;
          }
        } catch (e) {}
      }
      return [masterAdmin];
    }
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_users');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_employees');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_employees');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_EMPLOYEES;
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_clients');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const savedVersion = localStorage.getItem('mk_data_version');
    const saved = localStorage.getItem('mk_clients');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
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
  const [isRegisterBusinessModalOpen, setIsRegisterBusinessModalOpen] = useState(false);
  const [isRegisteringAsSponsor, setIsRegisteringAsSponsor] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientAuthIntent, setClientAuthIntent] = useState<'login' | 'register' | 'order_checkout'>('login');

  const openBusinessRegistration = (forClientUpgrade = false, asSponsor = false) => {
    setIsRegisteringAsSponsor(asSponsor);
    setIsRegisterBusinessModalOpen(true);
  };

  // Route Detection: Default to 'marketplace' so https://venezuela-iota.vercel.app/ opens the Marketplace directly!
  const [currentRoute, setCurrentRoute] = useState<'marketplace' | 'corporate'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/corporate') || search.includes('corporate') || hash.includes('corporate')) {
        return 'corporate';
      }
    }
    return 'marketplace';
  });

  const isMarketplaceRoute = currentRoute === 'marketplace';

  useEffect(() => {
    if (isMarketplaceRoute) {
      setCurrentRole('client');
      setActiveClientTab('explore');
    }
  }, [isMarketplaceRoute]);

  const navigateToRoute = (route: 'marketplace' | 'corporate') => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const newPath = route === 'marketplace' ? '/marketplace' : '/';
      try {
        window.history.pushState({}, '', newPath);
      } catch (e) {}
    }
    if (route === 'marketplace') {
      setCurrentRole('client');
      setActiveClientTab('explore');
    } else {
      if (currentUser?.role === 'admin') {
        setCurrentRole('admin');
        setActiveAdminTab('overview');
      } else if (currentUser?.role === 'seller') {
        setCurrentRole('seller');
        setActiveSellerTab('orders');
      } else {
        setCurrentRole('client');
      }
    }
  };

  const navigateToHome = () => {
    setCurrentRoute('marketplace');
    setCurrentRole('client');
    setActiveClientTab('explore');
    setSelectedBusinessForDetail(null);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', '/marketplace');
      } catch (e) {}
    }
  };

  const getMarketplaceShareUrl = () => {
    return 'https://venezuela-iota.vercel.app/marketplace';
  };

  const getCorporateShareUrl = () => {
    return 'https://venezuela-iota.vercel.app/';
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
  const loginAsCorporate = async (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Direct guaranteed check for admin_master with Chevropar#1970
    if ((cleanId === 'admin_master' || cleanId === 'admin_master@conforce.com') && cleanPass === 'Chevropar#1970') {
      let master = users.find((u) => u.username === 'admin_master');
      if (!master) {
        master = {
          id: 'usr-admin-master',
          name: 'Administrador Master Con Force',
          username: 'admin_master',
          email: 'admin_master@conforce.com',
          password: 'Chevropar#1970',
          role: 'admin',
          status: 'active',
          department: 'Dirección General & Superadministración',
          phone: '+52 55 9988 7766',
          createdAt: '2026-01-01',
          lastLogin: 'Justo ahora'
        };
        setUsers((prev) => [master!, ...prev]);
      }
      setCurrentUser(master);
      setCurrentRole('admin');
      setActiveAdminTab('overview');
      setIsCorporateAuthModalOpen(false);
      return {
        success: true,
        message: '¡Bienvenido Superadministrador Master!',
        role: 'admin' as Role,
        user: master
      };
    }

    // 1. Search in local state
    let user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) &&
        u.password === cleanPass
    );

    // 2. If not found in local memory, check live in Supabase PostgreSQL
    if (!user) {
      try {
        const remoteAuth = await verifyUserCredentialsInSupabase(cleanId, cleanPass);
        if (remoteAuth.success && remoteAuth.user) {
          user = remoteAuth.user;
          // Add to local state
          setUsers((prev) => {
            const exists = prev.some((p) => p.id === user!.id);
            return exists ? prev : [user!, ...prev];
          });
        }
      } catch (err) {
        console.warn('Supabase remote login check notice:', err);
      }
    }

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

  const loginAsClient = async (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Search in local state
    let user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) &&
        u.password === cleanPass
    );

    // 2. If not found in local memory, check live in Supabase PostgreSQL
    if (!user) {
      try {
        const remoteAuth = await verifyUserCredentialsInSupabase(cleanId, cleanPass);
        if (remoteAuth.success && remoteAuth.user) {
          user = remoteAuth.user;
          // Add to local state
          setUsers((prev) => {
            const exists = prev.some((p) => p.id === user!.id);
            return exists ? prev : [user!, ...prev];
          });
        }
      } catch (err) {
        console.warn('Supabase remote login check notice:', err);
      }
    }

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

  const registerClient = async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    // 1. Local duplicate check
    const localExists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername
    );

    if (localExists) {
      return {
        success: false,
        message: 'Ya existe una cuenta registrada con este correo o nombre de usuario en el sistema.'
      };
    }

    // 2. Supabase duplicate pre-check
    try {
      const supaDup = await checkUserExistsInSupabase(cleanUsername, cleanEmail);
      if (supaDup.exists) {
        return {
          success: false,
          message: supaDup.reason || 'Ya existe un usuario con estas credenciales en Supabase.'
        };
      }
    } catch (e) {
      console.warn('Supabase duplicate pre-check notice:', e);
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

    // 3. Persist directly and strictly in Supabase FIRST
    try {
      const userRes = await insertUserInSupabase(newUser);
      if (!userRes.success) {
        return {
          success: false,
          message: userRes.error || 'No se pudo guardar las credenciales en Supabase. Verifica tus datos.'
        };
      }
      const clientRes = await insertClientInSupabase(newClient);
      if (!clientRes.success) {
        console.warn('Notice saving client profile in Supabase:', clientRes.error);
      }
    } catch (err: any) {
      console.error('Error insertando en Supabase:', err);
      return {
        success: false,
        message: `Error al guardar en Supabase: ${err.message || String(err)}`
      };
    }

    // 4. Update local state and persistence
    setUsers((prev) => [newUser, ...prev]);
    setClients((prev) => [newClient, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('client');
    setIsClientAuthModalOpen(false);

    // 5. Refresh Supabase connection table counts
    checkSupabase().catch(() => {});

    return {
      success: true,
      message: '¡Tu cuenta ha sido creada y guardada exitosamente en Supabase! Bienvenido a Con Force.',
      user: newUser
    };
  };

  const registerBusiness = async (data: {
    businessName: string;
    category: string;
    address: string;
    logo?: string;
    banner?: string;
    phone: string;
    description?: string;
    rifOrNit?: string;
    ownerName: string;
    username: string;
    email: string;
    password: string;
    ownerPhone?: string;
    isSponsor?: boolean;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    // Check duplicate username or email
    const exists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername
    );
    if (exists) {
      return {
        success: false,
        message: 'Ya existe un usuario o correo registrado con esas credenciales. Elige otro usuario o inicia sesión.'
      };
    }

    const isSponsor = Boolean(data.isSponsor);
    const newBizId = isSponsor ? `biz-sponsor-${Date.now()}` : `biz-${Date.now()}`;
    const newUserId = isSponsor ? `usr-sponsor-${Date.now()}` : `usr-seller-${Date.now()}`;

    const newBusiness: Business = {
      id: newBizId,
      name: data.businessName.trim(),
      category: (data.category as BusinessCategory) || 'restaurante',
      rating: 5.0,
      reviewsCount: 1,
      deliveryTime: '20-40 min',
      minOrder: 0,
      address: data.address.trim(),
      coordinates: DEFAULT_CENTER_COORDS,
      logo: data.logo || (isSponsor ? '⭐' : '🏢'),
      bannerImage: data.banner || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
      description: data.description || (isSponsor ? 'Patrocinador oficial y aliado estratégico de Con Force.' : 'Comercio oficial afiliado a Con Force Marketplace.'),
      phone: data.phone.trim(),
      tags: [
        ...(isSponsor ? ['Patrocinador Oficial', 'Marca Verificada'] : []),
        data.category || 'Repuestos',
        'Atención Directa',
        'Garantía'
      ],
      isVerified: true,
      isActive: true,
      openingHours: '08:00 AM - 07:00 PM',
      commissionRate: 10,
      customPinColor: isSponsor ? '#f59e0b' : '#D4021D',
      isSponsor,
      ownerUsername: cleanUsername,
      rif: data.rifOrNit?.trim(),
      email: cleanEmail
    };

    const newUser: UserAccount = {
      id: newUserId,
      name: data.ownerName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: data.password,
      role: 'seller',
      businessId: newBizId,
      status: 'active',
      phone: (data.ownerPhone || data.phone).trim(),
      address: data.address.trim(),
      department: isSponsor ? 'Patrocinador Oficial' : 'Gerencia y Ventas',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Justo ahora',
      isSponsor
    };

    const newEmployee: EmployeeProfile = {
      id: `emp-${Date.now()}`,
      userId: newUserId,
      fullName: data.ownerName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: data.password,
      roleTitle: isSponsor ? `Representante de Marca - ${data.businessName.trim()}` : `Gerente General - ${data.businessName.trim()}`,
      systemRole: 'seller',
      department: isSponsor ? 'Patrocinios & Marcas' : 'Comercial & Negocios',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBusinesses((prev) => [newBusiness, ...prev]);
    setUsers((prev) => [newUser, ...prev]);
    setEmployees((prev) => [newEmployee, ...prev]);
    setSelectedBusinessId(newBizId);
    setCurrentUser(newUser);
    setCurrentRole('seller');
    setActiveSellerTab('orders');
    setIsCorporateAuthModalOpen(false);
    setIsRegisterBusinessModalOpen(false);

    // Sync to Supabase
    let supabasePersisted = false;
    try {
      const bizRes = await insertBusinessInSupabase(newBusiness);
      const usrRes = await insertUserInSupabase(newUser);
      supabasePersisted = Boolean(bizRes.success && usrRes.success);
    } catch (e) {
      console.warn('Sync to Supabase warning:', e);
    }

    return {
      success: true,
      message: isSponsor
        ? `¡Felicidades! El Patrocinador Oficial "${newBusiness.name}" ha sido registrado exitosamente${supabasePersisted ? ' y guardado en Supabase' : ''}.`
        : `¡Felicidades! Tu negocio "${newBusiness.name}" ha sido registrado exitosamente${supabasePersisted ? ' y guardado en Supabase' : ''}.`,
      business: newBusiness,
      user: newUser
    };
  };

  const upgradeClientToBusiness = async (data: {
    businessName: string;
    category: string;
    address: string;
    logo?: string;
    banner?: string;
    phone: string;
    description?: string;
    rifOrNit?: string;
    isSponsor?: boolean;
  }) => {
    if (!currentUser) {
      return {
        success: false,
        message: 'Debes tener una sesión iniciada para vincular tu negocio a tu cuenta.'
      };
    }

    const isSponsor = Boolean(data.isSponsor);
    const newBizId = isSponsor ? `biz-sponsor-${Date.now()}` : `biz-${Date.now()}`;

    const newBusiness: Business = {
      id: newBizId,
      name: data.businessName.trim(),
      category: (data.category as BusinessCategory) || 'restaurante',
      rating: 5.0,
      reviewsCount: 1,
      deliveryTime: '20-40 min',
      minOrder: 0,
      address: data.address.trim(),
      coordinates: DEFAULT_CENTER_COORDS,
      logo: data.logo || (isSponsor ? '⭐' : '🏢'),
      bannerImage: data.banner || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
      description: data.description || (isSponsor ? 'Patrocinador oficial y aliado estratégico de Con Force.' : 'Comercio oficial afiliado a Con Force Marketplace.'),
      phone: data.phone.trim(),
      tags: [
        ...(isSponsor ? ['Patrocinador Oficial', 'Marca Verificada'] : []),
        data.category || 'Repuestos',
        'Comercio Aliado',
        'Garantía'
      ],
      isVerified: true,
      isActive: true,
      openingHours: '08:00 AM - 07:00 PM',
      commissionRate: 10,
      customPinColor: isSponsor ? '#f59e0b' : '#D4021D',
      isSponsor,
      ownerUsername: currentUser.username,
      rif: data.rifOrNit?.trim(),
      email: currentUser.email
    };

    // Update currentUser to seller role and attach businessId
    const updatedUser: UserAccount = {
      ...currentUser,
      role: 'seller',
      businessId: newBizId,
      phone: data.phone.trim() || currentUser.phone,
      address: data.address.trim() || currentUser.address,
      department: isSponsor ? 'Patrocinador Oficial' : 'Gerencia de Negocio Afiliado',
      isSponsor
    };

    setBusinesses((prev) => [newBusiness, ...prev]);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setSelectedBusinessId(newBizId);
    setCurrentRole('seller');
    setActiveSellerTab('orders');
    setIsRegisterBusinessModalOpen(false);
    setIsCorporateAuthModalOpen(false);

    // Sync to Supabase
    let supabasePersisted = false;
    try {
      const bizRes = await insertBusinessInSupabase(newBusiness);
      const usrRes = await insertUserInSupabase(updatedUser);
      supabasePersisted = Boolean(bizRes.success && usrRes.success);
    } catch (e) {
      console.warn('Sync to Supabase warning:', e);
    }

    return {
      success: true,
      message: isSponsor
        ? `¡Excelente! Tu cuenta @${currentUser.username} ha sido vinculada como Patrocinador Oficial "${newBusiness.name}"${supabasePersisted ? ' y guardada en Supabase' : ''}.`
        : `¡Excelente! Tu cuenta @${currentUser.username} ha sido convertida a Comercio Aliado y tu negocio "${newBusiness.name}" está activo${supabasePersisted ? ' en Supabase' : ''}.`,
      business: newBusiness,
      user: updatedUser
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mk_current_user');
    setCurrentRole('client');
    setActiveClientTab('explore');
    setIsProfileModalOpen(false);
    setIsCorporateAuthModalOpen(false);
    setIsClientAuthModalOpen(false);
    setIsRegisterBusinessModalOpen(false);
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

    // Seller is strictly restricted to seller role
    if (currentUser?.role === 'seller') {
      if (targetRole === 'seller') {
        setCurrentRole('seller');
        setActiveSellerTab('orders');
        return { allowed: true };
      }
      return {
        allowed: false,
        message: 'Acceso exclusivo: Solo el Administrador Maestro puede navegar en todos los roles. Tu cuenta de Vendedor permanece en su panel de comercio.'
      };
    }

    // Client is strictly restricted to client role
    if (currentUser?.role === 'client') {
      if (targetRole === 'client') {
        setCurrentRole('client');
        setActiveClientTab('explore');
        return { allowed: true };
      }
      return {
        allowed: false,
        message: 'Acceso exclusivo: Solo el Administrador Maestro puede conmutar entre todos los roles. Tu cuenta de usuario navega en el Marketplace.'
      };
    }

    // Guest / Not logged in: only client
    if (targetRole === 'client') {
      setCurrentRole('client');
      return { allowed: true };
    }

    // Prompt corporate login if guest tries to enter admin/seller
    setIsCorporateAuthModalOpen(true);
    return {
      allowed: false,
      message: 'Solo el Administrador Maestro puede navegar libremente entre todos los roles. Inicia sesión con tus credenciales de Administrador.'
    };
  };

  // Admin CRUD for Users
  const addUser = async (
    user: Omit<UserAccount, 'id' | 'createdAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newU: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Actualizar estado local inmediatamente
    setUsers((prev) => [newU, ...prev]);

    // Si el rol es cliente, agregar también el perfil de cliente
    if (newU.role === 'client') {
      const newC: ClientProfile = {
        id: `cli-${Date.now()}`,
        userId: newU.id,
        name: newU.name,
        username: newU.username,
        email: newU.email,
        phone: newU.phone || '',
        address: newU.address || '',
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
        registeredAt: newU.createdAt
      };
      setClients((prev) => [newC, ...prev]);
      insertClientInSupabase(newC).catch((e) =>
        console.warn('Notice saving client in Supabase:', e)
      );
    }

    // Persistir directamente en Supabase
    try {
      const res = await insertUserInSupabase(newU);
      if (!res.success) {
        console.warn('Aviso guardando usuario en Supabase:', res.error);
        return { success: false, error: res.error };
      }
      return { success: true };
    } catch (e: any) {
      console.warn('Excepción guardando usuario en Supabase:', e);
      return { success: false, error: e.message || String(e) };
    }
  };

  const updateUser = async (id: string, updates: Partial<UserAccount>): Promise<void> => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        localStorage.setItem('mk_current_user', JSON.stringify(updated));
        return updated;
      });
    }
    // Sincronizar también en la lista de empleados si coincide
    setEmployees((prev) =>
      prev.map((emp) => {
        if (
          emp.userId === id ||
          (currentUser?.email && emp.email.toLowerCase() === currentUser.email.toLowerCase())
        ) {
          return {
            ...emp,
            fullName: updates.name || emp.fullName,
            email: updates.email || emp.email,
            phone: updates.phone || emp.phone,
            password: updates.password || emp.password
          };
        }
        return emp;
      })
    );
    // Sincronizar en la lista de clientes si coincide
    setClients((prev) =>
      prev.map((cli) => {
        if (
          cli.userId === id ||
          (currentUser?.email && cli.email.toLowerCase() === currentUser.email.toLowerCase())
        ) {
          return {
            ...cli,
            fullName: updates.name || cli.fullName,
            email: updates.email || cli.email,
            phone: updates.phone || cli.phone,
            address: updates.address || cli.address
          };
        }
        return cli;
      })
    );

    // Sincronizar en Supabase si está disponible
    try {
      await updateUserInSupabase(id, updates);
    } catch (e) {
      console.warn('Supabase sync user error:', e);
    }
  };

  const toggleSuspendUser = async (id: string): Promise<void> => {
    let nextStatus: 'active' | 'suspended' = 'active';
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          nextStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    try {
      await updateUserInSupabase(id, { status: nextStatus });
    } catch (e) {
      console.warn('Error actualizando estado en Supabase:', e);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setClients((prev) => prev.filter((c) => c.userId !== id));
    setEmployees((prev) => prev.filter((e) => e.userId !== id));

    try {
      await deleteUserInSupabase(id);
    } catch (e) {
      console.warn('Error eliminando usuario de Supabase:', e);
    }
  };

  const syncAllUsersToSupabase = async (): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> => {
    try {
      let syncedCount = 0;
      for (const u of users) {
        const res = await insertUserInSupabase(u);
        if (res.success) syncedCount++;
        if (u.role === 'client') {
          await insertClientInSupabase({
            id: `cli-${Date.now()}`,
            userId: u.id,
            name: u.name,
            username: u.username,
            email: u.email,
            phone: u.phone || '',
            address: u.address || '',
            totalOrders: 0,
            totalSpent: 0,
            status: 'active',
            registeredAt: u.createdAt || new Date().toISOString().split('T')[0]
          }).catch(() => {});
        }
      }
      return {
        success: true,
        count: syncedCount,
        message: `¡Se han sincronizado ${syncedCount} usuarios con Supabase con éxito!`
      };
    } catch (e: any) {
      return {
        success: false,
        count: 0,
        message: `Error al sincronizar usuarios con Supabase: ${e.message || String(e)}`
      };
    }
  };

  // Admin CRUD for Clients
  const addClient = (client: Omit<ClientProfile, 'id' | 'registeredAt'>) => {
    const newC: ClientProfile = {
      ...client,
      id: `cli-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setClients((prev) => [newC, ...prev]);
    insertClientInSupabase(newC).catch((e) =>
      console.warn('Notice saving client in Supabase:', e)
    );
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
    localStorage.removeItem('mk_mock_data_cleared');
    setIsMockDataCleared(false);
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

  // Function to permanently clear all sample/mock data across the entire system and Supabase
  const clearAllSampleData = async (): Promise<{ success: boolean; message: string }> => {
    setIsClearingData(true);
    try {
      // 1. Mark persistent flag that mock data has been wiped
      localStorage.setItem('mk_mock_data_cleared', 'true');
      setIsMockDataCleared(true);

      // 2. Clear state and localStorage
      setBusinesses([]);
      setProducts([]);
      setOrders([]);
      setCampaigns([]);
      setCart([]);
      setClients([]);
      setEmployees([]);
      setFailedSearches([]);

      // Keep only admin accounts, guaranteeing admin_master
      const preservedAdmins = users.filter((u) => u.role === 'admin');
      const masterAdmin = preservedAdmins.find((u) => u.username === 'admin_master') || INITIAL_USERS.find((u) => u.username === 'admin_master') || {
        id: 'usr-admin-master',
        name: 'Administrador Master Con Force',
        username: 'admin_master',
        email: 'admin_master@conforce.com',
        password: 'Chevropar#1970',
        role: 'admin' as Role,
        status: 'active' as const,
        department: 'Dirección General',
        phone: '+58 412 1234567',
        createdAt: '2026-01-01',
        lastLogin: '2026-09-21 18:00'
      };

      const finalAdmins = preservedAdmins.length > 0 ? preservedAdmins : [masterAdmin];
      setUsers(finalAdmins);

      localStorage.setItem('mk_businesses', JSON.stringify([]));
      localStorage.setItem('mk_products', JSON.stringify([]));
      localStorage.setItem('mk_orders', JSON.stringify([]));
      localStorage.setItem('mk_campaigns', JSON.stringify([]));
      localStorage.setItem('mk_cart', JSON.stringify([]));
      localStorage.setItem('mk_clients', JSON.stringify([]));
      localStorage.setItem('mk_employees', JSON.stringify([]));
      localStorage.setItem('mk_users', JSON.stringify(finalAdmins));

      // 3. Delete records from Supabase tables
      let supaNote = '';
      try {
        const supaResult = await clearAllSampleDataFromSupabase();
        supaNote = supaResult.success
          ? ' y de Supabase PostgreSQL'
          : ` (Supabase: ${supaResult.message})`;
      } catch (sErr: any) {
        supaNote = ` (Supabase: ${sErr.message || sErr})`;
      }

      // 4. Re-check Supabase to update live table counts
      await checkSupabase();

      return {
        success: true,
        message: `¡Registros de muestra eliminados exitosamente de todo el sistema${supaNote}! Se bloqueó la recarga automática y se preservó de forma segura la cuenta admin_master.`
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Error al eliminar datos de muestra: ${err.message || String(err)}`
      };
    } finally {
      setIsClearingData(false);
    }
  };

  const restoreSampleData = () => {
    localStorage.removeItem('mk_mock_data_cleared');
    setIsMockDataCleared(false);
    injectMockData();
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
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_campaigns');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const saved = localStorage.getItem('mk_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappInitialPrompt, setWhatsappInitialPrompt] = useState('');

  // Web Assistant (Native In-App Chatbot) State
  const [isWebAssistantOpen, setIsWebAssistantOpen] = useState(false);
  const [webAssistantInitialPrompt, setWebAssistantInitialPrompt] = useState('');

  // Demand Radar (Failed Searches Tracker)
  const [failedSearches, setFailedSearches] = useState<FailedSearchRecord[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_failed_searches');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
    const saved = localStorage.getItem('mk_failed_searches');
    return saved ? JSON.parse(saved) : INITIAL_FAILED_SEARCHES;
  });

  useEffect(() => {
    localStorage.setItem('mk_failed_searches', JSON.stringify(failedSearches));
  }, [failedSearches]);

  // Location State
  const [userLocation, setUserLocation] = useState<Coordinates | null>(DEFAULT_CENTER_COORDS);
  const [userAddressLabel, setUserAddressLabel] = useState<string>('Ubicación actual detectada');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('prompt');

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    const isCleared = localStorage.getItem('mk_mock_data_cleared') !== 'false';
    if (isCleared) {
      const saved = localStorage.getItem('mk_saved_addresses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      return [];
    }
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
        const [remoteBiz, remoteProd, remoteOrders, remoteUsers, remoteClients] = await Promise.all([
          fetchBusinessesFromSupabase(),
          fetchProductsFromSupabase(),
          fetchOrdersFromSupabase(),
          fetchUsersFromSupabase(),
          fetchClientsFromSupabase()
        ]);

        const isCleared = localStorage.getItem('mk_mock_data_cleared') === 'true';

        if (remoteBiz) {
          if (!isCleared || remoteBiz.length > 0) {
            setBusinesses(remoteBiz);
          } else if (isCleared && remoteBiz.length === 0) {
            setBusinesses([]);
          }
        }
        if (remoteProd) {
          if (!isCleared || remoteProd.length > 0) {
            setProducts(remoteProd);
          } else if (isCleared && remoteProd.length === 0) {
            setProducts([]);
          }
        }
        if (remoteOrders) {
          if (!isCleared || remoteOrders.length > 0) {
            setOrders(remoteOrders);
          } else if (isCleared && remoteOrders.length === 0) {
            setOrders([]);
          }
        }
        if (remoteUsers && remoteUsers.length > 0) {
          setUsers((prev) => {
            const map = new Map<string, UserAccount>();
            // Remote Supabase users take authoritative precedence
            remoteUsers.forEach((u) => map.set(u.id, u));

            // Identificar usuarios locales ausentes en Supabase (ej. johana90 creado previamente)
            const remoteUsernames = new Set(
              remoteUsers.map((u) => u.username.toLowerCase())
            );
            const remoteEmails = new Set(
              remoteUsers.map((u) => u.email.toLowerCase())
            );

            prev.forEach((localU) => {
              if (!map.has(localU.id)) {
                map.set(localU.id, localU);
              }
              // Si no existe en Supabase y no es el admin_master, auto-sincronizarlo ahora mismo
              if (
                !remoteUsernames.has(localU.username.toLowerCase()) &&
                !remoteEmails.has(localU.email.toLowerCase())
              ) {
                console.info(
                  `Auto-sincronizando usuario local "${localU.username}" a Supabase...`
                );
                insertUserInSupabase(localU).catch((e) =>
                  console.warn(`Error auto-syncing ${localU.username}:`, e)
                );
                if (localU.role === 'client') {
                  insertClientInSupabase({
                    id: `cli-${Date.now()}`,
                    userId: localU.id,
                    name: localU.name,
                    username: localU.username,
                    email: localU.email,
                    phone: localU.phone || '',
                    address: localU.address || '',
                    totalOrders: 0,
                    totalSpent: 0,
                    status: 'active',
                    registeredAt: localU.createdAt || new Date().toISOString().split('T')[0]
                  }).catch(() => {});
                }
              }
            });

            return Array.from(map.values());
          });
        }
        if (remoteClients && remoteClients.length > 0) {
          setClients((prev) => {
            const map = new Map<string, ClientProfile>();
            prev.forEach((c) => map.set(c.id, c));
            remoteClients.forEach((c) => map.set(c.id, c));
            return Array.from(map.values());
          });
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
      savedAddresses,
      users,
      clients
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

  // Deep Link URL & /marketplace Route Parser
  useEffect(() => {
    try {
      const pathname = (window.location.pathname || '').toLowerCase();
      const isMarketplaceRoute = pathname === '/marketplace' || pathname.startsWith('/marketplace');

      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const bizId = params.get('id');
      const filter = params.get('filter');
      const roleParam = (params.get('role') || params.get('login') || params.get('portal') || '').toLowerCase();

      if (roleParam === 'admin' || roleParam === 'superadmin') {
        if (currentUser?.role === 'admin') {
          setCurrentRole('admin');
          setActiveAdminTab('overview');
        } else {
          setIsCorporateAuthModalOpen(true);
        }
      } else if (roleParam === 'seller' || roleParam === 'negocio' || roleParam === 'vendedor') {
        if (currentUser?.role === 'seller') {
          setCurrentRole('seller');
          setActiveSellerTab('orders');
        } else {
          setIsCorporateAuthModalOpen(true);
        }
      } else if (isMarketplaceRoute || view === 'marketplace' || view === 'explore') {
        setCurrentRole('client');
        setActiveClientTab('explore');
      }

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
  const serviceFeeRate = 0.05; // 5% de tarifa de servicio a consumidor
  const cartServiceFee = cartSubtotal > 0 ? Math.max(10, Math.round(cartSubtotal * serviceFeeRate)) : 0;

  // Web Assistant (Native In-App Chatbot) Helper
  const openWebAssistantWithPrompt = (initialPrompt = '') => {
    setWebAssistantInitialPrompt(initialPrompt);
    setIsWebAssistantOpen(true);
  };

  // Demand Radar Search Tracker
  const recordFailedSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 2) return;

    setFailedSearches((prev) => {
      const existingIndex = prev.findIndex(
        (f) => f.term.toLowerCase() === cleanTerm.toLowerCase()
      );

      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + 1,
          lastSearchedAt: now
        };
        return updated;
      }

      // Guess category from keywords
      const lower = cleanTerm.toLowerCase();
      let categoryGuess = 'Marketplace General';
      if (
        lower.includes('med') ||
        lower.includes('pastilla') ||
        lower.includes('jarabe') ||
        lower.includes('farmacia') ||
        lower.includes('suero') ||
        lower.includes('dolor') ||
        lower.includes('gripe') ||
        lower.includes('insulina') ||
        lower.includes('antibiotico')
      ) {
        categoryGuess = 'Farmacia / Salud';
      } else if (
        lower.includes('taco') ||
        lower.includes('pizza') ||
        lower.includes('burger') ||
        lower.includes('hamburguesa') ||
        lower.includes('comida') ||
        lower.includes('cena') ||
        lower.includes('sushi') ||
        lower.includes('alitas') ||
        lower.includes('postre')
      ) {
        categoryGuess = 'Restaurante / Alimentos';
      } else if (
        lower.includes('pañal') ||
        lower.includes('bebe') ||
        lower.includes('formula') ||
        lower.includes('leche')
      ) {
        categoryGuess = 'Bebés / Maternidad';
      } else if (
        lower.includes('cable') ||
        lower.includes('cargador') ||
        lower.includes('pila') ||
        lower.includes('celular') ||
        lower.includes('usb')
      ) {
        categoryGuess = 'Conveniencia / Electrónica';
      }

      const newRecord: FailedSearchRecord = {
        id: `fs-${Date.now()}`,
        term: cleanTerm,
        categoryGuess,
        count: 1,
        firstSearchedAt: now,
        lastSearchedAt: now,
        status: 'pending',
        userLocationHint: userAddressLabel || 'Zona Metropolitana CDMX',
        notes: 'Búsqueda registrada automáticamente por cliente en Marketplace'
      };

      return [newRecord, ...prev];
    });
  };

  const updateFailedSearchStatus = (
    id: string,
    status: FailedSearchRecord['status'],
    notes?: string
  ) => {
    setFailedSearches((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(notes !== undefined ? { notes } : {})
            }
          : r
      )
    );
  };

  const deleteFailedSearch = (id: string) => {
    setFailedSearches((prev) => prev.filter((r) => r.id !== id));
  };

  // Boost Ads Activation for Sellers
  const boostProduct = (productId: string, planId: string, days: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) {
      return { success: false, message: 'Producto no encontrado' };
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    const formattedExpiry = expiryDate.toISOString().split('T')[0];

    let boostTier: 'basic' | 'pro' | 'premium' = 'basic';
    if (days >= 15) boostTier = 'premium';
    else if (days >= 7) boostTier = 'pro';

    updateProduct(productId, {
      isBoosted: true,
      boostTier,
      boostExpiresAt: formattedExpiry
    });

    return {
      success: true,
      message: `¡Producto "${targetProduct.name}" impulsado exitosamente con Ads por ${days} días!`
    };
  };

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

  const currentSellerBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0] || undefined;

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
        clearAllSampleData,
        restoreSampleData,
        isMockDataCleared,
        isClearingData,

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
        serviceFeeRate,
        cartServiceFee,

        // Demand Radar & Search Intelligence
        failedSearches,
        recordFailedSearch,
        updateFailedSearchStatus,
        deleteFailedSearch,

        // Boost Ads for Sellers
        boostProduct,

        // Web Assistant (Native In-App Chatbot)
        isWebAssistantOpen,
        setIsWebAssistantOpen,
        openWebAssistantWithPrompt,
        webAssistantInitialPrompt,

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
        registerBusiness,
        upgradeClientToBusiness,
        logout,
        switchRole,

        // Modals & Links
        isClientAuthModalOpen,
        setIsClientAuthModalOpen,
        isCorporateAuthModalOpen,
        setIsCorporateAuthModalOpen,
        isRegisterBusinessModalOpen,
        setIsRegisterBusinessModalOpen,
        isRegisteringAsSponsor,
        setIsRegisteringAsSponsor,
        openBusinessRegistration,
        isProfileModalOpen,
        setIsProfileModalOpen,
        clientAuthIntent,
        setClientAuthIntent,
        isMarketplaceRoute,
        currentRoute,
        navigateToRoute,
        navigateToHome,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        getMarketplaceShareUrl,
        getCorporateShareUrl,

        // Admin CRUD for Users
        addUser,
        updateUser,
        toggleSuspendUser,
        deleteUser,
        syncAllUsersToSupabase,

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
