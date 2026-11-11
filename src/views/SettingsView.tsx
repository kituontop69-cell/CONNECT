import React, { useState } from 'react';
import { Sliders, Monitor, Shield, Cpu, Moon, Eye, Volume2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [targetFps, setTargetFps] = useState('60');
  const [autoUpdatePin, setAutoUpdatePin] = useState(true);
  const [clipboardSync, setClipboardSync] = useState(true);
  const [audioStereo, setAudioStereo] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Application Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Customize video rendering pipeline, input sampling rates, and cryptographic defaults.
        </p>
      </div>

      <div className="space-y-4">
        {/* Video & Display Section */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            Display &amp; Hardware Video Pipeline
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
              <div>
                <h5 className="font-medium text-xs text-white">Hardware Acceleration (NVENC / D3D11)</h5>
                <p className="text-[11px] text-zinc-400">
                  Offloads screen capture and H.264/H.265 compression directly to your dedicated GPU
                </p>
              </div>
              <input
                type="checkbox"
                checked={hardwareAcceleration}
                onChange={(e) => setHardwareAcceleration(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
              <div>
                <h5 className="font-medium text-xs text-white">Max Target Framerate</h5>
                <p className="text-[11px] text-zinc-400">
                  Adjust max capture frequency based on LAN/WAN bandwidth availability
                </p>
              </div>
              <select
                value={targetFps}
                onChange={(e) => setTargetFps(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 focus:outline-none"
              >
                <option value="30">30 FPS (Low Bandwidth)</option>
                <option value="60">60 FPS (Standard 1080p)</option>
                <option value="120">120 FPS (High Refresh Pro)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Access Section */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Security &amp; Input Policies
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
              <div>
                <h5 className="font-medium text-xs text-white">Auto-Rotate Temporary PIN</h5>
                <p className="text-[11px] text-zinc-400">
                  Automatically regenerates the 6-digit access PIN after every completed session
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoUpdatePin}
                onChange={(e) => setAutoUpdatePin(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
              <div>
                <h5 className="font-medium text-xs text-white">Bidirectional Clipboard Sync</h5>
                <p className="text-[11px] text-zinc-400">
                  Instantly synchronize copied text and links between host and remote machine
                </p>
              </div>
              <input
                type="checkbox"
                checked={clipboardSync}
                onChange={(e) => setClipboardSync(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
