import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Lock, Mail, Bot, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, loginError } = useAppStore();
  const [email, setEmail] = useState('admin@avatarstudio.ai');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // smooth experience
    await login(email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B0D] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7644C6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FFC600]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl border border-[#27282D] shadow-2xl relative z-10"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7644C6] to-[#FFC600] p-0.5 mb-4 shadow-lg shadow-[#7644C6]/20">
            <div className="w-full h-full bg-[#0B0B0D] rounded-[14px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-[#FFC600]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Avatar Studio AI</h1>
          <p className="text-xs text-gray-400 mt-1">Plataforma Privada de Gestión de Avatares IA</p>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-3 bg-[#16171A] rounded-xl border border-[#27282D] flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#FFC600] shrink-0" />
          <span className="text-xs text-gray-300">Acceso restringido para usuarios autorizados en Supabase.</span>
        </div>

        {/* Error Alert */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium"
          >
            {loginError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0D] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0D] border border-[#27282D] focus:border-[#FFC600] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3 px-4 primary-button rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#27282D] pt-4">
          <p className="text-[11px] text-gray-500">
            Avatar Studio AI v2.4 Pro • Integración APIMART & Supabase
          </p>
        </div>
      </motion.div>
    </div>
  );
};
