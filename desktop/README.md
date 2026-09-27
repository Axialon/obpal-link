# ob.Pal Desktop

The small Windows helper that makes your phone this computer's mouse and keyboard, through ob.Pal Link: in every window, or only the programs you allow.

## Install

1. Download **[obpal-desktop-windows-x64.zip](https://github.com/Axialon/obpal-link/releases/latest/download/obpal-desktop-windows-x64.zip)**. Unzip it into a folder you'll keep, and double-click `install.cmd`. It registers the helper for Chrome, Chromium, Edge, Brave and Vivaldi, for your Windows user only.
2. In ob.Pal Link's popup, pick **PC**, and allow the permission it asks for.
3. Click **Control the whole PC**. Or bring one program to the front, come back to the popup and click **Allow**.

To update, switch ob.Pal Link away from **PC** (or close the browser), then unzip the new version over the old folder. Version 0.2 adds the whole PC and clicks; ob.Pal Link 1.3 or later uses them.

## Uninstall

Double-click `uninstall.cmd`. It removes the browser registration, the settings and the helper's files, and the folder itself once it's empty. The browser can stay open: a running helper notices and stops by itself (0.2.1 and later). To start over completely, also remove ob.Pal Link from the browser's extensions page, which clears its pairings.

The helper isn't code-signed yet, so Windows SmartScreen may warn about it. Choose **More info**, then **Run anyway**.

## If the popup still says it isn't installed

- **Use ob.Pal Link 1.2 or later.** Its fixed extension ID (`jnnpcnoilofjaffabnhecfokjjknlemg`) is the one the helper lets in. Remove any older ob.Pal Link first, then load the new folder.
- **Moved the folder?** Run `install.cmd` again from where it is now.
- **Ran `install.cmd` from inside the zip?** Unzip it first: a copy run from inside the zip lives in a temporary folder that Windows clears (the helper now refuses to install from one).
- **Check the registration.** Open a terminal in the folder and run `obpal-desktop status`: it lists the browsers it's registered for.
- **Reload the extension.** Go to the extensions page and use the reload arrow.

## Safety

- Nothing reaches the PC until you turn on the whole PC or allow a program, and only the kinds you chose (keyboard, mouse).
- One program at a time: input reaches it only while it's in front, and switching windows releases every held key.
- `Ctrl`+`Alt`+`Backspace` stops everything. Windows keeps programs running as administrator out of reach.

## Source

[Axialon/obpal: `desktop/`](https://github.com/Axialon/obpal/tree/main/desktop) (Rust, MIT).
