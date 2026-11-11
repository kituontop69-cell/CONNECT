use crate::models::DiscoveredDevice;
use std::net::UdpSocket;
use std::time::Duration;

pub const DISCOVERY_PORT: u16 = 43888;

pub fn scan_lan_devices(my_id: &str) -> Vec<DiscoveredDevice> {
    let mut devices = Vec::new();
    
    // Bind temporary UDP socket
    if let Ok(socket) = UdpSocket::bind("0.0.0.0:0") {
        let _ = socket.set_broadcast(true);
        let _ = socket.set_read_timeout(Some(Duration::from_millis(250)));

        // Send discovery beacon
        let beacon = format!("CONNECT_DISCOVERY_PING:{}", my_id);
        let _ = socket.send_to(beacon.as_bytes(), format!("255.255.255.255:{}", DISCOVERY_PORT));

        // Listen for responses
        let mut buf = [0u8; 1024];
        let start = std::time::Instant::now();

        while start.elapsed() < Duration::from_millis(300) {
            if let Ok((len, src)) = socket.recv_from(&mut buf) {
                if let Ok(msg) = std::str::from_utf8(&buf[..len]) {
                    if let Some(payload) = msg.strip_prefix("CONNECT_DISCOVERY_PONG:") {
                        // Format: ID|Name|OS
                        let parts: Vec<&str> = payload.split('|').collect();
                        if parts.len() >= 3 && parts[0] != my_id {
                            devices.push(DiscoveredDevice {
                                device_id: parts[0].to_string(),
                                device_name: parts[1].to_string(),
                                os_type: parts[2].to_string(),
                                ip_address: src.ip().to_string(),
                                port: src.port(),
                                is_trusted: false,
                                latency_ms: start.elapsed().as_millis() as u32,
                            });
                        }
                    }
                }
            }
        }
    }

    devices
}
