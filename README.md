# 📄 EasyResume - Modern Live Resume & CV Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A lightweight, high-performance, real-time interactive **Resume & CV Builder** built with vanilla HTML5, CSS3, and JavaScript. Create ATS-friendly, professional resumes in seconds with instant live preview and one-click PDF export.

---

## ✨ Features

- ⚡ **Real-Time Live Preview**: Instant split-pane rendering as you edit your information.
- 🎨 **5 Distinct Format Templates**:
  1. **Modern Clean**: Sleek single-column design with subtle accent borders.
  2. **Split Two-Column**: Professional sidebar layout with optimized section spacing.
  3. **Executive Classic**: Formal serif typography (Lora) for senior roles and academia.
  4. **Creative Executive (Navy & Circle Photo)**: Stylish header accents, circular profile photo, and visual skill percentage progress bars.
  5. **Yellow Frame Timeline (Banner Header & Nodes)**: High-impact dark banner header, yellow outer frame, and section node icons along a vertical timeline.
- 🎨 **Color Themes & Typography**: Live color palette selector (Blue, Emerald, Indigo, Rose, Purple, Dark Charcoal) and font customization (Inter, Outfit, Lora).
- 📷 **Profile Photo Upload**: Add custom profile picture or use template avatar placeholders.
- 💾 **Auto-Save & Persistence**: Automatic local storage caching ensures zero data loss.
- 📥 **JSON Backup Import / Export**: Save and restore your resume data anytime.
- 🖨️ **Print & PDF Optimized**: Exact print media queries `@media print` designed specifically for A4 PDF export without layout distortion.
- 🚀 **Zero External Dependencies**: Pure vanilla web app—no build tools, node modules, or npm setups required.

---

## 🛠️ Project Structure

```text
resume-builder/
├── index.html        # Main HTML structure & editor interface
├── style.css         # Custom design system, layouts & print media queries
├── app.js            # Reactive state management & DOM layout engine
├── README.md         # Documentation & GitHub guide
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
   git init
   git add .
   git commit -m "Initial commit of EasyResume builder"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/resume-builder.git
   git push -u origin main
   ```
2. Go to your repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` and root `/`.
4. Click **Save**. Your resume builder will be live online!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
