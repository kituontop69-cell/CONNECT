import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Laptop2,
  Clock,
  ArrowLeftRight,
  MonitorPlay,
  Gamepad2,
  KeyRound,
  Sliders,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { TabType } from '../../lib/types';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeSession, fileTransfers } = useAppStore();

  const activeTransfersCount = fileTransfers.filter(
    (t) => t.status === 'in_progress'
  ).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'connect', label: 'Connect', icon: Radio },
    { id: 'devices', label: 'My Devices', icon: Laptop2 },
    { id: 'recent', label: 'Recent Sessions', icon: Clock },
    {
      id: 'transfer',
      label: 'File Transfer',
      icon: ArrowLeftRight,
      badge: activeTransfersCount > 0 ? `${activeTransfersCount}` : undefined,
    },
    { id: 'share', label: 'Screen Sharing', icon: MonitorPlay },
    {
      id: 'control',
      label: 'Remote Control',
      icon: Gamepad2,
      badge: activeSession ? 'LIVE' : undefined,
    },
    { id: 'unattended', label: 'Unattended Access', icon: KeyRound },
    { id: 'settings', label: 'Settings', icon: Sliders },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-60 bg-[#0B0E14]/80 backdrop-blur-xl border-r border-white/[0.06] flex flex-col justify-between pt-14 pb-4 select-none shrink-0 h-full">
      {/* Navigation Group */}
      <div className="px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    item.badge === 'LIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00F2FE]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status Card */}
      <div className="px-3">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Security Gate</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              TLS 1.3 / E2EE
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Low-Latency Engine</span>
            <span className="text-cyan-400 font-mono">WebRTC / Nova</span>
          </div>
          <a
            href="https://gokaushik.com"
            target="_blank"
            rel="noreferrer"
            className="mt-1 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 hover:text-cyan-400 flex items-center justify-between transition-colors"
          >
            <span>Powered by CONNECT Core</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
