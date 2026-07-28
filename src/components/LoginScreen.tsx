import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Lock, Mail, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, loginError } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    await login(email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B0D] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7644C6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FFC600]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#16171A] p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFC600] to-[#F81878] flex items-center justify-center mb-3 shadow-lg shadow-[#FFC600]/10">
            <Zap className="w-7 h-7 text-black fill-black" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Avatar Studio AI</h1>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Acceso a la Plataforma</p>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-[#0B0B0D] rounded-xl border border-white/5 flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[#FFC600] shrink-0" />
          <span className="text-xs text-white/60">Ingresa con tus credenciales de Supabase o administrador.</span>
        </div>

        {/* Error Alert */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium"
          >
            {loginError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu_email@dominio.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0D] border border-white/10 focus:border-[#FFC600] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0D] border border-white/10 focus:border-[#FFC600] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-[#FFC600] text-[#0B0B0D] hover:bg-[#e0af00] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FFC600]/10 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center border-t border-white/5 pt-4">
          <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
            AVATAR STUDIO AI • POWERED BY APIMART
          </p>
        </div>
      </motion.div>
    </div>
  );
};

