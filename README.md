# 📄 EasyResume - Modern Live Resume & CV Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A lightweight, high-performance, real-time interactive **Resume & CV Builder** built with vanilla HTML5, CSS3, and JavaScript. Create ATS-friendly, professional resumes in seconds with instant live preview, a freeform MS Word-style canvas editor, and robust multi-option PDF exports.

---

## ✨ Features

- ⚡ **Dual Editor Modes**:
  1. **Form Builder**: Structured inputs with instant live preview on a selected template.
  2. **MS Word Canvas**: A freeform, content-editable A4 document canvas with a ribbon toolbar for rich text formatting, lists, tables, and alignment.
- 🎨 **5 Distinct Format Templates** (Form Builder Mode):
  - **Modern Clean**: Sleek single-column design with subtle accent borders.
  - **Split Two-Column**: Professional sidebar layout with optimized section spacing.
  - **Executive Classic**: Formal serif typography (Lora) for senior roles and academia.
  - **Creative Executive**: Stylish header accents, circular profile photo, and visual skill percentage progress bars.
  - **Yellow Frame Timeline**: High-impact dark banner header, yellow outer frame, and section node icons along a vertical timeline.
- 🎨 **Color Themes & Typography**: Live color palette selector (Blue, Emerald, Indigo, Rose, Purple, Dark Charcoal) and font customization (Inter, Outfit, Lora).
- 📷 **Interactive Profile Photo**: Upload a custom profile picture. In MS Word Canvas mode, freely drag and drop your avatar anywhere on the page (supports 360° all-axis movement and zoom scaling).
- 🖨️ **Multi-Option PDF Export**: 
  - Download the **MS Word Canvas Sheet** (Freeform layout).
  - Download the **Form Builder Resume** (Structured template).
  - Download **Both Sheets** (Combined Multi-Page PDF).
- 💾 **Auto-Save & Persistence**: Automatic local storage caching ensures zero data loss.
- 📥 **JSON Backup Import / Export**: Save and restore your resume data anytime.
- 🚀 **Zero External Dependencies**: Pure vanilla web app—no build tools, node modules, or npm setups required.

---

## 🛠️ Project Structure

```text
resume-builder/
├── index.html        # Main HTML structure, Form Editor & Word Canvas UI
├── style.css         # Custom design system, layouts & print media queries
├── app.js            # Reactive state management, drag engine & PDF generation
├── README.md         # Documentation
├── LICENSE           # MIT Open Source License
└── .gitignore        # Git ignore directives
```

---

## 🚀 Quick Start

### Method 1: Direct File Launch
Simply double click `index.html` or drag it into any modern web browser.

### Method 2: Local HTTP Server

**Using Python 3:**
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Using Node.js (`npx`):**
```bash
npx serve .
```

---

## 📤 Deploying to GitHub Pages

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Add MS Word Canvas, Draggable Photo, and Multi-Option PDF Export"
   git push origin main
   ```
2. Go to your repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` (or `master`) and root `/`.
5. Click **Save**. Your resume builder will be live online!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
