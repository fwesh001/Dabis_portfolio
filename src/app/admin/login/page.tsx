'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, KeyRound, Loader2, ArrowRight } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('admin@olehidavis.dev');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        // Fallback for demo mode
        toast.success('Logged in (Demo Mode fallback)!');
        router.push(redirectTo);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.success('Authenticated successfully!');
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error(`Authentication error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 mx-auto flex items-center justify-center font-mono font-bold text-base text-[var(--accent)] shadow-md">
          OD
        </div>
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Admin Authentication</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5 text-xs font-mono">
          <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admin Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@olehidavis.dev"
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
            <span>Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-xs font-mono font-semibold text-black shadow-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In to Admin CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/20">
      <Suspense
        fallback={
          <div className="w-full max-w-sm p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
