// WASAPI audio session control — same plumbing the Windows Volume Mixer uses.
// Flow: IMMDeviceEnumerator → default render endpoint → IAudioSessionManager2
//       → IAudioSessionEnumerator → per-session ISimpleAudioVolume::SetMasterVolume.
#![cfg(target_os = "windows")]

use serde::Serialize;
use windows::core::{Interface, PWSTR};
use windows::Win32::Foundation::CloseHandle;
use windows::Win32::Media::Audio::{
    eMultimedia, eRender, IAudioSessionControl2, IAudioSessionManager2, IMMDeviceEnumerator,
    ISimpleAudioVolume, MMDeviceEnumerator,
};
use windows::Win32::System::Com::{
    CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_ALL, COINIT_MULTITHREADED,
};
use windows::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_NAME_WIN32, PROCESS_QUERY_LIMITED_INFORMATION,
};

#[derive(Serialize, Clone, Debug)]
pub struct Session {
    pub pid: u32,
    pub process_name: String,
    pub volume: f32,
    pub muted: bool,
}

// RAII wrapper so every command call leaves COM in the same state it found it.
// Tauri command handlers run on threads that webview2/wry already initialized
// as STA. CoInitializeEx then returns RPC_E_CHANGED_MODE when we ask for MTA —
// in that case we don't init and we must NOT uninit on drop.
struct ComGuard {
    needs_uninit: bool,
}

const RPC_E_CHANGED_MODE: i32 = 0x80010106u32 as i32;

impl ComGuard {
    fn enter() -> windows::core::Result<Self> {
        let hr = unsafe { CoInitializeEx(None, COINIT_MULTITHREADED) };
        match hr.0 {
            // S_OK (0) → we initialized; balance with CoUninitialize.
            // S_FALSE (1) → already inited same mode; per MSDN, still pair with CoUninitialize.
            0 | 1 => Ok(Self { needs_uninit: true }),
            // Already inited with the OTHER apartment model — fine for our APIs;
            // don't uninit since our call didn't take.
            RPC_E_CHANGED_MODE => Ok(Self { needs_uninit: false }),
            _ => Err(hr.into()),
        }
    }
}

impl Drop for ComGuard {
    fn drop(&mut self) {
        if self.needs_uninit {
            unsafe { CoUninitialize() };
        }
    }
}

unsafe fn process_name_for(pid: u32) -> Option<String> {
    if pid == 0 {
        return None; // system-sounds session
    }
    let handle = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid).ok()?;
    let mut buf = [0u16; 1024];
    let mut size = buf.len() as u32;
    let res = QueryFullProcessImageNameW(
        handle,
        PROCESS_NAME_WIN32,
        PWSTR(buf.as_mut_ptr()),
        &mut size,
    );
    let _ = CloseHandle(handle);
    res.ok()?;
    let path = String::from_utf16_lossy(&buf[..size as usize]);
    path.rsplit('\\').next().map(str::to_string)
}

// Open the default render endpoint and grab its session enumerator. The
// caller holds COM via ComGuard so the returned interfaces stay valid.
unsafe fn open_session_enum() -> windows::core::Result<windows::Win32::Media::Audio::IAudioSessionEnumerator> {
    let enumerator: IMMDeviceEnumerator = CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)?;
    let device = enumerator.GetDefaultAudioEndpoint(eRender, eMultimedia)?;
    let manager: IAudioSessionManager2 = device.Activate(CLSCTX_ALL, None)?;
    manager.GetSessionEnumerator()
}

pub fn list_sessions() -> windows::core::Result<Vec<Session>> {
    let _com = ComGuard::enter()?;
    unsafe {
        let session_enum = open_session_enum()?;
        let count = session_enum.GetCount()?;
        let mut out = Vec::with_capacity(count as usize);
        for i in 0..count {
            let ctrl = session_enum.GetSession(i)?;
            let pid = ctrl
                .cast::<IAudioSessionControl2>()
                .and_then(|c2| c2.GetProcessId())
                .unwrap_or(0);
            let name = process_name_for(pid).unwrap_or_else(|| "(system sounds)".into());
            let vol: ISimpleAudioVolume = ctrl.cast()?;
            let level = vol.GetMasterVolume().unwrap_or(0.0);
            let muted = vol.GetMute().map(|b| b.as_bool()).unwrap_or(false);
            out.push(Session { pid, process_name: name, volume: level, muted });
        }
        Ok(out)
    }
}

pub fn set_volume_for_pid(target_pid: u32, level: f32) -> windows::core::Result<bool> {
    let _com = ComGuard::enter()?;
    let level = level.clamp(0.0, 1.0);
    unsafe {
        let session_enum = open_session_enum()?;
        let count = session_enum.GetCount()?;
        for i in 0..count {
            let ctrl = session_enum.GetSession(i)?;
            let pid = ctrl
                .cast::<IAudioSessionControl2>()
                .and_then(|c2| c2.GetProcessId())
                .unwrap_or(0);
            if pid != target_pid {
                continue;
            }
            let vol: ISimpleAudioVolume = ctrl.cast()?;
            vol.SetMasterVolume(level, std::ptr::null())?;
            return Ok(true);
        }
        Ok(false)
    }
}

pub fn set_volume_matching(pattern: &str, level: f32) -> windows::core::Result<usize> {
    let _com = ComGuard::enter()?;
    let pat = pattern.to_lowercase();
    let level = level.clamp(0.0, 1.0);
    unsafe {
        let session_enum = open_session_enum()?;
        let count = session_enum.GetCount()?;
        let mut hits = 0usize;
        for i in 0..count {
            let ctrl = session_enum.GetSession(i)?;
            let pid = ctrl
                .cast::<IAudioSessionControl2>()
                .and_then(|c2| c2.GetProcessId())
                .unwrap_or(0);
            let Some(name) = process_name_for(pid) else { continue };
            if !name.to_lowercase().contains(&pat) {
                continue;
            }
            let vol: ISimpleAudioVolume = ctrl.cast()?;
            vol.SetMasterVolume(level, std::ptr::null())?;
            hits += 1;
        }
        Ok(hits)
    }
}
