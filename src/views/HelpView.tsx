import React from 'react';
import { HelpCircle, ExternalLink, ShieldCheck, Terminal, BookOpen } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Documentation &amp; Support</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Technical specifications, port forwarding reference, and networking architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Terminal className="w-5 h-5" />
            <h3 className="font-semibold text-sm text-white">Port Reference</h3>
          </div>
          <p className="text-xs text-zinc-400">
            CONNECT operates on optimized transport ports for zero-config LAN discovery and NAT traversal:
          </p>
          <ul className="text-xs font-mono space-y-1.5 text-zinc-300">
            <li className="p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between">
              <span>UDP 43888</span>
              <span className="text-cyan-400">Local Subnet Radar Beacon</span>
            </li>
            <li className="p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between">
              <span>UDP 3478</span>
              <span className="text-emerald-400">STUN NAT Traversal</span>
            </li>
            <li className="p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between">
              <span>TCP 443</span>
              <span className="text-blue-400">WebRTC Signal &amp; Ephemeral Auth</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-semibold text-sm text-white">Cryptographic Standards</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Every session enforces strict zero-trust principles:
          </p>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>TLS 1.3 handshake with Curve25519 key exchange</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ChaCha20-Poly1305 authenticated symmetric video stream encryption</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SHA-256 chunk-by-chunk file transfer validation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
