import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { useAppStore } from './lib/store';
import { OverviewView } from './views/OverviewView';
import { ConnectView } from './views/ConnectView';
import { RemoteControlView } from './views/RemoteControlView';
import { FileTransferView } from './views/FileTransferView';
import { MyDevicesView } from './views/MyDevicesView';
import { ScreenSharingView } from './views/ScreenSharingView';
import { UnattendedAccessView } from './views/UnattendedAccessView';
import { RecentSessionsView } from './views/RecentSessionsView';
import { SettingsView } from './views/SettingsView';
import { HelpView } from './views/HelpView';

export const App: React.FC = () => {
  const { activeTab } = useAppStore();

  const renderView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'connect':
        return <ConnectView />;
      case 'control':
        return <RemoteControlView />;
      case 'transfer':
        return <FileTransferView />;
      case 'devices':
        return <MyDevicesView />;
      case 'share':
        return <ScreenSharingView />;
      case 'unattended':
        return <UnattendedAccessView />;
      case 'recent':
        return <RecentSessionsView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpView />;
      default:
        return <OverviewView />;
    }
  };

  return <AppShell>{renderView()}</AppShell>;
};

export default App;
