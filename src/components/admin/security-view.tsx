'use client';

import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { updateAdminPasswordAction } from '@/lib/actions/admin-actions';

export function SecurityView() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
      } else {
        await updateAdminPasswordAction(newPassword);
      }

      toast.success('Admin password updated successfully! Next login will require this new password.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />
          <span>Security &amp; Admin Authentication</span>
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Manage admin account password and Supabase Row-Level Security session protection
        </p>
      </div>

      {/* Password Update Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">
              Change Admin Password
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
              Account: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">admin@olehidavis.dev</span>
            </p>
          </div>
          <Lock className="w-4 h-4 text-[var(--accent)]" />
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 font-mono text-xs">
            <p className="text-[10px] text-zinc-500">
              Password updates immediately in Supabase Auth.
            </p>
            <button
              type="submit"
              disabled={isUpdatingPassword || !newPassword}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-black flex items-center justify-center gap-1.5 shadow transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
