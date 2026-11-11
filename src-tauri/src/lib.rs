pub mod capture;
pub mod commands;
pub mod discovery;
pub mod identity;
pub mod input;
pub mod models;
pub mod state;

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::get_device_profile,
            commands::refresh_pairing_pin,
            commands::generate_qr_pairing_token,
            commands::get_monitors,
            commands::get_system_telemetry,
            commands::discover_local_devices,
            commands::dispatch_mouse_action,
            commands::dispatch_keyboard_action,
            commands::start_connection,
            commands::disconnect_session,
            commands::get_active_session,
            commands::window_action,
        ])
        .run(tauri::generate_context!())
        .expect("error while running CONNECT application");
}
