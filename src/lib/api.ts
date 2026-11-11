import {
  DeviceProfile,
  MonitorInfo,
  SystemTelemetry,
  DiscoveredDevice,
  RemoteSessionInfo,
  MouseInputPayload,
  KeyboardInputPayload,
} from './types';

// Detect if running inside Tauri runtime
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function invokeTauri<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<T>(cmd, args);
    } catch (err) {
      console.warn(`[Tauri Invoke Error: ${cmd}]`, err);
    }
  }

  // Fallback dev mock for browser testing
  return getMockResponse<T>(cmd, args);
}

function getMockResponse<T>(cmd: string, args?: Record<string, unknown>): T {
  switch (cmd) {
    case 'get_device_profile':
      return {
        device_id: '842-195-736',
        device_name: 'DESKTOP-TITAN-X',
        os_type: 'windows',
        os_version: '11 Pro 24H2',
        local_ip: '192.168.1.145',
        temporary_pin: '839201',
        qr_pairing_token: 'PAIR-CONNECT-842-195-736-DEMO',
        qr_expires_in_seconds: 300,
        is_online: true,
      } as unknown as T;

    case 'refresh_pairing_pin':
      return Math.floor(100000 + Math.random() * 900000).toString() as unknown as T;

    case 'generate_qr_pairing_token':
      return [`PAIR-CONNECT-TOKEN-${Date.now()}`, 300] as unknown as T;

    case 'get_monitors':
      return [
        {
          id: 0,
          name: 'Display 1 (Primary - Samsung Odyssey G9)',
          width: 5120,
          height: 1440,
          is_primary: true,
          refresh_rate_hz: 240,
        },
        {
          id: 1,
          name: 'Display 2 (Portrait - LG UltraFine 4K)',
          width: 2160,
          height: 3840,
          is_primary: false,
          refresh_rate_hz: 60,
        },
      ] as unknown as T;

    case 'get_system_telemetry':
      return {
        cpu_usage: 14.5 + Math.random() * 8,
        ram_used_mb: 8420,
        ram_total_mb: 32768,
        uptime_seconds: 84920,
        battery_percent: 100,
        is_charging: true,
      } as unknown as T;

    case 'discover_local_devices':
      return [
        {
          device_id: '491-723-810',
          device_name: 'Kaushik-Pixel-9-Pro',
          os_type: 'android',
          ip_address: '192.168.1.189',
          port: 43888,
          last_seen_epoch: Math.floor(Date.now() / 1000),
        },
        {
          device_id: '912-384-511',
          device_name: 'Studio-MacBook-M3',
          os_type: 'macos',
          ip_address: '192.168.1.120',
          port: 43888,
          last_seen_epoch: Math.floor(Date.now() / 1000),
        },
      ] as unknown as T;

    case 'start_connection':
      return {
        session_id: `sess-${Date.now()}`,
        remote_device_id: (args?.target_id as string) || '491-723-810',
        remote_device_name: 'Kaushik-Pixel-9-Pro',
        remote_os: 'android',
        fps: 60,
        rtt_ms: 12,
        bitrate_kbps: 18400,
        packet_loss_percent: 0.0,
        jitter_ms: 1.2,
        connection_type: 'DirectLAN',
        is_active: true,
        is_audio_enabled: true,
        is_control_enabled: true,
        started_at_epoch: Math.floor(Date.now() / 1000),
      } as unknown as T;

    case 'dispatch_mouse_action':
    case 'dispatch_keyboard_action':
    case 'disconnect_session':
    case 'window_action':
      return true as unknown as T;

    default:
      return null as unknown as T;
  }
}

export const api = {
  getDeviceProfile: () => invokeTauri<DeviceProfile>('get_device_profile'),
  refreshPairingPin: () => invokeTauri<string>('refresh_pairing_pin'),
  generateQrToken: () => invokeTauri<[string, number]>('generate_qr_pairing_token'),
  getMonitors: () => invokeTauri<MonitorInfo[]>('get_monitors'),
  getTelemetry: () => invokeTauri<SystemTelemetry>('get_system_telemetry'),
  discoverDevices: () => invokeTauri<DiscoveredDevice[]>('discover_local_devices'),
  startConnection: (targetId: string, password?: string, token?: string) =>
    invokeTauri<RemoteSessionInfo>('start_connection', { target_id: targetId, password, token }),
  disconnectSession: () => invokeTauri<boolean>('disconnect_session'),
  getActiveSession: () => invokeTauri<RemoteSessionInfo | null>('get_active_session'),
  dispatchMouse: (payload: MouseInputPayload) =>
    invokeTauri<boolean>('dispatch_mouse_action', { payload }),
  dispatchKeyboard: (payload: KeyboardInputPayload) =>
    invokeTauri<boolean>('dispatch_keyboard_action', { payload }),
  windowAction: (action: 'minimize' | 'toggle_maximize' | 'close') =>
    invokeTauri<boolean>('window_action', { action }),
};
