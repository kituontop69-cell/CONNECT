import React from 'react';
import { Clock, Laptop, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const RecentSessionsView: React.FC = () => {
  const { connectToDevice } = useAppStore();

  const sessions = [
    {
      id: 'sess-84912',
      deviceName: 'Kaushik-Pixel-9-Pro',
      deviceId: '491-723-810',
      type: 'phone',
      duration: '42m 15s',
      date: 'Today, 03:14 AM',
      transferredMb: 1420,
      protocol: 'DirectLAN',
    },
    {
      id: 'sess-73104',
      deviceName: 'Studio-MacBook-M3',
      deviceId: '912-384-511',
      type: 'laptop',
      duration: '1h 05m',
      date: 'Yesterday, 11:20 PM',
      transferredMb: 520,
      protocol: 'P2P_WebRTC',
    },
    {
      id: 'sess-61922',
      deviceName: 'Office-Workstation-Dell',
      deviceId: '204-819-332',
      type: 'desktop',
      duration: '18m 40s',
      date: 'Nov 09, 2026',
      transferredMb: 94,
      protocol: 'Relayed_TURN',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Recent Sessions</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Audit history of previous remote access connections and telemetry stats.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-3">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-white/[0.05] text-cyan-400">
                {sess.type === 'phone' ? (
                  <Smartphone className="w-5 h-5" />
                ) : (
                  <Laptop className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">{sess.deviceName}</h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {sess.deviceId} • {sess.date}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs font-mono">
              <div className="text-right hidden sm:block">
                <span className="text-zinc-500 block text-[10px]">DURATION</span>
                <span className="text-zinc-300">{sess.duration}</span>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-zinc-500 block text-[10px]">DATA TRANSFERRED</span>
                <span className="text-zinc-300">{sess.transferredMb} MB</span>
              </div>

              <button
                onClick={() => connectToDevice(sess.deviceId)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Reconnect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
