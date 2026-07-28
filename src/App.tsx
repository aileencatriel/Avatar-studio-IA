import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/DashboardView';
import { AvatarsView } from './components/AvatarsView';
import { AvatarBuilderModal } from './components/AvatarBuilderModal';
import { ProjectsView } from './components/ProjectsView';
import { GenerationsView } from './components/GenerationsView';
import { GalleryView } from './components/GalleryView';
import { ModelsView } from './components/ModelsView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const { isAuthenticated, activeTab } = useAppStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Avatar Builder modal state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [editingAvatarId, setEditingAvatarId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  const handleOpenCreateAvatar = () => {
    setEditingAvatarId(null);
    setIsAvatarModalOpen(true);
  };

  const handleEditAvatar = (id: string) => {
    setEditingAvatarId(id);
    setIsAvatarModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-gray-100 flex font-sans antialiased selection:bg-[#FFC600] selection:text-[#0B0B0D]">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateAvatarModal={handleOpenCreateAvatar}
        />

        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenCreateAvatarModal={handleOpenCreateAvatar}
              onOpenAvatarDetail={handleEditAvatar}
            />
          )}

          {activeTab === 'avatars' && (
            <AvatarsView
              onOpenCreateAvatarModal={handleOpenCreateAvatar}
              onEditAvatar={handleEditAvatar}
            />
          )}

          {activeTab === 'projects' && <ProjectsView />}

          {activeTab === 'generations' && <GenerationsView />}

          {activeTab === 'gallery' && <GalleryView />}

          {activeTab === 'models' && <ModelsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>

        <footer className="p-4 text-center border-t border-white/5 text-[10px] text-white/20 font-medium tracking-widest uppercase">
          AVATAR STUDIO AI • v2.0.4 • POWERED BY APIMART
        </footer>
      </div>

      {/* Avatar Constructor Modal */}
      <AvatarBuilderModal
        avatarId={editingAvatarId}
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
