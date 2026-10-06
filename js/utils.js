/**
 * Weatherly — Utility Functions
 * Reusable helpers for formatting, conversions, and DOM manipulation.
 */

/**
 * Convert Celsius to Fahrenheit
 * @param {number} c - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(c) {
  if (typeof c !== 'number' || isNaN(c)) return 0;
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Convert Fahrenheit to Celsius
 * @param {number} f - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
export function fahrenheitToCelsius(f) {
  if (typeof f !== 'number' || isNaN(f)) return 0;
  return Math.round(((f - 32) * 5) / 9);
}

/**
 * Format temperature with unit symbol
 * @param {number} celsius - Temperature in Celsius
 * @param {'C' | 'F'} unit - Target unit
 * @param {boolean} [showUnitSymbol=true] - Whether to append 'C' or 'F'
 * @returns {string} Formatted temperature string
 */
export function formatTemp(celsius, unit = 'C', showUnitSymbol = true) {
  if (typeof celsius !== 'number' || isNaN(celsius)) return '--°';
  const val = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return showUnitSymbol ? `${val}°${unit}` : `${val}°`;
}

/**
 * Format speed in km/h or mph
 * @param {number} kmh - Speed in km/h
 * @param {'C' | 'F'} unit - Unit preference (F uses mph)
 * @returns {string} Formatted speed
 */
export function formatSpeed(kmh, unit = 'C') {
  if (typeof kmh !== 'number' || isNaN(kmh)) return '--';
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Convert wind degrees to cardinal direction
 * @param {number} deg - Wind direction in degrees
 * @returns {string} Cardinal direction (e.g. "NE", "SSW")
 */
export function degToCompass(deg) {
  if (typeof deg !== 'number' || isNaN(deg)) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Format ISO date string into readable date (e.g. "Monday, September 7")
 * @param {string} isoString
 * @param {string} [timeZone]
 * @returns {string}
 */
export function formatDate(isoString, timeZone) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: timeZone || undefined
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return isoString.split('T')[0];
  }
}

/**
 * Format ISO date into short day name (e.g. "Mon", "Today")
 * @param {string} isoString
 * @param {string} [timeZone]
 * @returns {string}
 */
export function formatDayName(isoString, timeZone) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const today = new Date();
    
    // Check if same day
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    
    if (isToday) return 'Today';

    const options = { weekday: 'short', timeZone: timeZone || undefined };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return 'Day';
  }
}

/**
 * Format ISO date string to time (e.g. "9 AM", "12 PM")
 * @param {string} isoString
 * @param {string} [timeZone]
 * @returns {string}
 */
export function formatTime(isoString, timeZone) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone || undefined
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return isoString.includes('T') ? isoString.split('T')[1].slice(0, 5) : isoString;
  }
}

/**
 * Format hour number or ISO string to simple hour (e.g. "10 AM")
 * @param {string|Date} dateInput
 * @param {string} [timeZone]
 * @returns {string}
 */
export function formatHour(dateInput, timeZone) {
  if (!dateInput) return '';
  try {
    const date = new Date(dateInput);
    const options = {
      hour: 'numeric',
      hour12: true,
      timeZone: timeZone || undefined
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return '';
  }
}

/**
 * Get UV index descriptive category
 * @param {number} uv
 * @returns {{ level: string, rating: string, advice: string }}
 */
export function getUvCategory(uv) {
  if (typeof uv !== 'number' || isNaN(uv)) {
    return { level: 'Low', rating: '0', advice: 'No protection needed' };
  }
  const rounded = Math.round(uv * 10) / 10;
  if (uv <= 2) {
    return { level: 'Low', rating: String(rounded), advice: 'No protection needed' };
  }
  if (uv <= 5) {
    return { level: 'Moderate', rating: String(rounded), advice: 'Wear sun protection' };
  }
  if (uv <= 7) {
    return { level: 'High', rating: String(rounded), advice: 'Seek shade during midday' };
  }
  if (uv <= 10) {
    return { level: 'Very High', rating: String(rounded), advice: 'Extra protection required' };
  }
  return { level: 'Extreme', rating: String(rounded), advice: 'Avoid outdoor sun exposure' };
}

/**
 * Debounce helper
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Safe HTML string escaper
 * @param {string} str
 * @returns {string}
 */
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
