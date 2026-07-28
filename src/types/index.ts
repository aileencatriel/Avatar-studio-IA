export type MediaCategory = 'imagen' | 'video' | 'texto' | 'json';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  fecha_creacion: string;
  avatar_url?: string;
  rol?: string;
}

export interface Avatar {
  id: string;
  usuario_id: string;
  nombre: string;
  descripcion: string;
  historia?: string;
  personalidad: string;
  temperamento?: string;
  memoria?: string;
  objetivos?: string;
  contexto?: string;
  estilo_respuesta?: string;
  instrucciones: string;
  imagen_principal: string;
  voz?: string;
  modelo_video: string;
  modelo_imagen: string;
  modelo_audio?: string;
  idioma: string;
  tono: string;
  edad_aparente: string;
  genero: string;
  estilo_visual: string;
  profesion?: string;
  rol?: string;
  nivel_creatividad?: number; // 0.0 - 1.0
  longitud_respuestas?: 'corta' | 'media' | 'larga' | 'detallada';
  prompt_base?: string;
  prompt_negativo?: string;
  modelos_favoritos?: string[];
  configuraciones_defecto?: Record<string, any>;
  fecha_creacion: string;
}

export interface Project {
  id: string;
  avatar_id?: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  estado?: 'activo' | 'completado' | 'en_pausa';
  color?: string;
  notas?: string;
  tags?: string[];
}

export interface Generation {
  id: string;
  avatar_id?: string;
  proyecto_id?: string;
  tipo: MediaCategory;
  prompt: string;
  prompt_negativo?: string;
  modelo_utilizado: string;
  proveedor?: string;
  parametros: Record<string, any>;
  fecha: string;
  archivo_generado: string; // URL or Base64 or stream reference
  estado: 'pendiente' | 'procesando' | 'completado' | 'fallido';
  duracion_segundos?: number;
  tamano_mb?: number;
  resolucion?: string;
  costo_estimado?: number;
  tiempo_ejecucion_ms?: number;
  metadatos?: Record<string, any>;
}

export interface FileAsset {
  id: string;
  generacion_id?: string;
  avatar_id?: string;
  proyecto_id?: string;
  nombre: string;
  tipo: MediaCategory;
  url: string;
  tamano: string; // e.g., "2.4 MB"
  duracion?: string; // e.g., "00:15"
  resolucion?: string; // e.g., "1080x1920"
  fecha: string;
  formato: string; // e.g., "png", "mp4"
}

export interface AIModel {
  id: string;
  nombre: string;
  proveedor: string; // e.g., "APIMART", "OpenAI", "Stability", "Midjourney"
  categoria: 'imagen' | 'video' | 'multimodal' | 'lenguaje';
  descripcion: string;
  version: string;
  parametros_admitidos: string[];
  estado: 'activo' | 'inactivo';
  limites?: string;
  capacidades?: string[];
  es_favorito?: boolean;
}

export interface AppSettings {
  apimartApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  defaultImageModel: string;
  defaultVideoModel: string;
  defaultLanguageModel: string;
  theme: 'dark';
  autoSaveGenerations: boolean;
  activeProvider: string; // 'APIMART' | 'OpenAI' | 'Replicate' | 'FalAI'
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
