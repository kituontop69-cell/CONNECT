import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  MonitorPlay,
  Gamepad2,
  ArrowLeftRight,
  QrCode,
  Cpu,
  HardDrive,
  Activity,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export const OverviewView: React.FC = () => {
  const {
    profile,
    telemetry,
    refreshPin,
    connectToDevice,
    setActiveTab,
    discoveredDevices,
  } = useAppStore();

  const [targetId, setTargetId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleCopyId = () => {
    if (profile?.device_id) {
      navigator.clipboard.writeText(profile.device_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyPin = () => {
    if (profile?.temporary_pin) {
      navigator.clipboard.writeText(profile.temporary_pin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleQuickConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) return;
    setConnecting(true);
    await connectToDevice(targetId.trim());
    setConnecting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-zinc-900/40 to-transparent border border-cyan-500/20 backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Universal Remote Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome to CONNECT
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            One Connection. Every Device. Seamless remote desktop, low-latency control, and P2P transfers.
          </p>
        </div>

        {/* Target Quick Connect Input */}
        <form onSubmit={handleQuickConnect} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Connect ID (e.g. 842-195-736)"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="px-4 py-2.5 w-64 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            disabled={connecting || !targetId.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
          >
            <span>{connecting ? 'Connecting...' : 'Connect'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Main Grid: My Device ID Card + System Telemetry Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 & 2: Local Device Credentials */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">
                  {profile?.device_name || 'DESKTOP-NODE'}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {profile?.os_type?.toUpperCase()} • {profile?.local_ip}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Ready to Accept Connections
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {/* Connect ID Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Your Connect ID
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-2xl font-bold tracking-wider text-cyan-300">
                  {profile?.device_id || '--- --- ---'}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Copy ID"
                >
                  {copiedId ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Temporary PIN Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Temporary PIN
                </span>
                <button
                  onClick={() => refreshPin()}
                  className="text-zinc-500 hover:text-cyan-400 transition-colors p-1"
                  title="Generate New PIN"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-2xl font-bold tracking-widest text-zinc-200">
                  {profile?.temporary_pin || '------'}
                </span>
                <button
                  onClick={handleCopyPin}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Copy PIN"
                >
                  {copiedPin ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs text-zinc-400">
            <span>Share your Connect ID and PIN with the remote party to authorize control.</span>
            <button
              onClick={() => setActiveTab('connect')}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              Show QR Code <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Live System Telemetry */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Live Telemetry
            </span>
            <span className="text-[10px] font-mono text-zinc-500">REALTIME</span>
          </div>

          <div className="space-y-4 my-4">
            {/* CPU Metric */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" /> CPU Usage
                </span>
                <span className="font-mono text-white font-medium">
                  {telemetry ? `${telemetry.cpu_usage.toFixed(1)}%` : '--%'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, telemetry?.cpu_usage || 10)}%` }}
                />
              </div>
            </div>

            {/* RAM Metric */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-zinc-500" /> System Memory
                </span>
                <span className="font-mono text-white font-medium">
                  {telemetry
                    ? `${(telemetry.ram_used_mb / 1024).toFixed(1)} / ${(
                        telemetry.ram_total_mb / 1024
                      ).toFixed(0)} GB`
                    : '-- GB'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${
                      telemetry
                        ? (telemetry.ram_used_mb / telemetry.ram_total_mb) * 100
                        : 25
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Network Transport */}
            <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] text-[11px] space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Hardware Acceleration</span>
                <span className="text-emerald-400 font-mono">D3D11 / NVENC</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Default Target FPS</span>
                <span className="text-zinc-200 font-mono">60 FPS Adaptive</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-white/[0.06]">
            Uptime: {Math.floor((telemetry?.uptime_seconds || 3600) / 3600)}h{' '}
            {Math.floor(((telemetry?.uptime_seconds || 3600) % 3600) / 60)}m
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('control')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/50 border border-white/[0.06] hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Remote Control</h4>
            <p className="text-xs text-zinc-400 mt-1">Control remote PC or phone screen</p>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/50 border border-white/[0.06] hover:border-blue-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Share Screen</h4>
            <p className="text-xs text-zinc-400 mt-1">Broadcast your display with audio</p>
          </button>

          <button
            onClick={() => setActiveTab('transfer')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/50 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Transfer Files</h4>
            <p className="text-xs text-zinc-400 mt-1">P2P encrypted chunked transfers</p>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/50 border border-white/[0.06] hover:border-purple-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Generate QR</h4>
            <p className="text-xs text-zinc-400 mt-1">Instant mobile phone pairing</p>
          </button>
        </div>
      </div>

      {/* Discovered Local Network Devices Radar */}
      <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm text-white">Local Network Discovery</h3>
            <p className="text-xs text-zinc-400">
              Nearby devices found automatically on your Wi-Fi subnet
            </p>
          </div>
          <button
            onClick={() => setActiveTab('connect')}
            className="text-xs text-cyan-400 hover:underline font-medium"
          >
            View Radar
          </button>
        </div>

        {discoveredDevices.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-white/10 rounded-xl">
            Scanning local LAN for CONNECT nodes...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discoveredDevices.map((dev) => (
              <div
                key={dev.device_id}
                className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.05] text-cyan-400">
                    {dev.os_type === 'android' ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-white">{dev.device_name}</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {dev.ip_address} • {dev.device_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => connectToDevice(dev.device_id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
