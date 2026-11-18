# SARSA CORPORATION — Website

Static, SEO-friendly website for **SARSA CORPORATION**, a construction & contracting
company in Dhaka, Bangladesh.

Built with **HTML5 + CSS3 + vanilla JavaScript** — no frameworks, no build step,
hostable on any basic shared hosting.

---

## 1. Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, services, delivery scope, why SARSA, process, leadership, capabilities, quality, credential |
| `about.html` | Company story, mission & vision, values, leadership, credential |
| `services.html` | All 8 services in detail |
| `projects.html` | Capabilities + project portfolio placeholders |
| `gallery.html` | Filterable masonry gallery with lightbox |
| `contact.html` | Contact info, WhatsApp, Google Map, Request-a-Quote form |

Supporting files:

```
css/style.css        design system + components
css/responsive.css   media queries (1180 / 1024 / 860 / 640 / 480)
js/main.js           nav, mobile menu, scroll reveal, gallery, form validation
sitemap.xml          search engine sitemap
robots.txt           crawler rules
```

---

## 2. Before going live — replace the domain

All SEO tags (canonical URLs, Open Graph, sitemap, robots.txt) currently use:

```
https://www.sarsacorporation.com/
```

**Search & replace this domain** in every `.html` file, `sitemap.xml` and
`robots.txt` with the real domain once purchased.

---

## 3. Replacing the logo

The site currently uses an "SC" monogram mark. To use the official logo:

1. Save the logo file as `assets/logo/logo.png` (or `.svg`).
2. In **every** HTML file, find the two blocks that look like:

```html
<span class="brand__mark" aria-hidden="true">SC</span>
```

3. Replace with:

```html
<img class="brand__mark" src="assets/logo/logo.png" alt="SARSA Corporation logo" width="44" height="44">
```

4. In `css/style.css`, inside `.brand__mark`, add `object-fit: contain;` if needed.

The favicon is an inline SVG (search for `link rel="icon"` in each page) —
replace with `<link rel="icon" href="assets/logo/logo.png">` when ready.

---

## 4. Replacing images

All images live in `assets/`:

| Folder | Used for |
|---|---|
| `assets/hero/` | hero backgrounds (home + sub-pages) |
| `assets/about/` | about sections |
| `assets/services/` | 8 service images (named by service) |
| `assets/projects/` | capabilities banner |
| `assets/quality/` | dark quality section background |
| `assets/gallery/` | gallery images |

**To replace any image:** keep the same filename and overwrite the file.
Recommended: WebP or JPEG, ≤ 200 KB, width 1200–2000 px for full-width images,
900–1000 px for cards. Always keep descriptive `alt` text in the HTML.

Image credits (free licences — Unsplash licence & Wikimedia Commons):

- Unsplash — free for commercial use, no attribution required
- `road.jpg` — "Road Widening and Construction Work at Jurain Railway Crossing,
  Dhaka" (Public domain, Bangladesh Press Information Department, via Wikimedia
  Commons)
- `dhaka-site.jpg` — CC BY-SA 3.0 (Wikimedia Commons)
- `hero/hero-video.webm` — "New Atlanta Stadium Time-Lapse, May 2015" by
  Atlanta Falcons, CC BY 3.0 (via Wikimedia Commons). **Currently unused** —
  the hero uses the sunset photo with a slow Ken Burns zoom (calmer UX). To
  re-enable video: replace the `<img>` inside `.hero__media` in `index.html`
  with a `<video autoplay muted loop playsinline poster="assets/hero/hero-main.jpg">`
  and a `<source src="assets/hero/hero-video.webm" type="video/webm">` child.

---

## 5. Updating company information

Company details appear in a few predictable places:

- **Header/footer contact block** — in every `.html` file (address, phone, email)
- **contact.html** — contact entries + office hours
- **Structured data (JSON-LD)** — in `index.html`, `services.html`, `contact.html`
- **Phone number format** — `tel:+8801577686060` (international format used for
  links; displayed number is `01577 686060`)
- **WhatsApp** — `https://wa.me/8801577686060`

Adding/removing a service: edit `services.html` (one `<article class="service-row">`
per service), the home page services grid in `index.html`, and the footer service
list (all pages).

---

## 6. Quote form — connected via FormSubmit (free)

The form on `contact.html` sends email through **formsubmit.co** — a free
service that needs no account and mails submissions directly to
`sarsactg@gmail.com`. The page never redirects; `js/main.js` posts via AJAX
and shows a success/error status inline.

### One-time activation (required)
The very first submission triggers an **activation email** to
`sarsactg@gmail.com`. Open that email and click **Activate Form** once —
after that every inquiry lands in the inbox automatically.

### How it is wired
- Form `action` in `contact.html`: `https://formsubmit.co/sarsactg@gmail.com`
  (non-JS fallback with `_subject`, `_template`, `_captcha`, `_next` hidden fields)
- AJAX endpoint in `js/main.js`: `FORMSUBMIT_AJAX` constant
- A `_honey` honeypot field silently drops spam bots
- `_replyto` is set to the visitor's email, so replies go straight to them

### Changing the destination address
Replace the email in **both** places: the form `action` in `contact.html` and
the `FORMSUBMIT_AJAX` constant in `js/main.js`, then redo the one-time
activation for the new address.

### Alternatives (if ever needed)
- **Web3Forms** — free, unlimited; get an access key at web3forms.com and POST
  to `https://api.web3forms.com/submit` with `access_key` in the body.
- **Formspree** — free tier is limited (~10 submissions/month); endpoint looks
  like `https://formspree.io/f/abcdwxyz`.

---

## 7. Adding a real project (portfolio)

In `projects.html`, each placeholder looks like:

```html
<div class="proj-card reveal">
  <span class="proj-card__plus" aria-hidden="true">+</span>
  <div>
    <span class="proj-card__slot">[ Project to be added ]</span>
    <p class="proj-card__meta">Client · Location · Category · ...</p>
  </div>
</div>
```

Replace a placeholder with (only **real, client-approved** projects):

```html
<article class="service-card reveal">
  <div class="service-card__media">
    <img src="assets/projects/project-1.jpg" alt="Project name — short description" loading="lazy">
  </div>
  <div class="service-card__body">
    <span class="service-card__no">01</span>
    <h3 class="service-card__title">Project Name</h3>
    <p class="service-card__text">Client · Location · Category · Status<br>Short scope description.</p>
  </div>
</article>
```

---

## 8. Deployment

Any static host works:

- **Shared hosting (cPanel):** upload everything via File Manager/FTP into
  `public_html/`. Done.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder or connect
  the repository. No build command needed.

After deployment:
1. Replace the placeholder domain everywhere (see section 2).
2. Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.
3. Register in Google Business Profile for local search ("construction company
   Dhaka").

---

## 9. Content rules (important)

Per company policy, the site contains **no invented facts** — no fake projects,
clients, testimonials, certifications, awards or experience claims. Placeholders
like `[ Project to be added ]` are intentional and should only be replaced with
verified information.
