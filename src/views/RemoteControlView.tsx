import React, { useState, useRef } from 'react';
import {
  Monitor,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PhoneOff,
  Activity,
  Layers,
  Shield,
  MousePointer,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { api } from '../lib/api';

export const RemoteControlView: React.FC = () => {
  const {
    activeSession,
    disconnect,
    monitors,
    selectedMonitorId,
    setSelectedMonitor,
  } = useAppStore();

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTelemetryHud, setShowTelemetryHud] = useState(true);
  const [hudPosition, setHudPosition] = useState({ x: 24, y: 24 });
  const [isDraggingHud, setIsDraggingHud] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Mouse dispatch handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !activeSession) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x_norm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y_norm = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    api.dispatchMouse({
      x_norm,
      y_norm,
      button: 'left',
      action: 'move',
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !activeSession) return;
    const button = e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left';
    const rect = canvasRef.current.getBoundingClientRect();
    const x_norm = (e.clientX - rect.left) / rect.width;
    const y_norm = (e.clientY - rect.top) / rect.height;

    api.dispatchMouse({
      x_norm,
      y_norm,
      button,
      action: 'down',
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !activeSession) return;
    const button = e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left';
    const rect = canvasRef.current.getBoundingClientRect();
    const x_norm = (e.clientX - rect.left) / rect.width;
    const y_norm = (e.clientY - rect.top) / rect.height;

    api.dispatchMouse({
      x_norm,
      y_norm,
      button,
      action: 'up',
    });
  };

  // Telemetry HUD drag handler
  const handleHudDragStart = (e: React.MouseEvent) => {
    setIsDraggingHud(true);
    const startX = e.clientX - hudPosition.x;
    const startY = e.clientY - hudPosition.y;

    const onMove = (moveEvent: MouseEvent) => {
      setHudPosition({
        x: Math.max(10, moveEvent.clientX - startX),
        y: Math.max(10, moveEvent.clientY - startY),
      });
    };

    const onUp = () => {
      setIsDraggingHud(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="h-full flex flex-col space-y-3 select-none">
      {/* Session Control Toolbar */}
      <div className="h-12 px-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-xs text-white">
              {activeSession ? activeSession.remote_device_name : 'No Active Session'}
            </span>
            <span className="text-zinc-500 text-xs font-mono">
              ({activeSession?.remote_device_id || 'Standby'})
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Multi-Monitor Selector */}
          <div className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-zinc-400 mr-1" />
            {monitors.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMonitor(m.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  selectedMonitorId === m.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Display {m.id + 1} ({m.width}x{m.height})
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar Quick Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTelemetryHud(!showTelemetryHud)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showTelemetryHud
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>HUD</span>
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => disconnect()}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>

      {/* Main Remote Canvas Viewport */}
      <div
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        className="flex-1 relative rounded-2xl bg-black border border-white/[0.08] overflow-hidden flex items-center justify-center cursor-crosshair group shadow-inner"
      >
        {activeSession ? (
          <div className="w-full h-full relative flex items-center justify-center bg-[#050608]">
            {/* Desktop Screen Mock with Active Grid */}
            <div className="w-[96%] h-[94%] rounded-xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
              {/* Virtual Remote Window header */}
              <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-white/[0.06] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="font-mono text-zinc-400 ml-2">
                    {activeSession.remote_device_name} — Active Remote Surface
                  </span>
                </div>
                <div className="font-mono text-[11px] text-cyan-400">
                  D3D11 NVENC H.264
                </div>
              </div>

              {/* Central Interaction Indicator */}
              <div className="text-center space-y-2 pointer-events-none">
                <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.15)]">
                  <MousePointer className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="font-semibold text-white text-base">
                  Direct Input Injection Active
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Move your cursor and click within this surface. Hardware mouse &amp; keyboard actions are dispatched with &lt;15ms latency.
                </p>
              </div>

              {/* Bottom Remote Taskbar Mock */}
              <div className="h-8 rounded-lg bg-black/50 border border-white/[0.06] flex items-center justify-between px-3 text-[11px] text-zinc-400 font-mono">
                <span>Start</span>
                <span>120 FPS Active Sync</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 p-8">
            <Monitor className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-semibold text-zinc-300">
              No Remote Session Connected
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Select a device from Overview or enter a Connect ID to initiate real-time desktop control.
            </p>
          </div>
        )}

        {/* Floating Draggable Ultra-Low Latency Telemetry HUD */}
        {showTelemetryHud && activeSession && (
          <div
            style={{ left: `${hudPosition.x}px`, top: `${hudPosition.y}px` }}
            className="absolute z-40 w-64 p-3.5 rounded-xl bg-black/85 backdrop-blur-xl border border-cyan-500/30 text-xs shadow-2xl space-y-2.5"
          >
            {/* Header / Drag Handle */}
            <div
              onMouseDown={handleHudDragStart}
              className="flex items-center justify-between cursor-move pb-2 border-b border-white/[0.08]"
            >
              <span className="font-bold text-[10px] uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Engine Telemetry
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {activeSession.connection_type}
              </span>
            </div>

            {/* Metrics List */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-zinc-500 block text-[10px]">FPS</span>
                <span className="text-white font-semibold">{activeSession.fps} FPS</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">RTT Latency</span>
                <span className="text-emerald-400 font-semibold">{activeSession.rtt_ms} ms</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Bitrate</span>
                <span className="text-cyan-300 font-semibold">
                  {(activeSession.bitrate_kbps / 1000).toFixed(1)} Mbps
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Packet Loss</span>
                <span className="text-zinc-300 font-semibold">
                  {activeSession.packet_loss_percent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-zinc-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>TLS 1.3 / ChaCha20-Poly1305</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
