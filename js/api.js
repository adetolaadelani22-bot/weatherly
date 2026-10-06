/**
 * Weatherly — API Client
 * Manages network calls to Open-Meteo Geocoding & Forecast APIs.
 */

import { getLocalMatches, normalizeAdmin1 } from './locations.js';

const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_API_BASE = 'https://api.open-meteo.com/v1';

/**
 * Custom API Error with user-friendly error types
 */
export class WeatherApiError extends Error {
  constructor(type, message, originalError = null) {
    super(message);
    this.name = 'WeatherApiError';
    this.type = type; // 'EMPTY_SEARCH' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'API_ERROR' | 'LOCATION_DENIED'
    this.originalError = originalError;
  }
}

/**
 * Search for cities using curated regional intelligence and Open-Meteo Geocoding API
 * Properly resolves regions, states (e.g. Osun State, Oshogbo / Osogbo, Oyo State, etc.),
 * handles spelling variants, and removes ambiguous false positives.
 * @param {string} query - City/state query string
 * @returns {Promise<Array<Object>>} List of matched cities
 */
export async function searchCities(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.length < 2) {
    return [];
  }

  // 1. Check curated regional & state database first (e.g. Osun State, Oshogbo, Osogbo, Ibadan)
  const localMatches = getLocalMatches(trimmed);
  const combinedResults = [...localMatches];
  const seenKeys = new Set(
    combinedResults.map(r => `${r.name.toLowerCase()}|${(r.admin1 || '').toLowerCase()}|${(r.country || '').toLowerCase()}`)
  );

  // Queries to attempt on Open-Meteo
  const cleanState = trimmed.replace(/\bstate\b/gi, '').replace(/\s+/g, ' ').trim();
  const queriesToTry = [];
  if (cleanState && cleanState !== trimmed && cleanState.length >= 2) {
    queriesToTry.push(cleanState);
  }
  queriesToTry.push(trimmed);

  const normQuery = trimmed.toLowerCase();
  const isOsunQuery = normQuery === 'osun' || normQuery.startsWith('osun') || normQuery.includes('osun state');

  try {
    for (const q of queriesToTry) {
      const url = `${GEOCODING_API_BASE}/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          for (const item of data.results) {
            if (!item || typeof item.name !== 'string' || !Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)) {
              continue;
            }
            const country = item.country || '';
            const rawAdmin = item.admin1 || '';
            const admin1 = normalizeAdmin1(rawAdmin, country);

            // Filter out false positive: small village named Osun in Ekiti or Oyo when searching for Osun State
            if (isOsunQuery && item.name.toLowerCase() === 'osun' && admin1.toLowerCase().includes('ekiti')) {
              continue;
            }

            const key = `${item.name.toLowerCase()}|${admin1.toLowerCase()}|${country.toLowerCase()}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              combinedResults.push({
                id: item.id,
                name: item.name,
                country: country,
                countryCode: item.country_code || '',
                admin1: admin1,
                latitude: item.latitude,
                longitude: item.longitude,
                timezone: item.timezone || 'auto'
              });
            }
          }
        }
      }

      if (combinedResults.length >= 6) {
        break;
      }
    }

    return combinedResults.slice(0, 8);
  } catch (err) {
    // If network error occurred but we have local matches (e.g. Osun State, Oshogbo), return local matches
    if (combinedResults.length > 0) {
      return combinedResults.slice(0, 8);
    }
    if (err instanceof WeatherApiError) throw err;
    throw new WeatherApiError(
      'NETWORK_ERROR',
      'Unable to connect to the weather service. Check your internet connection and try again.',
      err
    );
  }
}

/**
 * Retrieve comprehensive weather forecast data from Open-Meteo
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [timezone='auto']
 * @returns {Promise<Object>} Processed weather data response
 */
export async function getWeatherData(latitude, longitude, timezone = 'auto') {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new WeatherApiError('API_ERROR', 'Invalid coordinates provided for weather retrieval.');
  }

  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'weather_code',
    'cloud_cover',
    'wind_speed_10m',
    'wind_direction_10m'
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'rain',
    'weather_code',
    'cloud_cover',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index'
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'precipitation_probability_max',
    'precipitation_sum',
    'rain_sum',
    'sunrise',
    'sunset',
    'uv_index_max',
    'wind_speed_10m_max'
  ].join(',');

  const url = `${FORECAST_API_BASE}/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=7`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new WeatherApiError(
        'API_ERROR',
        `Weather service returned an error (${response.status}). Please try again shortly.`
      );
    }

    const data = await response.json();

    if (!data || !data.current || !data.hourly || !data.daily) {
      throw new WeatherApiError(
        'API_ERROR',
        'Incomplete weather data received from service.'
      );
    }

    return data;
  } catch (err) {
    if (err instanceof WeatherApiError) throw err;
    throw new WeatherApiError(
      'NETWORK_ERROR',
      'Unable to connect to the weather service. Check your internet connection and try again.',
      err
    );
  }
}

/**
 * Reverse geocode latitude and longitude to get locality details
 * Uses BigDataCloud client API with graceful fallbacks
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ name: string, country: string, admin1: string }>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      const admin1 = normalizeAdmin1(data.principalSubdivision || '', country);
      return { name, country, admin1 };
    }
  } catch {
    // Fallback gracefully
  }

  return {
    name: 'Current Location',
    country: '',
    admin1: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`
  };
}

/**
 * Request user location coordinates via Browser Geolocation API
 * @returns {Promise<{ latitude: number, longitude: number }>}
 */
export function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new WeatherApiError('LOCATION_DENIED', 'Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        let message = "We couldn't access your location. You can search for a city instead.";
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission was denied. You can search for a city instead.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out. Please try searching for your city.';
        }
        reject(new WeatherApiError('LOCATION_DENIED', message, error));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  });
}
