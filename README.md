# 🍔 Wow Burger – Ethiopian Restaurant & Dynamic In-Cafe QR Platform

A modern, full-stack digital menu and in-cafe QR management system built for **Wow Burger** in Addis Ababa, Ethiopia.

Customers can scan table QR codes at their table to browse live food & drink menus, customize items, and dispatch orders directly via WhatsApp. Restaurant staff can manage all menu categories, dishes, juices/drinks, diner gallery photos, WiFi, and table QR codes dynamically via the built-in Staff Admin Portal.

---

## 🌟 Key Features

### 📱 Customer In-Cafe Experience
- **Table QR Context Detection**: Scan table QR codes (`/?table=N`) to instantly activate table context with quick actions:
  - 🔔 **Call Waiter** (Instant WhatsApp alert with Table #)
  - 🧾 **Request Bill** (Instant WhatsApp alert with Table #)
  - 📶 **Guest WiFi** (1-tap copy of SSID and password)
- **Dynamic Food & Fast Food Menu**:
  - Smash Burgers, Wood-Fired Pizzas, Club Sandwiches, Crispy Fried Chicken, Wings, Shawarmas, Loaded Fries & Sides.
  - Interactive search bar and dietary filter chips (🌿 Vegetarian, 🌱 Vegan, ✝️ Fasting/Tsom, ☪️ Halal, 🌾 Gluten-Free).
  - Item detail drawer with quantity selector and special requests notes.
- **Dedicated Drinks & Juices Showcase**:
  - Sub-filters: 🍹 *Fresh Juices & Spris*, ☕ *Hot Coffee & Tea*, 🍨 *Shakes & Smoothies*, 🧊 *Cold & Sodas*, 💧 *Water & Mineral*.
  - Temperature & profile badges (`☕ Hot`, `🧊 Chilled`, `🍹 Fresh Blended`).
- **Interactive Cart & Order Drawer**:
  - Live order total calculation.
  - 1-tap WhatsApp order dispatch including table number and customized item list.
- **Diner Photo Gallery**: Filterable photo gallery (*Food*, *Ambiance*, *Kitchen*, *Drinks*) with fullscreen lightbox and keyboard navigation.
- **Table Reservation System**: Advance booking form with Ethiopian phone validation.
- **Mobile-First Sticky Bottom Dock**: Glassmorphic bottom navigation dock tailored for mobile diners.

### 🔐 Staff Admin Portal (`/admin`)
- **PIN Authentication**: Secure login barrier (Default PIN: `1234`).
- **Dashboard Overview**: Real-time counts of dishes, categories, beverages, and in-stock items.
- **Menu & Drinks Manager**:
  - Full CRUD (Create, Read, Update, Delete) for dishes and beverages.
  - Image upload with size/type validation + direct URL fallback.
  - Category assignment, pricing, and discount controls.
  - Profile & temperature levels (Mild, Medium, Hot, Cold, Fresh Blended, Hot Beverage).
  - 1-tap **Sold Out / Available** toggle.
- **Category Manager**: Add, edit, reorder, emoji picker, and show/hide categories.
- **Gallery Manager**: Add, edit, and feature photos.
- **Settings Manager & QR Studio**:
  - Manage restaurant name, Ethiopian phone/WhatsApp, address, opening hours, and WiFi credentials.
  - **Table QR Code Studio**: Instant QR code generator for Tables 1–50 with 1-click PNG download.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend & Storage**: Next.js Route Handlers + Atomic File-Based JSON Database (`data/*.json`)
- **Language**: TypeScript

---

## 📁 Project Structure

```
├── app/
│   ├── admin/             # Staff Admin Portal & Layout
│   ├── api/               # REST Route Handlers (menu, categories, gallery, settings, upload, auth)
│   ├── layout.tsx         # Root layout with Wow Burger metadata
│   └── page.tsx           # Main customer page with table detection
├── components/
│   ├── admin/             # Admin portal components (Menu, Categories, Gallery, Settings, Dashboard, Login)
│   ├── MenuSection.tsx    # Dynamic food & drinks menu with filters
│   ├── CartFloatingBar.tsx# Order cart drawer & WhatsApp order dispatch
│   ├── TableContextBar.tsx# Table QR bar with Waiter/Bill/WiFi actions
│   ├── MobileBottomNav.tsx# Mobile sticky glassmorphic navigation
│   ├── Hero.tsx, About.tsx, Gallery.tsx, Reservation.tsx, Contact.tsx, Footer.tsx
├── data/                  # Live JSON data files (categories.json, menu.json, gallery.json, settings.json)
└── public/                # Static assets & uploads (/uploads)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
- **Customer Menu**: [http://localhost:3000](http://localhost:3000)
- **Table 5 QR View**: [http://localhost:3000/?table=5](http://localhost:3000/?table=5)
- **Staff Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin) *(PIN: `1234`)*
