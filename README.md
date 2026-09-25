# ob.Pal Link

Your phone as a controller for any website. ob.Pal Link is a browser extension (Chromium, Manifest V3). Pair your phone by scanning a QR code; the phone needs no app, because the controller opens in its browser.

- **Controller**: a standard gamepad for any game that uses the Gamepad API, cloud gaming included.
- **3D**: drag to rotate, two fingers to pan and pinch to zoom, on any 3D viewer in the page.
- **Keys**: keyboard and mouse input for keyboard games.

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

The files in [`extension/`](extension) are the complete extension, unminified, exactly as it runs.

## Limitations

- **Synthetic events are untrusted.** Pages that check `isTrusted` ignore them, which includes some games, anti-cheat systems and many login and payment forms. Browser defaults don't run either: arrow keys don't scroll, and keys don't type into inputs.
- **Pointer lock and fullscreen need a real click.** Click the game yourself; mouse-look then works through `movementX`/`movementY`.
- **Cross-origin game frames need All sites.** That includes most itch.io games and many embeds.
- **Some pages can't be controlled:** browser pages such as `chrome://`, extension stores, and other extensions' pages.
- One phone and one controlled tab at a time.

## Contact

[hello@obpal.blackboxes.net](mailto:hello@obpal.blackboxes.net) · Part of [ob.Pal](https://obpal.blackboxes.net) and the [Blackboxes](https://ecosystem.blackboxes.net) ecosystem.

## License

MIT, see [LICENSE](LICENSE).
