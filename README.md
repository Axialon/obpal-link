# ob.Pal Link

Your phone as a controller for websites in your browser. ob.Pal Link is a browser extension (Chromium, Manifest V3). Pair your phone by scanning a QR code; the phone needs no app, because the controller opens in its browser.

- **Controller**: a standard gamepad for browser games that read the Gamepad API (see [Limitations](#limitations)).
- **3D**: drag to rotate, two fingers to pan and pinch to zoom, in compatible 3D viewers in the page.
- **Keys**: keyboard and mouse input for keyboard games.
- **PC** (Windows): your phone as this computer's mouse and keyboard, in every window or only the programs you allow, through the ob.Pal Desktop helper, with the phone's own keyboard for typing.

A phone you've paired once can also connect directly over your Wi-Fi when the internet is down, if your network lets devices reach each other (see [Limitations](#limitations)).

It works in Chrome, Edge, Brave and Vivaldi (Chromium 120 or later). Other Chromium browsers may work, but aren't tested.

Website: [obpal.blackboxes.net/link](https://obpal.blackboxes.net/link/) · Source: [github.com/Axialon/obpal](https://github.com/Axialon/obpal) (this repository carries the releases)

## What's new in 1.8.0

- **The QR becomes the seal.** When your phone connects, the QR code gathers into the connection seal in the same spot and stays there while you're connected, so you can check the symbols match at any time. It stays legible and keeps clear of the page's own controls.
- **One look everywhere.** The toolbar icon, popup and options use the same ob.Pal mark as the website and the store listing.
- **Calmer waiting.** Pairing and loading show a soft moving dot wave instead of spinners. When no QR code can be made (for example, while offline), Link says so with a clear symbol.
- **Steadier reconnects.** A phone that reconnects keeps its place, and the seal follows it.

**Updating from 1.7:** from the Chrome Web Store, it updates by itself. From this repository, replace the folder and reload, as below. Remembered phones carry over.

## New in 1.7.0

- **Pair, enable, try.** The popup walks you through the three steps, and **Try** opens a dot demo: turn on **This tab** there, choose **Controller**, and the dots follow your phone's left stick. A quick check before you open a game.
- **The connection seal.** When your phone connects, Link and the phone show the same three symbols. Check they match, and you know it's your phone that paired.
- **The PC install guide.** On ob.Pal's Desktop install page, Link shows whether the helper is connected and its version, and **Check in Link** opens the PC settings. The page gets nothing else, and can't send input or allow a phone.
- **Clearer words.** Rumble, 3D and the stop keys say exactly where they work. Allow and Deny, held-input release and `Ctrl`+`Alt`+`Backspace` work as before.

**Updating from 1.6:** from the Chrome Web Store, it updates by itself. From this repository, replace the folder and reload, as below. Remembered phones carry over.

## New in 1.6.2

- **Safer when a phone drops.** If your phone stops sending (it sleeps, loses signal or closes the controller), Link lets go of any held keys, buttons and mouse presses within half a second, and stops sending input. Nothing stays pressed on your computer.
- **Clearer about what works.** The extension's descriptions name the tested browsers and say that PC control is Windows only.

**Updating from 1.6.1:** replace the folder and reload, as below. Remembered phones carry over.

## New in 1.6.1

- **Bolder icons.** The toolbar and extensions-page icons are redrawn with heavier lines, so they stay clear at small sizes.

## New in 1.6

- **The PC asks first.** The first time a phone would control your PC, ob.Pal Link asks you once: **Allow** or **Deny**. Until you answer, the phone shows "Waiting for approval on the PC". Allowed phones never ask again, and you can change any answer in the options, under **Phones**.
- **A fresh QR code after every pairing.** An old code can't pair a new phone; the phone says "This code was used". Phones you've paired still reconnect.
- **The connection at a glance.** The popup shows the lock, whether the link is **Direct** or **Relayed**, and the round trip.
- **Keys that can't be copied out.** The pairing keys are kept non-extractable by the browser, on the phone and in the extension.

**Updating from 1.5:** replace the folder and reload, as below. Remembered phones carry over. Going back to 1.5 would forget them, and you'd pair again.

## Install

**[Add ob.Pal Link from the Chrome Web Store](https://chromewebstore.google.com/detail/obpal-link/jnnpcnoilofjaffabnhecfokjjknlemg)**. It works in Chrome, Edge, Brave and Vivaldi, and updates by itself. A new version can reach the store a few days after its release here, while the store reviews it.

Or install it from this repository:

1. Download **[obpal-link.zip](https://github.com/Axialon/obpal-link/releases/latest/download/obpal-link.zip)** from the latest release and unzip it into a folder you'll keep. You can also clone this repository and use its `extension` folder.
2. Open the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
   - Vivaldi: `vivaldi://extensions`
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the folder (the one that contains `manifest.json`).
5. Pin **ob.Pal Link** to the toolbar.

To update, replace the folder with the new release, then click the reload icon on the extension's card.

Keep the folder where it is, and don't load it from inside the zip or a folder that gets rebuilt: Chrome loads an unpacked extension from that folder every time it starts.

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

**The look**
- The popup and the options page come in the surfaces and colours the phone's settings offer. Pick one with the palette button in the popup, or under **Look** in the options (right-click the toolbar icon, then **Options**). Both pages follow at once.

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
2. In the popup, pick **PC** and allow the permission it asks for. The first time each phone would control the PC, the popup asks you once, with **!** on the toolbar icon: **Allow** or **Deny**. Turn on **Notify me** under **Phones** in the options to get the question as a Windows notification too.
3. Click **Control the whole PC**: the phone is the mouse and keyboard of every window, the browser included. Or, one program at a time: bring the program to the front, come back to the popup and click **Allow**.

| Phone | PC |
|---|---|
| Trackpad: drag · tap · tap again | move the pointer · click · double-click |
| hold, then lift · hold, then move | right-click · drag |
| two fingers · pinch · the wheel along its edge | scroll (a flick carries on) · zoom · scroll |
| Point (a mouse, held like a remote): aim · Left · Right | move the pointer · click where it went down · right-click |
| press Left and aim away · turn the wheel · tap it · hold it and aim | drag · scroll (turned fast, it spins free) · middle-click · scroll |
| zoom out · centre · zoom in | zoom · re-aim at the centre · zoom |
| Gamepad, whole PC | left stick: pointer · right stick: scroll · A / RT: click · X / LT: right-click · left stick press: middle-click · B: Esc · Y: Enter · D-pad: arrows · LB / RB: back / forward · Menu: Start · View: last app |
| Gamepad, one program | the Keys mapping above |
| **Keyboard** in the tray, or **Type** | type into the field that has the focus, with the phone's own keyboard (autocorrect, predictions, swipe typing) |
| its key row: esc · tab · ← ↑ ↓ → · ⌫ · ↵ | Esc · Tab · arrow keys · Backspace · Enter |

In Point, the phone's volume keys work too where its browser allows: up is Left, down holds the wheel.

**Typing.** When a text field on the PC has the keyboard focus, the phone shows **Type**: one tap opens the phone's own keyboard. In a password field, the phone types into a password field of its own, so nothing is suggested, learned or kept. **Keyboard** in the phone's tray opens it at any time. **Type** shows only where typing goes through: the whole PC or an allowed program, with keys allowed and not paused. If typing can't get through, the phone says why. Typing needs ob.Pal Desktop 0.3 or later.

- Nothing reaches the PC until you pick **PC** and turn on the whole PC or allow a program. Manage both in the extension's options, where **Pause all** stops everything.
- `Ctrl`+`Alt`+`Backspace` stops keyboard and mouse input from the phone at once. Windows keeps programs running as administrator out of reach.
- **Updating the helper:** switch ob.Pal Link away from **PC** and close its options page if it's open (or close the browser), then unzip the new version over the old folder.
- **Removing it:** double-click `uninstall.cmd` in its folder. It removes the helper, its settings and its files, with the browser still open.

The helper isn't code-signed yet, so Windows may warn about it. Its source is in [`desktop/`](https://github.com/Axialon/obpal/tree/main/desktop).

### No internet

After one online pairing, the extension and the phone remember each other. When the ob.Pal service can't be reached, the popup shows a **direct code**. Scan it and the phone opens the controller from its cache and connects straight over your local network. The code works once; a fresh one replaces it. Forget a phone with × in the popup, or in the phone's settings.

## Privacy and permissions

There are no accounts and no analytics, and the extension loads no remote code. Its only network use is the ob.Pal service (pairing and relay credentials) and the direct, encrypted WebRTC connection to your phone. It doesn't read page content, browsing history or what you type on the computer. What you type on the phone's keyboard goes over that connection to the extension and on to ob.Pal Desktop, which types it; neither keeps it. Full policy: [obpal.blackboxes.net/privacy](https://obpal.blackboxes.net/privacy/)

| Permission | Why |
|---|---|
| `offscreen` | An MV3 service worker can't hold a WebRTC connection, so an offscreen document keeps the link to the phone. |
| `storage` | Remembers the chosen mode, the look, and your Allow or Deny for each phone. Until the browser closes, session storage also holds the controlled tab, the link status and its connection seal. |
| `activeTab` | Clicking the toolbar icon grants access to the current tab only. |
| `scripting` | Injects the input bridge into the tab you turned on. |
| `https://obpal.blackboxes.net/*` | Pairing (signaling) and relay (TURN) credentials. On the Desktop install page only, it shows whether the helper is connected and its version. |
| `<all_urls>` (optional, off by default) | Only when you turn on **All sites**: reaches game frames served from other domains, and keeps control across navigation. |
| `nativeMessaging` (optional, off by default) | Only when you pick **PC**: talks to ob.Pal Desktop on your computer. |
| `notifications` (optional, off by default) | Only when you turn on **Notify me** in the options: a phone's first request to control the PC comes as a notification with **Allow** and **Deny**. |

The files in [`extension/`](extension) are the complete extension, unminified, exactly as it runs.

## Limitations

- **Synthetic events are untrusted.** Pages that check `isTrusted` ignore them, which includes some games, anti-cheat systems and many login and payment forms. Browser defaults don't run either: arrow keys don't scroll, and keys don't type into inputs.
- **Pointer lock and fullscreen need a real click.** Click the game yourself; mouse-look then works through `movementX`/`movementY`.
- **Cross-origin game frames need All sites.** That includes most itch.io games and many embeds.
- **Some pages can't be controlled:** browser pages such as `chrome://`, extension stores, and other extensions' pages.
- One phone and one controlled tab at a time.
- PC control is Windows only for now, with keyboard and relative mouse (no virtual gamepad yet). Windows' pointer speed and *Enhance pointer precision* apply to the phone as to a mouse.
- The direct code needs both devices on the same network, with local network names (mDNS) working. Some Chrome builds are phasing out what the phone side needs, so it can fall back to online-only.

## Contact

[hello@obpal.blackboxes.net](mailto:hello@obpal.blackboxes.net) · Part of [ob.Pal](https://obpal.blackboxes.net) and the [Blackboxes](https://ecosystem.blackboxes.net) ecosystem.

## License

MIT, see [LICENSE](LICENSE). The fonts the extension bundles, Inter and Plus Jakarta Sans, are under the SIL Open Font License 1.1 ([Inter](extension/assets/OFL-Inter.txt), [Plus Jakarta Sans](extension/assets/OFL-PlusJakartaSans.txt)).
