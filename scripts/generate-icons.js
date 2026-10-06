import fs from 'fs';
import path from 'path';

const ICONS = {
  // Brand & Navigation
  'logo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="16" fill="url(#logo-grad)"/>
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stop-color="#2563EB"/>
        <stop offset="1" stop-color="#1D4ED8"/>
      </linearGradient>
      <radialGradient id="sun-grad" cx="26" cy="24" r="14" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FDE047"/>
        <stop offset="1" stop-color="#F59E0B"/>
      </radialGradient>
      <linearGradient id="cloud-grad" x1="20" y1="28" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#E2E8F0"/>
      </linearGradient>
    </defs>
    <circle cx="26" cy="24" r="12" fill="url(#sun-grad)"/>
    <path d="M22 46h24a10 10 0 0 0 1.2-19.9A14 14 0 0 0 21 28.5 9 9 0 0 0 22 46Z" fill="url(#cloud-grad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"/>
  </svg>`,

  'search.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="21" cy="21" r="13" stroke="#2563EB" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M31 31l11 11" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
    <circle cx="17" cy="17" r="4" fill="#93C5FD" fill-opacity="0.6"/>
  </svg>`,

  'location.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke="#2563EB" stroke-width="3" stroke-dasharray="2 2" stroke-opacity="0.4"/>
    <circle cx="24" cy="24" r="12" stroke="#2563EB" stroke-width="3.5"/>
    <circle cx="24" cy="24" r="5" fill="#2563EB"/>
    <line x1="24" y1="2" x2="24" y2="8" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
    <line x1="24" y1="40" x2="24" y2="46" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
    <line x1="2" y1="24" x2="8" y2="24" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
    <line x1="40" y1="24" x2="46" y2="24" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'clear.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="#94A3B8" fill-opacity="0.2"/>
    <path d="M16 16l16 16M32 16L16 32" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'close.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="#FEE2E2"/>
    <path d="M16 16l16 16M32 16L16 32" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'clock.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" stroke="#2563EB" stroke-width="4"/>
    <circle cx="24" cy="24" r="3" fill="#2563EB"/>
    <path d="M24 12v12l7 4" stroke="#2563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'check.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="#059669"/>
    <path d="M14 24l7 7 14-14" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'star.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M24 4l6.2 12.5 13.8 2-10 9.7 2.4 13.8L24 35.5 11.6 42l2.4-13.8-10-9.7 13.8-2L24 4Z" fill="#F59E0B" stroke="#D97706" stroke-width="2" stroke-linejoin="round"/>
    <path d="M24 8l4.5 9 10 1.5-7.2 7 1.7 10-9-4.7L24 8Z" fill="#FDE68A" fill-opacity="0.6"/>
  </svg>`,

  'star-empty.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M24 4l6.2 12.5 13.8 2-10 9.7 2.4 13.8L24 35.5 11.6 42l2.4-13.8-10-9.7 13.8-2L24 4Z" stroke="#CBD5E1" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,

  // Weather Conditions (Rich Color Palette)
  'sun.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="sun-core" cx="32" cy="32" r="16" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFF7ED"/>
        <stop offset="0.3" stop-color="#FDE047"/>
        <stop offset="0.8" stop-color="#F59E0B"/>
        <stop offset="1" stop-color="#EA580C"/>
      </radialGradient>
      <filter id="sun-glow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <!-- Sun Rays -->
    <g stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" filter="url(#sun-glow)">
      <line x1="32" y1="4" x2="32" y2="12"/>
      <line x1="32" y1="52" x2="32" y2="60"/>
      <line x1="4" y1="32" x2="12" y2="32"/>
      <line x1="52" y1="32" x2="60" y2="32"/>
      <line x1="12.2" y1="12.2" x2="17.8" y2="17.8"/>
      <line x1="46.2" y1="46.2" x2="51.8" y2="51.8"/>
      <line x1="12.2" y1="51.8" x2="17.8" y2="46.2"/>
      <line x1="46.2" y1="17.8" x2="51.8" y2="12.2"/>
    </g>
    <circle cx="32" cy="32" r="15" fill="url(#sun-core)"/>
    <circle cx="27" cy="27" r="5" fill="#FFFFFF" fill-opacity="0.4"/>
  </svg>`,

  'moon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="moon-grad" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F8FAFC"/>
        <stop offset="0.4" stop-color="#E2E8F0"/>
        <stop offset="1" stop-color="#94A3B8"/>
      </linearGradient>
    </defs>
    <!-- Stars -->
    <circle cx="48" cy="16" r="1.5" fill="#F8FAFC" fill-opacity="0.8"/>
    <circle cx="54" cy="28" r="1" fill="#F8FAFC" fill-opacity="0.6"/>
    <circle cx="44" cy="44" r="1.5" fill="#F8FAFC" fill-opacity="0.7"/>
    <!-- Crescent Moon -->
    <path d="M34 10a22 22 0 1 0 16 34 24 24 0 0 1-16-34Z" fill="url(#moon-grad)" stroke="#CBD5E1" stroke-width="1.5"/>
    <circle cx="26" cy="28" r="3" fill="#64748B" fill-opacity="0.15"/>
    <circle cx="32" cy="38" r="2.5" fill="#64748B" fill-opacity="0.15"/>
    <circle cx="23" cy="42" r="1.8" fill="#64748B" fill-opacity="0.12"/>
  </svg>`,

  'sun-cloud.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="sun-bg" cx="24" cy="22" r="12" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FDE047"/>
        <stop offset="1" stop-color="#F59E0B"/>
      </radialGradient>
      <linearGradient id="cloud-front" x1="16" y1="26" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="0.7" stop-color="#F1F5F9"/>
        <stop offset="1" stop-color="#CBD5E1"/>
      </linearGradient>
    </defs>
    <!-- Sun behind cloud -->
    <g stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round">
      <line x1="24" y1="6" x2="24" y2="10"/>
      <line x1="12.7" y1="10.7" x2="15.5" y2="13.5"/>
      <line x1="8" y1="22" x2="12" y2="22"/>
      <line x1="35.3" y1="10.7" x2="32.5" y2="13.5"/>
      <line x1="40" y1="22" x2="36" y2="22"/>
    </g>
    <circle cx="24" cy="22" r="10" fill="url(#sun-bg)"/>
    <!-- Volumetric Cloud -->
    <path d="M18 50h28a11 11 0 0 0 1.5-21.9A15 15 0 0 0 20 30a10 10 0 0 0-2 20Z" fill="url(#cloud-front)" stroke="#E2E8F0" stroke-width="1.5"/>
  </svg>`,

  'cloud-sun.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="sun-bg2" cx="24" cy="22" r="12" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FDE047"/>
        <stop offset="1" stop-color="#F59E0B"/>
      </radialGradient>
      <linearGradient id="cloud-front2" x1="16" y1="26" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="0.7" stop-color="#F1F5F9"/>
        <stop offset="1" stop-color="#CBD5E1"/>
      </linearGradient>
    </defs>
    <g stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round">
      <line x1="24" y1="6" x2="24" y2="10"/>
      <line x1="12.7" y1="10.7" x2="15.5" y2="13.5"/>
      <line x1="8" y1="22" x2="12" y2="22"/>
      <line x1="35.3" y1="10.7" x2="32.5" y2="13.5"/>
    </g>
    <circle cx="24" cy="22" r="10" fill="url(#sun-bg2)"/>
    <path d="M18 50h28a11 11 0 0 0 1.5-21.9A15 15 0 0 0 20 30a10 10 0 0 0-2 20Z" fill="url(#cloud-front2)" stroke="#E2E8F0" stroke-width="1.5"/>
  </svg>`,

  'moon-cloud.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="moon-soft" x1="20" y1="10" x2="36" y2="28" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F8FAFC"/>
        <stop offset="1" stop-color="#CBD5E1"/>
      </linearGradient>
      <linearGradient id="cloud-night" x1="14" y1="28" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stop-color="#334155"/>
        <stop offset="1" stop-color="#1E293B"/>
      </linearGradient>
    </defs>
    <path d="M30 14a13 13 0 1 0 9 20 14 14 0 0 1-9-20Z" fill="url(#moon-soft)"/>
    <path d="M16 50h30a10 10 0 0 0 1-19.9A14 14 0 0 0 18 31a9 9 0 0 0-2 19Z" fill="url(#cloud-night)" stroke="#475569" stroke-width="1.5"/>
  </svg>`,

  'cloud.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="cloud-single" x1="12" y1="20" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="0.6" stop-color="#E2E8F0"/>
        <stop offset="1" stop-color="#94A3B8"/>
      </linearGradient>
    </defs>
    <path d="M16 48h32a12 12 0 0 0 1.5-23.9A16 16 0 0 0 18 26a11 11 0 0 0-2 22Z" fill="url(#cloud-single)" stroke="#CBD5E1" stroke-width="1.5"/>
  </svg>`,

  'fog.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="fog-cloud" x1="16" y1="16" x2="48" y2="40" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F1F5F9"/>
        <stop offset="1" stop-color="#94A3B8"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#fog-cloud)" stroke="#CBD5E1" stroke-width="1.5"/>
    <g stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round">
      <line x1="12" y1="46" x2="52" y2="46"/>
      <line x1="18" y1="53" x2="46" y2="53"/>
    </g>
  </svg>`,

  'drizzle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="drizzle-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#94A3B8"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#drizzle-cloud)" stroke="#CBD5E1" stroke-width="1.5"/>
    <g fill="#38BDF8">
      <circle cx="24" cy="46" r="2"/>
      <circle cx="23" cy="54" r="2"/>
      <circle cx="33" cy="48" r="2"/>
      <circle cx="32" cy="56" r="2"/>
      <circle cx="42" cy="46" r="2"/>
      <circle cx="41" cy="54" r="2"/>
    </g>
  </svg>`,

  'rain-light.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rainl-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#94A3B8"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#rainl-cloud)" stroke="#CBD5E1" stroke-width="1.5"/>
    <g stroke="#0284C7" stroke-width="3" stroke-linecap="round">
      <line x1="24" y1="44" x2="20" y2="52"/>
      <line x1="34" y1="44" x2="30" y2="52"/>
      <line x1="44" y1="44" x2="40" y2="52"/>
    </g>
  </svg>`,

  'rain.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rain-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F8FAFC"/>
        <stop offset="1" stop-color="#64748B"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#rain-cloud)" stroke="#94A3B8" stroke-width="1.5"/>
    <g stroke="#2563EB" stroke-width="3.5" stroke-linecap="round">
      <line x1="23" y1="44" x2="19" y2="54"/>
      <line x1="33" y1="44" x2="29" y2="54"/>
      <line x1="43" y1="44" x2="39" y2="54"/>
      <line x1="28" y1="50" x2="25" y2="58"/>
      <line x1="38" y1="50" x2="35" y2="58"/>
    </g>
  </svg>`,

  'shower.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="shw-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F8FAFC"/>
        <stop offset="1" stop-color="#64748B"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#shw-cloud)" stroke="#94A3B8" stroke-width="1.5"/>
    <g stroke="#0284C7" stroke-width="3" stroke-linecap="round">
      <line x1="22" y1="44" x2="19" y2="52"/>
      <line x1="32" y1="44" x2="29" y2="52"/>
      <line x1="42" y1="44" x2="39" y2="52"/>
      <line x1="26" y1="51" x2="24" y2="57"/>
      <line x1="36" y1="51" x2="34" y2="57"/>
    </g>
  </svg>`,

  'rain-heavy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rainh-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#475569"/>
        <stop offset="1" stop-color="#1E293B"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#rainh-cloud)" stroke="#334155" stroke-width="1.5"/>
    <g stroke="#1D4ED8" stroke-width="4" stroke-linecap="round">
      <line x1="21" y1="44" x2="16" y2="56"/>
      <line x1="31" y1="44" x2="26" y2="56"/>
      <line x1="41" y1="44" x2="36" y2="56"/>
      <line x1="26" y1="48" x2="22" y2="59"/>
      <line x1="36" y1="48" x2="32" y2="59"/>
    </g>
  </svg>`,

  'thunderstorm.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="storm-cloud" x1="16" y1="12" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#334155"/>
        <stop offset="1" stop-color="#0F172A"/>
      </linearGradient>
    </defs>
    <path d="M18 36h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 18a9 9 0 0 0-2 18Z" fill="url(#storm-cloud)" stroke="#1E293B" stroke-width="1.5"/>
    <!-- Lightning Bolt -->
    <path d="M34 32l-7 14h6l-3 12 12-16h-6l5-10h-7Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round"/>
    <g stroke="#38BDF8" stroke-width="3" stroke-linecap="round">
      <line x1="19" y1="42" x2="16" y2="50"/>
      <line x1="46" y1="42" x2="43" y2="50"/>
    </g>
  </svg>`,

  'snow.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="snow-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#BAE6FD"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#snow-cloud)" stroke="#BAE6FD" stroke-width="1.5"/>
    <g stroke="#0284C7" stroke-width="2.5" stroke-linecap="round">
      <!-- Snowflake 1 -->
      <line x1="22" y1="44" x2="22" y2="54"/>
      <line x1="17" y1="49" x2="27" y2="49"/>
      <line x1="18.5" y1="45.5" x2="25.5" y2="52.5"/>
      <line x1="18.5" y1="52.5" x2="25.5" y2="45.5"/>
      <!-- Snowflake 2 -->
      <line x1="38" y1="44" x2="38" y2="54"/>
      <line x1="33" y1="49" x2="43" y2="49"/>
      <line x1="34.5" y1="45.5" x2="41.5" y2="52.5"/>
      <line x1="34.5" y1="52.5" x2="41.5" y2="45.5"/>
    </g>
  </svg>`,

  'sleet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="sleet-cloud" x1="16" y1="14" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F1F5F9"/>
        <stop offset="1" stop-color="#94A3B8"/>
      </linearGradient>
    </defs>
    <path d="M18 38h28a10 10 0 0 0 1.2-19.9A14 14 0 0 0 20 20a9 9 0 0 0-2 18Z" fill="url(#sleet-cloud)" stroke="#CBD5E1" stroke-width="1.5"/>
    <g stroke="#0284C7" stroke-width="2.5" stroke-linecap="round">
      <line x1="20" y1="45" x2="16" y2="54"/>
      <line x1="42" y1="45" x2="38" y2="54"/>
      <!-- Small snowflake in center -->
      <line x1="31" y1="45" x2="31" y2="55"/>
      <line x1="26" y1="50" x2="36" y2="50"/>
    </g>
  </svg>`,

  // Meteorological Supporting Metric Icons
  'wind.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M6 16h24a6 6 0 1 0-6-6" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M4 26h32a6 6 0 1 1-6 6" stroke="#0284C7" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M8 36h14a5 5 0 1 0-5-5" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'humidity.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="drop-grad" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop stop-color="#38BDF8"/>
        <stop offset="0.6" stop-color="#0284C7"/>
        <stop offset="1" stop-color="#1D4ED8"/>
      </linearGradient>
    </defs>
    <path d="M24 4C24 4 10 20 10 30a14 14 0 0 0 28 0C38 20 24 4 24 4Z" fill="url(#drop-grad)"/>
    <path d="M19 24c0-4 4-8 7-10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7"/>
    <circle cx="21" cy="33" r="2.5" fill="#FFFFFF" fill-opacity="0.5"/>
  </svg>`,

  'droplet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="drop-grad2" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop stop-color="#38BDF8"/>
        <stop offset="1" stop-color="#2563EB"/>
      </linearGradient>
    </defs>
    <path d="M24 4C24 4 10 20 10 30a14 14 0 0 0 28 0C38 20 24 4 24 4Z" fill="url(#drop-grad2)"/>
    <path d="M19 24c0-4 4-8 7-10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7"/>
  </svg>`,

  'umbrella.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="umb-grad" x1="4" y1="12" x2="44" y2="28" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3B82F6"/>
        <stop offset="1" stop-color="#1D4ED8"/>
      </linearGradient>
    </defs>
    <path d="M4 24a20 20 0 0 1 40 0H4Z" fill="url(#umb-grad)"/>
    <path d="M24 24v16a4 4 0 0 1-8 0" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="24" y1="2" x2="24" y2="4" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  'compass.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" stroke="#2563EB" stroke-width="3.5"/>
    <circle cx="24" cy="24" r="16" stroke="#93C5FD" stroke-width="1.5" stroke-dasharray="2 2"/>
    <polygon points="24,8 29,24 24,21 19,24" fill="#EF4444"/>
    <polygon points="24,40 29,24 24,27 19,24" fill="#3B82F6"/>
    <circle cx="24" cy="24" r="2" fill="#FFFFFF"/>
  </svg>`,

  'sunrise.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <line x1="4" y1="40" x2="44" y2="40" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
    <!-- Half sun rising -->
    <path d="M12 40a12 12 0 0 1 24 0H12Z" fill="#FBBF24"/>
    <!-- Sun rays -->
    <g stroke="#F59E0B" stroke-width="3" stroke-linecap="round">
      <line x1="24" y1="18" x2="24" y2="23"/>
      <line x1="12" y1="23" x2="16" y2="27"/>
      <line x1="36" y1="23" x2="32" y2="27"/>
    </g>
    <!-- Arrow pointing up -->
    <path d="M24 6v8m-4-4l4-4 4 4" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'sunset.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <line x1="4" y1="40" x2="44" y2="40" stroke="#EA580C" stroke-width="4" stroke-linecap="round"/>
    <!-- Half sun setting -->
    <path d="M12 40a12 12 0 0 1 24 0H12Z" fill="#EA580C"/>
    <!-- Arrow pointing down -->
    <path d="M24 16v8m-4-4l4 4 4-4" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'uv.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="9" fill="#F59E0B"/>
    <g stroke="#EA580C" stroke-width="3.5" stroke-linecap="round">
      <line x1="24" y1="4" x2="24" y2="10"/>
      <line x1="24" y1="38" x2="24" y2="44"/>
      <line x1="4" y1="24" x2="10" y2="24"/>
      <line x1="38" y1="24" x2="44" y2="24"/>
      <line x1="10" y1="10" x2="14" y2="14"/>
      <line x1="34" y1="34" x2="38" y2="38"/>
      <line x1="10" y1="38" x2="14" y2="34"/>
      <line x1="34" y1="14" x2="38" y2="10"/>
    </g>
    <circle cx="24" cy="24" r="4" fill="#FEF08A"/>
  </svg>`,

  'cloud-cover.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M12 36h24a8 8 0 0 0 1-15.9A12 12 0 0 0 14 20a7 7 0 0 0-2 16Z" fill="#93C5FD" fill-opacity="0.8"/>
    <path d="M18 42h24a8 8 0 0 0 1-15.9A12 12 0 0 0 20 26a7 7 0 0 0-2 16Z" fill="#2563EB" fill-opacity="0.9"/>
  </svg>`,

  // Outfit Guide Category Icons
  'shirt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M38 8l-8-3a6 6 0 0 1-12 0l-8 3-7 7 6 5 3-3v25a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V17l3 3 6-5-7-7Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M18 5a6 6 0 0 0 12 0" stroke="#1D4ED8" stroke-width="2.5"/>
  </svg>`,

  'jacket.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M24 4l-12 5-6 8 6 4 2-3v24h20V18l2 3 6-4-6-8-12-5Z" fill="#1E293B" stroke="#0F172A" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="24" y1="4" x2="24" y2="42" stroke="#64748B" stroke-width="2.5"/>
    <circle cx="24" cy="18" r="2" fill="#F59E0B"/>
    <circle cx="24" cy="28" r="2" fill="#F59E0B"/>
  </svg>`,

  'layer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M24 4l-12 5-6 8 6 4 2-3v24h20V18l2 3 6-4-6-8-12-5Z" fill="#1E293B" stroke="#0F172A" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="24" y1="4" x2="24" y2="42" stroke="#64748B" stroke-width="2.5"/>
  </svg>`,

  'scarf.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M10 12c0-4.4 6.3-8 14-8s14 3.6 14 8-6.3 8-14 8-14-3.6-14-8Z" fill="#E11D48" stroke="#BE123C" stroke-width="2.5"/>
    <path d="M26 19v23h9V20" fill="#E11D48" stroke="#BE123C" stroke-width="2.5"/>
    <line x1="26" y1="36" x2="35" y2="36" stroke="#FFE4E6" stroke-width="2"/>
    <line x1="26" y1="39" x2="35" y2="39" stroke="#FFE4E6" stroke-width="2"/>
  </svg>`,

  'footwear.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M4 36h40v4H4z" fill="#334155"/>
    <path d="M8 36V20a5 5 0 0 1 5-5h6l8 7h11a5 5 0 0 1 5 5v9H8Z" fill="#2563EB" stroke="#1D4ED8" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M22 22l6 6" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 20l6 6" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  // Plan Your Day — Activity Icons
  'walking.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="26" cy="8" r="5" fill="#059669"/>
    <path d="M23 15l-4 12 7 4 4-8 5 4v9" stroke="#059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 27l-5 13" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 18l-6 4" stroke="#059669" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  'running.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="32" cy="8" r="5" fill="#2563EB"/>
    <path d="M24 16l-8 7 8 4-4 8 10 9" stroke="#2563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 23l-7 3" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
    <path d="M24 16l8-3 6 7" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'cycling.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <!-- Wheels -->
    <circle cx="12" cy="34" r="8" stroke="#D97706" stroke-width="3.5"/>
    <circle cx="36" cy="34" r="8" stroke="#D97706" stroke-width="3.5"/>
    <!-- Frame -->
    <path d="M12 34l8-14h10l6 14M20 20l4 14" stroke="#B45309" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Cyclist head & handlebars -->
    <circle cx="28" cy="10" r="3.5" fill="#D97706"/>
    <path d="M22 17l6-4 4 7" stroke="#B45309" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'sports.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5"/>
    <!-- Soccer ball pattern -->
    <polygon points="24,16 17,21 20,29 28,29 31,21" fill="#0F172A"/>
    <line x1="24" y1="16" x2="24" y2="6" stroke="#0F172A" stroke-width="2.5"/>
    <line x1="17" y1="21" x2="8" y2="18" stroke="#0F172A" stroke-width="2.5"/>
    <line x1="20" y1="29" x2="13" y2="37" stroke="#0F172A" stroke-width="2.5"/>
    <line x1="28" y1="29" x2="35" y2="37" stroke="#0F172A" stroke-width="2.5"/>
    <line x1="31" y1="21" x2="40" y2="18" stroke="#0F172A" stroke-width="2.5"/>
  </svg>`,

  'photography.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="14" width="36" height="26" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
    <path d="M16 14l3-5h10l3 5" fill="#334155"/>
    <circle cx="24" cy="27" r="8" fill="#38BDF8" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="22" cy="25" r="2.5" fill="#FFFFFF"/>
    <circle cx="35" cy="19" r="2" fill="#EF4444"/>
  </svg>`,

  'laundry.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <line x1="4" y1="12" x2="44" y2="12" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
    <!-- T-shirt hanging -->
    <path d="M18 12l-5 4 3 3 2-2v17h12V17l2 2 3-3-5-4a4 4 0 0 1-8 0" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2.5"/>
    <!-- Clothespins -->
    <rect x="15" y="9" width="3" height="6" fill="#F59E0B" rx="1"/>
    <rect x="29" y="9" width="3" height="6" fill="#F59E0B" rx="1"/>
  </svg>`,

  'outdoor_event.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <!-- Tree canopy -->
    <circle cx="24" cy="18" r="14" fill="#10B981"/>
    <circle cx="16" cy="22" r="9" fill="#059669"/>
    <circle cx="32" cy="22" r="9" fill="#059669"/>
    <!-- Trunk -->
    <rect x="21" y="28" width="6" height="14" fill="#78350F" rx="2"/>
    <!-- Ground grass -->
    <path d="M8 42h32" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'commute.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <!-- Car body -->
    <path d="M8 28l4-10a5 5 0 0 1 4.5-3.2h15a5 5 0 0 1 4.5 3.2l4 10H42a3 3 0 0 1 3 3v5H3v-5a3 3 0 0 1 3-3h2Z" fill="#2563EB" stroke="#1D4ED8" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Windows -->
    <path d="M14 26l3-8h6v8h-9Zm11 0v-8h6l3 8h-9Z" fill="#BAE6FD"/>
    <!-- Wheels -->
    <circle cx="14" cy="38" r="5" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
    <circle cx="34" cy="38" r="5" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
  </svg>`,

  // Empty State Hero Illustration
  'weather-explore.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="exp-sun" x1="40" y1="20" x2="80" y2="60" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FDE047"/>
        <stop offset="1" stop-color="#F59E0B"/>
      </linearGradient>
      <linearGradient id="exp-cloud" x1="20" y1="45" x2="100" y2="95" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="0.6" stop-color="#F1F5F9"/>
        <stop offset="1" stop-color="#CBD5E1"/>
      </linearGradient>
    </defs>
    <!-- Radiant background glow -->
    <circle cx="60" cy="50" r="38" fill="#EFF6FF"/>
    <!-- Sun -->
    <circle cx="76" cy="42" r="22" fill="url(#exp-sun)"/>
    <!-- Floating cloud -->
    <path d="M36 86h48a16 16 0 0 0 3-31.7 22 22 0 0 0-42-3.3 15 15 0 0 0-9 35Z" fill="url(#exp-cloud)" filter="drop-shadow(0 8px 16px rgba(37,99,235,0.12))"/>
    <!-- Rain droplets -->
    <circle cx="48" cy="98" r="3" fill="#38BDF8"/>
    <circle cx="62" cy="104" r="3.5" fill="#0284C7"/>
    <circle cx="76" cy="98" r="3" fill="#38BDF8"/>
  </svg>`
};

const publicIconsDir = path.resolve('public', 'icons');
const assetsIconsDir = path.resolve('assets', 'icons');

if (!fs.existsSync(publicIconsDir)) fs.mkdirSync(publicIconsDir, { recursive: true });
if (!fs.existsSync(assetsIconsDir)) fs.mkdirSync(assetsIconsDir, { recursive: true });

for (const [filename, content] of Object.entries(ICONS)) {
  fs.writeFileSync(path.join(publicIconsDir, filename), content.trim());
  fs.writeFileSync(path.join(assetsIconsDir, filename), content.trim());
}

console.log(`Successfully generated ${Object.keys(ICONS).length} SVG icon image files in /public/icons and /assets/icons.`);
