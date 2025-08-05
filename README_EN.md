# Image Magnifier

![Extension icon](icons/icon128.png)

A simple, lightweight and efficient Chrome extension designed for accessibility. It enlarges images on hover, helping users—especially those with visual impairments—browse the web more comfortably.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Demo

![Image Magnifier demonstration](demo.gif)

## Main features

* **Hover magnification**: No need to click; simply hover over an element to activate it.
* **Smart detection**: Works on `<img>` and `<video>` tags as well as `<a>` links pointing to image or video files (common formats like `.jpg`, `.png`, `.gif`, `.mp4`, `.webm`, etc.).
* **Automatic video playback**: Detected videos start automatically in the preview window, muted and looping for seamless viewing.
* **Two display modes**:
    1. **Double size (beside)**: Shows the image at 200% of its original size in a window next to the cursor. The window positions itself intelligently to stay on screen.
    2. **Full width (overlay)**: Displays the image large, overlaying the page content and taking up the width of the window.
* **Full control**: A simple, intuitive popup lets you toggle the extension on or off and switch modes on the fly.
* **Configurable zoom factor**: Adjust the magnification level directly from the popup.
*   **Quick Close with Escape** : Just press the `Escape` key to instantly close any active preview, without needing to move your mouse.
* **Lightweight and performant**: Designed to have minimal impact on browsing performance by activating scripts only when necessary.

## Installation

You can install the extension directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/gkhghnhoflimlafecekklclepijjaemp).

To install it manually:

1. **Download the project**:
    * Clone this repository: `git clone https://github.com/[YourLink]/vision-aid-magnifier.git`
    * OR download the project as a ZIP file and extract it.
2. **Open Google Chrome** and navigate to `chrome://extensions`.
3. **Enable Developer Mode**: Toggle the switch in the upper right corner of the page.
4. **Load the extension**:
    * Click the **"Load unpacked"** button.
    * A folder selection dialog opens. Navigate to the project folder (the one containing `manifest.json`) and select it.
5. **That's it!** The Image Magnifier icon should appear in your Chrome toolbar.

## How to use

1. Click the extension icon in the toolbar to open the configuration popup.
2. Use the main switch to **enable or disable** the extension.
3. Choose your preferred **"magnification mode"**:
    * `Double size (beside)`: Ideal for quickly inspecting images without losing page context.
    * `Full width (overlay)`: Perfect for viewing an image in greater detail.
4. Adjust the **zoom factor** to control the magnification level.

Changes are saved and applied instantly.

## Contributing

Contributions are welcome! If you have ideas for improvements or bug fixes, feel free to:
1. Fork the project.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## Credits

* **Creator**: Sartoris Jean-Paul (Miroum)
* **Inspiration**: This project is heavily inspired by the excellent extension [**Imagus** by TheFantasticWarrior](https://github.com/TheFantasticWarrior/chrome-extension-imagus), which set a high bar in this area.

## License

This project is distributed under the MIT License. See the `LICENSE` file for more details.