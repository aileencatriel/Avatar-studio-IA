import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import {
  Users,
  FolderKanban,
  Image as ImageIcon,
  Video,
  Music,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronRight,
  Plus,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  onOpenCreateAvatarModal: () => void;
  onOpenAvatarDetail: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCreateAvatarModal,
  onOpenAvatarDetail,
}) => {
  const { avatars, projects, generations, assets, models, setActiveTab, setSelectedAvatarId } = useAppStore();

  const totalAvatars = avatars.length;
  const totalProjects = projects.length;
  const totalImages = generations.filter((g) => g.tipo === 'imagen').length;
  const totalVideos = generations.filter((g) => g.tipo === 'video').length;

  const recentGenerations = generations.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#16171A] via-[#1C1D22] to-[#16171A] border border-[#27282D] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC600]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#7644C6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFC600]/10 border border-[#FFC600]/20 text-[#FFC600] text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>APIMART Engine Active</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Estudio de Producción <span className="gold-gradient-text">IA de Avatares</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-2 leading-relaxed">
              Crea personalidades digitales, genera avatares parlantes e imágenes fotorrealistas con modelos sincronizados en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateAvatarModal}
              className="primary-button px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#FFC600]/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Avatar</span>
            </button>
            <button
              onClick={() => setActiveTab('generations')}
              className="secondary-button px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#7644C6]" />
              <span>Estudio de Generación</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avatares */}
        <div className="bg-[#16171A] p-5 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Avatares</p>
          <h3 className="text-2xl font-bold text-white">{totalAvatars}</h3>
          <p className="text-green-500 text-[10px] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2 este mes
          </p>
        </div>

        {/* Proyectos */}
        <div className="bg-[#16171A] p-5 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Proyectos</p>
          <h3 className="text-2xl font-bold text-white">{totalProjects}</h3>
          <p className="text-white/30 text-[10px] mt-2">Activos ahora</p>
        </div>

        {/* Imágenes */}
        <div className="bg-[#16171A] p-5 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Imágenes</p>
          <h3 className="text-2xl font-bold text-white">{totalImages || 1429}</h3>
          <p className="text-pink-500 text-[10px] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs última semana
          </p>
        </div>

        {/* Videos */}
        <div className="bg-[#16171A] p-5 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Videos</p>
          <h3 className="text-2xl font-bold text-[#FFC600]">{totalVideos || 84}</h3>
          <p className="text-white/30 text-[10px] mt-2">Procesados</p>
        </div>
      </div>

      {/* Main Content Split: Recent Generations Table + Models & Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Generations Table */}
        <div className="lg:col-span-2 bg-[#16171A] rounded-2xl border border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-white">Generaciones Recientes</h2>
            <button
              onClick={() => setActiveTab('generations')}
              className="text-xs text-[#FFC600] font-medium hover:underline cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-widest text-white/30">
                  <th className="pb-4 px-2">Contenido</th>
                  <th className="pb-4 px-2">Avatar</th>
                  <th className="pb-4 px-2">Modelo</th>
                  <th className="pb-4 px-2">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {recentGenerations.map((gen) => {
                  const avatar = avatars.find((a) => a.id === gen.avatar_id);

                  return (
                    <tr key={gen.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                          gen.tipo === 'video'
                            ? 'bg-[#7644C6]/20 text-[#7644C6]'
                            : 'bg-[#FFC600]/20 text-[#FFC600]'
                        }`}>
                          {gen.tipo === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white text-xs truncate max-w-[180px] sm:max-w-[240px]">
                            {gen.prompt}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {new Date(gen.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-white/70 text-xs">
                        {avatar ? avatar.nombre : 'General'}
                      </td>

                      <td className="py-3 px-2 font-mono text-[11px] text-white/50">
                        {gen.modelo_utilizado}
                      </td>

                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                          {gen.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 span): Available Models & Latency Chart */}
        <div className="bg-[#16171A] rounded-2xl border border-white/5 flex flex-col p-6 justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white mb-6">Modelos Disponibles</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">APIMART Flux.1 Dev</span>
                  <span className="text-[10px] text-white/40">Fotorrealismo Ultra-HD</span>
                </div>
                <div className="w-12 h-6 bg-[#FFC600]/10 border border-[#FFC600]/20 rounded-full flex items-center justify-center text-[#FFC600] text-[10px] font-bold">
                  NEW
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">Kling Video 1.5 Pro</span>
                  <span className="text-[10px] text-white/40">Animación cinemática 1080p</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">ElevenLabs Multilingual v2</span>
                  <span className="text-[10px] text-white/40">Clonación y síntesis de voz</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">Runway Gen-3 Alpha</span>
                  <span className="text-[10px] text-white/40">Cinematografía 3D</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-white">Uso de Latencia</span>
              <span className="text-[10px] text-white/40">Real-time</span>
            </div>
            <div className="flex items-end gap-1 h-12">
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[40%]"></div>
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[60%]"></div>
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[45%]"></div>
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[80%]"></div>
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[55%]"></div>
              <div className="flex-1 bg-[#FFC600] rounded-t-sm h-[95%]"></div>
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[30%]"></div>
              <div className="flex-1 bg-[#7644C6] rounded-t-sm h-[50%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
