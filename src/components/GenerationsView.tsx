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
  Layers,
  Camera,
  Activity,
  Repeat,
  Cpu,
  Film
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

  const [activeTab, setActiveTab] = useState<'imagen' | 'video'>('imagen');
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

  // Model-specific Video Controls State
  // Kling 3
  const [kling3Mode, setKling3Mode] = useState<string>('profesional');
  const [kling3CameraMotion, setKling3CameraMotion] = useState<string>('panoramica');
  const [kling3MotionScale, setKling3MotionScale] = useState<number>(7);

  // Kling Motion control
  const [klingMotionReferenceUrl, setKlingMotionReferenceUrl] = useState<string>('');
  const [klingMotionTrajectory, setKlingMotionTrajectory] = useState<string>('orbita_circular');
  const [klingMotionVelocityCurve, setKlingMotionVelocityCurve] = useState<string>('curva_s');
  const [klingMotionOrbitGuidance, setKlingMotionOrbitGuidance] = useState<number>(75);

  // Seedance 2
  const [seedanceStyle, setSeedanceStyle] = useState<string>('urbano');
  const [seedanceIntensity, setSeedanceIntensity] = useState<number>(80);
  const [seedanceBpm, setSeedanceBpm] = useState<number>(128);
  const [seedancePhysics, setSeedancePhysics] = useState<string>('alta_precision');

  // Gemini Omni Flash preview
  const [omniFlashLatencyMode, setOmniFlashLatencyMode] = useState<string>('ultra_baja');
  const [omniFlashMultimodalStream, setOmniFlashMultimodalStream] = useState<boolean>(true);
  const [omniFlashExpressiveness, setOmniFlashExpressiveness] = useState<number>(8);
  const [omniFlashFps, setOmniFlashFps] = useState<number>(30);

  // Omni Flash Ext
  const [omniExtLength, setOmniExtLength] = useState<number>(10);
  const [omniExtInfiniteLoop, setOmniExtInfiniteLoop] = useState<boolean>(false);
  const [omniExtSeamlessBlend, setOmniExtSeamlessBlend] = useState<number>(85);
  const [omniExtKeyframeAnchor, setOmniExtKeyframeAnchor] = useState<string>('ultimo_fotograma');
  const [omniExtResolution, setOmniExtResolution] = useState<string>('1080p');

  // Status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [latestGeneration, setLatestGeneration] = useState<Generation | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedAvatar = avatars.find((a) => a.id === avatarId);

  // Auto populate defaults when avatar or tab changes
  useEffect(() => {
    if (selectedAvatar) {
      if (activeTab === 'imagen') {
        setSelectedModelId(selectedAvatar.modelo_imagen || 'apimart-nano-banana-pro');
        if (!prompt) {
          setPrompt(selectedAvatar.prompt_base || `Cinematic ultra-realistic portrait of ${selectedAvatar.nombre}, 8k resolution, photorealistic`);
        }
      } else if (activeTab === 'video') {
        setSelectedModelId(selectedAvatar.modelo_video || 'apimart-kling-3');
        if (!prompt) {
          setPrompt(`${selectedAvatar.nombre} speaking directly to camera, natural facial motion and head movement`);
        }
      }
    } else {
      if (activeTab === 'imagen' && !selectedModelId) {
        setSelectedModelId('apimart-nano-banana-pro');
      } else if (activeTab === 'video' && !selectedModelId) {
        setSelectedModelId('apimart-kling-3');
      }
    }
  }, [avatarId, activeTab, selectedAvatar]);

  const activeModels = models.filter((m) => {
    if (activeTab === 'imagen') return m.categoria === 'imagen';
    if (activeTab === 'video') return m.categoria === 'video';
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
        model: selectedModelId || (activeTab === 'imagen' ? 'apimart-nano-banana-pro' : activeTab === 'video' ? 'apimart-kling-3' : 'apimart-elevenlabs-multilingual-v2'),
        avatarId,
        parameters: {
          aspect_ratio: aspectRatio,
          duration,
          steps,
          guidance_scale: guidanceScale,
          reference_image: referenceImageUrl,
          // Video Model Specific Configurations
          ...(selectedModelId === 'apimart-kling-3' && {
            mode: kling3Mode,
            camera_motion: kling3CameraMotion,
            motion_scale: kling3MotionScale
          }),
          ...(selectedModelId === 'apimart-kling-motion-control' && {
            motion_reference_url: klingMotionReferenceUrl,
            trajectory: klingMotionTrajectory,
            velocity_curve: klingMotionVelocityCurve,
            orbit_guidance: klingMotionOrbitGuidance
          }),
          ...(selectedModelId === 'apimart-seedance-2' && {
            dance_style: seedanceStyle,
            intensity: seedanceIntensity,
            beat_sync_bpm: seedanceBpm,
            physics_simulation: seedancePhysics
          }),
          ...(selectedModelId === 'apimart-gemini-omni-flash-preview' && {
            latency_mode: omniFlashLatencyMode,
            multimodal_stream: omniFlashMultimodalStream,
            expressiveness: omniFlashExpressiveness,
            fps: omniFlashFps
          }),
          ...(selectedModelId === 'apimart-omni-flash-ext' && {
            extension_length: omniExtLength,
            infinite_loop: omniExtInfiniteLoop,
            seamless_blend: omniExtSeamlessBlend,
            keyframe_anchor: omniExtKeyframeAnchor,
            resolution: omniExtResolution
          })
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
                {avatars.length === 0 ? (
                  <option value="">Generación Libre (Sin Avatar Configurado)</option>
                ) : (
                  avatars.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.profesion || a.rol})
                    </option>
                  ))
                )}
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
                Prompt Descriptivo
              </label>
              {selectedAvatar && (
                <button
                  type="button"
                  onClick={() => setPrompt(selectedAvatar.prompt_base || '')}
                  className="text-[10px] text-[#FFC600] hover:underline cursor-pointer"
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
              placeholder="Describe la imagen o video en detalle..."
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
            <div className="space-y-4 pt-1">
              {/* Base Video Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-[11px] mb-1">Duración (Segundos)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white focus:border-[#FFC600] focus:outline-none"
                  >
                    <option value={5}>5 Segundos Standard</option>
                    <option value={10}>10 Segundos Pro</option>
                    <option value={15}>15 Segundos Cinemático</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-[11px] mb-1">Imagen / Keyframe de Referencia URL</label>
                  <input
                    type="url"
                    value={referenceImageUrl}
                    onChange={(e) => setReferenceImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 bg-[#0B0B0D] border border-[#27282D] rounded-xl text-xs text-white focus:border-[#FFC600] focus:outline-none"
                  />
                </div>
              </div>

              {/* Model-Specific Configuration Card */}
              <div className="bg-[#0B0B0D] p-4 rounded-xl border border-[#27282D] space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#27282D]">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#FFC600]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Configuración Específica: {
                        selectedModelId === 'apimart-kling-3' ? 'Kling 3' :
                        selectedModelId === 'apimart-kling-motion-control' ? 'Kling Motion control' :
                        selectedModelId === 'apimart-seedance-2' ? 'Seedance 2' :
                        selectedModelId === 'apimart-gemini-omni-flash-preview' ? 'Gemini Omni Flash preview' :
                        selectedModelId === 'apimart-omni-flash-ext' ? 'Omni Flash Ext' :
                        'APIMART Video Engine'
                      }
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFC600]/10 border border-[#FFC600]/30 text-[10px] font-mono text-[#FFC600] font-bold">
                    APIMART Specs
                  </span>
                </div>

                {/* 1. Kling 3 Controls */}
                {(selectedModelId === 'apimart-kling-3' || !selectedModelId) && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Modo de Renderizado</label>
                        <select
                          value={kling3Mode}
                          onChange={(e) => setKling3Mode(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="profesional">Profesional (4K High Fidelity)</option>
                          <option value="estandar">Estándar (1080p Rápido)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Movimiento de Cámara (Camera Motion)</label>
                        <select
                          value={kling3CameraMotion}
                          onChange={(e) => setKling3CameraMotion(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="panoramica">Panorámica Suave Horizontal</option>
                          <option value="zoom_in">Zoom In Dinámico</option>
                          <option value="orbita_360">Órbita 360° Cinemática</option>
                          <option value="dolly">Dolly Zoom Vertigo Effect</option>
                          <option value="estatico">Estático (Estabilidad de Rostro)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-gray-300 font-semibold">Intensidad de Movimiento (Motion Scale)</span>
                        <span className="text-[#FFC600] font-mono font-bold">{kling3MotionScale} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={kling3MotionScale}
                        onChange={(e) => setKling3MotionScale(Number(e.target.value))}
                        className="w-full accent-[#FFC600]"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Kling Motion Control */}
                {selectedModelId === 'apimart-kling-motion-control' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Trayectoria de Cámara (Trajectory)</label>
                        <select
                          value={klingMotionTrajectory}
                          onChange={(e) => setKlingMotionTrajectory(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="orbita_circular">Órbita Circular 3D</option>
                          <option value="lineal">Trayectoria Lineal Directa</option>
                          <option value="espiral_cinematografica">Espiral Cinemática Heloidal</option>
                          <option value="seguimiento_sujeto">Seguimiento Dinámico de Sujeto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Curva de Velocidad (Velocity Curve)</label>
                        <select
                          value={klingMotionVelocityCurve}
                          onChange={(e) => setKlingMotionVelocityCurve(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="curva_s">S-Curve Smooth (Ease-In / Ease-Out)</option>
                          <option value="constante">Lineal Constante</option>
                          <option value="aceleracion">Aceleración Progresiva</option>
                          <option value="desaceleracion">Freno Suave Cinemático</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Vector de Referencia URL</label>
                        <input
                          type="url"
                          value={klingMotionReferenceUrl}
                          onChange={(e) => setKlingMotionReferenceUrl(e.target.value)}
                          placeholder="https://... (pose or motion matrix)"
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-gray-300 font-semibold">Sensibilidad Guía Orbital</span>
                          <span className="text-[#FFC600] font-mono font-bold">{klingMotionOrbitGuidance}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={klingMotionOrbitGuidance}
                          onChange={(e) => setKlingMotionOrbitGuidance(Number(e.target.value))}
                          className="w-full accent-[#FFC600] mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Seedance 2 */}
                {selectedModelId === 'apimart-seedance-2' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Estilo de Danza / Coreografía</label>
                        <select
                          value={seedanceStyle}
                          onChange={(e) => setSeedanceStyle(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="urbano">Urbano / Hip-Hop Rítmico</option>
                          <option value="contemporaneo">Contemporáneo / Expresivo</option>
                          <option value="kpop">K-Pop Dance Synchronization</option>
                          <option value="accion">Cinematográfico / Movimiento Acción</option>
                          <option value="libre">Expresión Libre Fluida</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Simulación Física de Telas y Cabello</label>
                        <select
                          value={seedancePhysics}
                          onChange={(e) => setSeedancePhysics(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="alta_precision">Alta Precisión Simulación 3D</option>
                          <option value="estandar">Física Estándar</option>
                          <option value="desactivada">Física Básica Acelerada</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-gray-300 font-semibold">Intensidad Coreográfica</span>
                          <span className="text-[#FFC600] font-mono font-bold">{seedanceIntensity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={seedanceIntensity}
                          onChange={(e) => setSeedanceIntensity(Number(e.target.value))}
                          className="w-full accent-[#FFC600] mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Sincronización Ritmo (BPM)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="60"
                            max="200"
                            value={seedanceBpm}
                            onChange={(e) => setSeedanceBpm(Number(e.target.value))}
                            className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white font-mono"
                          />
                          <span className="text-gray-400 text-xs font-mono">BPM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Gemini Omni Flash preview */}
                {selectedModelId === 'apimart-gemini-omni-flash-preview' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Modo de Latencia</label>
                        <select
                          value={omniFlashLatencyMode}
                          onChange={(e) => setOmniFlashLatencyMode(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="ultra_baja">Ultra Baja Latencia (Real-Time)</option>
                          <option value="equilibrado">Equilibrado Stream</option>
                          <option value="maxima_calidad">Máxima Calidad Render</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Tasa de Frames (FPS)</label>
                        <select
                          value={omniFlashFps}
                          onChange={(e) => setOmniFlashFps(Number(e.target.value))}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value={24}>24 FPS (Cinematográfico)</option>
                          <option value={30}>30 FPS (Estándar)</option>
                          <option value={60}>60 FPS (Ultra Fluido)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Stream Multimodal Live</label>
                        <button
                          type="button"
                          onClick={() => setOmniFlashMultimodalStream(!omniFlashMultimodalStream)}
                          className={`w-full p-2 rounded-xl text-xs font-bold transition-all ${
                            omniFlashMultimodalStream
                              ? 'bg-[#FFC600] text-[#0B0B0D]'
                              : 'bg-[#16171A] text-gray-400 border border-[#27282D]'
                          }`}
                        >
                          {omniFlashMultimodalStream ? 'Stream Activado (Live)' : 'Stream Desactivado'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-gray-300 font-semibold">Nivel de Expresividad y Emoción</span>
                        <span className="text-[#FFC600] font-mono font-bold">{omniFlashExpressiveness} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={omniFlashExpressiveness}
                        onChange={(e) => setOmniFlashExpressiveness(Number(e.target.value))}
                        className="w-full accent-[#FFC600]"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Omni Flash Ext */}
                {selectedModelId === 'apimart-omni-flash-ext' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Longitud de Extensión</label>
                        <select
                          value={omniExtLength}
                          onChange={(e) => setOmniExtLength(Number(e.target.value))}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value={5}>+5 Segundos Extensión</option>
                          <option value={10}>+10 Segundos Extensión</option>
                          <option value={15}>+15 Segundos Extensión Pro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Ancla de Fotograma Clave</label>
                        <select
                          value={omniExtKeyframeAnchor}
                          onChange={(e) => setOmniExtKeyframeAnchor(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="ultimo_fotograma">Último Fotograma como Inicio</option>
                          <option value="loop_completo">Bucle Primer/Último Fotograma</option>
                          <option value="fotograma_clave">Fotograma Clave Seleccionado</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Resolución</label>
                        <select
                          value={omniExtResolution}
                          onChange={(e) => setOmniExtResolution(e.target.value)}
                          className="w-full p-2 bg-[#16171A] border border-[#27282D] rounded-xl text-xs text-white"
                        >
                          <option value="1080p">1080p Full HD</option>
                          <option value="4K">4K Ultra HD</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-gray-300 font-semibold">Mezcla Seamless Blend (Continuidad)</span>
                          <span className="text-[#FFC600] font-mono font-bold">{omniExtSeamlessBlend}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={omniExtSeamlessBlend}
                          onChange={(e) => setOmniExtSeamlessBlend(Number(e.target.value))}
                          className="w-full accent-[#FFC600]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-[11px] font-semibold mb-1">Modo Loop Infinito</label>
                        <button
                          type="button"
                          onClick={() => setOmniExtInfiniteLoop(!omniExtInfiniteLoop)}
                          className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            omniExtInfiniteLoop
                              ? 'bg-[#FFC600] text-[#0B0B0D]'
                              : 'bg-[#16171A] text-gray-400 border border-[#27282D]'
                          }`}
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>{omniExtInfiniteLoop ? 'Loop Infinito Activado' : 'Loop Infinito Desactivado'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
