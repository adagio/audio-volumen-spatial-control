#[cfg(target_os = "windows")]
mod audio;

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
            set_volume_for_pid
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
