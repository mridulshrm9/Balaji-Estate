# Balaji Estate - Real Estate Portfolio & Interactive Map

A premium, responsive, and bilingual (Hindi + English) web application for showcasing and selling plots at **Balaji Estate**, situated near the famous **Kali Talai Hanuman Mandir**.

This website features a modern, clean light design, an interactive SVG-based plot layout map matching the CAD layout, a site gallery, location maps, and inquiry forms.

---

## Technical Specifications

- **Front-End Stack:** HTML5, CSS3 (Vanilla), JavaScript (ES6)
- **Design Style:** Premium light theme, gold/charcoal palette, sleek micro-animations, mobile-first responsive layout.
- **Unified Bilingual Layout:** Both English and Hindi are displayed side-by-side on a single page, ensuring immediate readability for all users.
- **Interactive Map:** Dynamic SVG layout strictly matching the CAD blueprint, with 8 horizontal small plots and 1 large plot.
- **Plot Sizes:** Represented strictly in Square Feet (SQ.FT) only.
- **Zoom Controls:** Click a plot to focus the SVG viewbox smoothly via custom requestAnimationFrame animations.
- **Simulation Layer:** Form-submit interception showing exact email payload details.

---

## How to Run Locally

Since this is a static client-side web application, you do not need to install any heavy database or server dependencies.

1. **Clone or download** this project folder to your local machine.
2. Locate the file `index.html` in the root folder.
3. **Double-click `index.html`** to open it directly in any modern web browser.
4. Alternatively, run a simple local Python server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

---

## Configuring Email Inquiry Reception (Formspree / EmailJS)

To receive inquiries directly in your personal email, connect the form to an email routing service:

### Method 1: Using Formspree (Easiest, No Javascript needed)

1. Go to [Formspree](https://formspree.io) and create a free account.
2. Create a new form project (e.g., "Balaji Estate Inquiries").
3. Copy your unique Form Endpoint URL.
4. Open the `index.html` file in a code editor.
5. Search for the `<form>` tag around line 410:
   ```html
   <form action="https://formspree.io/f/mqakpevp" method="POST" id="inquiryForm" class="contact-form">
   ```
6. Replace the `action` attribute value `https://formspree.io/f/mqakpevp` with your unique Formspree URL.
7. Save the file. Any submissions will now route instantly to your email inbox.

---

## Image Assets

All photo resources are located in the [dataset](file:///c:/Users/mridu/Downloads/Business/Land/dataset) folder:
- **Brochure Poster:** Contains the map plan and features list in a printable layout.
- **Site Photos:** Real photographs of the Balaji Estate land showing completed boundaries, roads, leveling progress, and proximity to landmarks.
