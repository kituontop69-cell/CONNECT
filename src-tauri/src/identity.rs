use rand::Rng;
use std::net::UdpSocket;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct IdentityManager {
    device_id: String,
    device_name: String,
    current_pin: Mutex<String>,
    qr_token: Mutex<(String, u64)>, // (token, expiry_timestamp)
}

impl IdentityManager {
    pub fn new() -> Self {
        // Read machine name
        let device_name = whoami_device_name();
        
        // Generate a deterministic or randomized 9-digit ID (XXX-XXX-XXX)
        let device_id = generate_connect_id(&device_name);
        
        // Initial 6-digit PIN
        let pin = generate_pin();
        
        // Initial QR token (valid for 300 seconds)
        let now = current_epoch_seconds();
        let token = generate_random_token(32);

        Self {
            device_id,
            device_name,
            current_pin: Mutex::new(pin),
            qr_token: Mutex::new((token, now + 300)),
        }
    }

    pub fn get_device_id(&self) -> String {
        self.device_id.clone()
    }

    pub fn get_device_name(&self) -> String {
        self.device_name.clone()
    }

    pub fn get_current_pin(&self) -> String {
        self.current_pin.lock().unwrap().clone()
    }

    pub fn refresh_pin(&self) -> String {
        let mut pin = self.current_pin.lock().unwrap();
        *pin = generate_pin();
        pin.clone()
    }

    pub fn get_or_refresh_qr_token(&self) -> (String, u32) {
        let now = current_epoch_seconds();
        let mut qr = self.qr_token.lock().unwrap();
        
        if qr.1 <= now {
            // Expired, generate new
            qr.0 = generate_random_token(32);
            qr.1 = now + 300;
        }

        let remaining = (qr.1.saturating_sub(now)) as u32;
        (qr.0.clone(), remaining)
    }

    pub fn force_refresh_qr_token(&self) -> (String, u32) {
        let now = current_epoch_seconds();
        let mut qr = self.qr_token.lock().unwrap();
        qr.0 = generate_random_token(32);
        qr.1 = now + 300;
        (qr.0.clone(), 300)
    }
}

pub fn get_local_ip() -> String {
    // Probe local route via UDP socket to get primary network interface IP without sending packets
    if let Ok(socket) = UdpSocket::bind("0.0.0.0:0") {
        if socket.connect("8.8.8.8:80").is_ok() {
            if let Ok(addr) = socket.local_addr() {
                return addr.ip().to_string();
            }
        }
    }
    "127.0.0.1".to_string()
}

fn whoami_device_name() -> String {
    #[cfg(target_os = "windows")]
    {
        if let Ok(name) = std::env::var("COMPUTERNAME") {
            return name;
        }
    }
    if let Ok(name) = std::env::var("HOSTNAME") {
        return name;
    }
    "CONNECT-Node".to_string()
}

fn generate_connect_id(_seed: &str) -> String {
    // Generate 9 digits with checksum-like format: XXX-XXX-XXX
    let mut rng = rand::thread_rng();
    let p1: u32 = rng.gen_range(100..999);
    let p2: u32 = rng.gen_range(100..999);
    let p3: u32 = rng.gen_range(100..999);
    format!("{p1}-{p2}-{p3}")
}

fn generate_pin() -> String {
    let mut rng = rand::thread_rng();
    let n: u32 = rng.gen_range(100_000..999_999);
    n.to_string()
}

fn generate_random_token(len: usize) -> String {
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let mut rng = rand::thread_rng();
    (0..len)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

fn current_epoch_seconds() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}
