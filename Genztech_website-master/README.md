# Genztech Website — Complete Site Structure

## Folder Layout

```
genztech/
├── index.html                    ← Original home (redirect to pages/homepage.html)
├── loginpage.html                ← Login page (existing)
├── signuppage.html               ← Signup / Enroll page (existing)
├── bgimage.png                   ← Hero background image (place here)
├── assets/
│   ├── css/
│   │   └── genztech.css          ← Shared styles (dropdowns, cards, badges, timeline)
│   └── js/
│       └── genztech.js           ← Shared JS (mobile menu, form handlers, hover FX)
├── images/
│   └── genztech_logo.png         ← Logo (copy here from root)
└── pages/
    ├── homepage.html             ← Main home with full dropdown navbar
    ├── career-counselling.html   ← Career guidance + booking form
    ├── internships.html          ← 1.5 / 3 / 6 month internship tiers
    ├── certifications.html       ← 6 certification program cards
    ├── short-term-courses.html   ← 8 courses with filter tabs (CS / Mech / MBA / E&TC)
    ├── placement.html            ← 4 placement tracks + success stories
    ├── contact.html              ← Contact form + WhatsApp CTA + quick links
    ├── domain-cs.html            ← Computer Science / AI / ML domain page
    ├── domain-mechanical.html    ← Mechanical / CAD / CAE domain page
    ├── domain-mba.html           ← MBA / Finance / SAP domain page
    └── domain-etc.html           ← E&TC / Embedded / IoT domain page
```

## Page Count: 13 pages total

| Page                    | URL                              | Status  |
|-------------------------|----------------------------------|---------|
| Home (original)         | index.html                       | ✅ Done |
| Login                   | loginpage.html                   | ✅ Done |
| Signup / Enroll         | signuppage.html                  | ✅ Done |
| Home (new full nav)     | pages/homepage.html              | ✅ Done |
| Career Counselling      | pages/career-counselling.html    | ✅ Done |
| Internships             | pages/internships.html           | ✅ Done |
| Certifications          | pages/certifications.html        | ✅ Done |
| Short Term Courses      | pages/short-term-courses.html    | ✅ Done |
| Placement Programs      | pages/placement.html             | ✅ Done |
| Contact                 | pages/contact.html               | ✅ Done |
| Domain — CS / IT        | pages/domain-cs.html             | ✅ Done |
| Domain — Mechanical     | pages/domain-mechanical.html     | ✅ Done |
| Domain — MBA / Finance  | pages/domain-mba.html            | ✅ Done |
| Domain — E&TC           | pages/domain-etc.html            | ✅ Done |

## Setup Instructions

1. Place `genztech_logo.png` in both root and `images/` folder
2. Place `bgimage.png` in root folder (for hero section)
3. Open `pages/homepage.html` in browser to start
4. All internal links are relative — works from any local folder or web server

## Design System

- **Primary**: `#162c43` (Dark Navy)
- **Secondary**: `#046a61` (Teal/Green)
- **Font**: Hanken Grotesk (Google Fonts)
- **Cards**: Rounded-xl, outline-variant border, card-hover lift on hover
- **Buttons**: Rounded-full pill shape throughout
- **Navbar**: Dropdown menus on hover, sticky, 90px height
- **Footer**: Dark navy bg, 3-column link grid
