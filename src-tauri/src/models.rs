use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeviceProfile {
    pub device_id: String,
    pub device_name: String,
    pub os_type: String,
    pub os_version: String,
    pub local_ip: String,
    pub temporary_pin: String,
    pub qr_pairing_token: String,
    pub qr_expires_in_seconds: u32,
    pub is_online: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonitorInfo {
    pub id: u32,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub is_primary: bool,
    pub scale_factor: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemTelemetry {
    pub cpu_usage: f32,
    pub ram_used_mb: u64,
    pub ram_total_mb: u64,
    pub uptime_seconds: u64,
    pub battery_percent: Option<u8>,
    pub is_charging: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiscoveredDevice {
    pub device_id: String,
    pub device_name: String,
    pub os_type: String,
    pub ip_address: String,
    pub port: u16,
    pub is_trusted: bool,
    pub latency_ms: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RemoteSessionInfo {
    pub session_id: String,
    pub remote_device_id: String,
    pub remote_device_name: String,
    pub remote_os: String,
    pub connection_type: String, // "Direct LAN", "Direct P2P", "Relayed TURN"
    pub status: String,          // "connecting", "connected", "paused", "disconnected"
    pub fps: u32,
    pub rtt_ms: u32,
    pub bitrate_kbps: u32,
    pub packet_loss_percent: f32,
    pub resolution: String,
    pub started_at: u64,
    pub unattended: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileTransferItem {
    pub id: String,
    pub name: String,
    pub size_bytes: u64,
    pub transferred_bytes: u64,
    pub speed_mbps: f64,
    pub progress_percent: f32,
    pub status: String, // "queued", "transferring", "paused", "completed", "failed"
    pub is_upload: bool,
    pub eta_seconds: u32,
}
