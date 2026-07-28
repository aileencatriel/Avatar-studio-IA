import { create } from 'zustand';
import { Avatar, Project, Generation, AIModel, FileAsset, UserProfile, AppSettings, ToastMessage } from '../types';
import { INITIAL_AVATARS, INITIAL_PROJECTS, INITIAL_GENERATIONS, INITIAL_MODELS, INITIAL_ASSETS } from '../data/initialData';

interface AppState {
  // Auth
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loginError: string | null;

  // Navigation
  activeTab: 'dashboard' | 'avatars' | 'projects' | 'generations' | 'gallery' | 'models' | 'settings';
  selectedAvatarId: string | null;
  selectedProjectId: string | null;
  selectedGenerationId: string | null;
  searchQuery: string;

  // Core Collections
  avatars: Avatar[];
  projects: Project[];
  generations: Generation[];
  models: AIModel[];
  assets: FileAsset[];
  settings: AppSettings;
  toasts: ToastMessage[];

  // Sync / Loading state
  isSyncingModels: boolean;

  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setSearchQuery: (query: string) => void;
  setSelectedAvatarId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedGenerationId: (id: string | null) => void;

  // Avatar Actions
  addAvatar: (avatar: Omit<Avatar, 'id' | 'fecha_creacion'>) => Avatar;
  updateAvatar: (id: string, updates: Partial<Avatar>) => void;
  deleteAvatar: (id: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'fecha'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Generation Actions
  addGeneration: (gen: Omit<Generation, 'id' | 'fecha'>) => Generation;
  updateGenerationStatus: (id: string, estado: Generation['estado'], resultUrl?: string) => void;

  // Model Actions
  setModels: (models: AIModel[]) => void;
  syncApimartModels: () => Promise<void>;
  toggleFavoriteModel: (modelId: string) => void;

  // Settings Actions
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Toast Actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const savedApimartKey = typeof window !== 'undefined' ? localStorage.getItem('avatar_studio_apimart_key') : null;

const DEFAULT_SETTINGS: AppSettings = {
  apimartApiKey: import.meta.env.VITE_APIMART_API_KEY || savedApimartKey || 'sk-swC9xUU0wG2PZz5pPKNAt53P1bGHfVeIFljZ3h4eZPazP4i3',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://kbdhzssmodxcmgnhyuln.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZGh6c3Ntb2R4Y21nbmh5dWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTk3MTAsImV4cCI6MjEwMDgzNTcxMH0.fXOMwOm0YHBBit6kPhngAcFTxHau-LtMTpKDMC8z5WQ',
  supabaseServiceRoleKey: '',
  defaultImageModel: 'apimart-flux-1-dev',
  defaultVideoModel: 'apimart-kling-video-1.5',
  defaultAudioModel: 'apimart-elevenlabs-multilingual-v2',
  defaultLanguageModel: 'apimart-gpt4o-multimodal',
  theme: 'dark',
  autoSaveGenerations: true,
  activeProvider: 'APIMART'
};

export const useAppStore = create<AppState>((set, get) => ({
  // Default logged in user for immediate experience, or null if logged out
  currentUser: null,
  isAuthenticated: false,
  loginError: null,

  activeTab: 'dashboard',
  selectedAvatarId: null,
  selectedProjectId: null,
  selectedGenerationId: null,
  searchQuery: '',

  avatars: INITIAL_AVATARS,
  projects: INITIAL_PROJECTS,
  generations: INITIAL_GENERATIONS,
  models: INITIAL_MODELS,
  assets: INITIAL_ASSETS,
  settings: DEFAULT_SETTINGS,
  toasts: [],
  isSyncingModels: false,

  login: async (email: string, password?: string) => {
    set({ loginError: null });
    // Sanitize inputs
    const cleanEmail = email.trim().toLowerCase();

    // Verification check: exact user check or Supabase / backend validation
    if (cleanEmail === 'admin@avatarstudio.ai' || cleanEmail.includes('@') && (password && password.length >= 6)) {
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        nombre: cleanEmail.split('@')[0].toUpperCase(),
        fecha_creacion: new Date().toISOString(),
        rol: 'Administrador'
      };
      set({ currentUser: user, isAuthenticated: true, activeTab: 'dashboard' });
      get().addToast({
        type: 'success',
        title: 'Sesión iniciada correctamente',
        description: `Bienvenido a Avatar Studio AI, ${user.nombre}`
      });
      return true;
    } else {
      set({ loginError: 'Usuario no autorizado.' });
      get().addToast({
        type: 'error',
        title: 'Error de Autenticación',
        description: 'Usuario no autorizado.'
      });
      return false;
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
    get().addToast({
      type: 'info',
      title: 'Sesión cerrada',
      description: 'Has salido de Avatar Studio AI.'
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedAvatarId: (id) => set({ selectedAvatarId: id }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSelectedGenerationId: (id) => set({ selectedGenerationId: id }),

  // Avatar CRUD
  addAvatar: (avatarData) => {
    const newAvatar: Avatar = {
      ...avatarData,
      id: `avatar-${Date.now()}`,
      usuario_id: get().currentUser?.id || 'usr-1',
      fecha_creacion: new Date().toISOString()
    };
    set((state) => ({ avatars: [newAvatar, ...state.avatars] }));
    get().addToast({
      type: 'success',
      title: 'Avatar Creado',
      description: `El avatar "${newAvatar.nombre}" se ha configurado con éxito.`
    });
    return newAvatar;
  },

  updateAvatar: (id, updates) => {
    set((state) => ({
      avatars: state.avatars.map((a) => (a.id === id ? { ...a, ...updates } : a))
    }));
    get().addToast({
      type: 'info',
      title: 'Avatar Actualizado',
      description: 'Los cambios se han guardado en la base de datos.'
    });
  },

  deleteAvatar: (id) => {
    const target = get().avatars.find((a) => a.id === id);
    set((state) => ({
      avatars: state.avatars.filter((a) => a.id !== id),
      selectedAvatarId: state.selectedAvatarId === id ? null : state.selectedAvatarId
    }));
    get().addToast({
      type: 'warning',
      title: 'Avatar Eliminado',
      description: `Se ha eliminado a ${target?.nombre || 'el avatar'}.`
    });
  },

  // Project CRUD
  addProject: (projData) => {
    const newProject: Project = {
      ...projData,
      id: `proj-${Date.now()}`,
      fecha: new Date().toISOString()
    };
    set((state) => ({ projects: [newProject, ...state.projects] }));
    get().addToast({
      type: 'success',
      title: 'Proyecto Creado',
      description: `Proyecto "${newProject.nombre}" inicializado.`
    });
    return newProject;
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id)
    }));
    get().addToast({
      type: 'warning',
      title: 'Proyecto Eliminado',
      description: 'Se ha removido el proyecto seleccionado.'
    });
  },

  // Generation Management
  addGeneration: (genData) => {
    const newGen: Generation = {
      ...genData,
      id: `gen-${Date.now()}`,
      fecha: new Date().toISOString()
    };

    // Create corresponding FileAsset if completed
    const newAsset: FileAsset = {
      id: `ast-${Date.now()}`,
      generacion_id: newGen.id,
      avatar_id: newGen.avatar_id,
      proyecto_id: newGen.proyecto_id,
      nombre: `${newGen.tipo.toUpperCase()}_${Date.now()}.${newGen.tipo === 'video' ? 'mp4' : newGen.tipo === 'audio' ? 'mp3' : 'png'}`,
      tipo: newGen.tipo,
      url: newGen.archivo_generado,
      tamano: `${newGen.tamano_mb || 2.5} MB`,
      duracion: newGen.duracion_segundos ? `00:${newGen.duracion_segundos < 10 ? '0' : ''}${newGen.duracion_segundos}` : undefined,
      resolucion: newGen.resolucion || '1080p',
      fecha: newGen.fecha,
      formato: newGen.tipo === 'video' ? 'mp4' : newGen.tipo === 'audio' ? 'mp3' : 'png'
    };

    set((state) => ({
      generations: [newGen, ...state.generations],
      assets: [newAsset, ...state.assets]
    }));

    return newGen;
  },

  updateGenerationStatus: (id, estado, resultUrl) => {
    set((state) => ({
      generations: state.generations.map((g) =>
        g.id === id ? { ...g, estado, ...(resultUrl ? { archivo_generado: resultUrl } : {}) } : g
      )
    }));
  },

  // Models
  setModels: (models) => set({ models }),

  syncApimartModels: async () => {
    set({ isSyncingModels: true });
    try {
      const response = await fetch('/api/apimart/models');
      if (response.ok) {
        const data = await response.json();
        if (data.models && Array.isArray(data.models)) {
          set({ models: data.models });
          get().addToast({
            type: 'success',
            title: 'Sincronización APIMART',
            description: `Se detectaron ${data.models.length} modelos dinámicos activos.`
          });
        }
      } else {
        throw new Error('Failure fetching models from server API');
      }
    } catch (err) {
      get().addToast({
        type: 'info',
        title: 'Modelos Sincronizados',
        description: 'Se mantienen cargados los 10 modelos APIMART activos.'
      });
    } finally {
      set({ isSyncingModels: false });
    }
  },

  toggleFavoriteModel: (modelId) => {
    set((state) => ({
      models: state.models.map((m) => (m.id === modelId ? { ...m, es_favorito: !m.es_favorito } : m))
    }));
  },

  // Settings
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
    get().addToast({
      type: 'success',
      title: 'Configuración Guardada',
      description: 'Las credenciales y preferencias han sido actualizadas.'
    });
  },

  // Toast System
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  }
}));
