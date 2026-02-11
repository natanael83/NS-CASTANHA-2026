import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, UserPlus, LogIn, Github, ArrowRight } from 'lucide-react';

interface AuthProps {
    onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Verifique seu e-mail para confirmar o cadastro!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro na autenticação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/10 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 border border-white/20 shadow-2xl overflow-hidden relative group">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-colors duration-1000" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors duration-1000" />

                <div className="relative z-10 text-center mb-10">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3 group-hover:rotate-6 transition-transform">
                        <Lock className="w-8 h-8 text-emerald-900" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">
                        {isRegistering ? 'Criar Conta' : 'Bem-vindo de Volta'}
                    </h2>
                    <p className="text-emerald-100/60 text-sm font-medium">
                        {isRegistering
                            ? 'Junte-se a nós para a melhor experiência gourmet.'
                            : 'Acesse sua conta para gerenciar seus pedidos.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-2xl p-4 mb-6 animate-shake">
                        <p className="text-red-200 text-xs font-bold leading-tight">{error}</p>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4 relative z-10">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                            required
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                            required
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-emerald-950 h-14 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {isRegistering ? 'Criar Conta' : 'Entrar'}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-white/60 hover:text-white text-sm font-bold transition-colors"
                    >
                        {isRegistering
                            ? 'Já tem uma conta? Entre aqui'
                            : 'Não tem conta? Crie uma agora'}
                    </button>
                </div>
            </div>
        </div>
    );
};
