# ob.Pal Desktop

The small Windows helper that lets ob.Pal Link press keys and move the mouse in the programs you allow, from your phone.

## Install

1. Download **[obpal-desktop-windows-x64.zip](https://github.com/Axialon/obpal-link/releases/latest/download/obpal-desktop-windows-x64.zip)**. Unzip it into a folder you'll keep, and double-click `install.cmd`. It registers the helper for Chrome, Chromium, Edge, Brave and Vivaldi, for your Windows user only.
2. In ob.Pal Link's popup, pick **PC**, and allow the permission it asks for.
3. Bring the program you want to control to the front, then click **Allow** in the popup.

The helper isn't code-signed yet, so Windows SmartScreen may warn about it. Choose **More info**, then **Run anyway**.

## If the popup still says it isn't installed

- **Use ob.Pal Link 1.2 or later.** Its fixed extension ID (`jnnpcnoilofjaffabnhecfokjjknlemg`) is the one the helper lets in. Remove any older ob.Pal Link first, then load the new folder.
- **Moved the folder?** Run `install.cmd` again from where it is now.
- **Check the registration.** Open a terminal in the folder and run `obpal-desktop status`: it lists the browsers it's registered for.
- **Reload the extension.** Go to the extensions page and use the reload arrow.

## Safety

- Input reaches only the programs you've allowed, only while they're in front, and only the kinds you allowed (keyboard, mouse).
- Never the browser itself, and never programs running as administrator.
- `Ctrl`+`Alt`+`Backspace` stops everything, and switching windows releases every held key.

## Source

[Axialon/obpal: `desktop/`](https://github.com/Axialon/obpal/tree/main/desktop) (Rust, MIT).
