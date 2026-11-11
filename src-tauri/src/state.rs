use crate::identity::IdentityManager;
use crate::models::{DiscoveredDevice, RemoteSessionInfo};
use std::sync::Mutex;
use sysinfo::System;

pub struct AppState {
    pub identity: IdentityManager,
    pub sysinfo: Mutex<System>,
    pub active_session: Mutex<Option<RemoteSessionInfo>>,
    pub paired_devices: Mutex<Vec<DiscoveredDevice>>,
}

impl AppState {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();

        Self {
            identity: IdentityManager::new(),
            sysinfo: Mutex::new(sys),
            active_session: Mutex::new(None),
            paired_devices: Mutex::new(Vec::new()),
        }
    }
}
