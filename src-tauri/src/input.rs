use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct MouseInputPayload {
    pub action: String, // "move", "down", "up", "click", "double_click", "right_click", "scroll"
    pub norm_x: f32,    // 0.0 to 1.0
    pub norm_y: f32,    // 0.0 to 1.0
    pub button: Option<String>,
    pub delta_y: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct KeyboardInputPayload {
    pub action: String, // "down", "up", "press"
    pub key: String,
    pub vk_code: Option<u16>,
}

#[cfg(target_os = "windows")]
mod win32_input {
    use super::*;

    const INPUT_MOUSE: u32 = 0;
    const INPUT_KEYBOARD: u32 = 1;

    const MOUSEEVENTF_MOVE: u32 = 0x0001;
    const MOUSEEVENTF_LEFTDOWN: u32 = 0x0002;
    const MOUSEEVENTF_LEFTUP: u32 = 0x0004;
    const MOUSEEVENTF_RIGHTDOWN: u32 = 0x0008;
    const MOUSEEVENTF_RIGHTUP: u32 = 0x0010;
    const MOUSEEVENTF_MIDDLEDOWN: u32 = 0x0020;
    const MOUSEEVENTF_MIDDLEUP: u32 = 0x0040;
    const MOUSEEVENTF_WHEEL: u32 = 0x0800;
    const MOUSEEVENTF_ABSOLUTE: u32 = 0x8000;

    #[allow(dead_code)]
    const KEYEVENTF_EXTENDEDKEY: u32 = 0x0001;
    const KEYEVENTF_KEYUP: u32 = 0x0002;
    const KEYEVENTF_UNICODE: u32 = 0x0004;

    #[repr(C)]
    struct MOUSEINPUT {
        dx: i32,
        dy: i32,
        mouse_data: u32,
        dw_flags: u32,
        time: u32,
        dw_extra_info: usize,
    }

    #[repr(C)]
    struct KEYBDINPUT {
        w_vk: u16,
        w_scan: u16,
        dw_flags: u32,
        time: u32,
        dw_extra_info: usize,
    }

    #[repr(C)]
    struct HARDWAREINPUT {
        u_msg: u32,
        param_l: u16,
        param_h: u16,
    }

    #[repr(C)]
    struct INPUT {
        r#type: u32,
        u: InputUnion,
    }

    #[repr(C)]
    union InputUnion {
        mi: std::mem::ManuallyDrop<MOUSEINPUT>,
        ki: std::mem::ManuallyDrop<KEYBDINPUT>,
        hi: std::mem::ManuallyDrop<HARDWAREINPUT>,
    }

    extern "system" {
        fn SendInput(c_inputs: u32, p_inputs: *const INPUT, cb_size: i32) -> u32;
    }

    pub fn dispatch_mouse(payload: &MouseInputPayload) -> bool {
        let abs_x = ((payload.norm_x.clamp(0.0, 1.0) * 65535.0) as i32).max(0);
        let abs_y = ((payload.norm_y.clamp(0.0, 1.0) * 65535.0) as i32).max(0);

        let mut inputs = Vec::new();

        match payload.action.as_str() {
            "move" => {
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE));
            }
            "down" => {
                let flag = match payload.button.as_deref() {
                    Some("right") => MOUSEEVENTF_RIGHTDOWN,
                    Some("middle") => MOUSEEVENTF_MIDDLEDOWN,
                    _ => MOUSEEVENTF_LEFTDOWN,
                };
                inputs.push(create_mouse_input(abs_x, abs_y, 0, flag | MOUSEEVENTF_ABSOLUTE));
            }
            "up" => {
                let flag = match payload.button.as_deref() {
                    Some("right") => MOUSEEVENTF_RIGHTUP,
                    Some("middle") => MOUSEEVENTF_MIDDLEUP,
                    _ => MOUSEEVENTF_LEFTUP,
                };
                inputs.push(create_mouse_input(abs_x, abs_y, 0, flag | MOUSEEVENTF_ABSOLUTE));
            }
            "click" => {
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_LEFTUP | MOUSEEVENTF_ABSOLUTE));
            }
            "right_click" => {
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_RIGHTDOWN | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_RIGHTUP | MOUSEEVENTF_ABSOLUTE));
            }
            "double_click" => {
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_LEFTUP | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_ABSOLUTE));
                inputs.push(create_mouse_input(abs_x, abs_y, 0, MOUSEEVENTF_LEFTUP | MOUSEEVENTF_ABSOLUTE));
            }
            "scroll" => {
                let delta = payload.delta_y.unwrap_or(0) as u32;
                inputs.push(create_mouse_input(abs_x, abs_y, delta, MOUSEEVENTF_WHEEL));
            }
            _ => return false,
        }

        unsafe {
            let count = inputs.len() as u32;
            let sent = SendInput(count, inputs.as_ptr(), std::mem::size_of::<INPUT>() as i32);
            sent == count
        }
    }

    pub fn dispatch_keyboard(payload: &KeyboardInputPayload) -> bool {
        let mut inputs = Vec::new();
        
        if let Some(vk) = payload.vk_code {
            match payload.action.as_str() {
                "down" => {
                    inputs.push(create_key_input(vk, 0, 0));
                }
                "up" => {
                    inputs.push(create_key_input(vk, 0, KEYEVENTF_KEYUP));
                }
                "press" => {
                    inputs.push(create_key_input(vk, 0, 0));
                    inputs.push(create_key_input(vk, 0, KEYEVENTF_KEYUP));
                }
                _ => return false,
            }
        } else {
            // Unicode characters
            for c in payload.key.encode_utf16() {
                match payload.action.as_str() {
                    "down" => {
                        inputs.push(create_key_input(0, c, KEYEVENTF_UNICODE));
                    }
                    "up" => {
                        inputs.push(create_key_input(0, c, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP));
                    }
                    _ => {
                        inputs.push(create_key_input(0, c, KEYEVENTF_UNICODE));
                        inputs.push(create_key_input(0, c, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP));
                    }
                }
            }
        }

        unsafe {
            let count = inputs.len() as u32;
            let sent = SendInput(count, inputs.as_ptr(), std::mem::size_of::<INPUT>() as i32);
            sent == count
        }
    }

    fn create_mouse_input(dx: i32, dy: i32, data: u32, flags: u32) -> INPUT {
        INPUT {
            r#type: INPUT_MOUSE,
            u: InputUnion {
                mi: std::mem::ManuallyDrop::new(MOUSEINPUT {
                    dx,
                    dy,
                    mouse_data: data,
                    dw_flags: flags,
                    time: 0,
                    dw_extra_info: 0,
                }),
            },
        }
    }

    fn create_key_input(vk: u16, scan: u16, flags: u32) -> INPUT {
        INPUT {
            r#type: INPUT_KEYBOARD,
            u: InputUnion {
                ki: std::mem::ManuallyDrop::new(KEYBDINPUT {
                    w_vk: vk,
                    w_scan: scan,
                    dw_flags: flags,
                    time: 0,
                    dw_extra_info: 0,
                }),
            },
        }
    }
}

pub fn dispatch_mouse(payload: MouseInputPayload) -> bool {
    #[cfg(target_os = "windows")]
    {
        win32_input::dispatch_mouse(&payload)
    }
    #[cfg(not(target_os = "windows"))]
    {
        true
    }
}

pub fn dispatch_keyboard(payload: KeyboardInputPayload) -> bool {
    #[cfg(target_os = "windows")]
    {
        win32_input::dispatch_keyboard(&payload)
    }
    #[cfg(not(target_os = "windows"))]
    {
        true
    }
}
