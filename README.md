# MidiPad - Frontend

![MidiPad Banner](https://img.shields.io/badge/MidiPad-Share_Your_Melodies-white?style=for-the-badge)

Welcome to the official frontend repository for [midipad.net](https://midipad.net) — a fast, modern, and completely ad-free platform created for beatmakers, producers, and musicians to share and discover MIDI files.

Check out the [MidiPad Backend Repository](https://github.com/ТВОЙ_НИК/midipad-backend).

## Features
* **Community Driven:** Like, comment, and track downloads for every MIDI file.
* **Multi-language:** Built-in support for English and Russian.
* **Fast Search & Sorting:** Find tracks by tags, popularity, or trending status.
* **Responsive Design:** Fully mobile-friendly UI.

## Tech Stack
* **Core:** React 19, React Router v7
* **Audio/MIDI:** Tone.js, html-midi-player
* **Styling:** Tailwind CSS, PostCSS
* **i18n:** react-i18next

## Requirements
To run this project locally, you will need:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** or **yarn**
* The MidiPad Backend running locally on port `5000`.

> 💡 **Note on API Proxying:** This project uses `http-proxy-middleware` via `src/setupProxy.js`. In development mode, requests starting with `/api` and `/uploads` are automatically proxied to the local backend server (`http://127.0.0.1:5000`) without modifying the request path.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LomkaKa1ff/Midipad.git
   cd midipad-frontend

2. **Install dependencies:**

   *(Note: --legacy-peer-deps is used to resolve strict dependency peer conflicts between React 19 and react-scripts)*
   ```bash
   npm install --legacy-peer-deps

3. **Run the development server:**
   ```bash
   npm start

## License
All rights reserved. This project is proprietary. No one may copy, distribute, or modify the code without the explicit permission of the author.