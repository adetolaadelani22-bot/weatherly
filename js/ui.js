/**
 * Weatherly — UI Rendering Module
 * Responsible for modern, accessible, and secure DOM manipulation.
 */

import { formatTemp, formatSpeed, degToCompass, formatDate, formatDayName, formatHour, formatTime, getUvCategory, escapeHTML } from './utils.js';
import { getWeatherCondition, calculateWeatherScore, generateDailyBrief, analyzeRainTimeline, getOutfitRecommendation, evaluateActivity, calculateBestOutdoorWindow, ACTIVITIES } from './weather.js';

const ICON_BASE_URL = `${import.meta.env.BASE_URL}icons/`;

/**
 * Map icon identifier to its image asset URL
 * @param {string} iconName
 * @returns {string} Relative asset URL
 */
export function getIconUrl(iconName) {
  const map = {
    'sun': './icons/sun.svg',
    'moon': './icons/moon.svg',
    'sun-cloud': './icons/sun-cloud.svg',
    'cloud-sun': './icons/cloud-sun.svg',
    'moon-cloud': './icons/moon-cloud.svg',
    'cloud': './icons/cloud.svg',
    'fog': './icons/fog.svg',
    'drizzle': './icons/drizzle.svg',
    'rain-light': './icons/rain-light.svg',
    'rain': './icons/rain.svg',
    'shower': './icons/shower.svg',
    'rain-heavy': './icons/rain-heavy.svg',
    'snow': './icons/snow.svg',
    'sleet': './icons/sleet.svg',
    'thunderstorm': './icons/thunderstorm.svg',
    'wind': './icons/wind.svg',
    'humidity': './icons/humidity.svg',
    'droplet': './icons/droplet.svg',
    'umbrella': './icons/umbrella.svg',
    'compass': './icons/compass.svg',
    'sunrise': './icons/sunrise.svg',
    'sunset': './icons/sunset.svg',
    'uv': './icons/uv.svg',
    'cloud-cover': './icons/cloud-cover.svg',
    'shirt': './icons/shirt.svg',
    'jacket': './icons/jacket.svg',
    'layer': './icons/layer.svg',
    'scarf': './icons/scarf.svg',
    'footwear': './icons/footwear.svg',
    'star': './icons/star.svg',
    'star-empty': './icons/star-empty.svg',
    'check': './icons/check.svg',
    'clear': './icons/clear.svg',
    'close': './icons/close.svg',
    'clock': './icons/clock.svg',
    'location': './icons/location.svg',
    'search': './icons/search.svg',
    'logo': './icons/logo.svg',
    'walking': './icons/walking.svg',
    'running': './icons/running.svg',
    'cycling': './icons/cycling.svg',
    'sports': './icons/sports.svg',
    'photography': './icons/photography.svg',
    'laundry': './icons/laundry.svg',
    'outdoor_event': './icons/outdoor_event.svg',
    'commute': './icons/commute.svg',
    'weather-explore': './icons/weather-explore.svg'
  };

  return map[iconName]
    ? map[iconName].replace('./icons/', ICON_BASE_URL)
    : `${ICON_BASE_URL}cloud.svg`;
}

/**
 * Return modern image markup for weather conditions and UI icons
 * @param {string} iconName
 * @param {string} [customClass='']
 * @param {string} [altText='']
 * @returns {string} HTML <img> element string
 */
export function getIconImg(iconName, customClass = '', altText = '') {
  const src = getIconUrl(iconName);
  const alt = altText ? escapeHTML(altText) : `${escapeHTML(iconName)} icon`;
  const classes = customClass ? `${escapeHTML(customClass)} icon-img` : 'icon-img';
  return `<img src="${src}" alt="${alt}" class="${classes}" referrerPolicy="no-referrer" loading="lazy" />`;
}

/**
 * Backwards-compatible alias for getIconImg — returns <img> markup
 * @param {string} iconName
 * @param {string} [customClass='']
 * @param {string} [altText='']
 * @returns {string} HTML <img> string
 */
export function getIconSvg(iconName, customClass = '', altText = '') {
  return getIconImg(iconName, customClass, altText);
}

/**
 * Render visual star ratings using star image elements
 * @param {number} rating
 * @param {number} [maxStars=5]
 * @returns {string} HTML markup containing star images
 */
export function renderStars(rating = 5, maxStars = 5) {
  let html = '';
  const numRating = Math.round(Number(rating) || 0);
  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= numRating;
    const icon = isFilled ? 'star' : 'star-empty';
    html += `<img src="${getIconUrl(icon)}" alt="${isFilled ? '★' : '☆'}" class="star-icon-img" referrerPolicy="no-referrer" width="15" height="15" />`;
  }
  return `<span class="star-rating-images" aria-label="${numRating} out of ${maxStars} stars">${html}</span>`;
}

/**
 * Apply dynamic atmospheric theme class to body
 * @param {string} category - 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy' | 'night'
 */
export function applyAtmosphereTheme(category) {
  const body = document.body;
  const themeClasses = ['theme-sunny', 'theme-cloudy', 'theme-rain', 'theme-storm', 'theme-night', 'theme-fog'];
  themeClasses.forEach(cls => body.classList.remove(cls));

  switch (category) {
    case 'night':
      body.classList.add('theme-night');
      break;
    case 'sunny':
      body.classList.add('theme-sunny');
      break;
    case 'rainy':
      body.classList.add('theme-rain');
      break;
    case 'stormy':
      body.classList.add('theme-storm');
      break;
    case 'foggy':
      body.classList.add('theme-fog');
      break;
    case 'cloudy':
    default:
      body.classList.add('theme-cloudy');
      break;
  }
}

/**
 * Render Autocomplete Suggestions Dropdown
 * @param {HTMLElement} container
 * @param {Array<Object>} suggestions
 * @param {Function} onSelect
 */
export function renderAutocomplete(container, suggestions, onSelect) {
  if (!container) return;
  container.innerHTML = '';

  if (!suggestions || suggestions.length === 0) {
    container.classList.add('hidden');
    return;
  }

  const list = document.createElement('ul');
  list.className = 'autocomplete-list';
  list.setAttribute('role', 'listbox');

  suggestions.forEach((city, idx) => {
    const item = document.createElement('li');
    item.className = 'autocomplete-item';
    item.setAttribute('role', 'option');
    item.setAttribute('tabindex', '0');
    item.dataset.index = String(idx);

    const regionPart = city.admin1 ? `${city.admin1}, ` : '';
    item.innerHTML = `
      <div class="item-icon">${getIconSvg('location', 'w-4 h-4')}</div>
      <div class="item-content">
        <span class="city-name">${escapeHTML(city.name)}</span>
        <span class="country-name">${escapeHTML(regionPart + city.country)}</span>
      </div>
    `;

    item.addEventListener('click', () => onSelect(city));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(city);
      }
    });

    list.appendChild(item);
  });

  container.appendChild(list);
  container.classList.remove('hidden');
}

/**
 * Render Recent Searches Bar
 * @param {HTMLElement} container
 * @param {Array<Object>} recentSearches
 * @param {Function} onSelect
 * @param {Function} onClear
 */
export function renderRecentSearches(container, recentSearches, onSelect, onClear) {
  if (!container) return;
  container.innerHTML = '';

  if (!recentSearches || recentSearches.length === 0) {
    container.classList.add('hidden');
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'recent-searches-wrapper';

  const label = document.createElement('span');
  label.className = 'recent-label';
  label.textContent = 'Recent:';
  wrapper.appendChild(label);

  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'recent-pills';

  recentSearches.forEach(item => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'recent-pill';
    pill.textContent = item.name;
    pill.setAttribute('aria-label', `Search weather for ${item.name}`);
    pill.addEventListener('click', () => onSelect(item));
    pillsContainer.appendChild(pill);
  });

  wrapper.appendChild(pillsContainer);

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'recent-clear-btn';
  clearBtn.setAttribute('title', 'Clear recent searches');
  clearBtn.setAttribute('aria-label', 'Clear recent searches');
  clearBtn.innerHTML = `${getIconSvg('clear', 'w-3 h-3')} Clear`;
  clearBtn.addEventListener('click', onClear);
  wrapper.appendChild(clearBtn);

  container.appendChild(wrapper);
  container.classList.remove('hidden');
}

/**
 * Render Current Weather Card & Key Supporting Stats
 * @param {HTMLElement} container
 * @param {Object} location
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 */
export function renderCurrentWeather(container, location, rawData, unit = 'C') {
  if (!container) return;

  const current = rawData.current || {};
  const daily = rawData.daily || {};
  const timezone = rawData.timezone || 'auto';

  const tempC = current.temperature_2m;
  const apparentC = current.apparent_temperature;
  const isDay = typeof current.is_day === 'number' ? current.is_day : 1;
  const weatherCode = typeof current.weather_code === 'number' ? current.weather_code : 0;
  const condition = getWeatherCondition(weatherCode, isDay);

  const humidity = current.relative_humidity_2m ?? '--';
  const windKmh = current.wind_speed_10m ?? 0;
  const windDir = current.wind_direction_10m ?? 0;
  const cloudCover = current.cloud_cover ?? '--';
  const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) ?? 0;
  const maxTempC = (daily.temperature_2m_max && daily.temperature_2m_max[0]) ?? tempC;
  const minTempC = (daily.temperature_2m_min && daily.temperature_2m_min[0]) ?? tempC;
  const uvMax = (daily.uv_index_max && daily.uv_index_max[0]) ?? 0;
  const uvInfo = getUvCategory(uvMax);
  const sunrise = (daily.sunrise && daily.sunrise[0]) ? formatTime(daily.sunrise[0], timezone) : '--';
  const sunset = (daily.sunset && daily.sunset[0]) ? formatTime(daily.sunset[0], timezone) : '--';

  const locationSubtitle = location.country
    ? `${location.admin1 ? location.admin1 + ', ' : ''}${location.country}`
    : 'Local Coordinates';

  const currentDateFormatted = formatDate(new Date().toISOString(), timezone);

  // Apply atmospheric dynamic theme
  applyAtmosphereTheme(condition.category);

  container.innerHTML = `
    <article class="weather-hero-card" id="current-weather-card">
      <div class="hero-top-bar">
        <div class="location-heading">
          <div class="location-name-row">
            <span class="location-pin">${getIconSvg('location', 'w-5 h-5')}</span>
            <h2 class="location-title" id="location-name">${escapeHTML(location.name)}</h2>
          </div>
          <p class="location-subtitle">${escapeHTML(locationSubtitle)}</p>
          <time class="location-date">${escapeHTML(currentDateFormatted)}</time>
        </div>
        <div class="condition-badge">
          <span class="condition-badge-icon">${getIconSvg(condition.icon, 'w-6 h-6')}</span>
          <span class="condition-badge-text">${escapeHTML(condition.description)}</span>
        </div>
      </div>

      <div class="hero-main-focal">
        <div class="hero-temp-wrapper">
          <span class="hero-temp" id="current-temp">${formatTemp(tempC, unit, false)}</span>
          <span class="hero-unit">°${unit}</span>
        </div>
        <div class="hero-temp-details">
          <div class="feels-like-pill">
            Feels like <strong>${formatTemp(apparentC, unit)}</strong>
          </div>
          <div class="high-low-row">
            <span class="high-temp">↑ ${formatTemp(maxTempC, unit)}</span>
            <span class="divider">/</span>
            <span class="low-temp">↓ ${formatTemp(minTempC, unit)}</span>
          </div>
        </div>
      </div>

      <div class="supporting-stats-grid">
        <div class="stat-card" id="stat-rain">
          <div class="stat-icon-wrapper">${getIconSvg('umbrella', 'stat-svg')}</div>
          <div class="stat-content">
            <span class="stat-label">Rain Chance</span>
            <span class="stat-value">${rainProb}%</span>
          </div>
        </div>

        <div class="stat-card" id="stat-humidity">
          <div class="stat-icon-wrapper">${getIconSvg('humidity', 'stat-svg')}</div>
          <div class="stat-content">
            <span class="stat-label">Humidity</span>
            <span class="stat-value">${humidity}%</span>
          </div>
        </div>

        <div class="stat-card" id="stat-wind">
          <div class="stat-icon-wrapper">${getIconSvg('wind', 'stat-svg')}</div>
          <div class="stat-content">
            <span class="stat-label">Wind</span>
            <span class="stat-value">${formatSpeed(windKmh, unit)}</span>
            <span class="stat-sub">${degToCompass(windDir)} (${Math.round(windDir)}°)</span>
          </div>
        </div>

        <div class="stat-card" id="stat-uv">
          <div class="stat-icon-wrapper">${getIconSvg('uv', 'stat-svg')}</div>
          <div class="stat-content">
            <span class="stat-label">UV Index</span>
            <span class="stat-value">${uvInfo.rating}</span>
            <span class="stat-sub">${uvInfo.level}</span>
          </div>
        </div>

        <div class="stat-card" id="stat-clouds">
          <div class="stat-icon-wrapper">${getIconSvg('cloud-cover', 'stat-svg')}</div>
          <div class="stat-content">
            <span class="stat-label">Cloud Cover</span>
            <span class="stat-value">${cloudCover}%</span>
          </div>
        </div>

        <div class="stat-card" id="stat-sun">
          <div class="stat-icon-wrapper">${getIconSvg('sunrise', 'stat-svg')}</div>
          <div class="stat-content">
            <span class="stat-label">Sun Times</span>
            <span class="stat-value text-sm">${sunrise}</span>
            <span class="stat-sub">Sunset: ${sunset}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Today's Weather Score Card
 * @param {HTMLElement} container
 * @param {Object} rawData
 */
export function renderDailyScore(container, rawData) {
  if (!container) return;
  const scoreData = calculateWeatherScore(rawData);

  // SVG circular gauge math: circumference = 2 * PI * 42 ~= 263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreData.score / 100) * circumference;

  container.innerHTML = `
    <article class="decision-card score-card" id="weather-score-card">
      <div class="card-header-clean">
        <div class="card-title-group">
          <span class="card-eyebrow">Weatherly Intelligence</span>
          <h3 class="card-heading">Today’s Weather Score</h3>
        </div>
        <span class="score-badge ${scoreData.badgeClass}">${escapeHTML(scoreData.label)}</span>
      </div>

      <div class="score-body">
        <div class="score-dial-wrap">
          <svg class="score-svg-gauge" viewBox="0 0 100 100" width="110" height="110">
            <circle class="score-gauge-bg" cx="50" cy="50" r="${radius}" stroke-width="8" />
            <circle
              class="score-gauge-fill ${scoreData.badgeClass}"
              cx="50"
              cy="50"
              r="${radius}"
              stroke-width="8"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${strokeDashoffset}"
            />
          </svg>
          <div class="score-center-text">
            <span class="score-big">${scoreData.score}</span>
            <span class="score-denom">/ 100</span>
          </div>
        </div>

        <div class="score-explanation">
          <p class="score-summary-text">${escapeHTML(scoreData.description)}</p>
          <div class="score-metrics-bars">
            <div class="metric-bar-row">
              <span class="bar-label">Thermal Comfort</span>
              <div class="bar-track"><div class="bar-fill" style="width: ${scoreData.factors.temperature}%"></div></div>
            </div>
            <div class="metric-bar-row">
              <span class="bar-label">Sky & Dryness</span>
              <div class="bar-track"><div class="bar-fill" style="width: ${scoreData.factors.rain}%"></div></div>
            </div>
            <div class="metric-bar-row">
              <span class="bar-label">Wind Stability</span>
              <div class="bar-track"><div class="bar-fill" style="width: ${scoreData.factors.wind}%"></div></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Smart Daily Brief Card
 * @param {HTMLElement} container
 * @param {string} cityName
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 */
export function renderDailyBrief(container, cityName, rawData, unit = 'C') {
  if (!container) return;
  const brief = generateDailyBrief(cityName, rawData, unit);

  container.innerHTML = `
    <article class="decision-card brief-card" id="daily-brief-card">
      <div class="card-header-clean">
        <div class="card-title-group">
          <span class="card-eyebrow">Personal Briefing</span>
          <h3 class="card-heading">Today's Brief</h3>
        </div>
        <div class="brief-time-indicator">
          <span class="clock-icon">${getIconSvg('clock', 'w-4 h-4')}</span>
          <span>Updated</span>
        </div>
      </div>

      <div class="brief-body">
        <p class="brief-greeting">${escapeHTML(brief.greeting)}</p>
        <p class="brief-narrative">${escapeHTML(brief.narrative)}</p>
        <div class="brief-takeaway-box">
          <span class="takeaway-label">Key Advice</span>
          <p class="takeaway-text">${escapeHTML(brief.takeaway)}</p>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Rain Timeline Component
 * @param {HTMLElement} container
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 */
export function renderRainTimeline(container, rawData, unit = 'C', timeZone) {
  if (!container) return;
  const timeline = analyzeRainTimeline(rawData, unit, timeZone);

  let timelineHtml = '';
  timeline.items.forEach(item => {
    const isPeak = item.time === timeline.peakHour && timeline.peakProbability > 0;
    const barHeightPercent = Math.max(6, item.probability);
    const probClass = item.probability >= 50 ? 'rain-high' : item.probability >= 25 ? 'rain-med' : 'rain-low';

    timelineHtml += `
      <div class="timeline-slot ${isPeak ? 'slot-peak' : ''}">
        <span class="slot-time">${escapeHTML(item.time)}</span>
        <span class="slot-icon">${getIconSvg(item.condition.icon, 'w-5 h-5')}</span>
        <div class="slot-bar-track">
          <div class="slot-bar-fill ${probClass}" style="height: ${barHeightPercent}%;"></div>
        </div>
        <span class="slot-prob">${item.probability}%</span>
      </div>
    `;
  });

  container.innerHTML = `
    <article class="decision-card rain-timeline-card" id="rain-timeline-card">
      <div class="card-header-clean">
        <div class="card-title-group">
          <span class="card-eyebrow">Hourly Precipitation</span>
          <h3 class="card-heading">Rain Timeline</h3>
        </div>
        <span class="timeline-pill ${timeline.hasSignificantRain ? 'pill-rain-active' : 'pill-rain-dry'}">
          ${timeline.hasSignificantRain ? 'Rain expected' : 'Minimal rain risk'}
        </span>
      </div>

      <div class="timeline-horizontal-scroll">
        <div class="timeline-slots-row">
          ${timelineHtml}
        </div>
      </div>

      <div class="timeline-interpretation-bar">
        <span class="interpretation-icon">${getIconSvg('umbrella', 'w-4 h-4')}</span>
        <p class="interpretation-text">${escapeHTML(timeline.interpretation)}</p>
      </div>
    </article>
  `;
}

/**
 * Render "What Should I Wear?" Outfit Guide Card
 * @param {HTMLElement} container
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 */
export function renderOutfitGuide(container, rawData, unit = 'C') {
  if (!container) return;
  const outfit = getOutfitRecommendation(rawData, unit);

  let itemsHtml = '';
  outfit.items.forEach(item => {
    itemsHtml += `
      <div class="outfit-item">
        <div class="outfit-icon-box">${getIconSvg(item.icon, 'w-5 h-5')}</div>
        <div class="outfit-content">
          <span class="outfit-category">${escapeHTML(item.category)}</span>
          <span class="outfit-main">${escapeHTML(item.recommendation)}</span>
          <span class="outfit-detail">${escapeHTML(item.detail)}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <article class="decision-card outfit-card" id="outfit-guide-card">
      <div class="card-header-clean">
        <div class="card-title-group">
          <span class="card-eyebrow">Clothing & Gear</span>
          <h3 class="card-heading">Outfit Guide</h3>
        </div>
      </div>

      <div class="outfit-summary-banner">
        <span class="outfit-summary-highlight">${escapeHTML(outfit.summary)}</span>
      </div>

      <div class="outfit-items-grid">
        ${itemsHtml}
      </div>
    </article>
  `;
}

/**
 * Render Best Outdoor Window Card
 * @param {HTMLElement} container
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 */
export function renderBestOutdoorWindow(container, rawData, unit = 'C', timeZone) {
  if (!container) return;
  const windowData = calculateBestOutdoorWindow(rawData, unit, timeZone);

  let criteriaHtml = '';
  windowData.criteria.forEach(crit => {
    criteriaHtml += `
      <li class="window-crit-item">
        <span class="crit-check">${getIconSvg('check', 'w-4 h-4')}</span>
        <span>${escapeHTML(crit)}</span>
      </li>
    `;
  });

  container.innerHTML = `
    <article class="decision-card window-card" id="best-window-card">
      <div class="card-header-clean">
        <div class="card-title-group">
          <span class="card-eyebrow">Optimal Timing</span>
          <h3 class="card-heading">Best Outdoor Window</h3>
        </div>
        <div class="window-stars" aria-label="Rating: ${windowData.starCount || 4} of 5 stars">
          ${renderStars(windowData.starCount || 4)}
        </div>
      </div>

      <div class="window-time-display">
        <span class="window-time-val">${escapeHTML(windowData.windowLabel)}</span>
        <span class="window-badge">Prime Hours</span>
      </div>

      <p class="window-summary-text">${escapeHTML(windowData.summary)}</p>

      <ul class="window-criteria-list">
        ${criteriaHtml}
      </ul>
    </article>
  `;
}

/**
 * Render Activity Planner Section
 * @param {HTMLElement} container
 * @param {string} selectedActivityId
 * @param {Function} onSelectActivity
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 */
export function renderActivityPlanner(container, selectedActivityId, onSelectActivity, rawData, unit = 'C', timeZone) {
  if (!container) return;
  const evaluation = evaluateActivity(selectedActivityId, rawData, unit, timeZone);

  let buttonsHtml = '';
  ACTIVITIES.forEach(act => {
    const isSelected = act.id === selectedActivityId;
    buttonsHtml += `
      <button
        type="button"
        class="activity-tab-btn ${isSelected ? 'active' : ''}"
        data-activity="${act.id}"
        aria-pressed="${isSelected}"
      >
        <span class="activity-emoji">${getIconImg(act.icon, 'w-5 h-5 activity-icon-img', act.name)}</span>
        <span class="activity-name">${escapeHTML(act.name)}</span>
      </button>
    `;
  });

  const ratingCount = evaluation.ratingStars || 4;

  container.innerHTML = `
    <article class="decision-card planner-card" id="activity-planner-card">
      <div class="card-header-clean">
        <div class="card-title-group">
          <span class="card-eyebrow">Personalized Scheduling</span>
          <h3 class="card-heading">Plan Your Day</h3>
        </div>
        <span class="status-badge ${evaluation.statusClass}">${escapeHTML(evaluation.status)}</span>
      </div>

      <div class="activities-tabs-row" role="tablist" aria-label="Select an activity">
        ${buttonsHtml}
      </div>

      <div class="activity-evaluation-box">
        <div class="eval-header-row">
          <div class="eval-title-group">
            <span class="eval-emoji">${getIconImg(evaluation.icon, 'w-8 h-8 eval-icon-img', evaluation.name)}</span>
            <div>
              <h4 class="eval-name">${escapeHTML(evaluation.name)}</h4>
              <span class="eval-stars">${renderStars(ratingCount)}</span>
            </div>
          </div>
          <div class="eval-timing-tag">
            <span class="timing-label">Best Window:</span>
            <span class="timing-time">${escapeHTML(evaluation.bestWindow)}</span>
          </div>
        </div>

        <p class="eval-rationale">${escapeHTML(evaluation.rationale)}</p>
      </div>
    </article>
  `;

  // Attach event listeners to activity buttons
  const buttons = container.querySelectorAll('.activity-tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const actId = btn.dataset.activity;
      if (actId) onSelectActivity(actId);
    });
  });
}

/**
 * Render Hourly Forecast Shelf
 * @param {HTMLElement} container
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 */
export function renderHourlyForecast(container, rawData, unit = 'C', timeZone) {
  if (!container) return;
  const hourly = rawData.hourly || {};
  if (!hourly.time) return;

  const now = new Date();
  let startIndex = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    const itemDate = new Date(hourly.time[i]);
    if (itemDate.getTime() >= now.getTime() - 45 * 60 * 1000) {
      startIndex = i;
      break;
    }
  }

  const items = [];
  const limit = Math.min(hourly.time.length, startIndex + 24);

  for (let i = startIndex; i < limit; i++) {
    const timeIso = hourly.time[i];
    const tempC = hourly.temperature_2m ? hourly.temperature_2m[i] : 20;
    const rainProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    const windSpeed = hourly.wind_speed_10m ? hourly.wind_speed_10m[i] : 10;
    const code = hourly.weather_code ? hourly.weather_code[i] : 0;
    const isDay = hourly.is_day ? hourly.is_day[i] : 1;
    const condition = getWeatherCondition(code, isDay);

    items.push({
      time: formatHour(timeIso, timeZone),
      tempFormatted: formatTemp(tempC, unit),
      rainProb,
      windFormatted: formatSpeed(windSpeed, unit),
      condition
    });
  }

  let cardsHtml = '';
  items.forEach(item => {
    cardsHtml += `
      <div class="hourly-card">
        <span class="hourly-time">${escapeHTML(item.time)}</span>
        <span class="hourly-icon">${getIconSvg(item.condition.icon, 'w-6 h-6')}</span>
        <span class="hourly-temp">${item.tempFormatted}</span>
        <span class="hourly-rain ${item.rainProb > 0 ? 'active' : ''}">${item.rainProb}%</span>
        <span class="hourly-wind">${item.windFormatted}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <section class="forecast-section" id="hourly-forecast-section">
      <div class="section-header-row">
        <h3 class="section-title">Hourly Forecast</h3>
        <span class="section-sub">Next 24 Hours</span>
      </div>
      <div class="hourly-scroll-container">
        <div class="hourly-track">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}

/**
 * Render 7-Day Forecast Section
 * @param {HTMLElement} container
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 */
export function renderDailyForecast(container, rawData, unit = 'C', timeZone) {
  if (!container) return;
  const daily = rawData.daily || {};
  if (!daily.time) return;

  const count = Math.min(7, daily.time.length);
  let rowsHtml = '';

  for (let i = 0; i < count; i++) {
    const timeIso = daily.time[i];
    const dayLabel = formatDayName(timeIso, timeZone);
    const code = daily.weather_code ? daily.weather_code[i] : 0;
    const condition = getWeatherCondition(code, 1);
    const maxC = daily.temperature_2m_max ? daily.temperature_2m_max[i] : 25;
    const minC = daily.temperature_2m_min ? daily.temperature_2m_min[i] : 18;
    const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

    rowsHtml += `
      <div class="daily-row">
        <span class="daily-day">${escapeHTML(dayLabel)}</span>
        <div class="daily-condition">
          <span class="daily-icon">${getIconSvg(condition.icon, 'w-5 h-5')}</span>
          <span class="daily-cond-text">${escapeHTML(condition.description)}</span>
        </div>
        <span class="daily-rain-prob ${rainProb >= 25 ? 'has-rain' : ''}">
          ${getIconSvg('droplet', 'w-3 h-3')} ${rainProb}%
        </span>
        <div class="daily-temp-range">
          <span class="daily-max">${formatTemp(maxC, unit)}</span>
          <div class="daily-range-bar"></div>
          <span class="daily-min">${formatTemp(minC, unit)}</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <section class="forecast-section" id="daily-forecast-section">
      <div class="section-header-row">
        <h3 class="section-title">7-Day Forecast</h3>
        <span class="section-sub">Week Outlook</span>
      </div>
      <div class="daily-cards-container">
        ${rowsHtml}
      </div>
    </section>
  `;
}

/**
 * Render Loading Skeleton State
 * @param {HTMLElement} container
 */
export function renderLoadingSkeleton(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="loading-state-wrapper" aria-busy="true" aria-live="polite">
      <div class="loading-status-bar">
        <div class="spinner"></div>
        <span>Fetching weather data & formulating recommendations...</span>
      </div>
      <div class="skeleton-grid">
        <div class="skeleton-card skeleton-hero"></div>
        <div class="skeleton-row-cards">
          <div class="skeleton-card skeleton-medium"></div>
          <div class="skeleton-card skeleton-medium"></div>
        </div>
        <div class="skeleton-row-cards">
          <div class="skeleton-card skeleton-medium"></div>
          <div class="skeleton-card skeleton-medium"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Error State Message
 * @param {HTMLElement} container
 * @param {string} errorType - 'EMPTY_SEARCH' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'API_ERROR' | 'LOCATION_DENIED'
 * @param {string} [customMessage]
 * @param {Function} [onDismiss]
 */
export function renderErrorState(container, errorType, customMessage = '', onDismiss = null) {
  if (!container) return;

  let title = 'Notice';
  let message = customMessage || 'An unexpected issue occurred.';

  switch (errorType) {
    case 'EMPTY_SEARCH':
      title = 'Search Input Required';
      message = customMessage || 'Please enter a city name to search.';
      break;
    case 'NOT_FOUND':
      title = 'City Not Found';
      message = customMessage || "We couldn't find that location. Try another city name or check spelling.";
      break;
    case 'LOCATION_DENIED':
      title = 'Location Access';
      message = customMessage || "We couldn't access your location. You can search for a city instead.";
      break;
    case 'NETWORK_ERROR':
      title = 'Connection Error';
      message = customMessage || 'Unable to connect to the weather service. Check your internet connection and try again.';
      break;
    case 'API_ERROR':
      title = 'Service Unavailable';
      message = customMessage || 'Weather information is temporarily unavailable. Please try again shortly.';
      break;
  }

  container.innerHTML = `
    <div class="error-banner" role="alert" id="error-message-box">
      <div class="error-icon-box">${getIconSvg('fog', 'w-5 h-5')}</div>
      <div class="error-text-content">
        <h4 class="error-title">${escapeHTML(title)}</h4>
        <p class="error-desc">${escapeHTML(message)}</p>
      </div>
      ${onDismiss ? `<button type="button" class="error-dismiss-btn" aria-label="Dismiss error">${getIconSvg('close', 'w-4 h-4')}</button>` : ''}
    </div>
  `;

  if (onDismiss) {
    const dismissBtn = container.querySelector('.error-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', onDismiss);
    }
  }
}

/**
 * Render Welcoming Empty State
 * @param {HTMLElement} container
 * @param {Function} onSelectCity
 */
export function renderEmptyState(container, onSelectCity) {
  if (!container) return;

  const sampleCities = [
    { name: 'Lagos', country: 'Nigeria', latitude: 6.4541, longitude: 3.3947 },
    { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 },
    { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006 },
    { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
    { name: 'Nairobi', country: 'Kenya', latitude: -1.2833, longitude: 36.8167 },
    { name: 'Accra', country: 'Ghana', latitude: 5.556, longitude: -0.1969 }
  ];

  let sampleBtns = '';
  sampleCities.forEach(city => {
    sampleBtns += `
      <button type="button" class="sample-city-pill" data-city="${escapeHTML(city.name)}">
        ${getIconSvg('location', 'w-3.5 h-3.5')}
        <span>${escapeHTML(city.name)}</span>
      </button>
    `;
  });

  container.innerHTML = `
    <div class="empty-state-card" id="empty-state-card">
      <div class="empty-state-icon">${getIconImg('weather-explore', 'empty-explore-img', 'Explore Weather')}</div>
      <h3 class="empty-state-heading">Where are you heading?</h3>
      <p class="empty-state-desc">
        Search for any city or use your current location to explore real-time weather and discover the best timing for your plans.
      </p>
      <div class="empty-quick-explore">
        <span class="quick-explore-label">Popular destinations:</span>
        <div class="sample-cities-row">
          ${sampleBtns}
        </div>
      </div>
    </div>
  `;

  const buttons = container.querySelectorAll('.sample-city-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.city;
      const target = sampleCities.find(c => c.name === name);
      if (target && onSelectCity) {
        onSelectCity(target);
      }
    });
  });
}
