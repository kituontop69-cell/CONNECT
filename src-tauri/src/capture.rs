use crate::models::MonitorInfo;

#[cfg(target_os = "windows")]
mod win32_capture {
    use super::*;
    use std::ffi::c_void;

    type BOOL = i32;
    type HMONITOR = *mut c_void;
    type HDC = *mut c_void;
    type LPRECT = *mut RECT;
    type LPARAM = isize;

    #[repr(C)]
    #[derive(Default, Clone, Copy)]
    pub struct RECT {
        pub left: i32,
        pub top: i32,
        pub right: i32,
        pub bottom: i32,
    }

    #[repr(C)]
    #[derive(Default, Clone, Copy)]
    pub struct MONITORINFOEXW {
        pub cb_size: u32,
        pub rc_monitor: RECT,
        pub rc_work: RECT,
        pub dw_flags: u32,
        pub sz_device: [u16; 32],
    }

    extern "system" {
        fn EnumDisplayMonitors(
            hdc: HDC,
            lprc_clip: LPRECT,
            lpfn_enum: unsafe extern "system" fn(HMONITOR, HDC, LPRECT, LPARAM) -> BOOL,
            dw_data: LPARAM,
        ) -> BOOL;
        fn GetMonitorInfoW(h_monitor: HMONITOR, lpmi: *mut MONITORINFOEXW) -> BOOL;
        fn GetSystemMetrics(n_index: i32) -> i32;
    }

    const SM_CXSCREEN: i32 = 0;
    const SM_CYSCREEN: i32 = 1;

    struct EnumContext {
        monitors: Vec<MonitorInfo>,
    }

    unsafe extern "system" fn monitor_enum_proc(
        h_monitor: HMONITOR,
        _hdc: HDC,
        _rect: LPRECT,
        l_param: LPARAM,
    ) -> BOOL {
        let ctx = &mut *(l_param as *mut EnumContext);
        let mut info = MONITORINFOEXW {
            cb_size: std::mem::size_of::<MONITORINFOEXW>() as u32,
            ..Default::default()
        };

        if GetMonitorInfoW(h_monitor, &mut info) != 0 {
            let width = (info.rc_monitor.right - info.rc_monitor.left).abs() as u32;
            let height = (info.rc_monitor.bottom - info.rc_monitor.top).abs() as u32;
            let is_primary = (info.dw_flags & 1) != 0; // MONITORINFOF_PRIMARY = 1
            
            let len = info.sz_device.iter().position(|&c| c == 0).unwrap_or(32);
            let name = String::from_utf16_lossy(&info.sz_device[..len]);

            let id = ctx.monitors.len() as u32 + 1;
            ctx.monitors.push(MonitorInfo {
                id,
                name: if name.is_empty() { format!("Display {id}") } else { name },
                width,
                height,
                is_primary,
                scale_factor: 1.0,
            });
        }
        1 // Continue enumeration
    }

    pub fn enumerate_monitors() -> Vec<MonitorInfo> {
        let mut ctx = EnumContext { monitors: Vec::new() };
        unsafe {
            let l_param = &mut ctx as *mut EnumContext as LPARAM;
            EnumDisplayMonitors(std::ptr::null_mut(), std::ptr::null_mut(), monitor_enum_proc, l_param);
        }

        if ctx.monitors.is_empty() {
            // Fallback to primary screen metrics
            unsafe {
                let w = GetSystemMetrics(SM_CXSCREEN) as u32;
                let h = GetSystemMetrics(SM_CYSCREEN) as u32;
                vec![MonitorInfo {
                    id: 1,
                    name: "Primary Display".to_string(),
                    width: if w > 0 { w } else { 1920 },
                    height: if h > 0 { h } else { 1080 },
                    is_primary: true,
                    scale_factor: 1.0,
                }]
            }
        } else {
            ctx.monitors
        }
    }
}

pub fn get_monitors() -> Vec<MonitorInfo> {
    #[cfg(target_os = "windows")]
    {
        win32_capture::enumerate_monitors()
    }
    #[cfg(not(target_os = "windows"))]
    {
        vec![MonitorInfo {
            id: 1,
            name: "Primary Display".to_string(),
            width: 1920,
            height: 1080,
            is_primary: true,
            scale_factor: 1.0,
        }]
    }
}
