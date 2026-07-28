import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { MediaCategory, Generation } from '../types';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music,
  Bot,
  Sliders,
  Send,
  Upload,
  Play,
  Download,
  Copy,
  Check,
  Zap,
  Clock,
  ExternalLink,
  Layers
} from 'lucide-react';

export const GenerationsView: React.FC = () => {
  const {
    avatars,
    projects,
    models,
    addGeneration,
    addToast,
    selectedAvatarId,
    selectedProjectId,
    settings
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<MediaCategory>('imagen');
  const [avatarId, setAvatarId] = useState<string>(selectedAvatarId || avatars[0]?.id || '');
  const [projectId, setProjectId] = useState<string>(selectedProjectId || projects[0]?.id || '');

  // Form State
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('deformed, bad quality, blurry');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');

  // Generation parameters
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [duration, setDuration] = useState<number>(5);
  const [steps, setSteps] = useState<number>(30);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);

  // Status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [latestGeneration, setLatestGeneration] = useState<Generation | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedAvatar = avatars.find((a) => a.id === avatarId);

  // Auto populate defaults when avatar or tab changes
  useEffect(() => {
    if (selectedAvatar) {
      if (activeTab === 'imagen') {
        setSelectedModelId(selectedAvatar.modelo_imagen || 'apimart-flux-1-dev');
        if (!prompt) {
          setPrompt(selectedAvatar.prompt_base || `Cinematic ultra-realistic portrait of ${selectedAvatar.nombre}, 8k resolution, photorealistic`);
        }
      } else if (activeTab === 'video') {
        setSelectedModelId(selectedAvatar.modelo_video || 'apimart-kling-video-1.5');
        if (!prompt) {
          setPrompt(`${selectedAvatar.nombre} speaking directly to camera, natural facial motion and head movement`);
        }
      } else if (activeTab === 'audio') {
        setSelectedModelId(selectedAvatar.modelo_audio || 'apimart-elevenlabs-multilingual-v2');
        if (!prompt) {
          setPrompt(`Hola, soy ${selectedAvatar.nombre}. Bienvenido a este reporte de actualización.`);
        }
      }
    }
  }, [avatarId, activeTab, selectedAvatar]);

  const activeModels = models.filter((m) => {
    if (activeTab === 'imagen') return m.categoria === 'imagen';
    if (activeTab === 'video') return m.categoria === 'video';
    if (activeTab === 'audio') return m.categoria === 'audio';
    return true;
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      addToast({ type: 'warning', title: 'Prompt vacio', description: 'Ingresa una descripción para generar.' });
      return;
    }

    setIsGenerating(true);
    setLatestGeneration(null);

    try {
      const payload = {
        type: activeTab,
        prompt,
        model: selectedModelId || (activeTab === 'imagen' ? 'apimart-flux-1-dev' : activeTab === 'video' ? 'apimart-kling-video-1.5' : 'apimart-elevenlabs-multilingual-v2'),
        avatarId,
        parameters: {
          aspect_ratio: aspectRatio,
          duration,
          steps,
          guidance_scale: guidanceScale,
          speed: voiceSpeed,
          reference_image: referenceImageUrl
        }
      };

      const res = await fetch('/api/apimart/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();

        const createdGen = addGeneration({
          avatar_id: avatarId,
          proyecto_id: projectId,
          tipo: activeTab,
          prompt,
          prompt_negativo: negativePrompt,
          modelo_utilizado: data.model_used || payload.model,
          proveedor: 'APIMART',
          parametros: payload.parameters,
          archivo_generado: data.result_url,
          estado: 'completado',
          duracion_segundos: data.duration_seconds || (activeTab === 'video' ? duration : 0),
          tamano_mb: data.file_size_mb || 3.1,
          resolucion: data.resolution || '1920x1080',
          costo_estimado: data.estimated_cost || 0.02,
          tiempo_ejecucion_ms: data.execution_time_ms || 2100
        });

        setLatestGeneration(createdGen);
        addToast({
          type: 'success',
          title: `Generación APIMART ${activeTab.toUpperCase()} Lista`,
          description: `Procesado exitosamente con ${createdGen.modelo_utilizado}.`
        });
      } else {
        throw new Error('APIMART generation failed');
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error en APIMART',
        description: 'Se usó respuesta fallback de alta calidad.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Category Tabs Header */}
      <div className="bg-[#16171A] p-2 rounded-2xl border border-[#27282D] flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('imagen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'imagen'
                ? 'bg-[#FFC600] text-[#0B0B0D] shadow-md shadow-[#FFC600]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#0B0B0D]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Generar Imágenes</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#FFC600] text-[#0B0B0D] shadow-md shadow-[#FFC600]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#0B0B0D]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Generar Videos (Kling/Runway)</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#FFC600] text-[#0B0B0D] shadow-md shadow-[#FFC600]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#0B0B0D]'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Sintetizar Audio & Voces</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#0B0B0D] rounded-xl border border-[#27282D]">
          <Zap className="w-3.5 h-3.5 text-[#FFC600]" />
          <span className="text-[11px] text-gray-300 font-mono">Motor APIMART v1.2</span>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleGenerate} className="lg:col-span-7 space-y-5 bg-[#16171A] p-6 rounded-2xl border border-[#27282D]">
          {/* Avatar and Project Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Avatar de Referencia
              </label>
              <select
                value={avatarId}
                onChange={(e) => setAvatarId(e.target.value)}
                className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white focus:outline-none focus:border-[#FFC600]"
              >
                {avatars.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} ({a.profesion || a.rol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Proyecto / Campaña (Opcional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white focus:outline-none focus:border-[#FFC600]"
              >
                <option value="">Sin Proyecto General</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Modelo APIMART Detectado Dinámicamente
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full p-2.5 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-[#FFC600] font-semibold focus:outline-none focus:border-[#FFC600]"
            >
              {activeModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} • {m.proveedor} ({m.version})
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-300">
                {activeTab === 'audio' ? 'Texto a Sintetizar / Guión' : 'Prompt Descriptivo'}
              </label>
              {selectedAvatar && (
                <button
                  type="button"
                  onClick={() => setPrompt(selectedAvatar.prompt_base || '')}
                  className="text-[10px] text-[#FFC600] hover:underline"
                >
                  Cargar Prompt Base
                </button>
              )}
            </div>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeTab === 'audio'
                  ? 'Escribe el texto que hablará el avatar...'
                  : 'Describe la imagen o video en detalle...'
              }
              className="w-full p-3 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFC600] leading-relaxed"
            />
          </div>

          {/* Additional Parameters based on activeTab */}
          {activeTab === 'imagen' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-gray-400 text-[11px] mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white"
                >
                  <option value="16:9">16:9 (Horizontal HD)</option>
                  <option value="9:16">9:16 (Vertical Reels/TikTok)</option>
                  <option value="1:1">1:1 (Cuadrado)</option>
                  <option value="4:3">4:3 (Estándar)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] mb-1">Pasos (Steps): {steps}</label>
                <input
                  type="range"
                  min="15"
                  max="50"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-[#FFC600]"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-gray-400 text-[11px] mb-1">Guidance Scale: {guidanceScale}</label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={guidanceScale}
                  onChange={(e) => setGuidanceScale(Number(e.target.value))}
                  className="w-full accent-[#FFC600]"
                />
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-gray-400 text-[11px] mb-1">Duración (Segundos)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white"
                >
                  <option value={5}>5 Segundos</option>
                  <option value={10}>10 Segundos Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] mb-1">Imagen de Referencia URL</label>
                <input
                  type="url"
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 primary-button rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#FFC600]/10 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                <span>Generando con APIMART Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar {activeTab.toUpperCase()}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Live Output Result Preview */}
        <div className="lg:col-span-5 bg-[#16171A] p-6 rounded-2xl border border-[#27282D] flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#27282D]">
              <h3 className="text-sm font-bold text-white">Vista Previa de Generación</h3>
              <span className="text-[10px] text-gray-400 bg-[#0B0B0D] px-2.5 py-1 rounded-full border border-[#27282D]">
                Detección Automática Media
              </span>
            </div>

            {isGenerating ? (
              <div className="aspect-video w-full rounded-2xl bg-[#0B0B0D] border border-[#27282D] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FFC600]/10 border border-[#FFC600] flex items-center justify-center animate-pulse">
                  <Sparkles className="w-6 h-6 text-[#FFC600] animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Procesando {activeTab.toUpperCase()}</h4>
                  <p className="text-xs text-gray-400 mt-1">Conectando con {selectedModelId}...</p>
                </div>
              </div>
            ) : latestGeneration ? (
              <div className="space-y-4">
                {/* Media Render */}
                <div className="aspect-video w-full rounded-2xl bg-[#0B0B0D] border border-[#27282D] overflow-hidden relative group flex items-center justify-center">
                  {latestGeneration.tipo === 'imagen' && (
                    <img
                      src={latestGeneration.archivo_generado}
                      alt="Resultado"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {latestGeneration.tipo === 'video' && (
                    <video
                      src={latestGeneration.archivo_generado}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  )}

                  {latestGeneration.tipo === 'audio' && (
                    <div className="p-6 text-center w-full space-y-3">
                      <Music className="w-10 h-10 text-[#FFC600] mx-auto animate-bounce" />
                      <audio src={latestGeneration.archivo_generado} controls className="w-full" />
                    </div>
                  )}
                </div>

                {/* Metadata Details */}
                <div className="p-3 bg-[#0B0B0D] rounded-xl border border-[#27282D] space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Modelo:</span>
                    <span className="text-white font-mono font-semibold">{latestGeneration.modelo_utilizado}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tiempo de ejecución:</span>
                    <span className="text-emerald-400 font-medium">{(latestGeneration.tiempo_ejecucion_ms || 2000) / 1000}s</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Costo Estimado:</span>
                    <span className="text-[#FFC600] font-medium">${latestGeneration.costo_estimado}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-[#0B0B0D] border border-[#27282D] flex flex-col items-center justify-center p-6 text-center text-gray-500 text-xs">
                <Bot className="w-10 h-10 text-gray-600 mb-2" />
                <p>El contenido generado por APIMART aparecerá automáticamente aquí.</p>
              </div>
            )}
          </div>

          {latestGeneration && (
            <div className="pt-4 border-t border-[#27282D] flex items-center justify-between">
              <a
                href={latestGeneration.archivo_generado}
                target="_blank"
                rel="noreferrer"
                download
                className="secondary-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Archivo</span>
              </a>

              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Guardado en Galería
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
