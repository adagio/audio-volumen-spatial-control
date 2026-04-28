# Spatial Audio Volume

Desktop app to balance the volume of two running applications spatially, by
moving a single avatar along a horizontal axis. As the listener leans toward
one app, that app gets louder and the other quieter — driving the same Windows
audio sessions you'd see in **Settings → System → Sound → Volume Mixer**.

Built with Tauri 2 + Rust, vanilla HTML/CSS/JS frontend.

## Demo

<video src="https://audio-volumen-spatial-control.franco-cedillo.workers.dev/assets/SpatialAudioVolume.mp4" poster="https://audio-volumen-spatial-control.franco-cedillo.workers.dev/assets/poster.png" controls muted playsinline width="720"></video>

[![Demo poster](https://audio-volumen-spatial-control.franco-cedillo.workers.dev/assets/poster.png)](https://audio-volumen-spatial-control.franco-cedillo.workers.dev/)

[▶ Ver demo en el sitio](https://audio-volumen-spatial-control.franco-cedillo.workers.dev/) ·
[Descargar MP4](https://audio-volumen-spatial-control.franco-cedillo.workers.dev/assets/SpatialAudioVolume.mp4)

## What it does

- Lists every audio session active on the default render endpoint (the same
  list as the Volume Mixer).
- Two slots ("left" and "right") drive volumes from your axis position.
- A "you" avatar in the middle of the field is draggable; arrow keys also
  move it. Position `-1` puts left slot at 100% and right at 0%, position
  `+1` is the opposite, `0` is balanced.
- A stack of inactive sessions sits below the field. Click an active bubble
  to arm its slot, then click any stack chip to swap.

Sessions identify by PID, so two instances of the same program don't
move together.

## Platform

Windows only. The audio backend talks to WASAPI's `IAudioSessionManager2` /
`ISimpleAudioVolume` directly via the `windows` crate. Linux (PulseAudio /
PipeWire) and macOS (CoreAudio) backends are not implemented.

## Run

Prerequisites: Rust toolchain, `cargo-tauri`. (Node is **not** required —
the frontend is plain static files.)

```powershell
cargo tauri dev
```

For a release build:

```powershell
cargo tauri build
```

The bundled installer lands in `src-tauri/target/release/bundle/`.

## Controls

| Action | Effect |
|---|---|
| Drag head ("you") | Move along the L/R axis |
| `←` / `→` | Step left / right |
| `Home` or `0` | Recenter |
| Double-click field | Recenter |
| `Esc` | Disarm a selected slot |
| Click app bubble | Arm that slot for swap |
| Click stack chip (slot armed) | Swap session into the armed slot |
| Click stack chip (no slot armed) | Default into the left slot |

## Architecture

```
src/                       static frontend (HTML/CSS/JS, no bundler)
  index.html               sketchy SVG field + stack container
  style.css                Caveat-font hand-drawn aesthetic
  main.js                  state, polling, render, drag/keyboard
src-tauri/
  src/lib.rs               #[tauri::command]s exposed to the webview
  src/audio.rs             WASAPI session enumeration + volume control
  tauri.conf.json          window config + frontendDist pointer
  Cargo.toml               windows = "0.61" (Windows-only target dep)
```

### Tauri commands

| Command | Args | Returns |
|---|---|---|
| `list_audio_sessions` | — | `[{ pid, process_name, volume, muted }, …]` |
| `set_volume_for_pid` | `{ pid, volume }` (0..1) | `bool` (true if matched) |
| `set_app_volume` | `{ appId, volume }` | `usize` (sessions matched by name substring) |

The frontend uses `set_volume_for_pid` for precision; `set_app_volume` is
kept for debug/console use.

### COM apartment quirk

Tauri command threads come pre-initialized as STA by webview2/wry, so a
naive `CoInitializeEx(MTA)` returns `RPC_E_CHANGED_MODE` (0x80010106). The
`ComGuard` in `audio.rs` treats that HRESULT as success-without-init and
skips `CoUninitialize` on drop — the audio session APIs work in either
apartment so the apartment mismatch is not a problem.

### Cargo workspace note

The parent directory tree contains other Cargo workspaces. `src-tauri/Cargo.toml`
declares an empty `[workspace]` table to opt out of any ancestor workspace and
stand on its own; without it `cargo` fails with "multiple workspace roots".

## Known limitations

- Windows-only (see Platform).
- Sessions only appear once an app actually starts producing audio — Windows
  doesn't create the session until then. Empty stack on launch is normal if
  no apps are playing.
- The stack auto-fills empty slots with the first available session on each
  poll (every 2s). Slot assignments don't persist across restarts.
- Process basename is shown in lower-case as reported by Windows; long names
  are truncated.

## Credits

Wireframes generated via Claude Design (claude.ai/design); option **A · Spatial
Field (top-down)** was selected and adapted. Drag interaction was inverted
from the source: in the wireframe the app bubbles were draggable, here the
listener avatar moves while apps stay fixed.
