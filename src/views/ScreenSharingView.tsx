import React, { useState } from 'react';
import { MonitorPlay, Layers, Volume2, Shield, Eye, Lock } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const ScreenSharingView: React.FC = () => {
  const { monitors, selectedMonitorId, setSelectedMonitor } = useAppStore();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [blockSensitiveWindows, setBlockSensitiveWindows] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Screen Sharing Broadcaster
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Stream your desktop in crystal-clear 60 FPS / 4K with per-monitor routing and privacy shields.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
            Select Display to Broadcast
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {monitors.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMonitor(m.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMonitorId === m.id
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'border-white/[0.06] bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Display {m.id + 1}
                  </span>
                  {m.is_primary && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      PRIMARY
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-zinc-400">
                  {m.width} x {m.height} @ {m.refresh_rate_hz}Hz
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast Options */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <div>
                <h5 className="font-medium text-xs text-white">System Audio Loopback</h5>
                <p className="text-[11px] text-zinc-400">
                  Transmit PC audio alongside the video feed with Opus high-fidelity codec
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeAudio}
              onChange={(e) => setIncludeAudio(e.target.checked)}
              className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-cyan-400" />
              <div>
                <h5 className="font-medium text-xs text-white">Privacy Window Blanking</h5>
                <p className="text-[11px] text-zinc-400">
                  Automatically obscure banking and password apps from the broadcast
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={blockSensitiveWindows}
              onChange={(e) => setBlockSensitiveWindows(e.target.checked)}
              className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isBroadcasting
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(0,242,254,0.3)]'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <span>{isBroadcasting ? 'Stop Screen Broadcast' : 'Start Screen Broadcast'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
