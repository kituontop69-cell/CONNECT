export type TabType =
  | 'overview'
  | 'connect'
  | 'devices'
  | 'recent'
  | 'transfer'
  | 'share'
  | 'control'
  | 'unattended'
  | 'settings'
  | 'help';

export interface DeviceProfile {
  device_id: string;
  device_name: string;
  os_type: string;
  os_version: string;
  local_ip: string;
  temporary_pin: string;
  qr_pairing_token: string;
  qr_expires_in_seconds: number;
  is_online: boolean;
}

export interface MonitorInfo {
  id: number;
  name: string;
  width: number;
  height: number;
  is_primary: boolean;
  refresh_rate_hz: number;
}

export interface SystemTelemetry {
  cpu_usage: number;
  ram_used_mb: number;
  ram_total_mb: number;
  uptime_seconds: number;
  battery_percent?: number | null;
  is_charging?: boolean | null;
}

export interface DiscoveredDevice {
  device_id: string;
  device_name: string;
  os_type: string;
  ip_address: string;
  port: number;
  last_seen_epoch: number;
}

export interface RemoteSessionInfo {
  session_id: string;
  remote_device_id: string;
  remote_device_name: string;
  remote_os: string;
  fps: number;
  rtt_ms: number;
  bitrate_kbps: number;
  packet_loss_percent: number;
  jitter_ms: number;
  connection_type: 'DirectLAN' | 'P2P_WebRTC' | 'Relayed_TURN';
  is_active: boolean;
  is_audio_enabled: boolean;
  is_control_enabled: boolean;
  started_at_epoch: number;
}

export interface FileTransferItem {
  id: string;
  file_name: string;
  file_size_bytes: number;
  bytes_transferred: number;
  speed_bytes_sec: number;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'failed';
  is_upload: boolean;
  sha256_hash?: string;
  remaining_seconds: number;
}

export interface MouseInputPayload {
  x_norm: number;
  y_norm: number;
  button: 'left' | 'right' | 'middle';
  action: 'move' | 'down' | 'up' | 'click' | 'double_click' | 'scroll';
  scroll_delta?: number;
}

export interface KeyboardInputPayload {
  key: string;
  action: 'down' | 'up' | 'type';
  vk_code?: number;
}
