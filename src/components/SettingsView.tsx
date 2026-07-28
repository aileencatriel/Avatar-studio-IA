import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Settings,
  Key,
  Database,
  Globe,
  Sliders,
  ShieldAlert,
  Save,
  Check,
  Zap,
  Layers,
  Server
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, addToast, creditsData, fetchApimartCredits } = useAppStore();

  const [apimartApiKey, setApimartApiKey] = useState(settings.apimartApiKey || '');
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabaseAnonKey || '');
  const [activeProvider, setActiveProvider] = useState(settings.activeProvider || 'APIMART');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== 'undefined') {
      localStorage.setItem('avatar_studio_apimart_key', apimartApiKey);
      localStorage.setItem('avatar_studio_supabase_url', supabaseUrl);
      localStorage.setItem('avatar_studio_supabase_anon_key', supabaseAnonKey);
    }

    updateSettings({
      apimartApiKey,
      supabaseUrl,
      supabaseAnonKey,
      activeProvider
    });
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="bg-[#16171A] p-6 rounded-2xl border border-[#27282D]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#27282D]">
          <div className="p-2.5 rounded-xl bg-[#FFC600]/10 text-[#FFC600]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Configuración Global de Avatar Studio AI</h2>
            <p className="text-xs text-gray-400">Credenciales de APIMART, Supabase y Adaptadores de IA</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* APIMART Credentials */}
          <div className="space-y-4 bg-[#0B0B0D] p-4 rounded-xl border border-[#27282D]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Zap className="w-4 h-4 text-[#FFC600]" />
                <span>APIMART API Secret Key & Créditos</span>
              </div>
              <button
                type="button"
                onClick={() => fetchApimartCredits()}
                disabled={creditsData.loading}
                className="px-3 py-1 rounded-lg bg-[#FFC600]/10 hover:bg-[#FFC600]/20 text-[#FFC600] font-bold text-[11px] border border-[#FFC600]/30 transition-colors cursor-pointer"
              >
                {creditsData.loading ? 'Consultando...' : 'Verificar Créditos'}
              </button>
            </div>

            <p className="text-gray-400">
              La API Key de APIMART se utiliza en el servidor para comunicarse de forma segura y consultar el saldo de tu cuenta.
            </p>

            <input
              type="password"
              value={apimartApiKey}
              onChange={(e) => setApimartApiKey(e.target.value)}
              placeholder="apimart_sk_••••••••••••••••••••"
              className="w-full p-2.5 bg-[#16171A] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-white font-mono"
            />

            {/* Live Credit Summary Box */}
            <div className="p-3.5 bg-[#16171A] rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Balance de Créditos APIMART</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  {creditsData.remaining.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {creditsData.total.toLocaleString()} créditos</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Plan: <span className="text-gray-300 font-semibold">{creditsData.plan}</span>
                </p>
              </div>

              <div className="w-full sm:w-36 flex flex-col items-end">
                <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#FFC600] font-bold mb-1">
                  <span>Disponible</span>
                  <span>{creditsData.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFC600] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, creditsData.percentage))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Supabase Credentials */}
          <div className="space-y-3 bg-[#0B0B0D] p-4 rounded-xl border border-[#27282D]">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Database className="w-4 h-4 text-[#7644C6]" />
              <span>Configuración Supabase (Base de Datos & Auth)</span>
            </div>
            <p className="text-gray-400">
              Si configuras tu proyecto de Supabase, la plataforma sincronizará los usuarios y las tablas automáticamente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Supabase Project URL</label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full p-2.5 bg-[#16171A] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiI..."
                  className="w-full p-2.5 bg-[#16171A] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* AI Providers Extensibility */}
          <div className="space-y-3 bg-[#0B0B0D] p-4 rounded-xl border border-[#27282D]">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Server className="w-4 h-4 text-[#F81878]" />
              <span>Proveedor Principal Adaptable</span>
            </div>
            <p className="text-gray-400">
              Arquitectura extensible para cambiar de proveedor principal de IA manteniendo la interfaz común.
            </p>
            <select
              value={activeProvider}
              onChange={(e) => setActiveProvider(e.target.value)}
              className="w-full p-2.5 bg-[#16171A] border border-[#27282D] rounded-xl text-white font-semibold focus:outline-none"
            >
              <option value="APIMART">APIMART Enterprise (Predeterminado Recomendado)</option>
              <option value="OpenAI">OpenAI Direct Adapter</option>
              <option value="Replicate">Replicate Adapter</option>
              <option value="FalAI">Fal AI Adapter</option>
              <option value="Runway">Runway Gen-3 Adapter</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="primary-button px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FFC600]/10"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
