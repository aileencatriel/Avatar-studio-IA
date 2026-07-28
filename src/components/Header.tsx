import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, Plus, Sparkles, Menu, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCreateAvatarModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenCreateAvatarModal,
}) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, settings } = useAppStore();

  const titles: Record<string, string> = {
    dashboard: 'Dashboard General',
    avatars: 'Gestión de Avatares IA',
    projects: 'Proyectos y Campañas',
    generations: 'Estudio de Generaciones APIMART',
    gallery: 'Galería de Archivos y Contenidos',
    models: 'Catálogo de Modelos IA (APIMART)',
    settings: 'Configuración de Sistema',
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-[#0B0B0D]/80 backdrop-blur-md">
      {/* Left: Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base md:text-lg font-semibold text-white tracking-tight">
            {titles[activeTab] || 'Overview'}
          </h1>
        </div>
      </div>

      {/* Middle: Universal Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar avatares, proyectos, prompts o imágenes..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#16171A] border border-white/10 focus:border-[#FFC600] rounded-full text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Status Pill from Theme */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#16171A] border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-xs font-medium text-white/70">APIMART Connected</span>
        </div>

        <button
          onClick={onOpenCreateAvatarModal}
          className="secondary-button px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-[#FFC600]" />
          <span className="hidden sm:inline">Nuevo Avatar</span>
        </button>

        <button
          onClick={() => setActiveTab('generations')}
          className="primary-button px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FFC600]/10 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generar IA</span>
        </button>

        {/* User Initials Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#7644C6] flex items-center justify-center text-xs font-bold text-white shrink-0">
          JD
        </div>
      </div>
    </header>
  );
};
