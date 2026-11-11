import React from 'react';
import { Laptop, Smartphone, MoreVertical, Plus, Power, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const MyDevicesView: React.FC = () => {
  const { connectToDevice, setActiveTab } = useAppStore();

  const pairedDevices = [
    {
      id: '491-723-810',
      name: 'Kaushik-Pixel-9-Pro',
      type: 'phone',
      os: 'Android 15',
      status: 'online',
      lastSeen: 'Active now',
      ip: '192.168.1.189',
    },
    {
      id: '912-384-511',
      name: 'Studio-MacBook-M3',
      type: 'laptop',
      os: 'macOS Sonoma',
      status: 'online',
      lastSeen: '5m ago',
      ip: '192.168.1.120',
    },
    {
      id: '204-819-332',
      name: 'Office-Workstation-Dell',
      type: 'desktop',
      os: 'Windows 11',
      status: 'offline',
      lastSeen: 'Yesterday',
      ip: '10.0.0.45',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Paired Devices</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your authenticated personal devices for instant zero-prompt connection.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('connect')}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Pair New Device</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pairedDevices.map((device) => (
          <div
            key={device.id}
            className="p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between hover:border-cyan-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-white/[0.05] text-cyan-400 border border-white/[0.06]">
                  {device.type === 'phone' ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">{device.name}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{device.os}</p>
                </div>
              </div>
              <button className="text-zinc-500 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>CONNECT ID</span>
                <span className="text-cyan-300 font-semibold">{device.id}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Status</span>
                <span
                  className={
                    device.status === 'online' ? 'text-emerald-400' : 'text-zinc-500'
                  }
                >
                  {device.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Last Seen</span>
                <span>{device.lastSeen}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => connectToDevice(device.id)}
                disabled={device.status === 'offline'}
                className="flex-1 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-30"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Connect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          All paired devices communicate using cryptographically verified asymmetric keys. You can revoke device access anytime.
        </span>
      </div>
    </div>
  );
};
