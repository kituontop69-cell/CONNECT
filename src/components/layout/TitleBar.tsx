import React from 'react';
import { Minus, Square, X, Wifi, ShieldCheck, Activity } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { api } from '../../lib/api';

export const TitleBar: React.FC = () => {
  const { profile, activeSession } = useAppStore();

  const handleMinimize = () => api.windowAction('minimize');
  const handleMaximize = () => api.windowAction('toggle_maximize');
  const handleClose = () => api.windowAction('close');

  return (
    <div
      data-tauri-drag-region
      className="h-10 w-full bg-[#080A0F]/90 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-3 select-none z-50 fixed top-0 left-0 right-0"
    >
      {/* Brand & Connectivity Pill */}
      <div className="flex items-center space-x-3 pointer-events-none">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F2FE]" />
          <span className="font-bold text-xs tracking-wider text-white">CONNECT</span>
          <span className="text-[10px] text-zinc-500 font-mono font-medium">v0.1.0</span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        {/* Live Status Pill */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px]">
          <Wifi className="w-3 h-3 text-cyan-400" />
          <span className="text-zinc-300 font-mono">{profile?.local_ip || '127.0.0.1'}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Ready
          </span>
        </div>

        {activeSession && (
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 animate-pulse">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Connected: {activeSession.remote_device_name}</span>
            <span className="font-mono text-zinc-400">({activeSession.rtt_ms}ms)</span>
          </div>
        )}
      </div>

      {/* Device ID quick pill in Titlebar */}
      <div className="pointer-events-none hidden md:flex items-center text-xs text-zinc-400">
        <span className="text-zinc-500 mr-1.5">My ID:</span>
        <span className="font-mono font-semibold text-zinc-200 tracking-wider">
          {profile?.device_id || '--- --- ---'}
        </span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center space-x-1 pointer-events-auto">
        <button
          onClick={handleMinimize}
          className="w-8 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Toggle Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-rose-500/80 transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
