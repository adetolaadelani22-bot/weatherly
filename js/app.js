/**
 * Weatherly — Main Application Controller
 * Coordinates API requests, UI rendering, local storage persistence, and user events.
 */

import { searchCities, getWeatherData, reverseGeocode, getCurrentCoordinates, WeatherApiError } from './api.js';
import { getRecentSearches, saveRecentSearch, clearRecentSearches, getUnitPreference, setUnitPreference, getLastLocation, setLastLocation } from './storage.js';
import { debounce } from './utils.js';
import {
  renderAutocomplete,
  renderRecentSearches,
  renderCurrentWeather,
  renderDailyScore,
  renderDailyBrief,
  renderRainTimeline,
  renderOutfitGuide,
  renderBestOutdoorWindow,
  renderActivityPlanner,
  renderHourlyForecast,
  renderDailyForecast,
  renderLoadingSkeleton,
  renderErrorState,
  renderEmptyState
} from './ui.js';

class WeatherlyApp {
  constructor() {
    this.state = {
      currentLocation: null,
      weatherData: null,
      unit: getUnitPreference(),
      selectedActivity: 'walking',
      recentSearches: getRecentSearches(),
      isLoading: false,
      autocompleteResults: []
    };

    this.dom = {
      searchForm: document.getElementById('search-form'),
      searchInput: document.getElementById('search-input'),
      searchClearBtn: document.getElementById('search-clear-btn'),
      locationBtn: document.getElementById('use-location-btn'),
      autocompleteContainer: document.getElementById('autocomplete-dropdown'),
      recentContainer: document.getElementById('recent-searches-container'),
      unitToggleC: document.getElementById('unit-c'),
      unitToggleF: document.getElementById('unit-f'),
      errorContainer: document.getElementById('error-banner-container'),
      emptyContainer: document.getElementById('empty-state-container'),
      dashboardContainer: document.getElementById('weather-dashboard'),
      // Individual sections
      currentWeatherSection: document.getElementById('current-weather-mount'),
      dailyScoreSection: document.getElementById('daily-score-mount'),
      dailyBriefSection: document.getElementById('daily-brief-mount'),
      rainTimelineSection: document.getElementById('rain-timeline-mount'),
      outfitGuideSection: document.getElementById('outfit-guide-mount'),
      bestWindowSection: document.getElementById('best-window-mount'),
      activityPlannerSection: document.getElementById('activity-planner-mount'),
      hourlyForecastSection: document.getElementById('hourly-forecast-mount'),
      dailyForecastSection: document.getElementById('daily-forecast-mount')
    };

    this.init();
  }

  /**
   * Initialize event handlers and bootstrap app
   */
  init() {
    this.setupEventListeners();
    this.updateUnitToggleUI();
    this.renderRecentSearchesUI();

    // Check for last saved location or show initial city
    const lastLoc = getLastLocation();
    if (lastLoc && typeof lastLoc.latitude === 'number') {
      this.loadWeatherForLocation(lastLoc);
    } else {
      // Default to Lagos or show clean empty state
      this.showEmptyState();
    }
  }

  /**
   * Wire up DOM event listeners
   */
  setupEventListeners() {
    // Search form submission
    if (this.dom.searchForm) {
      this.dom.searchForm.addEventListener('submit', e => {
        e.preventDefault();
        this.handleSearchSubmit();
      });
    }

    // Search input typing with debounced autocomplete
    if (this.dom.searchInput) {
      const debouncedSearch = debounce(async query => {
        await this.handleAutocomplete(query);
      }, 250);

      this.dom.searchInput.addEventListener('input', e => {
        const val = e.target.value.trim();
        if (this.dom.searchClearBtn) {
          this.dom.searchClearBtn.classList.toggle('hidden', val.length === 0);
        }
        if (val.length >= 2) {
          debouncedSearch(val);
        } else {
          this.closeAutocomplete();
        }
      });

      // Clear search input button
      if (this.dom.searchClearBtn) {
        this.dom.searchClearBtn.addEventListener('click', () => {
          this.dom.searchInput.value = '';
          this.dom.searchClearBtn.classList.add('hidden');
          this.closeAutocomplete();
          this.dom.searchInput.focus();
        });
      }

      // Keyboard navigation for autocomplete list
      this.dom.searchInput.addEventListener('keydown', e => {
        this.handleKeyboardNavigation(e);
      });
    }

    // Geolocation button
    if (this.dom.locationBtn) {
      this.dom.locationBtn.addEventListener('click', () => {
        this.handleUseCurrentLocation();
      });
    }

    // Unit toggle buttons
    if (this.dom.unitToggleC) {
      this.dom.unitToggleC.addEventListener('click', () => this.setUnit('C'));
    }
    if (this.dom.unitToggleF) {
      this.dom.unitToggleF.addEventListener('click', () => this.setUnit('F'));
    }

    // Close autocomplete on click outside
    document.addEventListener('click', e => {
      if (
        this.dom.autocompleteContainer &&
        !this.dom.autocompleteContainer.contains(e.target) &&
        e.target !== this.dom.searchInput
      ) {
        this.closeAutocomplete();
      }
    });
  }

  /**
   * Update active class on Celsius / Fahrenheit toggle
   */
  updateUnitToggleUI() {
    const isC = this.state.unit === 'C';
    if (this.dom.unitToggleC) {
      this.dom.unitToggleC.classList.toggle('active', isC);
      this.dom.unitToggleC.setAttribute('aria-pressed', String(isC));
    }
    if (this.dom.unitToggleF) {
      this.dom.unitToggleF.classList.toggle('active', !isC);
      this.dom.unitToggleF.setAttribute('aria-pressed', String(!isC));
    }
  }

  /**
   * Change temperature unit and rerender all affected components
   * @param {'C' | 'F'} newUnit
   */
  setUnit(newUnit) {
    if (this.state.unit === newUnit) return;
    this.state.unit = newUnit;
    setUnitPreference(newUnit);
    this.updateUnitToggleUI();

    // Rerender active dashboard if data is loaded
    if (this.state.weatherData && this.state.currentLocation) {
      this.renderFullDashboard();
    }
  }

  /**
   * Render recent search history pills
   */
  renderRecentSearchesUI() {
    renderRecentSearches(
      this.dom.recentContainer,
      this.state.recentSearches,
      selectedLocation => {
        this.loadWeatherForLocation(selectedLocation);
      },
      () => {
        clearRecentSearches();
        this.state.recentSearches = [];
        this.renderRecentSearchesUI();
      }
    );
  }

  /**
   * Handle text search submit
   */
  async handleSearchSubmit() {
    const query = (this.dom.searchInput?.value || '').trim();
    if (!query) {
      this.showError('EMPTY_SEARCH', 'Please enter a city name to search.');
      return;
    }

    this.closeAutocomplete();
    this.clearError();

    try {
      this.setLoading(true);
      const results = await searchCities(query);

      if (!results || results.length === 0) {
        this.setLoading(false);
        this.showError('NOT_FOUND', `We couldn't find "${query}". Try another city or check spelling.`);
        return;
      }

      // Pick top match
      const target = results[0];
      await this.loadWeatherForLocation(target);
    } catch (err) {
      this.setLoading(false);
      this.handleError(err);
    }
  }

  /**
   * Handle typing for suggestions dropdown
   * @param {string} query
   */
  async handleAutocomplete(query) {
    try {
      const results = await searchCities(query);
      this.state.autocompleteResults = results;

      renderAutocomplete(this.dom.autocompleteContainer, results, selectedCity => {
        if (this.dom.searchInput) {
          this.dom.searchInput.value = selectedCity.name;
        }
        this.closeAutocomplete();
        this.loadWeatherForLocation(selectedCity);
      });
    } catch {
      this.closeAutocomplete();
    }
  }

  /**
   * Close autocomplete dropdown
   */
  closeAutocomplete() {
    if (this.dom.autocompleteContainer) {
      this.dom.autocompleteContainer.innerHTML = '';
      this.dom.autocompleteContainer.classList.add('hidden');
    }
    this.state.autocompleteResults = [];
  }

  /**
   * Handle arrow keys and Enter in search input for dropdown
   * @param {KeyboardEvent} e
   */
  handleKeyboardNavigation(e) {
    const container = this.dom.autocompleteContainer;
    if (!container || container.classList.contains('hidden')) return;

    const items = container.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;

    let activeIndex = -1;
    items.forEach((item, idx) => {
      if (item.classList.contains('highlighted')) activeIndex = idx;
    });

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
      items.forEach((it, i) => it.classList.toggle('highlighted', i === nextIndex));
      items[nextIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
      items.forEach((it, i) => it.classList.toggle('highlighted', i === prevIndex));
      items[prevIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      items[activeIndex].click();
    } else if (e.key === 'Escape') {
      this.closeAutocomplete();
    }
  }

  /**
   * Use Current Location via Geolocation API
   */
  async handleUseCurrentLocation() {
    this.clearError();
    this.closeAutocomplete();

    try {
      this.setLoading(true);
      const coords = await getCurrentCoordinates();
      const geoDetail = await reverseGeocode(coords.latitude, coords.longitude);

      const locationObj = {
        name: geoDetail.name,
        country: geoDetail.country,
        admin1: geoDetail.admin1,
        latitude: coords.latitude,
        longitude: coords.longitude
      };

      await this.loadWeatherForLocation(locationObj);
    } catch (err) {
      this.setLoading(false);
      this.handleError(err);
    }
  }

  /**
   * Load weather for a validated location object
   * @param {Object} location
   */
  async loadWeatherForLocation(location) {
    if (!location || typeof location.latitude !== 'number') return;

    this.clearError();
    this.setLoading(true);
    this.hideEmptyState();

    try {
      const weatherData = await getWeatherData(
        location.latitude,
        location.longitude,
        location.timezone || 'auto'
      );

      this.state.currentLocation = location;
      this.state.weatherData = weatherData;

      // Save to recent searches & last location
      saveRecentSearch(location);
      setLastLocation(location);
      this.state.recentSearches = getRecentSearches();
      this.renderRecentSearchesUI();

      this.setLoading(false);
      this.renderFullDashboard();

      // Smoothly scroll to weather content on mobile
      if (window.innerWidth < 768 && this.dom.dashboardContainer) {
        this.dom.dashboardContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      this.setLoading(false);
      this.handleError(err);
    }
  }

  /**
   * Render the entire decision dashboard
   */
  renderFullDashboard() {
    const { currentLocation, weatherData, unit, selectedActivity } = this.state;
    if (!currentLocation || !weatherData) return;

    if (this.dom.dashboardContainer) {
      this.dom.dashboardContainer.classList.remove('hidden');
    }

    const timezone = weatherData.timezone || 'auto';

    // 1. Current Weather
    renderCurrentWeather(this.dom.currentWeatherSection, currentLocation, weatherData, unit);

    // 2. Weatherly Daily Score
    renderDailyScore(this.dom.dailyScoreSection, weatherData);

    // 3. Smart Daily Brief
    renderDailyBrief(this.dom.dailyBriefSection, currentLocation.name, weatherData, unit);

    // 4. Rain Timeline
    renderRainTimeline(this.dom.rainTimelineSection, weatherData, unit, timezone);

    // 5. Outfit Guide
    renderOutfitGuide(this.dom.outfitGuideSection, weatherData, unit);

    // 6. Best Outdoor Window
    renderBestOutdoorWindow(this.dom.bestWindowSection, weatherData, unit, timezone);

    // 7. Activity Planner
    renderActivityPlanner(
      this.dom.activityPlannerSection,
      selectedActivity,
      activityId => {
        this.state.selectedActivity = activityId;
        renderActivityPlanner(
          this.dom.activityPlannerSection,
          activityId,
          aId => this.handleActivityChange(aId),
          weatherData,
          unit,
          timezone
        );
      },
      weatherData,
      unit,
      timezone
    );

    // 8. Hourly Forecast
    renderHourlyForecast(this.dom.hourlyForecastSection, weatherData, unit, timezone);

    // 9. 7-Day Forecast
    renderDailyForecast(this.dom.dailyForecastSection, weatherData, unit, timezone);
  }

  /**
   * Handle activity selection tab switch
   * @param {string} activityId
   */
  handleActivityChange(activityId) {
    this.state.selectedActivity = activityId;
    if (this.state.weatherData) {
      renderActivityPlanner(
        this.dom.activityPlannerSection,
        activityId,
        aId => this.handleActivityChange(aId),
        this.state.weatherData,
        this.state.unit,
        this.state.weatherData.timezone
      );
    }
  }

  /**
   * Set loading UI state with skeletons
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.state.isLoading = loading;

    if (loading) {
      if (this.dom.dashboardContainer) {
        this.dom.dashboardContainer.classList.add('hidden');
      }
      if (this.dom.emptyContainer) {
        this.dom.emptyContainer.classList.add('hidden');
      }
      renderLoadingSkeleton(this.dom.errorContainer);
    } else {
      if (this.dom.errorContainer && this.dom.errorContainer.querySelector('.loading-state-wrapper')) {
        this.dom.errorContainer.innerHTML = '';
      }
    }
  }

  /**
   * Show welcoming empty state
   */
  showEmptyState() {
    if (this.dom.dashboardContainer) {
      this.dom.dashboardContainer.classList.add('hidden');
    }
    if (this.dom.emptyContainer) {
      this.dom.emptyContainer.classList.remove('hidden');
      renderEmptyState(this.dom.emptyContainer, selectedCity => {
        this.loadWeatherForLocation(selectedCity);
      });
    }
  }

  /**
   * Hide empty state
   */
  hideEmptyState() {
    if (this.dom.emptyContainer) {
      this.dom.emptyContainer.classList.add('hidden');
      this.dom.emptyContainer.innerHTML = '';
    }
  }

  /**
   * Render error notification
   * @param {string} type
   * @param {string} message
   */
  showError(type, message) {
    if (this.dom.errorContainer) {
      renderErrorState(this.dom.errorContainer, type, message, () => {
        this.clearError();
      });
    }
  }

  /**
   * Clear error message
   */
  clearError() {
    if (this.dom.errorContainer) {
      this.dom.errorContainer.innerHTML = '';
    }
  }

  /**
   * Parse error and display appropriate banner
   * @param {Error|WeatherApiError} err
   */
  handleError(err) {
    if (err instanceof WeatherApiError) {
      this.showError(err.type, err.message);
    } else {
      this.showError('NETWORK_ERROR', err.message || 'Unable to load weather data. Please try again.');
    }
  }
}

// Bootstrap once DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
  window.weatherlyApp = new WeatherlyApp();
});
