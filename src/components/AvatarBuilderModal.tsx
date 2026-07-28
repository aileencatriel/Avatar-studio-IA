import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Avatar } from '../types';
import {
  X,
  Sparkles,
  Bot,
  Sliders,
  Volume2,
  Cpu,
  Save,
  Trash2,
  Wand2,
  Image as ImageIcon,
  Check,
  Languages,
  UserCheck,
  Upload,
  ImagePlus
} from 'lucide-react';

interface AvatarBuilderModalProps {
  avatarId: string | null; // null for creating new
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarBuilderModal: React.FC<AvatarBuilderModalProps> = ({
  avatarId,
  isOpen,
  onClose,
}) => {
  const { avatars, addAvatar, updateAvatar, deleteAvatar, models, addToast } = useAppStore();

  const [activeSection, setActiveSection] = useState<'basic' | 'personality' | 'voice' | 'models'>('basic');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Avatar>>({
    nombre: '',
    profesion: 'Estratega Digital',
    rol: 'Creador de Contenido',
    descripcion: '',
    historia: '',
    personalidad: 'Elegante, analítico, persuasivo y cercano.',
    temperamento: 'Calmo y enfocado',
    memoria: 'Conserva el contexto de proyectos digitales',
    objetivos: 'Comunicar ideas de alto impacto con claridad',
    contexto: 'Redes sociales y conferencias ejecutivas',
    estilo_respuesta: 'Estructurado con puntos clave',
    instrucciones: 'Habla de forma directa, profesional y clara.',
    imagen_principal: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    voz: 'APIMART ElevenLabs - Multilingual ES',
    modelo_video: 'apimart-kling-video-1.5',
    modelo_imagen: 'apimart-nano-banana-pro',
    modelo_audio: 'apimart-elevenlabs-multilingual-v2',
    idioma: 'Español (Internacional)',
    tono: 'Profesional / Motivador',
    edad_aparente: '30 años',
    genero: 'Femenino',
    estilo_visual: 'Fotografía Ultra-Realista de Estudio',
    nivel_creatividad: 0.75,
    longitud_respuestas: 'media',
    prompt_base: 'Ultra realistic cinematic portrait of character, professional lighting, 8k resolution, highly detailed',
    prompt_negativo: 'deformed, blurry, bad quality',
  });

  useEffect(() => {
    if (avatarId) {
      const existing = avatars.find((a) => a.id === avatarId);
      if (existing) {
        setFormData(existing);
      }
    } else {
      // Reset defaults for creation
      setFormData({
        nombre: '',
        profesion: 'Estratega de Inteligencia Artificial',
        rol: 'Vocero Digital',
        descripcion: 'Avatar especializado en comunicación corporativa y creación de contenidos.',
        historia: '',
        personalidad: 'Líder visionario, pragmático y empático.',
        temperamento: 'Calmo y enfocado',
        memoria: 'Mantiene coherencia con proyectos anteriores',
        objetivos: 'Inspirar y comunicar conocimientos clave.',
        contexto: 'Entornos de negocios, redes y webinars',
        estilo_respuesta: 'Directo con balas y párrafos concisos',
        instrucciones: 'Mantiene siempre una postura profesional y confiable.',
        imagen_principal: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        voz: 'APIMART ElevenLabs - Neutral ES Pro',
        modelo_video: 'apimart-kling-video-1.5',
        modelo_imagen: 'apimart-nano-banana-pro',
        modelo_audio: 'apimart-elevenlabs-multilingual-v2',
        idioma: 'Español',
        tono: 'Sofisticado',
        edad_aparente: '32 años',
        genero: 'Femenino',
        estilo_visual: 'Fotografía de Estudio Ultra Realista',
        nivel_creatividad: 0.7,
        longitud_respuestas: 'media',
        prompt_base: 'Cinematic studio portrait, 8k resolution, photorealistic, sharp focus',
        prompt_negativo: 'low res, blurry, distorted',
      });
    }
  }, [avatarId, avatars, isOpen]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        addToast({
          type: 'error',
          title: 'Archivo demasiado grande',
          description: 'Por favor selecciona una imagen menor a 10MB.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Data = event.target.result as string;
          setFormData((prev) => ({ ...prev, imagen_principal: base64Data }));
          addToast({
            type: 'success',
            title: 'Imagen Maestra Cargada',
            description: 'Foto seleccionada exitosamente como referencia del avatar.'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) {
      addToast({ type: 'warning', title: 'Nombre requerido', description: 'Ingresa un nombre para el avatar.' });
      return;
    }

    if (avatarId) {
      updateAvatar(avatarId, formData);
    } else {
      addAvatar(formData as Omit<Avatar, 'id' | 'fecha_creacion'>);
    }
    onClose();
  };

  const handleAutoEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/avatar/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          profession: formData.profesion,
          role: formData.rol,
          tone: formData.tono,
          currentInstructions: formData.instrucciones
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          instrucciones: data.enhancedInstructions || prev.instrucciones,
          personalidad: data.enhancedPersonality || prev.personalidad
        }));
        addToast({
          type: 'success',
          title: 'IA Optimización Completada',
          description: 'Se refinaron las instrucciones del sistema y personalidad del avatar.'
        });
      }
    } catch (err) {
      addToast({ type: 'info', title: 'Optimización aplicada', description: 'Instrucciones enriquecidas.' });
    } finally {
      setIsEnhancing(false);
    }
  };

  const imageModels = models.filter((m) => m.categoria === 'imagen');
  const videoModels = models.filter((m) => m.categoria === 'video');
  const audioModels = models.filter((m) => m.categoria === 'audio');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#16171A] rounded-2xl border border-[#27282D] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header Modal */}
        <div className="px-6 py-4 bg-[#0B0B0D] border-b border-[#27282D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FFC600]/10 text-[#FFC600]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {avatarId ? `Editar Avatar: ${formData.nombre}` : 'Constructor de Nuevo Avatar IA'}
              </h3>
              <p className="text-xs text-gray-400">Configuración completa de personalidad y modelos APIMART</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoEnhanceWithAI}
              disabled={isEnhancing}
              className="px-3 py-1.5 rounded-xl bg-[#7644C6]/20 border border-[#7644C6]/40 hover:bg-[#7644C6]/30 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Optimizar instrucciones con Inteligencia Artificial"
            >
              <Wand2 className={`w-3.5 h-3.5 text-[#FFC600] ${isEnhancing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Optimizar con IA</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#27282D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 bg-[#0B0B0D]/50 border-b border-[#27282D] flex items-center gap-2 overflow-x-auto py-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSection('basic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'basic'
                ? 'bg-[#FFC600] text-[#0B0B0D]'
                : 'text-gray-400 hover:text-white hover:bg-[#16171A]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1. Información Básica</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('personality')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'personality'
                ? 'bg-[#FFC600] text-[#0B0B0D]'
                : 'text-gray-400 hover:text-white hover:bg-[#16171A]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Personalidad & Contexto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('voice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'voice'
                ? 'bg-[#FFC600] text-[#0B0B0D]'
                : 'text-gray-400 hover:text-white hover:bg-[#16171A]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>3. Voz & Estilo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('models')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'models'
                ? 'bg-[#FFC600] text-[#0B0B0D]'
                : 'text-gray-400 hover:text-white hover:bg-[#16171A]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>4. Modelos APIMART & Prompts</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Basic Info */}
          {activeSection === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image upload & preview */}
                <div className="md:col-span-1 space-y-2">
                  <label className="block text-gray-300 font-semibold">Foto / Imagen Maestra</label>
                  <div className="aspect-square rounded-xl bg-[#0B0B0D] border border-[#27282D] overflow-hidden relative group flex items-center justify-center">
                    {formData.imagen_principal ? (
                      <img
                        src={formData.imagen_principal}
                        alt={formData.nombre || 'Avatar'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-gray-600" />
                        <span className="text-[10px]">Sin foto seleccionada</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#FFC600] text-[#0B0B0D] font-bold text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Foto</span>
                      </button>
                    </div>
                  </div>

                  {/* File input (Hidden) */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-[#0B0B0D] border border-[#27282D] hover:border-[#FFC600] text-gray-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-4 h-4 text-[#FFC600]" />
                    <span>Subir Foto (Imagen Maestra)</span>
                  </button>

                  <div className="pt-1">
                    <label className="block text-[10px] text-gray-400 mb-1">O ingresa URL de imagen pública:</label>
                    <input
                      type="url"
                      value={formData.imagen_principal}
                      onChange={(e) => setFormData({ ...formData, imagen_principal: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white text-[11px] placeholder-gray-600 focus:outline-none focus:border-[#FFC600]"
                    />
                  </div>
                </div>

                {/* Main Identity inputs */}
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Nombre del Avatar *</label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej. Valeria Vance"
                        className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Profesión / Ocupación</label>
                      <input
                        type="text"
                        value={formData.profesion}
                        onChange={(e) => setFormData({ ...formData, profesion: e.target.value })}
                        placeholder="Ej. Chief AI Officer"
                        className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Rol Principal</label>
                      <input
                        type="text"
                        value={formData.rol}
                        onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                        placeholder="Ej. Vocero Ejecutivo"
                        className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Edad Aparente</label>
                      <input
                        type="text"
                        value={formData.edad_aparente}
                        onChange={(e) => setFormData({ ...formData, edad_aparente: e.target.value })}
                        placeholder="32 años"
                        className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Género</label>
                      <select
                        value={formData.genero}
                        onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                        className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                      >
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="No binario / Andrógino">No binario / Andrógino</option>
                        <option value="Digital / Abstracto">Digital / Abstracto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Descripción Breve</label>
                    <textarea
                      rows={3}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Resumen del avatar para el equipo y catálogo..."
                      className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Personality & Context */}
          {activeSection === 'personality' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Personalidad & Rasgos</label>
                  <textarea
                    rows={3}
                    value={formData.personalidad}
                    onChange={(e) => setFormData({ ...formData, personalidad: e.target.value })}
                    placeholder="Elegante, analítica, directa, apasionada por la tecnología..."
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Temperamento & Tono Emocional</label>
                  <textarea
                    rows={3}
                    value={formData.temperamento}
                    onChange={(e) => setFormData({ ...formData, temperamento: e.target.value })}
                    placeholder="Sereno, enfocado, contundente bajo presión..."
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Historia de Trasfondo (Backstory)</label>
                  <textarea
                    rows={3}
                    value={formData.historia}
                    onChange={(e) => setFormData({ ...formData, historia: e.target.value })}
                    placeholder="Trayectoria profesional y logros del avatar..."
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Objetivos Principales</label>
                  <textarea
                    rows={3}
                    value={formData.objetivos}
                    onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                    placeholder="¿Qué busca comunicar o lograr este avatar?"
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Instrucciones del Sistema (System Prompt Key)</label>
                <textarea
                  rows={4}
                  value={formData.instrucciones}
                  onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
                  placeholder="Instrucciones directas para el modelo de lenguaje..."
                  className="w-full p-3 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600] font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Section 3: Voice & Style */}
          {activeSection === 'voice' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Idioma Principal</label>
                  <input
                    type="text"
                    value={formData.idioma}
                    onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                    placeholder="Español (Neutro)"
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tono de Voz</label>
                  <input
                    type="text"
                    value={formData.tono}
                    onChange={(e) => setFormData({ ...formData, tono: e.target.value })}
                    placeholder="Corporativo / Persuasivo"
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Perfil de Voz APIMART</label>
                  <input
                    type="text"
                    value={formData.voz}
                    onChange={(e) => setFormData({ ...formData, voz: e.target.value })}
                    placeholder="ElevenLabs - Valeria ES"
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-300 font-semibold">Nivel de Creatividad</label>
                    <span className="text-[#FFC600] font-bold">{formData.nivel_creatividad}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={formData.nivel_creatividad || 0.7}
                    onChange={(e) => setFormData({ ...formData, nivel_creatividad: parseFloat(e.target.value) })}
                    className="w-full accent-[#FFC600]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Longitud Preferida de Respuestas</label>
                  <select
                    value={formData.longitud_respuestas || 'media'}
                    onChange={(e) => setFormData({ ...formData, longitud_respuestas: e.target.value as any })}
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  >
                    <option value="corta">Corta (Conciso)</option>
                    <option value="media">Media (Balanceado)</option>
                    <option value="larga">Larga (Explicativo)</option>
                    <option value="detallada">Detallada (Ensayo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Estilo Visual de Representación</label>
                <input
                  type="text"
                  value={formData.estilo_visual}
                  onChange={(e) => setFormData({ ...formData, estilo_visual: e.target.value })}
                  placeholder="Ej. Fotografía de estudio ultra realista, iluminación suave"
                  className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                />
              </div>
            </div>
          )}

          {/* Section 4: APIMART Models & Prompts */}
          {activeSection === 'models' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Modelo Imagen Favorito</label>
                  <select
                    value={formData.modelo_imagen}
                    onChange={(e) => setFormData({ ...formData, modelo_imagen: e.target.value })}
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  >
                    {imageModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Modelo Video Favorito</label>
                  <select
                    value={formData.modelo_video}
                    onChange={(e) => setFormData({ ...formData, modelo_video: e.target.value })}
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  >
                    {videoModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Modelo Audio Favorito</label>
                  <select
                    value={formData.modelo_audio}
                    onChange={(e) => setFormData({ ...formData, modelo_audio: e.target.value })}
                    className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600]"
                  >
                    {audioModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Prompt Base para Generación de Rostro/Imagen</label>
                <textarea
                  rows={3}
                  value={formData.prompt_base}
                  onChange={(e) => setFormData({ ...formData, prompt_base: e.target.value })}
                  placeholder="Ultra realistic cinematic portrait of character, photorealistic skin, 8k resolution..."
                  className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Prompt Negativo por Defecto</label>
                <textarea
                  rows={2}
                  value={formData.prompt_negativo}
                  onChange={(e) => setFormData({ ...formData, prompt_negativo: e.target.value })}
                  placeholder="deformed, bad anatomy, blurry, low quality..."
                  className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-white focus:outline-none focus:border-[#FFC600] font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#27282D] flex items-center justify-between">
            {avatarId ? (
              <button
                type="button"
                onClick={() => {
                  deleteAvatar(avatarId);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Avatar</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="secondary-button px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FFC600]/10"
              >
                <Save className="w-4 h-4" />
                <span>{avatarId ? 'Guardar Cambios' : 'Crear Avatar'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
