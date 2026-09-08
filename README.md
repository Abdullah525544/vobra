# DELISOGA — Glass Jar eCommerce

A complete, production-ready single-product eCommerce website for the
**DELISOGA Glass Jar with Bamboo Lid & Glass Straw**, built for the Pakistani
market. The site is split into:

- **Storefront** — Home, Product, Cart, Checkout, Thank-you, About, Contact, FAQ, Reviews, Privacy, Terms, Shipping, Returns
- **Admin Portal** — Login, Dashboard (stats), Orders (list + detail), Reviews manager, Settings

The frontend is a Vite + React 18 + Tailwind CSS app. The backend is **Firebase**
(Firestore + Auth + Storage) with a **graceful localStorage demo mode** so you
can develop and preview the entire experience without configuring Firebase first.

---

## Highlights

- 🎨 Premium visual system — warm neutrals, cream, bamboo tones, sage accents, Fraunces + Inter typography
- 📱 Mobile-first responsive design (360 / 390 / 768 / 1024 / 1440)
- 🛒 Full checkout flow with quantity-aware free-delivery calculation
- 🧾 Unique readable Order IDs (e.g. `DS-AB12CD-3X`)
- 💾 Server timestamps + audit fields; historical orders never change when prices change
- 🛡️ Firestore security rules + strict order shape validation
- 🔐 Admin portal with sidebar, dashboard, order workflow, review management, settings
- 🖼️ Product images compressed & lazy-loaded; semantic HTML; SEO meta + JSON-LD product schema
- 🇵🇰 Built for Pakistan: PKR pricing, Cash on Delivery, Pakistani phone validation
- 🚫 No fake countdowns, no fake live visitors, no manipulative dark patterns

---

## Quick start

```bash
# 1. Install
npm install

# 2. Run in demo mode (uses localStorage; no Firebase required)
npm run dev

# 3. Open
http://localhost:5173
```

The site will run in **demo mode** out of the box. You can:

- Browse the storefront
- Add to cart and place an order (it will be saved to localStorage)
- Sign in to the admin at **`/admin/login`** using any email + password `admin123`
- Change product price, delivery charges, free-delivery threshold, and more from `/admin/settings`

---

## Wiring up Firebase (production)

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Enable **Firestore Database** (production mode) and **Authentication** (Email/Password).
3. In **Project settings → General → Your apps**, register a Web app and copy the config.
4. Copy `.env.example` to `.env.local` and fill in your values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_DATA_MODE=live
VITE_SITE_URL=https://delisoga.com
```

5. In **Authentication → Users**, create your admin user, copy the **UID**, then in
   **Firestore → Start collection** create a collection called `admins` with a
   document whose ID is that UID and fields:

   ```
   email: "your@email.com"
   role:  "admin"
   createdAt: <server timestamp>
   ```

6. Deploy Firestore + Storage rules:

   ```bash
   firebase init          # select firestore + storage, use existing project
   firebase deploy --only firestore:rules,storage
   ```

7. Restart the dev server — the app will detect the env vars and switch to
   **live mode** (Firestore-backed). The demo data is seeded automatically on
   the first read of `settings/site` and `reviews`.

---

## Project structure

```
delisoga-store/
├── public/
│   ├── images/                # Web-optimised product / lifestyle photos
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── admin/                 # Admin portal
│   │   ├── AdminLayout.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Dashboard.jsx
│   │   ├── OrdersList.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── ReviewsManager.jsx
│   │   └── Settings.jsx
│   ├── components/
│   │   ├── home/              # Home page sections
│   │   ├── layout/            # Header, Footer, Cart drawer, etc.
│   │   └── ui/                # Reusable UI primitives
│   ├── context/               # React contexts
│   ├── data/                  # Seed data (settings, reviews)
│   ├── lib/                   # firebase, orders, reviews, settings, adminAuth
│   ├── pages/                 # Customer-facing pages
│   ├── styles/index.css
│   ├── App.jsx
│   └── main.jsx
├── firestore.rules            # Production Firestore security rules
├── storage.rules              # Production Storage security rules
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Configuring business values

Almost everything you’d want to change day-to-day lives in
**Admin → Settings**:

- Product price (default **PKR 1,000**)
- Delivery charge (default **PKR 250**)
- Free-delivery minimum quantity (default **2**)
- In-stock toggle + stock note
- Announcement bar text + on/off
- WhatsApp & phone numbers, email, address, business hours
- Brand name / tagline / social URLs

The site reads these on load and reactively updates across the entire storefront.

---

## Testing the buying flow

1. Open the site, scroll to the product purchase card on the homepage.
2. Change quantity to **1** — confirm delivery charge is added.
3. Change quantity to **2** — confirm the “Free delivery unlocked” state appears
   and the delivery charge is removed from the total.
4. Click **Add to Order** → opens the cart drawer.
5. Click **Continue to checkout** → fill in your name, Pakistani mobile
   (`03XX XXXXXXX`), address, city.
6. Click **Place order** → you’ll be redirected to `/thank-you/<ORDER_ID>` with
   the full order summary.
7. Visit **`/admin/login`**, sign in with any email + password `admin123`.
8. See your order on the dashboard, change its status through the workflow
   (New → Confirmed → Processing → Shipped → Delivered), or mark it Cancelled.

---

## Responsive targets

Tested and tuned for the following widths:

- **360px** (small Android)
- **390px** (iPhone)
- **768px** (tablet portrait)
- **1024px** (laptop)
- **1440px** (desktop)

The mobile bottom bar appears below `sm` and surfaces the live cart total and a
sticky “Order Now” CTA.

---

## Accessibility & UX

- Semantic HTML, correct heading hierarchy
- Keyboard-friendly focus rings and accessible color contrast
- `prefers-reduced-motion` respected for animations
- ARIA labels on icon-only buttons
- Pakistani phone validation: `^(?:\+?92|0)3\d{9}$`

---

## What I deliberately did not build

To keep the experience honest, the site does **not** claim:

- Specific delivery times (not configured)
- A warranty or return guarantee (none offered)
- Live visitor counts, fake countdowns, or scarcity alerts
- Certifications, lab tests, or other unverified claims

If you want to add any of these later, do it from `/admin/settings` so the language
is always under your control.

---

## Scripts

| Script          | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Vite dev server (port 5173)                |
| `npm run build` | Production build to `dist/`                |
| `npm run preview` | Preview the production build             |

---

## License

© DELISOGA. All rights reserved.
