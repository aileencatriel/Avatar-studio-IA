import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { AIModel } from '../types';
import {
  Cpu,
  RotateCw,
  Search,
  CheckCircle2,
  Zap,
  Sparkles,
  Star,
  Image as ImageIcon,
  Video,
  Music,
  Bot
} from 'lucide-react';

export const ModelsView: React.FC = () => {
  const { models, syncApimartModels, isSyncingModels, toggleFavoriteModel } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredModels = models.filter((m) => {
    if (selectedCategory !== 'all' && m.categoria !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.nombre.toLowerCase().includes(q) || m.descripcion.toLowerCase().includes(q) || m.proveedor.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Sync Bar */}
      <div className="bg-[#16171A] p-4 rounded-2xl border border-[#27282D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#FFC600]" />
            <h2 className="text-base font-bold text-white">Catálogo Dinámico de Modelos APIMART</h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Los modelos se sincronizan desde la API de APIMART para reflejar nuevos modelos disponibles en tiempo real.
          </p>
        </div>

        <button
          onClick={syncApimartModels}
          disabled={isSyncingModels}
          className="primary-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-[#FFC600]/10 shrink-0 disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isSyncingModels ? 'animate-spin' : ''}`} />
          <span>{isSyncingModels ? 'Sincronizando APIMART...' : 'Sincronizar Modelos APIMART'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar modelo o proveedor..."
            className="w-full pl-9 pr-4 py-2 bg-[#16171A] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#16171A] p-1 rounded-xl border border-[#27282D] overflow-x-auto">
          {['all', 'imagen', 'video', 'audio', 'multimodal', 'lenguaje'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                selectedCategory === cat ? 'bg-[#FFC600] text-[#0B0B0D]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <motion.div
            key={model.id}
            whileHover={{ y: -2 }}
            className="bg-[#16171A] p-5 rounded-2xl border border-[#27282D] space-y-4 hover:border-[#FFC600]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-[#FFC600] uppercase tracking-wider block">
                    {model.proveedor} • {model.categoria}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{model.nombre}</h3>
                </div>

                <button
                  onClick={() => toggleFavoriteModel(model.id)}
                  className="p-1 text-gray-500 hover:text-[#FFC600]"
                >
                  <Star className={`w-4 h-4 ${model.es_favorito ? 'fill-[#FFC600] text-[#FFC600]' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3">
                {model.descripcion}
              </p>

              {/* Supported parameters */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-semibold block">Parámetros Admitidos:</span>
                <div className="flex flex-wrap gap-1">
                  {model.parametros_admitidos.map((param) => (
                    <span
                      key={param}
                      className="px-2 py-0.5 rounded-md bg-[#0B0B0D] text-gray-300 font-mono text-[10px] border border-[#27282D]"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#27282D] flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Activo
              </span>
              <span className="text-gray-500 font-mono">{model.version}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
