import React, { useEffect } from 'react';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../lib/store';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { fetchInitialState, scanDevices } = useAppStore();

  useEffect(() => {
    fetchInitialState();
    scanDevices();

    // Periodic telemetry and local discovery radar scan
    const interval = setInterval(() => {
      fetchInitialState();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080A0F] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden pt-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#080A0F] relative">
          {children}
        </main>
      </div>
    </div>
  );
};
