# CONNECT — One Connection. Every Device.

> **Universal Remote Access, Screen Sharing & Device Control Platform**  
> Engineered by **Kaushik Boruah** ([@kituontop69-cell](https://github.com/kituontop69-cell)) • [gokaushik.com](https://gokaushik.com)

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Android%20%7C%20macOS%20(Planned)-blue.svg?style=for-the-badge&logo=windows)](https://github.com/kituontop69-cell/CONNECT)
[![Framework](https://img.shields.io/badge/Framework-Tauri%20v2%20%2B%20Rust-brightgreen.svg?style=for-the-badge&logo=tauri)](https://github.com/kituontop69-cell/CONNECT)
[![Frontend](https://img.shields.io/badge/UI-React%2019%20%7C%20Tailwind%20%7C%20Zustand-cyan.svg?style=for-the-badge&logo=react)](https://github.com/kituontop69-cell/CONNECT)
[![Security](https://img.shields.io/badge/Security-TLS%201.3%20%7C%20ChaCha20--Poly1305-emerald.svg?style=for-the-badge&logo=shield)](https://github.com/kituontop69-cell/CONNECT)

---

## ⚡ Overview

**CONNECT** is an ultra-low latency, cross-platform remote desktop control, screen sharing, and peer-to-peer file transfer engine. It fuses the enterprise stability of **TeamViewer**, the agility of **AnyDesk**, and the cross-device fluidity of **AirDroid** into one cohesive, modern desktop application.

Built from the ground up on **Tauri v2** and **Rust**, CONNECT delivers hardware-accelerated D3D11 capture, sub-15ms input injection via native Win32 `SendInput`, and real-time P2P transport over WebRTC and local UDP discovery beacons.

---

## 💎 Core Architecture & Capabilities

### 1. 🔗 Universal 4-Way Pairing Matrix
* **Method A: Dynamic QR Pairing** — Single-use cryptographically signed QR code with 300s TTL for instant mobile phone pairing without typing passwords.
* **Method B: 9-Digit Connect ID & Auto-Rotating PIN** — Classic `XXX-XXX-XXX` structured identifier with temporary 6-digit access PIN.
* **Method C: Local LAN Subnet Radar (Port `43888`)** — Zero-config automatic discovery of all active CONNECT nodes on your local Wi-Fi network using broadcast UDP beacons.
* **Method D: Ephemeral Direct Link** — One-click pairing URLs shareable via messaging apps with mandatory recipient approval.

### 2. 🎮 High-Precision Remote Control Engine
* **Native Input Injection:** Direct Win32 `SendInput` mouse and keyboard dispatch with normalized `0.0..1.0` coordinate scaling.
* **Multi-Monitor Selection:** Real-time enumeration of connected physical monitors (`EnumDisplayMonitors`) with per-display routing.
* **Hardware Video Compression:** D3D11 Desktop Duplication API with hardware-accelerated NVENC / AMF / Intel QuickSync encoding.

### 3. 📊 Draggable Live Telemetry HUD
* Realtime metrics overlay displaying:
  * **FPS:** Adaptive 30–60–120 FPS
  * **RTT Latency:** Sub-15ms on LAN, minimal on WAN
  * **Bitrate:** Dynamic adaptation up to 50 Mbps
  * **Network Vitals:** Packet loss %, jitter ms, and active route (`DirectLAN`, `P2P_WebRTC`, `Relayed_TURN`).

### 4. 🚀 Encrypted P2P Chunked File Transfer
* High-throughput file streaming directly between peers.
* Automatic chunk resume on network drops.
* Cryptographic SHA-256 file integrity validation.
* Zero cloud storage exposure or intermediary server logging.

### 5. 🛡️ Unattended Access & Security Gate
* Master passphrase protection with Argon2id key derivation.
* TLS 1.3 handshake with Curve25519 key exchange.
* ChaCha20-Poly1305 authenticated symmetric media stream encryption.
* Persistent unmistakable visual indicator on host display whenever remote control is active.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app/) (Rust 1.75+, WebView2) |
| **Native Engine** | Rust (`tokio`, `sysinfo`, Win32 API bindings, UDP socket broadcasting) |
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Styling & Motion** | [Tailwind CSS v3](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Build & Tooling** | Vite v6, Cargo, NSIS 3.13, WiX Toolset |

---

## 🚀 Building from Source

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Rust & Cargo](https://rustup.rs/) (latest stable)
* [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (on Windows)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kituontop69-cell/CONNECT.git
cd CONNECT

# Install frontend dependencies
npm install

# Run in Development Mode (Live HMR + Native Rust Shell)
npm run tauri dev

# Build Production Standalone Executable (.exe & .msi)
npm run tauri build
```

The production release binaries will be generated at:
* **Standalone Portable Executable:** `src-tauri/target/release/connect.exe`
* **Windows NSIS Installer:** `src-tauri/target/release/bundle/nsis/CONNECT_0.1.0_x64-setup.exe`
* **Enterprise MSI Package:** `src-tauri/target/release/bundle/msi/CONNECT_0.1.0_x64_en-US.msi`

---

## 👤 Developer & Maintainer

**Kaushik Boruah**
* Website: [https://gokaushik.com](https://gokaushik.com)
* GitHub: [@kituontop69-cell](https://github.com/kituontop69-cell)
* Portfolio: [gokaushik.com/projects](https://gokaushik.com/projects)

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
