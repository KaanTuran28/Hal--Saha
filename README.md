# ⚽ Halı Saha Tactical Board Pro

![HTML](https://img.shields.io/badge/HTML-CSS-orange)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

<p align="center"><b><a href="#english">English</a></b> · <b><a href="#türkçe">Türkçe</a></b></p>

---

## English

A modern, interactive, mobile-friendly 7-a-side tactical board for Turkish "halı saha" (indoor/artificial-turf football). Set up line-ups and tactics before a match with friends, then export the pitch as a PDF and share it in the group chat.

### Features

- **Drag & drop:** move players smoothly from the bench onto the pitch.
- **Free placement & formations:** snap players into preset formations (2-3-1, 3-2-1, etc.) or drop them anywhere on the pitch.
- **PDF export:** download your line-up as a high-resolution PDF in one click.
- **Fully mobile:** works with touch on phones and tablets.
- **Modern UI:** a dark-themed design with glassmorphism and neon accents.

### Tech stack

- HTML5 & CSS3 (Flexbox, CSS variables, media queries)
- Vanilla JavaScript (ES6+)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — PDF generation
- [mobile-drag-drop](https://github.com/timruffles/mobile-drag-drop) — touch drag-and-drop
- FontAwesome — icons

### Running

Open `index.html` in a browser, or serve the folder with any static server (`python -m http.server`). No build step.

### Structure

```
├── index.html
├── css/style.css
└── js/app.js
```

### License

MIT — see [LICENSE](./LICENSE).

---

## Türkçe

Modern, interaktif ve mobil uyumlu bir 7v7 halı saha taktik tahtası uygulaması. Arkadaşlarınızla yapacağınız maçlardan önce kadroları kurun, taktikleri belirleyin ve sahayı PDF olarak indirip WhatsApp grubunda paylaşın.

### Özellikler

- **Sürükle ve bırak:** oyuncuları yedek kulübesinden sahaya pürüzsüzce sürükleyin.
- **Serbest dolaşım & dizilişler:** oyuncuları hazır dizilişlere (2-3-1, 3-2-1 vb.) oturtun ya da sahanın istediğiniz noktasına serbestçe bırakın.
- **PDF çıktısı:** kurduğunuz kadroyu tek tıkla yüksek çözünürlüklü PDF olarak indirin.
- **%100 mobil uyumlu:** telefon ve tabletlerde dokunmatik destekle sorunsuz kullanım.
- **Modern arayüz:** glassmorphism ve neon efektleriyle zenginleştirilmiş karanlık tema.

### Kullanılan teknolojiler

- HTML5 & CSS3 (Flexbox, CSS değişkenleri, media query'ler)
- Vanilla JavaScript (ES6+)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — PDF oluşturma
- [mobile-drag-drop](https://github.com/timruffles/mobile-drag-drop) — dokunmatik sürükle-bırak
- FontAwesome — ikonlar

### Çalıştırma

`index.html` dosyasını tarayıcıda açın ya da klasörü herhangi bir statik sunucuyla yayınlayın (`python -m http.server`). Derleme adımı yoktur.

### Yapı

```
├── index.html
├── css/style.css
└── js/app.js
```

### Lisans

MIT — bkz. [LICENSE](./LICENSE).
