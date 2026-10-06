/**
 * Weatherly — Storage Module
 * Manages localStorage interactions with graceful error-handling for storage quotas and restrictions.
 */

const STORAGE_KEYS = {
  RECENT_SEARCHES: 'weatherly_recent_searches_v1',
  UNIT_PREFERENCE: 'weatherly_unit_preference_v1',
  LAST_LOCATION: 'weatherly_last_location_v1'
};

const MAX_RECENT_SEARCHES = 5;

/**
 * Safely access localStorage
 * @returns {boolean} Whether storage is accessible
 */
function isStorageAvailable() {
  try {
    const testKey = '__weatherly_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get stored recent searches
 * @returns {Array<Object>} List of stored locations
 */
export function getRecentSearches() {
  if (!isStorageAvailable()) return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    const parsed = data ? JSON.parse(data) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      item =>
        item &&
        typeof item.name === 'string' &&
        typeof item.latitude === 'number' &&
        typeof item.longitude === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Save a newly searched location to recent history
 * @param {Object} location - Location object { name, country, admin1, latitude, longitude }
 */
export function saveRecentSearch(location) {
  if (
    !isStorageAvailable() ||
    !location ||
    typeof location.name !== 'string' ||
    !location.name.trim() ||
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude)
  ) {
    return;
  }
  try {
    const current = getRecentSearches();
    // Deduplicate by name and country
    const filtered = current.filter(item => {
      const sameName = item.name.toLowerCase() === location.name.toLowerCase();
      const sameCountry = (item.country || '').toLowerCase() === (location.country || '').toLowerCase();
      return !(sameName && sameCountry);
    });

    const updated = [
      {
        id: location.id || `${location.name}_${location.latitude}_${location.longitude}`,
        name: location.name,
        country: location.country || '',
        admin1: location.admin1 || '',
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now()
      },
      ...filtered
    ].slice(0, MAX_RECENT_SEARCHES);

    window.localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches() {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch {
    // Non-blocking
  }
}

/**
 * Get user unit preference ('C' or 'F')
 * @returns {'C' | 'F'}
 */
export function getUnitPreference() {
  if (!isStorageAvailable()) return 'C';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.UNIT_PREFERENCE);
    return stored === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
}

/**
 * Store user unit preference
 * @param {'C' | 'F'} unit
 */
export function setUnitPreference(unit) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.UNIT_PREFERENCE, unit === 'F' ? 'F' : 'C');
  } catch {
    // Non-blocking
  }
}

/**
 * Get the last selected location
 * @returns {Object|null}
 */
export function getLastLocation() {
  if (!isStorageAvailable()) return null;
  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Store last selected location
 * @param {Object} location
 */
export function setLastLocation(location) {
  if (!isStorageAvailable() || !location) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(location));
  } catch {
    // Non-blocking
  }
}
