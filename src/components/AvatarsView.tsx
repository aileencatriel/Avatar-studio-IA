import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Avatar } from '../types';
import {
  Users,
  Plus,
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Video,
  Music,
  ImageIcon,
  Grid,
  List,
  Cpu,
  Trash2,
  UserPlus
} from 'lucide-react';

interface AvatarsViewProps {
  onOpenCreateAvatarModal: () => void;
  onEditAvatar: (id: string) => void;
}

export const AvatarsView: React.FC<AvatarsViewProps> = ({
  onOpenCreateAvatarModal,
  onEditAvatar,
}) => {
  const { avatars, searchQuery, setSearchQuery, setActiveTab, setSelectedAvatarId, deleteAvatar } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAvatars = avatars.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.nombre.toLowerCase().includes(q) ||
      a.descripcion.toLowerCase().includes(q) ||
      a.profesion?.toLowerCase().includes(q) ||
      a.idioma.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16171A] p-4 rounded-2xl border border-[#27282D]">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nombre, profesión, idioma..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0B0D] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium hidden md:inline">
            {filteredAvatars.length} Avatars registrados
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0B0B0D] p-1 rounded-xl border border-[#27282D]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'grid' ? 'bg-[#16171A] text-[#FFC600]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'list' ? 'bg-[#16171A] text-[#FFC600]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenCreateAvatarModal}
            className="primary-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-[#FFC600]/10 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Avatar</span>
          </button>
        </div>
      </div>

      {/* Empty state when no avatars */}
      {filteredAvatars.length === 0 ? (
        <div className="bg-[#16171A] border border-[#27282D] rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-[#FFC600]/10 rounded-2xl flex items-center justify-center mx-auto text-[#FFC600] border border-[#FFC600]/20">
            <UserPlus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No tienes ningún avatar registrado</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Puedes crear un nuevo avatar personal subiendo tu propia foto (imagen maestra) y configurando sus modelos de generación (Nano banana, Nano Banana PRO, Nano Banana 2 o GPT IMAGE 2).
          </p>
          <button
            onClick={onOpenCreateAvatarModal}
            className="primary-button px-6 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xl shadow-[#FFC600]/10"
          >
            <Plus className="w-4 h-4" />
            <span>Crear mi Primer Avatar</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAvatars.map((avatar) => (
            <motion.div
              key={avatar.id}
              whileHover={{ y: -4 }}
              className="bg-[#16171A] rounded-2xl border border-[#27282D] overflow-hidden hover:border-[#FFC600]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
            >
              {/* Image Banner */}
              <div className="aspect-[4/3] w-full bg-[#0B0B0D] relative overflow-hidden">
                <img
                  src={avatar.imagen_principal}
                  alt={avatar.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16171A] via-transparent to-black/30" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                    {avatar.genero} • {avatar.edad_aparente}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar el avatar "${avatar.nombre}"?`)) {
                        deleteAvatar(avatar.id);
                      }
                    }}
                    title="Eliminar Avatar"
                    className="p-1.5 rounded-full bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white transition-colors border border-red-500/30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-2.5 py-1 rounded-full bg-[#FFC600]/90 text-[#0B0B0D] text-[10px] font-bold shadow-md">
                    {avatar.idioma.split(' ')[0]}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-extrabold text-white leading-tight drop-shadow-md">
                    {avatar.nombre}
                  </h3>
                  <p className="text-xs text-[#FFC600] font-medium mt-0.5 drop-shadow">
                    {avatar.profesion || avatar.rol}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {avatar.descripcion}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-[#0B0B0D] border border-[#27282D] space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-gray-400">
                      <span>Personalidad:</span>
                      <span className="text-white font-medium truncate max-w-[150px]">
                        {avatar.personalidad}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Modelo Imagen:</span>
                      <span className="text-[#7644C6] font-semibold font-mono">
                        {avatar.modelo_imagen.replace('apimart-', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-[#27282D] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onEditAvatar(avatar.id)}
                    className="secondary-button flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center cursor-pointer"
                  >
                    Editar Ficha
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAvatarId(avatar.id);
                      setActiveTab('generations');
                    }}
                    className="primary-button py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className="bg-[#16171A] p-4 rounded-2xl border border-[#27282D] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#FFC600]/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={avatar.imagen_principal}
                  alt={avatar.nombre}
                  className="w-14 h-14 rounded-xl object-cover border border-[#27282D] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{avatar.nombre}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFC600]/10 text-[#FFC600] font-semibold">
                      {avatar.profesion}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{avatar.descripcion}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                    <span>Idioma: {avatar.idioma}</span>
                    <span>•</span>
                    <span>Tono: {avatar.tono}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEditAvatar(avatar.id)}
                  className="secondary-button px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar el avatar "${avatar.nombre}"?`)) {
                      deleteAvatar(avatar.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/20 transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedAvatarId(avatar.id);
                    setActiveTab('generations');
                  }}
                  className="primary-button px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
