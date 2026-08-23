import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { WhatsAppChatModal } from './components/common/WhatsAppChatModal';
import { RoleAccessModal } from './components/common/RoleAccessModal';
import { RoleSwitcherHub } from './components/common/RoleSwitcherHub';
import { ClientExplore } from './components/client/ClientExplore';
import { BusinessDetailModal } from './components/client/BusinessDetailModal';
import { CartCheckoutDrawer } from './components/client/CartCheckoutDrawer';
import { MyOrdersView } from './components/client/MyOrdersView';
import { MyAccountView } from './components/client/MyAccountView';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { Business } from './types';

const PulsoAppContent: React.FC = () => {
  const {
    currentRole,
    activeClientTab,
    selectedBusinessForDetail,
    setSelectedBusinessForDetail,
    setActiveClientTab
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleSelectBusiness = (biz: Business) => {
    setSelectedBusinessForDetail(biz);
  };

  const handleOrderSuccess = (orderId: string) => {
    setActiveClientTab('orders');
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top PWA Install Banner */}
      <PWAInstallBanner />

      {/* Top Application Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      {/* Responsive Fullscreen Body Layout */}
      <div className="flex-1 flex w-full max-w-full bg-white">
        {/* Left Sidebar on Desktop */}
        <Navigation
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Center Main View Area */}
        <main className="flex-1 w-full min-w-0 overflow-y-auto pt-2 bg-white">
          {/* CLIENT ROLE VIEWS */}
          {currentRole === 'client' && (
            <>
              {activeClientTab === 'explore' && (
                <ClientExplore onSelectBusiness={handleSelectBusiness} />
              )}
              {activeClientTab === 'orders' && <MyOrdersView />}
              {activeClientTab === 'account' && (
                <MyAccountView onOpenRoleModal={() => setIsRoleModalOpen(true)} />
              )}
              {activeClientTab === 'roles_hub' && <RoleSwitcherHub />}
            </>
          )}

          {/* SELLER ROLE VIEWS */}
          {currentRole === 'seller' && <SellerDashboard />}

          {/* SUPERADMIN ROLE VIEWS */}
          {currentRole === 'admin' && <SuperAdminDashboard />}
        </main>
      </div>

      {/* WhatsApp Floating Action Button & Simulator Modal */}
      <WhatsAppFloatingButton />
      <WhatsAppChatModal />

      {/* Role Switcher Modal (2 columns on mobile) */}
      <RoleAccessModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Business Catalog / Detail Modal */}
      {selectedBusinessForDetail && (
        <BusinessDetailModal
          business={selectedBusinessForDetail}
          onClose={() => setSelectedBusinessForDetail(null)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PulsoAppContent />
    </AppProvider>
  );
}
