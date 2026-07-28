import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Sparkles,
  Images,
  Cpu,
  Settings,
  LogOut,
  Bot,
  Zap,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Coins
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activeTab, setActiveTab, currentUser, logout, settings, creditsData, fetchApimartCredits } = useAppStore();

  useEffect(() => {
    fetchApimartCredits();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'avatars', label: 'Avatars', icon: Users },
    { id: 'projects', label: 'Proyectos', icon: FolderKanban },
    { id: 'generations', label: 'Generaciones', icon: Sparkles },
    { id: 'gallery', label: 'Galería', icon: Images },
    { id: 'models', label: 'Modelos IA', icon: Cpu },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ] as const;

  const handleSelect = (id: typeof activeTab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between bg-[#0B0B0D] border-r border-[#27282D] p-3 text-gray-300 select-none">
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFC600] to-[#F81878] flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-5 h-5 text-black" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-white tracking-tight leading-none">
                  Avatar Studio <span className="text-[#FFC600]">AI</span>
                </h2>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">APIMART Studio</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-[#FFC600] font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#FFC600]' : ''}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Credit Usage Widget */}
      {!collapsed && (
        <div className="px-1 py-2">
          <div className="bg-[#16171A] rounded-xl p-3 border border-white/5 hover:border-[#FFC600]/30 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#FFC600]" />
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Créditos APIMART</span>
              </div>
              <button
                onClick={() => fetchApimartCredits()}
                disabled={creditsData.loading}
                title="Actualizar créditos de la API"
                className="p-1 rounded text-white/40 hover:text-[#FFC600] hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3 h-3 ${creditsData.loading ? 'animate-spin text-[#FFC600]' : ''}`} />
              </button>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-bold font-mono text-white">
                {creditsData.remaining.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">/ {creditsData.total.toLocaleString()}</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#FFC600]">
                {creditsData.percentage}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#FFC600] to-[#F81878] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, creditsData.percentage))}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-500 pt-0.5">
              <span className="truncate max-w-[120px]">{creditsData.plan}</span>
              {creditsData.lastUpdated && <span>{creditsData.lastUpdated}</span>}
            </div>
          </div>
        </div>
      )}

      {/* User Footer */}
      <div className="border-t border-[#27282D] pt-3 px-1">
        {!collapsed && (
          <div className="mb-3 px-2 py-1.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#7644C6] flex items-center justify-center text-xs text-white font-bold shrink-0">
              {currentUser?.nombre?.[0] || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium text-white truncate">{currentUser?.nombre}</p>
              <p className="text-[10px] text-gray-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center' : 'justify-start'
          } gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer`}
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block h-screen fixed left-0 top-0 z-30 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 w-64 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};
