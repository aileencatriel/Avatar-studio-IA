import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { FileAsset, MediaCategory } from '../types';
import {
  Images,
  Image as ImageIcon,
  Video,
  Music,
  Search,
  Filter,
  Download,
  Eye,
  X,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  Copy,
  Check,
  Trash2,
  Edit3
} from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { assets, avatars, projects, generations, deleteAsset, deleteGeneration, updateGeneration } = useAppStore();

  const [filterType, setFilterType] = useState<MediaCategory | 'all'>('all');
  const [filterAvatarId, setFilterAvatarId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<FileAsset | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState<boolean>(false);
  const [editedPrompt, setEditedPrompt] = useState<string>('');

  const filteredAssets = assets.filter((ast) => {
    if (filterType !== 'all' && ast.tipo !== filterType) return false;
    if (filterAvatarId !== 'all' && ast.avatar_id !== filterAvatarId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!ast.nombre.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getAssociatedGen = (genId?: string) => {
    return generations.find((g) => g.id === genId);
  };

  const currentGen = selectedAsset ? getAssociatedGen(selectedAsset.generacion_id) : null;

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAssetModal = (asset: FileAsset) => {
    setSelectedAsset(asset);
    const gen = getAssociatedGen(asset.generacion_id);
    if (gen) {
      setEditedPrompt(gen.prompt);
    }
    setIsEditingPrompt(false);
  };

  const handleSavePromptEdit = () => {
    if (currentGen) {
      updateGeneration(currentGen.id, { prompt: editedPrompt });
      setIsEditingPrompt(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter Bar */}
      <div className="bg-[#16171A] p-4 rounded-2xl border border-[#27282D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar archivos por nombre..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0B0D] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          {/* Media Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0B0B0D] p-1 rounded-xl border border-[#27282D] overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'all' ? 'bg-[#FFC600] text-[#0B0B0D]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos ({assets.length})
            </button>
            <button
              onClick={() => setFilterType('imagen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                filterType === 'imagen' ? 'bg-[#FFC600] text-[#0B0B0D]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imágenes</span>
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                filterType === 'video' ? 'bg-[#FFC600] text-[#0B0B0D]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter by Avatar */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#27282D]">
          <span className="text-xs text-gray-400 font-medium">Filtrar por Avatar:</span>
          <select
            value={filterAvatarId}
            onChange={(e) => setFilterAvatarId(e.target.value)}
            className="p-1.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="all">Todos los Avatares</option>
            {avatars.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-[#16171A] rounded-2xl border border-[#27282D] text-gray-500 text-xs">
          No se encontraron archivos en la galería con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const avatar = avatars.find((a) => a.id === asset.avatar_id);

            return (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleOpenAssetModal(asset)}
                className="bg-[#16171A] rounded-2xl border border-[#27282D] overflow-hidden cursor-pointer group relative hover:border-[#FFC600]/50 transition-all shadow-lg flex flex-col justify-between"
              >
                {/* Thumb */}
                <div className="aspect-square bg-[#0B0B0D] relative overflow-hidden flex items-center justify-center">
                  {asset.tipo === 'imagen' && (
                    <img src={asset.url} alt={asset.nombre} className="w-full h-full object-cover" />
                  )}

                  {asset.tipo === 'video' && (
                    <video src={asset.url} className="w-full h-full object-cover" />
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Eye className="w-5 h-5 text-white drop-shadow-md" />
                  </div>

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase border border-white/10">
                    {asset.formato}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar el archivo "${asset.nombre}"?`)) {
                        deleteAsset(asset.id);
                      }
                    }}
                    title="Eliminar archivo"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white transition-colors border border-red-500/30 opacity-0 group-hover:opacity-100 z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{asset.nombre}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{avatar?.nombre || 'General'}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#16171A] rounded-2xl border border-[#27282D] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#0B0B0D] border-b border-[#27282D] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white truncate">{selectedAsset.nombre}</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Media Preview */}
              <div className="max-h-80 w-full bg-[#0B0B0D] rounded-xl overflow-hidden flex items-center justify-center border border-[#27282D]">
                {selectedAsset.tipo === 'imagen' && (
                  <img src={selectedAsset.url} alt="Full" className="max-h-80 object-contain" />
                )}
                {selectedAsset.tipo === 'video' && (
                  <video src={selectedAsset.url} controls autoPlay className="max-h-80 w-full" />
                )}
              </div>

              {/* Details & Actions */}
              {currentGen && (
                <div className="bg-[#0B0B0D] p-4 rounded-xl border border-[#27282D] space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-semibold">Prompt Utilizado:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                        className="text-[10px] text-[#FFC600] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditingPrompt ? 'Cancelar' : 'Editar Prompt'}</span>
                      </button>
                      <button
                        onClick={() => handleCopyPrompt(currentGen.prompt)}
                        className="text-[10px] text-[#FFC600] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {isEditingPrompt ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="w-full p-2.5 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white focus:outline-none focus:border-[#FFC600]"
                      />
                      <button
                        onClick={handleSavePromptEdit}
                        className="primary-button px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-200 italic">"{currentGen.prompt}"</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-400">
                    <div>Modelo: <span className="text-white font-mono">{currentGen.modelo_utilizado}</span></div>
                    <div>Resolución: <span className="text-white">{selectedAsset.resolucion || 'HD'}</span></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar este contenido ("${selectedAsset.nombre}") de la galería?`)) {
                      deleteAsset(selectedAsset.id);
                      if (selectedAsset.generacion_id) {
                        deleteGeneration(selectedAsset.generacion_id);
                      }
                      setSelectedAsset(null);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Contenido</span>
                </button>

                <a
                  href={selectedAsset.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo Original</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
