# Caffe Jr. - Coffee Machine Service Website

Caffe Jr. is a modern website for a professional coffee machine service business.
The platform allows customers to learn about the service process, view testimonials, contact the company, and book a service appointment.

The project is built with **Next.js (App Router)** and focuses on **performance, responsiveness, and clean component architecture**.


# Tech Stack

Core Technologies

* Next.js 14 (App Router)
* React
* TypeScript
* Tailwind CSS

UI & Styling

* Custom UI component system
* Responsive layouts
* CSS variables for theming
* Framer Motion (planned)

3D & Media

* React Three Fiber
* Drei
* GLTF models

Infrastructure

* Resend (email booking system)
* Vercel / Node hosting

# Features

### Responsive Website

The website is designed to work seamlessly across:

* Mobile
* Tablet
* Desktop

Sections automatically adjust spacing, layout, and component behavior depending on screen size.

---

### Multilingual Support

The website supports multiple languages.

Languages are handled through:

```
data/siteData.ts
```

Each section pulls content dynamically based on the selected language.

Example languages:

* Danish
* English

Language state is controlled in `page.tsx`.

---

### Modular Component Architecture

The project follows a modular structure where each section of the page is a reusable component.

Main Sections

* Hero
* Help
* Process
* Testimonials
* Contact
* Footer

Each section receives the selected language and loads content dynamically.

Example:

```
<Hero language={language} />
<Process language={language} />
```

---

### Booking System

Customers can submit service requests using a booking form.

The form collects:

* Name
* Email
* Phone
* Machine type
* Preferred service date
* Message

Spam protection:

* Hidden honeypot field
* Timestamp validation

The form sends emails using **Resend API**.

Environment variables:

```
RESEND_API_KEY=re_xxxxxxxxx
BOOKING_RECEIVER_EMAIL=service@company.com
BOOKING_SENDER_EMAIL=onboarding@resend.dev
```

---

### 3D Coffee Machine Model

The hero section includes a **3D coffee machine model** rendered with:

* React Three Fiber
* Drei
* GLTF loader

Features:

* Environment lighting
* Orbit controls
* Error boundary fallback
* Lazy loading

---

### UI Component System

Reusable components exist inside:

```
components/ui/
```

Example:

```
Button
```

Buttons support:

* primary
* secondary
* outline
* responsive sizing


# Project Structure

```
app
 ├─ layout.tsx
 ├─ page.tsx
 └─ globals.css

components
 ├─ layout
 │   ├─ Navbar
 │   └─ Footer
 │
 ├─ sections
 │   ├─ Hero
 │   ├─ Help
 │   ├─ Process
 │   ├─ Testimonials
 │   └─ Contact
 │
 └─ ui
     └─ Button

data
 └─ siteData.ts

public
 ├─ images
 ├─ models
 └─ favicon
```


# Local Development

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Open browser

```
http://localhost:3000
```

# Environment Variables

Create a `.env.local` file.

```
RESEND_API_KEY=
BOOKING_RECEIVER_EMAIL=
BOOKING_SENDER_EMAIL=
```


# SEO & Metadata

SEO metadata is defined in:

```
app/layout.tsx
```

Includes:

* title
* description
* favicon
* apple icons

Next.js handles favicon generation across browsers.

# Browser Compatibility

The site is optimized for:

* Chrome
* Safari
* Edge
* Firefox

Icons are configured to support Apple devices and Safari.

# Future Improvements

Planned improvements for the next iterations.

### UX Improvements

* Language persistence via localStorage
* Smooth scroll navigation
* Section scroll snapping
* Improved mobile navigation

### Visual Improvements

* Final design asset integration
* Advanced animations
* Better hero section interaction

### Business Features

* Booking calendar integration
* Admin dashboard for bookings
* CRM integration
* Payment support

### Performance

* Image optimization
* Model compression
* Lazy loading improvements

# Deployment

Recommended platforms:

* Vercel
* Netlify
* Railway

Deploy command

```
npm run build
```


# License

This project is proprietary and developed for the **Caffe Jr. Coffee Machine Service** platform.
