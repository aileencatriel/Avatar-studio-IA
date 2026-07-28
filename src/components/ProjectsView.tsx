import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Project } from '../types';
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  Sparkles,
  FileText,
  Users,
  Image as ImageIcon,
  Video,
  Music,
  Trash2,
  Edit3,
  Check,
  X
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, avatars, generations, assets, addProject, updateProject, deleteProject, addToast, setActiveTab, setSelectedProjectId } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjId, setSelectedProjId] = useState<string | null>(projects[0]?.id || null);
  const [isCreatingModal, setIsCreatingModal] = useState(false);

  // New Project Form
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjAvatarId, setNewProjAvatarId] = useState<string>(avatars[0]?.id || '');
  const [newProjColor, setNewProjColor] = useState('#FFC600');

  const selectedProj = projects.find((p) => p.id === selectedProjId) || projects[0];

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
  });

  const projGenerations = generations.filter((g) => g.proyecto_id === selectedProj?.id);
  const projAssets = assets.filter((a) => a.proyecto_id === selectedProj?.id);
  const projAvatar = avatars.find((a) => a.id === selectedProj?.avatar_id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;

    const created = addProject({
      nombre: newProjName,
      descripcion: newProjDesc,
      avatar_id: newProjAvatarId,
      color: newProjColor,
      estado: 'activo',
      notas: 'Notas e historial del proyecto.',
      tags: ['Campaña']
    });

    setSelectedProjId(created.id);
    setIsCreatingModal(false);
    setNewProjName('');
    setNewProjDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16171A] p-4 rounded-2xl border border-[#27282D]">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proyectos y campañas..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0B0D] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          onClick={() => setIsCreatingModal(true)}
          className="primary-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-[#FFC600]/10 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            Proyectos ({filteredProjects.length})
          </h3>

          <div className="space-y-2">
            {filteredProjects.map((p) => {
              const isSelected = p.id === selectedProjId;
              const avatar = avatars.find((a) => a.id === p.avatar_id);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjId(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#16171A] border-[#FFC600] shadow-lg'
                      : 'bg-[#16171A]/50 border-[#27282D] hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.color || '#FFC600' }}
                        />
                        <h4 className="text-sm font-bold text-white">{p.nombre}</h4>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{p.descripcion}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#27282D] flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#7644C6]" />
                      {avatar?.nombre || 'Sin avatar asignado'}
                    </span>
                    <span className="capitalize text-emerald-400 font-medium">{p.estado || 'activo'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Project Inspector */}
        <div className="lg:col-span-2">
          {selectedProj ? (
            <div className="bg-[#16171A] p-6 rounded-2xl border border-[#27282D] space-y-6">
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27282D] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedProj.color || '#FFC600' }}
                    />
                    <h2 className="text-xl font-extrabold text-white">{selectedProj.nombre}</h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{selectedProj.descripcion}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      deleteProject(selectedProj.id);
                      setSelectedProjId(projects.find((p) => p.id !== selectedProj.id)?.id || null);
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProjectId(selectedProj.id);
                      setActiveTab('generations');
                    }}
                    className="primary-button px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generar en Proyecto</span>
                  </button>
                </div>
              </div>

              {/* Linked Avatar */}
              {projAvatar && (
                <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-[#27282D] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={projAvatar.imagen_principal}
                      alt={projAvatar.nombre}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{projAvatar.nombre}</h4>
                      <p className="text-[10px] text-[#FFC600]">{projAvatar.profesion}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-[#16171A] px-2.5 py-1 rounded-full border border-[#27282D]">
                    Avatar Principal
                  </span>
                </div>
              )}

              {/* Project Notes */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#FFC600]" />
                  <span>Notas & Estrategia</span>
                </h4>
                <textarea
                  rows={3}
                  value={selectedProj.notas || ''}
                  onChange={(e) => updateProject(selectedProj.id, { notas: e.target.value })}
                  placeholder="Añade notas del proyecto o directrices de contenido..."
                  className="w-full p-3 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white focus:outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Project Generations */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 mb-3 flex items-center justify-between">
                  <span>Generaciones del Proyecto ({projGenerations.length})</span>
                </h4>

                {projGenerations.length === 0 ? (
                  <div className="p-6 text-center bg-[#0B0B0D] rounded-xl border border-[#27282D] text-gray-500 text-xs">
                    No hay contenido generado en este proyecto aún. Usa el botón superior para crear.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projGenerations.map((gen) => (
                      <div
                        key={gen.id}
                        className="p-3 rounded-xl bg-[#0B0B0D] border border-[#27282D] flex items-start gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#16171A] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                          {gen.tipo === 'imagen' && <img src={gen.archivo_generado} className="w-full h-full object-cover" />}
                          {gen.tipo === 'video' && <Video className="w-5 h-5 text-[#F81878]" />}
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-bold text-[#FFC600] uppercase">{gen.tipo}</span>
                          <p className="text-xs text-white line-clamp-1 truncate">"{gen.prompt}"</p>
                          <span className="text-[10px] text-gray-500">{gen.modelo_utilizado}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 bg-[#16171A] rounded-2xl border border-[#27282D]">
              Selecciona o crea un proyecto.
            </div>
          )}
        </div>
      </div>

      {/* Modal create project */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#16171A] p-6 rounded-2xl border border-[#27282D]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Crear Nuevo Proyecto</h3>
              <button onClick={() => setIsCreatingModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nombre del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="Ej. Campaña Lanzamiento Q3"
                  className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Objetivos y resumen..."
                  className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Avatar Asociado</label>
                <select
                  value={newProjAvatarId}
                  onChange={(e) => setNewProjAvatarId(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                >
                  {avatars.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.profesion})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="secondary-button px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-button px-4 py-2 rounded-xl font-semibold">
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
