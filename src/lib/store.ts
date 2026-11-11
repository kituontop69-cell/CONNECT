import { create } from 'zustand';
import {
  TabType,
  DeviceProfile,
  MonitorInfo,
  SystemTelemetry,
  DiscoveredDevice,
  RemoteSessionInfo,
  FileTransferItem,
} from './types';
import { api } from './api';

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profile: DeviceProfile | null;
  monitors: MonitorInfo[];
  telemetry: SystemTelemetry | null;
  discoveredDevices: DiscoveredDevice[];
  activeSession: RemoteSessionInfo | null;
  fileTransfers: FileTransferItem[];
  isScanning: boolean;
  selectedMonitorId: number;
  qrCountdown: number;

  // Actions
  fetchInitialState: () => Promise<void>;
  refreshPin: () => Promise<void>;
  refreshQrToken: () => Promise<void>;
  scanDevices: () => Promise<void>;
  connectToDevice: (deviceId: string, password?: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  setSelectedMonitor: (id: number) => void;
  addFileTransfer: (file: File) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  profile: null,
  monitors: [],
  telemetry: null,
  discoveredDevices: [],
  activeSession: null,
  fileTransfers: [
    {
      id: 'tx-101',
      file_name: 'Nova_Update_2.4.zip',
      file_size_bytes: 42949672,
      bytes_transferred: 32212254,
      speed_bytes_sec: 48200000,
      status: 'in_progress',
      is_upload: true,
      sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      remaining_seconds: 3,
    },
    {
      id: 'tx-102',
      file_name: 'system_capture_4k.raw',
      file_size_bytes: 104857600,
      bytes_transferred: 104857600,
      speed_bytes_sec: 0,
      status: 'completed',
      is_upload: false,
      sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      remaining_seconds: 0,
    },
  ],
  isScanning: false,
  selectedMonitorId: 0,
  qrCountdown: 300,

  fetchInitialState: async () => {
    try {
      const [profile, monitors, telemetry] = await Promise.all([
        api.getDeviceProfile(),
        api.getMonitors(),
        api.getTelemetry(),
      ]);
      set({
        profile,
        monitors,
        telemetry,
        selectedMonitorId: monitors.find((m) => m.is_primary)?.id ?? 0,
        qrCountdown: profile?.qr_expires_in_seconds ?? 300,
      });
    } catch (e) {
      console.error('Failed to load initial state', e);
    }
  },

  refreshPin: async () => {
    const pin = await api.refreshPairingPin();
    const curr = get().profile;
    if (curr) {
      set({ profile: { ...curr, temporary_pin: pin } });
    }
  },

  refreshQrToken: async () => {
    const [token, ttl] = await api.generateQrToken();
    const curr = get().profile;
    if (curr) {
      set({
        profile: {
          ...curr,
          qr_pairing_token: token,
          qr_expires_in_seconds: ttl,
        },
        qrCountdown: ttl,
      });
    }
  },

  scanDevices: async () => {
    set({ isScanning: true });
    try {
      const devices = await api.discoverDevices();
      set({ discoveredDevices: devices, isScanning: false });
    } catch {
      set({ isScanning: false });
    }
  },

  connectToDevice: async (deviceId: string, password?: string) => {
    try {
      const session = await api.startConnection(deviceId, password);
      set({ activeSession: session, activeTab: 'control' });
      return true;
    } catch {
      return false;
    }
  },

  disconnect: async () => {
    await api.disconnectSession();
    set({ activeSession: null, activeTab: 'overview' });
  },

  setSelectedMonitor: (id: number) => set({ selectedMonitorId: id }),

  addFileTransfer: (file: File) => {
    const newItem: FileTransferItem = {
      id: `tx-${Date.now()}`,
      file_name: file.name,
      file_size_bytes: file.size,
      bytes_transferred: 0,
      speed_bytes_sec: 25000000,
      status: 'in_progress',
      is_upload: true,
      remaining_seconds: Math.ceil(file.size / 25000000),
    };
    set((state) => ({ fileTransfers: [newItem, ...state.fileTransfers] }));
  },
}));
