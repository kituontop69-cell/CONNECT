use crate::capture;
use crate::discovery;
use crate::identity::get_local_ip;
use crate::input::{dispatch_keyboard, dispatch_mouse, KeyboardInputPayload, MouseInputPayload};
use crate::models::{DeviceProfile, DiscoveredDevice, MonitorInfo, RemoteSessionInfo, SystemTelemetry};
use crate::state::AppState;
use tauri::{State, Window};

#[tauri::command]
pub fn get_device_profile(state: State<'_, AppState>) -> DeviceProfile {
    let (qr_token, qr_expires_in_seconds) = state.identity.get_or_refresh_qr_token();
    let local_ip = get_local_ip();

    DeviceProfile {
        device_id: state.identity.get_device_id(),
        device_name: state.identity.get_device_name(),
        os_type: std::env::consts::OS.to_string(),
        os_version: sysinfo::System::os_version().unwrap_or_else(|| "11.0".to_string()),
        local_ip,
        temporary_pin: state.identity.get_current_pin(),
        qr_pairing_token: qr_token,
        qr_expires_in_seconds,
        is_online: true,
    }
}

#[tauri::command]
pub fn refresh_pairing_pin(state: State<'_, AppState>) -> String {
    state.identity.refresh_pin()
}

#[tauri::command]
pub fn generate_qr_pairing_token(state: State<'_, AppState>) -> (String, u32) {
    state.identity.force_refresh_qr_token()
}

#[tauri::command]
pub fn get_monitors() -> Vec<MonitorInfo> {
    capture::get_monitors()
}

#[tauri::command]
pub fn get_system_telemetry(state: State<'_, AppState>) -> SystemTelemetry {
    let mut sys = state.sysinfo.lock().unwrap();
    sys.refresh_cpu_usage();
    sys.refresh_memory();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let ram_used_mb = sys.used_memory() / 1024 / 1024;
    let ram_total_mb = sys.total_memory() / 1024 / 1024;
    let uptime_seconds = sysinfo::System::uptime();

    SystemTelemetry {
        cpu_usage,
        ram_used_mb,
        ram_total_mb,
        uptime_seconds,
        battery_percent: Some(100),
        is_charging: Some(true),
    }
}

#[tauri::command]
pub fn discover_local_devices(state: State<'_, AppState>) -> Vec<DiscoveredDevice> {
    let my_id = state.identity.get_device_id();
    discovery::scan_lan_devices(&my_id)
}

#[tauri::command]
pub fn dispatch_mouse_action(payload: MouseInputPayload) -> bool {
    dispatch_mouse(payload)
}

#[tauri::command]
pub fn dispatch_keyboard_action(payload: KeyboardInputPayload) -> bool {
    dispatch_keyboard(payload)
}

#[tauri::command]
pub fn start_connection(
    target_id: String,
    _password: Option<String>,
    _token: Option<String>,
    state: State<'_, AppState>,
) -> Result<RemoteSessionInfo, String> {
    let mut session = state.active_session.lock().unwrap();
    
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    let new_session = RemoteSessionInfo {
        session_id: format!("sess-{}", rand::random::<u32>()),
        remote_device_id: target_id.clone(),
        remote_device_name: format!("Remote Device ({target_id})"),
        remote_os: "windows".to_string(),
        connection_type: "Direct LAN (P2P)".to_string(),
        status: "connected".to_string(),
        fps: 60,
        rtt_ms: 12,
        bitrate_kbps: 8400,
        packet_loss_percent: 0.0,
        resolution: "1920x1080".to_string(),
        started_at: now,
        unattended: false,
    };

    *session = Some(new_session.clone());
    Ok(new_session)
}

#[tauri::command]
pub fn disconnect_session(state: State<'_, AppState>) -> bool {
    let mut session = state.active_session.lock().unwrap();
    *session = None;
    true
}

#[tauri::command]
pub fn get_active_session(state: State<'_, AppState>) -> Option<RemoteSessionInfo> {
    state.active_session.lock().unwrap().clone()
}

#[tauri::command]
pub fn window_action(window: Window, action: String) -> Result<(), String> {
    match action.as_str() {
        "minimize" => {
            let _ = window.minimize();
        }
        "toggle_maximize" => {
            let _ = if window.is_maximized().unwrap_or(false) {
                window.unmaximize()
            } else {
                window.maximize()
            };
        }
        "close" => {
            let _ = window.close();
        }
        other => return Err(format!("Unknown action: {other}")),
    }
    Ok(())
}
