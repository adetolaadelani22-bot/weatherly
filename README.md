# Weatherly — Personal Weather Decision Assistant

> **Forecast → Understand → Decide**  
> *“Know the weather. Understand your day.”*

Weatherly is a modern, responsive web application engineered to transform raw meteorological data into simple, practical recommendations that help users make informed everyday decisions. Rather than merely presenting numbers and weather icons, Weatherly directly answers:

* **What should I wear today?**
* **Will it rain, and at what exact times?**
* **When is the best window to go outside?**
* **Can I run, cycle, do laundry, or commute smoothly?**
* **What is the overall quality and comfort score of today?**

---

## 1. Project Overview

Standard weather forecasts provide temperatures, barometric pressures, and percentages without context. Weatherly synthesizes this information through a decision engine to provide:

1. **Today's Weather Score**: A 0–100 dynamic index balancing thermal comfort, precipitation hazard, wind speed, and humidity.
2. **Smart Daily Brief**: A rule-based conversational briefing pinpointing morning vs. afternoon shifts, rain likelihood, and essential precautions.
3. **Hourly Rain Timeline**: A visual probability chart indicating the exact peak hours of shower risk.
4. **Outfit Guide**: Contextual clothing recommendations covering base layers, outerwear, accessories (e.g. umbrella, sunglasses), and footwear.
5. **Activity Planner**: Customized evaluations for walking, running, cycling, sports, photography, outdoor laundry, events, and transit commutes.
6. **Best Outdoor Window**: Algorithmic detection of the prime 2–3 hour daylight period for outdoor recreation.

---

## 2. Features

* **City Search & Autocomplete**: Real-time debounced location querying with administrative region and country labeling.
* **Current Location (Geolocation API)**: One-click GPS location detection with reverse geocoding.
* **Persistent Recent Searches**: Stored in `localStorage` (up to 5 cities) with quick-access tags and clear history control.
* **Unit Switching (°C / °F)**: Instant conversion across all temperature points, speeds, and forecast cards with local persistence.
* **Dynamic Weather Atmosphere**: Subtle aesthetic background tints and theme accents corresponding to conditions (Clear / Sunny, Overcast / Cloudy, Rain, Storm, and Night).
* **Hourly Forecast (24h)**: Horizontally scrollable carousel with temperatures, precipitation risk, conditions, and wind metrics.
* **7-Day Forecast**: Weekly outlook with day names, condition icons, rain probabilities, and temperature range visualization bars.
* **Defensive Error Handling**: Dedicated, user-friendly banners for empty inputs, missing locations, network offline states, and location permission denial.
* **Zero-Framework Architecture**: Built strictly with HTML5, CSS3, and Vanilla JavaScript (ES6+).

---

## 3. Technologies

* **HTML5**: Semantic document layout (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`, `<form>`).
* **CSS3**: CSS Custom Properties (design tokens), CSS Grid, Flexbox, media queries, accessibility states, and fluid typography.
* **Vanilla JavaScript (ES6+)**: Native ES modules (`import`/`export`), `async/await`, Promises, DOM APIs.
* **Open-Meteo REST APIs**:
  * *Geocoding API*: City search and coordinate resolution (`geocoding-api.open-meteo.com`).
  * *Forecast API*: Current, hourly, and daily meteorological forecasts (`api.open-meteo.com`).
* **Browser Geolocation API**: Coordinate detection for current location search.
* **Web Storage API (localStorage)**: Client-side storage for recent searches and unit preferences.

---

## 4. Architecture & File Structure

```
weatherly/
├── index.html              # Primary entry point & semantic markup
├── css/
│   ├── style.css           # Design tokens, themes, typography, and card components
│   └── responsive.css      # Mobile-first breakpoints and accessible motion queries
├── js/
│   ├── app.js              # Application controller & state coordinator
│   ├── api.js              # Open-Meteo network calls, geocoding & error wrappers
│   ├── weather.js          # Core decision engine, scores, brief, and outfit logic
│   ├── ui.js               # Reusable DOM rendering functions & SVG icon system
│   ├── storage.js          # LocalStorage persistence manager
│   └── utils.js            # Math, temperature conversions, date & debounce helpers
├── assets/
│   ├── icons/              # SVG vector icon assets
│   └── images/             # Visual banners & graphic assets
└── README.md               # Product documentation
```

### Module Responsibilities:
* `api.js`: Exclusively handles fetch requests to Open-Meteo and reverse geocoding services, wrapping failures in structured `WeatherApiError` instances.
* `weather.js`: Pure transformation functions taking raw weather JSON and producing structured recommendation models (scores, outfit arrays, activity rankings).
* `ui.js`: DOM manipulation module rendering sanitized HTML, SVG icons, and state views.
* `storage.js`: Encapsulates safe `localStorage` interactions with quota failure recovery.
* `utils.js`: Pure mathematical and string formatting helpers (Celsius/Fahrenheit conversions, wind compass degrees, time formatting).
* `app.js`: Instantiates the application, listens for user events, dispatches API requests, and triggers UI updates.

---

## 5. API Flow

```text
User Input / Geolocation
           │
           ▼
[ Open-Meteo Geocoding API ] ──► Extracts Latitude, Longitude, City, Country
           │
           ▼
[ Open-Meteo Forecast API ] ───► Retrieves Current, Hourly & Daily Forecasts
           │
           ▼
[ weather.js Decision Engine ] ──► Calculates Daily Score (0-100)
                                ──► Formulates Smart Daily Brief
                                ──► Analyzes Rain Timeline & Peak Hours
                                ──► Derives Outfit Recommendations
                                ──► Evaluates Activities & Best Windows
           │
           ▼
[ ui.js Render Pipeline ] ───────► Paints Accessible, Responsive Cards to DOM
```

---

## 6. Error Handling

* **Empty Search**: Prevents redundant API requests and informs the user to enter a city name.
* **City Not Found**: Catches empty geocoding results and presents a friendly message suggesting alternative spellings.
* **Network Failures**: Catches network dropped connections or offline statuses with retry advice.
* **API Outages**: Gracefully intercepts non-200 HTTP responses without breaking interface state.
* **Location Permission Denied**: Detects user or browser permission denials and provides a clear alternative (searching by city).
* **Defensive Property Access**: All nested API properties are verified with safe default fallbacks to ensure uninterrupted rendering.

---

## 7. Responsive Design

Weatherly is designed with a **mobile-first** approach:
* **Mobile (< 640px)**: Cards stack vertically into a focused single-column flow, touch targets measure at least 44px, and stat grids collapse into balanced 2-column cards.
* **Tablets (640px – 1024px)**: Decision cards arrange into structured 2-column bento grids.
* **Desktop (≥ 1024px)**: Fluid 1200px max-width container with 6-column supporting metric cards and bento-style decision widgets.
* **No Page Overflow**: Horizontal scrolling is strictly prevented on the document body; hourly feeds and timeline components utilize isolated, styled scroll containers.

---

## 8. Future Improvements

* **Severe Weather Push Alerts**: Notification API integration for sudden storm or precipitation warnings.
* **Air Quality Index (AQI)**: Integration with Open-Meteo Air Quality API for particulate matter (PM2.5, PM10) and pollen forecasts.
* **Offline Service Worker (PWA)**: Full Progressive Web App manifest and caching of recent forecasts for offline consultations.
* **Interactive Radar Maps**: Embedded radar layers for visual precipitation tracking.
