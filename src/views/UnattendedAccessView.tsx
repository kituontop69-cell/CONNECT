import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export const UnattendedAccessView: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      setSaved(true);
      setIsEnabled(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Unattended Access Gate
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure a master password to access this machine remotely without anyone present to approve the prompt.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.06]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Enable Unattended Access</h4>
              <p className="text-xs text-zinc-400">
                Allows authorized clients to connect using a permanent strong master password
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="w-5 h-5 accent-cyan-400 cursor-pointer"
          />
        </div>

        {isEnabled && (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Master Security Password
              </label>
              <input
                type="password"
                placeholder="Enter minimum 12-character passphrase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Confirm Master Password
              </label>
              <input
                type="password"
                placeholder="Re-enter passphrase"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>{saved ? 'Saved Successfully' : 'Apply Security Password'}</span>
            </button>
          </form>
        )}

        {/* Security Warning Box */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Strict Enterprise Safety Guidelines
          </div>
          <p className="text-amber-300/80 leading-relaxed">
            When unattended access is enabled, a persistent visual banner will always display in the titlebar. Unattended sessions are logged with full timestamps, source IP addresses, and cryptographic device signatures.
          </p>
        </div>
      </div>
    </div>
  );
};
