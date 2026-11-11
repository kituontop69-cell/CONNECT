import React, { useState, useEffect } from 'react';
import {
  QrCode,
  KeyRound,
  Radar,
  Link2,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export const ConnectView: React.FC = () => {
  const {
    profile,
    refreshQrToken,
    refreshPin,
    discoveredDevices,
    scanDevices,
    isScanning,
    connectToDevice,
  } = useAppStore();

  const [activeMethod, setActiveMethod] = useState<'qr' | 'id' | 'lan' | 'link'>('qr');
  const [targetId, setTargetId] = useState('');
  const [targetPin, setTargetPin] = useState('');
  const [countdown, setCountdown] = useState(profile?.qr_expires_in_seconds ?? 300);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Countdown timer for pairing token
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshQrToken();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLink = () => {
    const link = `https://connect.network/pair?token=${profile?.qr_pairing_token || 'demo'}&id=${profile?.device_id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConnectById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) return;
    await connectToDevice(targetId.trim(), targetPin.trim() || undefined);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Device Connection Center
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Pair cross-platform devices seamlessly via QR scan, Connect ID, LAN discovery, or invitation links.
        </p>
      </div>

      {/* Connection Method Tabs */}
      <div className="flex p-1 rounded-xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md">
        <button
          onClick={() => setActiveMethod('qr')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMethod === 'qr'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Method A: QR Code</span>
        </button>

        <button
          onClick={() => setActiveMethod('id')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMethod === 'id'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Method B: ID &amp; PIN</span>
        </button>

        <button
          onClick={() => {
            setActiveMethod('lan');
            scanDevices();
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMethod === 'lan'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Method C: LAN Radar</span>
        </button>

        <button
          onClick={() => setActiveMethod('link')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMethod === 'link'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Method D: Invite Link</span>
        </button>
      </div>

      {/* Method A: QR Code */}
      {activeMethod === 'qr' && (
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md flex flex-col items-center text-center">
          <div className="w-56 h-56 p-4 rounded-2xl bg-white flex items-center justify-center shadow-2xl relative group">
            {/* Embedded high-contrast SVG QR Code Matrix */}
            <svg
              className="w-full h-full text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="black" />
              <rect x="4" y="4" width="3" height="3" fill="white" />
              <rect x="15" y="2" width="7" height="7" rx="1.5" fill="black" />
              <rect x="17" y="4" width="3" height="3" fill="white" />
              <rect x="2" y="15" width="7" height="7" rx="1.5" fill="black" />
              <rect x="4" y="17" width="3" height="3" fill="white" />
              <circle cx="12" cy="12" r="2" fill="black" />
              <rect x="11" y="4" width="2" height="4" fill="black" />
              <rect x="4" y="11" width="4" height="2" fill="black" />
              <rect x="15" y="15" width="3" height="3" fill="black" />
              <rect x="19" y="18" width="3" height="4" fill="black" />
              <rect x="15" y="19" width="3" height="3" fill="black" />
            </svg>

            {/* Expiring Badge overlay */}
            <div className="absolute inset-0 bg-black/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
              <span className="text-xs text-white font-mono mb-2">Single-Use Token</span>
              <button
                onClick={() => refreshQrToken()}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
            </div>
          </div>

          {/* Countdown & Info */}
          <div className="mt-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Expires in {Math.floor(countdown / 60)}:
              {String(countdown % 60).padStart(2, '0')} min
            </div>
            <h3 className="font-semibold text-white text-base">
              Scan with CONNECT Android or PC App
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Point your phone camera or the CONNECT companion scanner to establish an authenticated end-to-end encrypted session.
            </p>
          </div>
        </div>
      )}

      {/* Method B: ID & PIN */}
      {activeMethod === 'id' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Incoming Session Auth */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
            <h3 className="font-semibold text-sm text-white">Allow Remote Access</h3>
            <p className="text-xs text-zinc-400">
              Provide these credentials to allow another device to connect to this machine.
            </p>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-500">Your ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xl font-bold text-cyan-300">
                    {profile?.device_id}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profile?.device_id || '');
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1.5 text-zinc-400 hover:text-white"
                  >
                    {copiedId ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-zinc-500">One-Time PIN</span>
                  <button
                    onClick={() => refreshPin()}
                    className="text-zinc-500 hover:text-cyan-400 text-xs"
                  >
                    Change PIN
                  </button>
                </div>
                <div className="font-mono text-xl font-bold text-zinc-200 mt-1">
                  {profile?.temporary_pin}
                </div>
              </div>
            </div>
          </div>

          {/* Outgoing Connect Form */}
          <form
            onSubmit={handleConnectById}
            className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-4"
          >
            <h3 className="font-semibold text-sm text-white">Connect to Remote Device</h3>
            <p className="text-xs text-zinc-400">
              Enter the 9-digit Connect ID and optional PIN of the target device.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Target Connect ID</label>
                <input
                  type="text"
                  placeholder="e.g. 491-723-810"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Target PIN (if required)</label>
                <input
                  type="password"
                  placeholder="6-digit PIN"
                  value={targetPin}
                  onChange={(e) => setTargetPin(e.target.value)}
                  maxLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
              >
                <span>Initiate Remote Control</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Method C: LAN Radar */}
      {activeMethod === 'lan' && (
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Radar className={`w-4 h-4 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
                Local Subnet Radar (Port 43888)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically discovering other active CONNECT nodes on your Wi-Fi
              </p>
            </div>
            <button
              onClick={() => scanDevices()}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-2 border border-white/10 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Pinging Subnet...' : 'Refresh Radar'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {discoveredDevices.map((dev) => (
              <div
                key={dev.device_id}
                className="p-4 rounded-xl bg-black/30 border border-white/[0.06] hover:border-cyan-500/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    {dev.os_type === 'android' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Laptop className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-white">{dev.device_name}</h5>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {dev.ip_address} • ID: {dev.device_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => connectToDevice(dev.device_id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Method D: Direct Link */}
      {activeMethod === 'link' && (
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
          <h3 className="font-semibold text-sm text-white">Direct Invitation Link</h3>
          <p className="text-xs text-zinc-400">
            Send an instant pairing URL to your partner via WhatsApp, Telegram, or Email.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`https://connect.network/pair?token=${profile?.qr_pairing_token}&id=${profile?.device_id}`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-zinc-300"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              This link expires in 5 minutes and will prompt you to explicitly approve remote control when clicked.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
