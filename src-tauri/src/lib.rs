#[cfg(target_os = "windows")]
mod audio;

#[cfg(target_os = "windows")]
mod overlay;

#[cfg(target_os = "windows")]
pub use audio::Session;

#[cfg(not(target_os = "windows"))]
#[derive(serde::Serialize, Clone, Debug)]
pub struct Session {
    pub pid: u32,
    pub process_name: String,
    pub volume: f32,
    pub muted: bool,
}

#[tauri::command]
fn list_audio_sessions() -> Result<Vec<Session>, String> {
    #[cfg(target_os = "windows")]
    {
        audio::list_sessions().map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("audio control only implemented on Windows".into())
    }
}

#[tauri::command]
fn set_app_volume(app_id: String, volume: f32) -> Result<usize, String> {
    let v = volume.clamp(0.0, 1.0);
    #[cfg(target_os = "windows")]
    {
        let hits = audio::set_volume_matching(&app_id, v).map_err(|e| e.to_string())?;
        log::debug!("set_app_volume({app_id} → {v:.3}) matched {hits} session(s)");
        Ok(hits)
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = (app_id, v);
        Err("audio control only implemented on Windows".into())
    }
}

#[tauri::command]
fn set_volume_for_pid(pid: u32, volume: f32) -> Result<bool, String> {
    let v = volume.clamp(0.0, 1.0);
    #[cfg(target_os = "windows")]
    {
        audio::set_volume_for_pid(pid, v).map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = (pid, v);
        Err("audio control only implemented on Windows".into())
    }
}

#[tauri::command]
fn set_mini_mode(window: tauri::WebviewWindow, enabled: bool) -> Result<(), String> {
    use tauri::{LogicalSize, Size};

    window
        .set_always_on_top(enabled)
        .map_err(|e| format!("set_always_on_top: {e}"))?;
    window
        .set_skip_taskbar(enabled)
        .map_err(|e| format!("set_skip_taskbar: {e}"))?;
    window
        .set_decorations(!enabled)
        .map_err(|e| format!("set_decorations: {e}"))?;
    window
        .set_resizable(!enabled)
        .map_err(|e| format!("set_resizable: {e}"))?;

    // Set min size first so the shrink to mini dimensions is not clamped
    // by the larger min in tauri.conf.json.
    let (min_w, min_h, w, h) = if enabled {
        (300.0, 80.0, 380.0, 96.0)
    } else {
        (520.0, 480.0, 760.0, 620.0)
    };
    window
        .set_min_size(Some(Size::Logical(LogicalSize::new(min_w, min_h))))
        .map_err(|e| format!("set_min_size: {e}"))?;
    window
        .set_size(Size::Logical(LogicalSize::new(w, h)))
        .map_err(|e| format!("set_size: {e}"))?;

    #[cfg(target_os = "windows")]
    {
        let hwnd = window.hwnd().map_err(|e| format!("hwnd: {e}"))?;
        let raw = hwnd.0 as isize;
        overlay::apply(raw, enabled)?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_audio_sessions,
            set_app_volume,
            set_volume_for_pid,
            set_mini_mode
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
