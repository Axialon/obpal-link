# ob.Pal Link

Your phone as a controller for any website. ob.Pal Link is a browser extension (Chromium, Manifest V3). Pair your phone by scanning a QR code; the phone needs no app, because the controller opens in its browser.

- **Controller**: a standard gamepad for any game that uses the Gamepad API, cloud gaming included.
- **3D**: drag to rotate, two fingers to pan and pinch to zoom, on any 3D viewer in the page.
- **Keys**: keyboard and mouse input for keyboard games.
- **PC** (Windows): keyboard and mouse for the desktop programs you allow, through the ob.Pal Desktop helper.

A phone you've paired once also connects directly over your Wi-Fi when the internet is down.

It works in Chrome, Edge, Brave, Opera, Vivaldi and Arc (Chromium 120 or later).

Website: [obpal.blackboxes.net/link](https://obpal.blackboxes.net/link/) · Source: [github.com/Axialon/obpal](https://github.com/Axialon/obpal) (this repository carries the releases)

## Install

The Chrome Web Store listing is on its way. Until then, install it from this repository:

1. Download **[obpal-link.zip](https://github.com/Axialon/obpal-link/releases/latest/download/obpal-link.zip)** from the latest release and unzip it into a folder you'll keep. You can also clone this repository and use its `extension` folder.
2. Open the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
   - Opera: `opera://extensions`
   - Vivaldi: `vivaldi://extensions`
   - Arc: `arc://extensions`
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the folder (the one that contains `manifest.json`).
5. Pin **ob.Pal Link** to the toolbar.

To update, replace the folder with the new release, then click the reload icon on the extension's card.

**Updating from 1.1 or earlier:** version 1.2 has a fixed extension ID (so the PC helper can recognise it). Remove the old ob.Pal Link from the extensions page, then load the new folder.

## Pair and play

1. Open the game or 3D page, then click the ob.Pal Link toolbar icon.
2. Scan the QR code with your phone's camera. The ob.Pal controller opens in the phone's browser, and the status changes to **Connected**.
3. Turn on **This tab**.
4. Pick what the phone drives: **Controller**, **3D** or **Keys**. You can also switch from the phone, with the **Target** picker in its tray.

**Controlling tabs**
- One tab is controlled at a time. Turning on another tab moves control to it.
- A dot on the toolbar icon marks the controlled tab. It's lime while the phone is connected.

**How long the pairing lasts**
- The pairing stays up until the browser closes, or until you press × in the popup.
- To reconnect after that, scan the code again.

## Modes

### Controller

`navigator.getGamepads()` includes `ob.Pal Controller`, which uses the standard mapping.
- `gamepadconnected` and `gamepaddisconnected` fire.
- As with a real controller in Chrome, the pad appears on its first button press after the page has loaded.
- Physical controllers keep their slots.
- Rumble (`vibrationActuator.playEffect('dual-rumble', …)`) vibrates the phone.
- The phone must be in its **Gamepad** mode.

**Motion.** The phone's Motion chips follow the [control catalogue](https://github.com/Axialon/obpal/blob/main/spec/CATALOGUE.md). Hold a chip for its options (route, sensitivity, deadzone jump, invert Y). The profile pill picks a profile: Default, Flight, Driving, Shooter or Pointer. Some sites suggest one (tesana.com suggests Flight), and your own choice always wins.

| Utility | Page receives |
|---|---|
| **Aim** (gyro turn rate) | Right-stick values that clear the game's deadzone with a small turn; with Shooter, mouse movement under pointer lock |
| **Steer** (tilt angle) | Flight: tilt = right-stick X and tip = right-stick Y, like a yoke. Default and Driving: tilt = left-stick X, like a wheel |
| **Point** (Wii-style) | A lime cursor where the phone points. A clicks under it and holding B drags, through frames and open shadow roots. Under pointer lock it becomes mouse movement |

While A or B click at the cursor, they don't also reach the game as gamepad buttons.

### 3D

The target is the largest visible canvas or `<model-viewer>` in the page.

| Phone input | Page receives |
|---|---|
| One-finger trackpad, Point-mode gyro, right stick, tilt | left-button drag (rotate) |
| Two-finger drag, left stick | right-button drag (pan) |
| Pinch, RT (in) / LT (out) | wheel events (zoom) |

### Keys

| Phone input | Keyboard / mouse |
|---|---|
| Left stick (or tilt) | W A S D |
| D-pad | Arrow keys |
| A / B / X / Y | Space / Escape / E / Q |
| Menu | Enter |
| LB / RB | Shift / Control |
| Right stick, Point-mode gyro, trackpad | mouse movement |
| RT / LT | left / right mouse button |

### PC (Windows)

1. Download **[obpal-desktop-windows-x64.zip](https://github.com/Axialon/obpal-link/releases/latest/download/obpal-desktop-windows-x64.zip)**, unzip it into a folder you'll keep, and double-click `install.cmd`. It registers the helper for Chrome, Chromium, Edge, Brave and Vivaldi, for your Windows user only.
2. In the popup, pick **PC** and allow the permission it asks for.
3. Bring the program you want to control to the front, then click **Allow** in the popup.

- Input reaches only programs you've allowed, while they're in front, and only the kinds you allowed (keyboard, mouse). Manage the list in the extension's options.
- Never the browser itself, and never programs running as administrator.
- `Ctrl`+`Alt`+`Backspace` stops everything; switching windows releases every held key.

The helper isn't code-signed yet, so Windows may warn about it. Its source is in [`desktop/`](https://github.com/Axialon/obpal/tree/main/desktop).

### No internet

After one online pairing, the extension and the phone remember each other. When the ob.Pal service can't be reached, the popup shows a **direct code**. Scan it and the phone opens the controller from its cache and connects straight over your local network. The code works once; a fresh one replaces it. Forget a phone with × in the popup, or in the phone's settings.

## Privacy and permissions

There are no accounts and no analytics, and the extension loads no remote code. Its only network use is the ob.Pal service (pairing and relay credentials) and the direct, encrypted WebRTC connection to your phone. It doesn't read page content, browsing history or what you type. Full policy: [obpal.blackboxes.net/privacy](https://obpal.blackboxes.net/privacy/)

| Permission | Why |
|---|---|
| `offscreen` | An MV3 service worker can't hold a WebRTC connection, so an offscreen document keeps the link to the phone. |
| `storage` | Remembers the chosen mode. Until the browser closes, session storage also holds the controlled tab and the link status. |
| `activeTab` | Clicking the toolbar icon grants access to the current tab only. |
| `scripting` | Injects the input bridge into the tab you turned on. |
| `https://obpal.blackboxes.net/*` | Pairing (signaling) and relay (TURN) credentials. |
| `<all_urls>` (optional, off by default) | Only when you turn on **All sites**: reaches game frames served from other domains, and keeps control across navigation. |
| `nativeMessaging` (optional, off by default) | Only when you pick **PC**: talks to ob.Pal Desktop on your computer. |

The files in [`extension/`](extension) are the complete extension, unminified, exactly as it runs.

## Limitations

- **Synthetic events are untrusted.** Pages that check `isTrusted` ignore them, which includes some games, anti-cheat systems and many login and payment forms. Browser defaults don't run either: arrow keys don't scroll, and keys don't type into inputs.
- **Pointer lock and fullscreen need a real click.** Click the game yourself; mouse-look then works through `movementX`/`movementY`.
- **Cross-origin game frames need All sites.** That includes most itch.io games and many embeds.
- **Some pages can't be controlled:** browser pages such as `chrome://`, extension stores, and other extensions' pages.
- One phone and one controlled tab at a time.
- PC control is Windows only for now, with keyboard and relative mouse (no virtual gamepad yet).
- The direct code needs both devices on the same network, with local network names (mDNS) working. Some Chrome builds are phasing out what the phone side needs, so it can fall back to online-only.

## Contact

[hello@obpal.blackboxes.net](mailto:hello@obpal.blackboxes.net) · Part of [ob.Pal](https://obpal.blackboxes.net) and the [Blackboxes](https://ecosystem.blackboxes.net) ecosystem.

## License

MIT, see [LICENSE](LICENSE).
