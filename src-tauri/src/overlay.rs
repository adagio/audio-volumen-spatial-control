// Overlay-mode glue for Windows.
//
// Effect: 75% window opacity via WS_EX_LAYERED + SetLayeredWindowAttributes
// (LWA_ALPHA). Always-on-top and skip-taskbar are handled by the caller
// through the cross-platform Tauri APIs. Together those flags give an
// NVIDIA-ShadowPlay / AMD-ReLive style overlay, including persistence
// across virtual desktops (the Virtual Desktop Manager exempts
// WS_EX_TOOLWINDOW windows from per-desktop binding).
//
// Adapted from D:\files\projects\individual_me\time-timer\src-tauri\src\overlay.rs.

use windows::Win32::Foundation::{COLORREF, HWND};
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowLongPtrW, SetLayeredWindowAttributes, SetWindowLongPtrW, GWL_EXSTYLE, LWA_ALPHA,
    WS_EX_LAYERED,
};

const OVERLAY_ALPHA: u8 = 191; // ~75%
const OPAQUE_ALPHA: u8 = 255;

pub fn apply(hwnd_raw: isize, enabled: bool) -> Result<(), String> {
    let hwnd = HWND(hwnd_raw as *mut std::ffi::c_void);

    unsafe {
        // Ensure WS_EX_LAYERED is set so SetLayeredWindowAttributes works.
        // Leave the bit set even when disabling — toggling the style off and
        // on causes a visible repaint flash; resetting alpha to 255 gets the
        // same visual result without flicker.
        let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
        let want_style = ex_style | WS_EX_LAYERED.0 as isize;
        if ex_style != want_style {
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, want_style);
        }

        let alpha = if enabled { OVERLAY_ALPHA } else { OPAQUE_ALPHA };
        SetLayeredWindowAttributes(hwnd, COLORREF(0), alpha, LWA_ALPHA)
            .map_err(|e| format!("SetLayeredWindowAttributes failed: {e}"))?;
    }

    Ok(())
}
