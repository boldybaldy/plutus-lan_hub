
# ⚡ PLUTUS — Local Network File & Text Sharing

A lightweight, zero-cloud web utility designed for fast, seamless sharing of text, code snippets, images, videos, and files across devices connected to the same local network (LAN). 

Built with **Python**, **Flask**, and vanilla JavaScript/CSS, everything runs locally on your host machine with full privacy and maximum transfer speed.

---

## ✨ Features

- 📄 **Real-Time Text Scratchpad:** Share text and code snippets across all connected LAN devices with automatic background synchronization.
- 📋 **One-Click Copy:** Built-in copy-to-clipboard button with visual confirmation.
- 🖼️ **Image & GIF Previews:** Instant "peeking" previews for images, GIFs, SVGs, and WebP graphics.
- 📦 **Drag-and-Drop Uploads:** Drag files directly into your browser window for fast uploading.
- 🌓 **Light & Dark Mode:** Toggle between sleek dark and light themes (saved to browser preferences).
- ▦ **List & Grid Views:** Switch file viewing layouts on the fly depending on your workflow.
- 📱 **Fully Responsive:** Smooth layout auto-adjusts across desktop browsers, phones, and tablets.
- 🌐 **Host IP Badge:** Displays the host's LAN address (`http://<IP>:5000`) at the top for quick device pairing.

---

## 📂 Project Structure

```text
.
├── app.py
├── requirements.txt
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── templates/
    └── index.html

```

---

## 🚀 Quick Start Guide

### 1. Prerequisites

Ensure Python 3.8+ is installed on your system.

On **Ubuntu/Debian**, install `python3-venv` if you haven't already:

```bash
sudo apt update
sudo apt install python3-venv -y

```

### 2. Clone & Navigate

```bash
git clone git@github.com:boldybaldy/plutus-lan_hub.git
cd plutus-lan_hub

```

### 3. Set Up Virtual Environment

Create and activate an isolated Python environment:

```bash
# Create venv
python3 -m venv venv

# Activate venv (Linux / macOS)
source venv/bin/activate

# On Windows:
# venv\Scripts\activate

```

### 4. Install Dependencies

```bash
pip install -r requirements.txt

```

### 5. Run the Server

```bash
python3 app.py

```

Upon launching, the terminal will display the host's LAN URL:

```text
==================================================
 App running! Access it on any LAN device at:
 [http://192.168.1.50:5000](http://192.168.1.50:5000)
==================================================

```

Open this address in the web browser of any device (laptop, phone, tablet) connected to the same local Wi-Fi.

---

## 💾 Storage & Data Ownership

* **Uploaded Files:** All files uploaded through the web interface are saved directly on the host machine in an automatically generated `uploads/` directory inside the project root folder (`./uploads/`).
* **Persistence:** Uploaded media and files remain permanently stored on the host computer until manually deleted.
* **Text Scratchpad:** Scratchpad contents are held in memory during the host app session.

---

## ⚙️ Configuration & Customization

* **Default Port:** The app defaults to port `5000`. You can change `PORT = 5000` at the top of `app.py`.
* **Allowed Upload Size:** By default, Flask allows uploads without strict size caps on local networks. You can configure `app.config['MAX_CONTENT_LENGTH']` in `app.py` if needed.

---

## 📄 License

Distributed under the [MIT License](https://www.google.com/search?q=LICENSE). Open-source and free to modify.

```

```
