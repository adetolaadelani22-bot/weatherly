/**
 * Weatherly — Weather Analysis & Decision Engine
 * Transforms raw Open-Meteo meteorological metrics into practical recommendations,
 * comfort scores, rain timelines, outfit guides, and activity evaluations.
 */

import { formatTemp, formatSpeed, formatHour, formatTime, getUvCategory } from './utils.js';

/**
 * WMO Weather code metadata dictionary
 */
export const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: 'sun', category: 'sunny' },
  1: { description: 'Mainly clear', icon: 'sun-cloud', category: 'sunny' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun', category: 'cloudy' },
  3: { description: 'Overcast', icon: 'cloud', category: 'cloudy' },
  45: { description: 'Foggy', icon: 'fog', category: 'foggy' },
  48: { description: 'Depositing rime fog', icon: 'fog', category: 'foggy' },
  51: { description: 'Light drizzle', icon: 'drizzle', category: 'rainy' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', category: 'rainy' },
  55: { description: 'Dense drizzle', icon: 'drizzle', category: 'rainy' },
  56: { description: 'Light freezing drizzle', icon: 'sleet', category: 'snowy' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet', category: 'snowy' },
  61: { description: 'Light rain', icon: 'rain-light', category: 'rainy' },
  63: { description: 'Moderate rain', icon: 'rain', category: 'rainy' },
  65: { description: 'Heavy rain', icon: 'rain-heavy', category: 'rainy' },
  66: { description: 'Light freezing rain', icon: 'sleet', category: 'snowy' },
  67: { description: 'Heavy freezing rain', icon: 'sleet', category: 'snowy' },
  71: { description: 'Slight snow fall', icon: 'snow', category: 'snowy' },
  73: { description: 'Moderate snow fall', icon: 'snow', category: 'snowy' },
  75: { description: 'Heavy snow fall', icon: 'snow', category: 'snowy' },
  77: { description: 'Snow grains', icon: 'snow', category: 'snowy' },
  80: { description: 'Light rain showers', icon: 'shower', category: 'rainy' },
  81: { description: 'Moderate rain showers', icon: 'shower', category: 'rainy' },
  82: { description: 'Violent rain showers', icon: 'rain-heavy', category: 'rainy' },
  85: { description: 'Slight snow showers', icon: 'snow', category: 'snowy' },
  86: { description: 'Heavy snow showers', icon: 'snow', category: 'snowy' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', category: 'stormy' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm', category: 'stormy' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm', category: 'stormy' }
};

/**
 * Translate WMO weather code to condition details
 * @param {number} code
 * @param {number} [isDay=1]
 * @returns {{ code: number, description: string, icon: string, category: string, isNight: boolean }}
 */
export function getWeatherCondition(code, isDay = 1) {
  const meta = WEATHER_CODES[code] || {
    description: 'Variable conditions',
    icon: 'cloud',
    category: 'cloudy'
  };

  const isNight = isDay === 0;
  let icon = meta.icon;

  if (isNight) {
    if (icon === 'sun') icon = 'moon';
    else if (icon === 'sun-cloud' || icon === 'cloud-sun') icon = 'moon-cloud';
  }

  return {
    code,
    description: meta.description,
    icon,
    category: isNight ? 'night' : meta.category,
    isNight
  };
}

/**
 * Calculate Weatherly Daily Score (0 - 100)
 * Evaluates temperature comfort, rain probability, wind speeds, humidity, and atmospheric stability.
 * @param {Object} rawData - Open-Meteo payload
 * @returns {{ score: number, rating: string, label: string, description: string, factorBreakdown: Array<Object> }}
 */
export function calculateWeatherScore(rawData) {
  const current = rawData.current || {};
  const daily = rawData.daily || {};

  const temp = typeof current.temperature_2m === 'number' ? current.temperature_2m : 20;
  const apparentTemp = typeof current.apparent_temperature === 'number' ? current.apparent_temperature : temp;
  const windSpeed = typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : 10;
  const humidity = typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : 50;
  const weatherCode = typeof current.weather_code === 'number' ? current.weather_code : 0;
  const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
  const rainSum = (daily.rain_sum && daily.rain_sum[0]) || 0;

  let score = 100;
  const explanations = [];

  // 1. Temperature Comfort (Ideal range: 19°C - 24°C)
  let tempDeduction = 0;
  if (apparentTemp >= 19 && apparentTemp <= 24) {
    tempDeduction = 0;
    explanations.push('Ideal thermal comfort');
  } else if (apparentTemp > 24 && apparentTemp <= 28) {
    tempDeduction = 6;
    explanations.push('Warm temperatures');
  } else if (apparentTemp > 28 && apparentTemp <= 34) {
    tempDeduction = 16;
    explanations.push('Hot afternoon heat');
  } else if (apparentTemp > 34) {
    tempDeduction = 28;
    explanations.push('Intense heat stress');
  } else if (apparentTemp >= 14 && apparentTemp < 19) {
    tempDeduction = 5;
    explanations.push('Cool but pleasant');
  } else if (apparentTemp >= 5 && apparentTemp < 14) {
    tempDeduction = 15;
    explanations.push('Chilly outdoor conditions');
  } else {
    tempDeduction = 28;
    explanations.push('Freezing temperatures');
  }
  score -= tempDeduction;

  // 2. Rain & Precipitation Probability
  let rainDeduction = 0;
  if (rainProb <= 15 && rainSum === 0) {
    rainDeduction = 0;
    explanations.push('dry skies expected');
  } else if (rainProb <= 35) {
    rainDeduction = 8;
    explanations.push('slight possibility of showers');
  } else if (rainProb <= 60) {
    rainDeduction = 18;
    explanations.push('moderate chance of rain');
  } else if (rainProb <= 80) {
    rainDeduction = 28;
    explanations.push('rain likely throughout the day');
  } else {
    rainDeduction = 36;
    explanations.push('heavy rain anticipated');
  }
  score -= rainDeduction;

  // 3. Wind Speed
  let windDeduction = 0;
  if (windSpeed <= 15) {
    windDeduction = 0;
  } else if (windSpeed <= 25) {
    windDeduction = 5;
    explanations.push('moderate breeze');
  } else if (windSpeed <= 40) {
    windDeduction = 15;
    explanations.push('brisk wind gusts');
  } else {
    windDeduction = 25;
    explanations.push('strong high winds');
  }
  score -= windDeduction;

  // 4. Humidity
  let humidityDeduction = 0;
  if (humidity > 82 && apparentTemp > 22) {
    humidityDeduction = 8;
    explanations.push('muggy humidity');
  } else if (humidity < 20) {
    humidityDeduction = 5;
    explanations.push('very dry air');
  }
  score -= humidityDeduction;

  // 5. Severe Weather Codes
  if (weatherCode >= 95) {
    score -= 25;
    explanations.push('thunderstorm risk');
  } else if (weatherCode === 65 || weatherCode === 82) {
    score -= 15;
  }

  // Clamp 10 - 100
  score = Math.max(12, Math.min(100, Math.round(score)));

  let label = 'Good day';
  let rating = 'Good';
  let badgeClass = 'score-good';

  if (score >= 85) {
    label = 'Excellent day';
    rating = 'Excellent';
    badgeClass = 'score-excellent';
  } else if (score >= 70) {
    label = 'Good day';
    rating = 'Good';
    badgeClass = 'score-good';
  } else if (score >= 50) {
    label = 'Fair day';
    rating = 'Moderate';
    badgeClass = 'score-moderate';
  } else {
    label = 'Challenging day';
    rating = 'Challenging';
    badgeClass = 'score-challenging';
  }

  // Construct readable explanation
  const cleanedExplanations = explanations.slice(0, 3);
  let description = 'Comfortable outdoor conditions with balanced weather elements.';
  if (cleanedExplanations.length > 0) {
    const capitalizedFirst = cleanedExplanations[0].charAt(0).toUpperCase() + cleanedExplanations[0].slice(1);
    description = `${capitalizedFirst}${cleanedExplanations.length > 1 ? ', with ' + cleanedExplanations.slice(1).join(' and ') : ''}.`;
  }

  return {
    score,
    label,
    rating,
    badgeClass,
    description,
    factors: {
      temperature: 100 - tempDeduction,
      rain: 100 - rainDeduction,
      wind: 100 - windDeduction
    }
  };
}

/**
 * Generate Smart Daily Brief dynamically from meteorological data
 * @param {string} cityName
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @returns {{ greeting: string, headline: string, narrative: string, takeaway: string }}
 */
export function generateDailyBrief(cityName, rawData, unit = 'C') {
  const current = rawData.current || {};
  const daily = rawData.daily || {};
  const hourly = rawData.hourly || {};

  const date = new Date();
  const currentHour = date.getHours();

  let greetingTime = 'day';
  if (currentHour < 12) greetingTime = 'morning';
  else if (currentHour < 17) greetingTime = 'afternoon';
  else greetingTime = 'evening';

  const greeting = `Good ${greetingTime}, ${cityName}.`;

  const maxTempC = (daily.temperature_2m_max && daily.temperature_2m_max[0]) || 25;
  const minTempC = (daily.temperature_2m_min && daily.temperature_2m_min[0]) || 18;
  const rainProbMax = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
  const windMax = (daily.wind_speed_10m_max && daily.wind_speed_10m_max[0]) || 15;
  const uvMax = (daily.uv_index_max && daily.uv_index_max[0]) || 4;

  const formattedMax = formatTemp(maxTempC, unit);
  const formattedMin = formatTemp(minTempC, unit);

  // Analyze hourly rain trends to pinpoint morning vs afternoon vs evening
  let rainTiming = '';
  if (hourly.precipitation_probability && hourly.time) {
    const next12Hours = hourly.precipitation_probability.slice(0, 18);
    let morningRain = false;
    let afternoonRain = false;
    let eveningRain = false;

    for (let i = 0; i < next12Hours.length; i++) {
      const hDate = new Date(hourly.time[i]);
      const hour = hDate.getHours();
      const prob = next12Hours[i] || 0;

      if (prob >= 40) {
        if (hour >= 6 && hour < 12) morningRain = true;
        else if (hour >= 12 && hour < 18) afternoonRain = true;
        else eveningRain = true;
      }
    }

    if (afternoonRain && !morningRain) {
      rainTiming = 'Rain is more likely during the afternoon, so consider carrying an umbrella if you will be outside later.';
    } else if (morningRain && !afternoonRain) {
      rainTiming = 'Scattered showers are possible this morning before clearing up later in the day.';
    } else if (morningRain && afternoonRain) {
      rainTiming = 'Intermittent rain showers are expected across multiple parts of the day.';
    } else if (rainProbMax >= 50) {
      rainTiming = 'Showers are likely at times today. Keep rain protection within easy reach.';
    } else if (rainProbMax >= 25) {
      rainTiming = 'A brief passing shower cannot be ruled out, though dry periods should dominate.';
    } else {
      rainTiming = 'Dry skies are expected to prevail through the rest of the day.';
    }
  }

  // Thermal summary
  let thermalSummary = '';
  if (maxTempC >= 30) {
    thermalSummary = `Expect warm temperatures reaching up to ${formattedMax}. Staying hydrated is advised.`;
  } else if (maxTempC >= 20) {
    thermalSummary = `Temperatures will peak around a comfortable ${formattedMax}, cooling down to ${formattedMin} overnight.`;
  } else if (maxTempC >= 10) {
    thermalSummary = `A cool day ahead with highs around ${formattedMax}. A layer or jacket will keep you comfortable.`;
  } else {
    thermalSummary = `Cold conditions continue with highs only reaching ${formattedMax}. Bundle up warmly before heading out.`;
  }

  // Wind / UV add-on
  let extraAdvice = '';
  if (uvMax >= 7) {
    extraAdvice = ' UV levels will be high around midday; sunscreen or shades are recommended.';
  } else if (windMax >= 35) {
    extraAdvice = ' Noticeable wind gusts may be felt in open areas.';
  }

  const narrative = `${thermalSummary} ${rainTiming}${extraAdvice}`.trim();

  let takeaway = 'Favorable conditions for most daily routines.';
  if (rainProbMax >= 60) {
    takeaway = 'Carry an umbrella and allow extra time for travel.';
  } else if (maxTempC >= 32) {
    takeaway = 'Stay in shaded areas and keep well-hydrated.';
  } else if (maxTempC <= 8) {
    takeaway = 'Dress in warm insulated layers today.';
  } else if (rainProbMax <= 20 && maxTempC >= 18 && maxTempC <= 26) {
    takeaway = 'Great day for outdoor walks, errands, and open-air plans.';
  }

  return {
    greeting,
    headline: `Forecast highlights for today`,
    narrative,
    takeaway
  };
}

/**
 * Extract and analyze hourly rain timeline for next 12 to 24 hours
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 * @returns {{ items: Array<Object>, peakHour: string, peakProbability: number, interpretation: string, hasSignificantRain: boolean }}
 */
export function analyzeRainTimeline(rawData, unit = 'C', timeZone) {
  const hourly = rawData.hourly || {};
  if (!hourly.time || !hourly.precipitation_probability) {
    return {
      items: [],
      peakHour: '',
      peakProbability: 0,
      interpretation: 'Precipitation data unavailable.',
      hasSignificantRain: false
    };
  }

  // Find index corresponding to current local hour or first future index
  const now = new Date();
  let startIndex = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    const itemDate = new Date(hourly.time[i]);
    if (itemDate.getTime() >= now.getTime() - 45 * 60 * 1000) {
      startIndex = i;
      break;
    }
  }

  const sliceCount = 14;
  const endIndex = Math.min(hourly.time.length, startIndex + sliceCount);
  const items = [];

  let peakProb = 0;
  let peakIndex = -1;
  const rainyHours = [];

  for (let i = startIndex; i < endIndex; i++) {
    const timeIso = hourly.time[i];
    const prob = typeof hourly.precipitation_probability[i] === 'number' ? hourly.precipitation_probability[i] : 0;
    const rainMm = (hourly.rain && typeof hourly.rain[i] === 'number') ? hourly.rain[i] : 0;
    const tempC = (hourly.temperature_2m && typeof hourly.temperature_2m[i] === 'number') ? hourly.temperature_2m[i] : 20;
    const code = (hourly.weather_code && typeof hourly.weather_code[i] === 'number') ? hourly.weather_code[i] : 0;

    const condition = getWeatherCondition(code, 1);
    const formattedHour = formatHour(timeIso, timeZone);

    if (prob > peakProb) {
      peakProb = prob;
      peakIndex = items.length;
    }

    if (prob >= 35) {
      rainyHours.push(formattedHour);
    }

    items.push({
      time: formattedHour,
      timeIso,
      probability: prob,
      rainMm,
      tempFormatted: formatTemp(tempC, unit, false),
      condition
    });
  }

  let interpretation = 'Low rain probability throughout the upcoming hours.';
  let hasSignificantRain = false;

  if (peakProb >= 40 && rainyHours.length > 0) {
    hasSignificantRain = true;
    if (rainyHours.length === 1) {
      interpretation = `Rain is most likely around ${rainyHours[0]} (${peakProb}% probability).`;
    } else {
      const firstHour = rainyHours[0];
      const lastHour = rainyHours[rainyHours.length - 1];
      interpretation = `Rain is most likely between ${firstHour} and ${lastHour} (peaking at ${peakProb}%).`;
    }
  } else if (peakProb >= 20) {
    interpretation = `Slight chance of isolated drizzles (up to ${peakProb}%), but steady rain is unlikely.`;
  } else {
    interpretation = 'Clear and dry skies expected throughout the timeline.';
  }

  return {
    items,
    peakHour: peakIndex >= 0 && items[peakIndex] ? items[peakIndex].time : '',
    peakProbability: peakProb,
    interpretation,
    hasSignificantRain
  };
}

/**
 * Generate outfit guide recommendations based on temperature, rain, wind, and UV
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @returns {{ title: string, summary: string, items: Array<{ category: string, icon: string, recommendation: string, detail: string }> }}
 */
export function getOutfitRecommendation(rawData, unit = 'C') {
  const current = rawData.current || {};
  const daily = rawData.daily || {};

  const temp = typeof current.temperature_2m === 'number' ? current.temperature_2m : 20;
  const apparentTemp = typeof current.apparent_temperature === 'number' ? current.apparent_temperature : temp;
  const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
  const windSpeed = typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : 10;
  const uvIndex = (daily.uv_index_max && daily.uv_index_max[0]) || 3;

  const items = [];
  let summary = '';

  // 1. Tops & Base Layer
  if (apparentTemp >= 28) {
    items.push({
      category: 'Top / Base',
      icon: 'shirt',
      recommendation: 'Light, breathable fabric',
      detail: 'Cotton, linen, or loose athletic wear to stay cool in heat.'
    });
    summary = 'Light, breathable clothing recommended for warm temperatures.';
  } else if (apparentTemp >= 20) {
    items.push({
      category: 'Top / Base',
      icon: 'shirt',
      recommendation: 'Comfortable t-shirt or short sleeves',
      detail: 'Standard breathable casual or smart wear.'
    });
    summary = 'Comfortable everyday clothing is ideal for today.';
  } else if (apparentTemp >= 14) {
    items.push({
      category: 'Top / Base',
      icon: 'shirt',
      recommendation: 'Long-sleeve shirt or light knit',
      detail: 'Mild temperatures where a light second layer feels great.'
    });
    summary = 'A long sleeve or light layer is recommended.';
  } else if (apparentTemp >= 7) {
    items.push({
      category: 'Top / Base',
      icon: 'shirt',
      recommendation: 'Warm sweater, fleece, or thermal layer',
      detail: 'Retains body heat comfortably against the cool breeze.'
    });
    summary = 'Warm layering is essential in cool weather today.';
  } else {
    items.push({
      category: 'Top / Base',
      icon: 'shirt',
      recommendation: 'Thermal base layer + heavy sweater',
      detail: 'Insulated undergarments and woolen layers for freezing cold.'
    });
    summary = 'Heavy winter clothing with thermal base layers required.';
  }

  // 2. Outerwear
  if (apparentTemp >= 25 && rainProb < 35 && windSpeed < 25) {
    items.push({
      category: 'Outerwear',
      icon: 'layer',
      recommendation: 'No outer jacket needed',
      detail: 'Warm enough all day without extra outerwear.'
    });
  } else if (rainProb >= 50) {
    items.push({
      category: 'Outerwear',
      icon: 'umbrella',
      recommendation: 'Waterproof jacket or trench coat',
      detail: 'High chance of rain requires water-resistant outer protection.'
    });
  } else if (windSpeed >= 28) {
    items.push({
      category: 'Outerwear',
      icon: 'wind',
      recommendation: 'Windbreaker jacket',
      detail: 'Blocks brisk gusts and maintains body warmth.'
    });
  } else if (apparentTemp < 14 && apparentTemp >= 8) {
    items.push({
      category: 'Outerwear',
      icon: 'jacket',
      recommendation: 'Light jacket or structured coat',
      detail: 'Great for transition between indoor and outdoor air.'
    });
  } else if (apparentTemp < 8) {
    items.push({
      category: 'Outerwear',
      icon: 'jacket',
      recommendation: 'Insulated winter parka or heavy overcoat',
      detail: 'Down or insulated padding to lock in core warmth.'
    });
  } else {
    items.push({
      category: 'Outerwear',
      icon: 'layer',
      recommendation: 'Optional light cardigan for evening',
      detail: 'Temperatures may drop slightly after sunset.'
    });
  }

  // 3. Rain & Sun Accessories
  if (rainProb >= 45) {
    items.push({
      category: 'Accessories',
      icon: 'umbrella',
      recommendation: 'Carry an umbrella',
      detail: `${rainProb}% rain probability — keep a compact umbrella in your bag.`
    });
  } else if (uvIndex >= 6) {
    items.push({
      category: 'Accessories',
      icon: 'sun',
      recommendation: 'Sunglasses & UV protection',
      detail: `UV Index is high (${uvIndex}). Protect your eyes and skin.`
    });
  } else if (apparentTemp <= 5) {
    items.push({
      category: 'Accessories',
      icon: 'scarf',
      recommendation: 'Beanie, scarf, and gloves',
      detail: 'Protect sensitive extremities from frigid outdoor wind.'
    });
  } else {
    items.push({
      category: 'Accessories',
      icon: 'check',
      recommendation: 'Standard accessories',
      detail: 'Comfortable day; no specialized weather gear needed.'
    });
  }

  // 4. Footwear
  if (rainProb >= 50) {
    items.push({
      category: 'Footwear',
      icon: 'footwear',
      recommendation: 'Water-resistant shoes or boots',
      detail: 'Keep feet dry through damp streets and puddles.'
    });
  } else if (apparentTemp >= 26) {
    items.push({
      category: 'Footwear',
      icon: 'footwear',
      recommendation: 'Breathable sneakers or sandals',
      detail: 'Permeable shoes for warm walking comfort.'
    });
  } else if (apparentTemp <= 6) {
    items.push({
      category: 'Footwear',
      icon: 'footwear',
      recommendation: 'Warm, insulated boots with traction',
      detail: 'Prevents cold seepage and provides firm grip.'
    });
  } else {
    items.push({
      category: 'Footwear',
      icon: 'footwear',
      recommendation: 'Everyday comfortable sneakers or shoes',
      detail: 'Dry sidewalks allow regular casual or office shoes.'
    });
  }

  return {
    title: 'Outfit Guide',
    summary,
    items
  };
}

/**
 * Activity definition and rule evaluator
 */
export const ACTIVITIES = [
  { id: 'walking', name: 'Walking', icon: 'walking' },
  { id: 'running', name: 'Running', icon: 'running' },
  { id: 'cycling', name: 'Cycling', icon: 'cycling' },
  { id: 'sports', name: 'Sports', icon: 'sports' },
  { id: 'photography', name: 'Photography', icon: 'photography' },
  { id: 'laundry', name: 'Laundry', icon: 'laundry' },
  { id: 'outdoor_event', name: 'Outdoor Event', icon: 'outdoor_event' },
  { id: 'commute', name: 'Commute', icon: 'commute' }
];

/**
 * Evaluate specific activity suitability across the forecast
 * @param {string} activityId
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 * @returns {{ id: string, name: string, icon: string, status: string, statusClass: string, bestWindow: string, rationale: string, ratingStars: number }}
 */
export function evaluateActivity(activityId, rawData, unit = 'C', timeZone) {
  const hourly = rawData.hourly || {};
  const current = rawData.current || {};
  const daily = rawData.daily || {};

  const activity = ACTIVITIES.find(a => a.id === activityId) || ACTIVITIES[0];

  // Evaluate hours 6:00 to 20:00 (daylight activity span)
  const candidateWindows = [];
  const times = hourly.time || [];
  const probs = hourly.precipitation_probability || [];
  const temps = hourly.temperature_2m || [];
  const winds = hourly.wind_speed_10m || [];
  const codes = hourly.weather_code || [];
  const clouds = hourly.cloud_cover || [];
  const humidities = hourly.relative_humidity_2m || [];

  // Slice first 24 hours
  const limit = Math.min(24, times.length);
  for (let i = 0; i < limit; i++) {
    const d = new Date(times[i]);
    const hour = d.getHours();
    if (hour >= 6 && hour <= 20) {
      candidateWindows.push({
        index: i,
        hour,
        timeFormatted: formatHour(times[i], timeZone),
        prob: probs[i] || 0,
        temp: temps[i] || 20,
        wind: winds[i] || 10,
        code: codes[i] || 0,
        cloud: clouds[i] || 0,
        humidity: humidities[i] || 50
      });
    }
  }

  const candidatePool =
    candidateWindows.length > 0
      ? candidateWindows
      : [
          {
            hour: 12,
            timeFormatted: '12 PM',
            prob: 0,
            temp: 20,
            wind: 10,
            code: 0,
            cloud: 0,
            humidity: 50
          }
        ];

  let status = 'Good';
  let statusClass = 'status-good';
  let ratingStars = 4;
  let bestWindow = 'Midday';
  let rationale = '';

  switch (activityId) {
    case 'running': {
      // Ideal: Cool (12-18°C), low rain (<15%), low wind (<18 km/h)
      // Morning (7 AM - 9 AM) or evening
      const sorted = [...candidatePool].sort((a, b) => {
        const scoreA = Math.abs(a.temp - 15) * 1.5 + a.prob * 1.0 + a.wind * 0.5;
        const scoreB = Math.abs(b.temp - 15) * 1.5 + b.prob * 1.0 + b.wind * 0.5;
        return scoreA - scoreB;
      });

      const best = sorted[0];
      if (best) {
        const nextHour = (best.hour + 2) % 24;
        bestWindow = `${best.timeFormatted} – ${formatHour(new Date().setHours(nextHour, 0, 0, 0), timeZone)}`;
      }

      if (best.prob <= 15 && best.temp <= 22 && best.wind <= 20) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Cooler temperatures (${formatTemp(best.temp, unit)}) and low rain probability for optimal endurance.`;
      } else if (best.prob >= 60) {
        status = 'Challenging';
        statusClass = 'status-poor';
        ratingStars = 2;
        rationale = `High probability of wet roads and active showers. Consider indoor treadmill training.`;
      } else if (best.temp >= 28) {
        status = 'Fair';
        statusClass = 'status-fair';
        ratingStars = 3;
        rationale = `Warm conditions. Schedule your run early before midday heat sets in and hydrate heavily.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 4;
        rationale = `Favorable running conditions with manageable temperature and light breeze.`;
      }
      break;
    }

    case 'cycling': {
      // Wind and rain are major factors
      const best = [...candidatePool].sort((a, b) => (a.prob * 2 + a.wind * 2) - (b.prob * 2 + b.wind * 2))[0];
      if (best) {
        const nextHour = (best.hour + 2) % 24;
        bestWindow = `${best.timeFormatted} – ${formatHour(new Date().setHours(nextHour, 0, 0, 0), timeZone)}`;
      }

      if (best.wind > 32) {
        status = 'Challenging';
        statusClass = 'status-poor';
        ratingStars = 2;
        rationale = `Strong head-winds (${formatSpeed(best.wind, unit)}) and gusts make cycling hazardous.`;
      } else if (best.prob > 50) {
        status = 'Caution';
        statusClass = 'status-fair';
        ratingStars = 2;
        rationale = `Slick roads and showers likely. Fenders and high-visibility lights recommended.`;
      } else if (best.wind <= 18 && best.prob <= 15) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Dry pavement, calm winds (${formatSpeed(best.wind, unit)}), and great visibility.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 4;
        rationale = `Pleasant riding conditions with gentle breeze and dry tarmac.`;
      }
      break;
    }

    case 'laundry': {
      // Warmth, low humidity, low rain, and decent breeze for drying
      const best = [...candidatePool].sort((a, b) => {
        const scoreA = a.prob * 3 + a.humidity * 1 - a.temp * 1.5 - a.wind * 0.8;
        const scoreB = b.prob * 3 + b.humidity * 1 - b.temp * 1.5 - b.wind * 0.8;
        return scoreA - scoreB;
      });

      const pick = best[0];
      if (pick) {
        const endHour = Math.min(18, pick.hour + 4);
        bestWindow = `${pick.timeFormatted} – ${formatHour(new Date().setHours(endHour, 0, 0, 0), timeZone)}`;
      }

      if (pick.prob <= 15 && pick.humidity <= 60 && pick.temp >= 20) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Low rain probability (${pick.prob}%), warm sunshine, and good drying breeze.`;
      } else if (pick.prob >= 50) {
        status = 'Not Advised';
        statusClass = 'status-poor';
        ratingStars = 1;
        rationale = `Showers expected. Outdoor hanging is not recommended today; prefer indoor drying.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 3;
        rationale = `Drying conditions are acceptable; keep an eye on occasional passing clouds.`;
      }
      break;
    }

    case 'photography': {
      // Golden hours (morning 7-9 AM, late afternoon 5-7 PM) or soft overcast
      const goldenHours = candidatePool.filter(c => (c.hour >= 7 && c.hour <= 9) || (c.hour >= 17 && c.hour <= 19));
      const pick = goldenHours.length > 0 ? goldenHours[0] : candidatePool[0];
      if (pick) {
        const nextHour = (pick.hour + 2) % 24;
        bestWindow = `${pick.timeFormatted} – ${formatHour(new Date().setHours(nextHour, 0, 0, 0), timeZone)}`;
      }

      if (pick.cloud >= 20 && pick.cloud <= 70 && pick.prob <= 15) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Soft, dynamic natural light with atmospheric cloud diffusion and zero rain hazard.`;
      } else if (pick.prob >= 60) {
        status = 'Challenging';
        statusClass = 'status-fair';
        ratingStars = 2;
        rationale = `Heavy cloud cover and rain risk. Protect sensitive lenses and camera bodies.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 4;
        rationale = `Consistent illumination and clear perspectives for outdoor composition.`;
      }
      break;
    }

    case 'outdoor_event': {
      // Daytime comfort, zero rain
      const best = [...candidatePool].sort((a, b) => (a.prob * 2.5 + Math.abs(a.temp - 22)))[0];
      if (best) {
        const nextHour = Math.min(21, best.hour + 3);
        bestWindow = `${best.timeFormatted} – ${formatHour(new Date().setHours(nextHour, 0, 0, 0), timeZone)}`;
      }

      if (best.prob <= 15 && best.temp >= 19 && best.temp <= 26 && best.wind <= 22) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Comfortable temperatures (${formatTemp(best.temp, unit)}) and negligible rain probability.`;
      } else if (best.prob >= 50) {
        status = 'Caution';
        statusClass = 'status-poor';
        ratingStars = 2;
        rationale = `Rain is possible after midday. Ensure tent canopies or backup indoor venues are accessible.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 4;
        rationale = `Conditions are generally favorable with moderate warmth and light air movement.`;
      }
      break;
    }

    case 'commute': {
      // Rush hour analysis: 7 AM - 9 AM and 5 PM - 7 PM
      const commuteHours = candidatePool.filter(c => (c.hour >= 7 && c.hour <= 9) || (c.hour >= 17 && c.hour <= 19));
      const pick = commuteHours.length > 0 ? commuteHours[0] : candidatePool[0];
      bestWindow = '7:30 AM — 9:00 AM & 5:00 PM — 6:30 PM';

      if (pick.prob >= 60 || pick.code >= 95) {
        status = 'Delay Risk';
        statusClass = 'status-poor';
        ratingStars = 2;
        rationale = `Wet roads and potential storm delays. Allow an extra 15–20 minutes travel buffer.`;
      } else if (pick.wind >= 35) {
        status = 'Caution';
        statusClass = 'status-fair';
        ratingStars = 3;
        rationale = `Gusty winds along exposed highway corridors. Drive attentively.`;
      } else {
        status = 'Smooth';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Clear visibility and dry roadways expected across major transit hours.`;
      }
      break;
    }

    case 'sports': {
      const best = [...candidatePool].sort((a, b) => (a.prob * 2 + Math.abs(a.temp - 19) * 1.2 + a.wind * 0.8))[0];
      if (best) {
        const nextHour = (best.hour + 2) % 24;
        bestWindow = `${best.timeFormatted} – ${formatHour(new Date().setHours(nextHour, 0, 0, 0), timeZone)}`;
      }

      if (best.prob <= 15 && best.temp >= 16 && best.temp <= 24) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Dry turf and comfortable exertion temperatures for peak athletic performance.`;
      } else if (best.prob >= 50) {
        status = 'Challenging';
        statusClass = 'status-poor';
        ratingStars = 2;
        rationale = `Slippery grass or court surfaces. Risk of rain interruptions.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 4;
        rationale = `Pleasant outdoor conditions for team games and drills.`;
      }
      break;
    }

    case 'walking':
    default: {
      const best = [...candidatePool].sort((a, b) => (a.prob * 2 + Math.abs(a.temp - 21) * 1.5))[0];
      if (best) {
        const nextHour = (best.hour + 2) % 24;
        bestWindow = `${best.timeFormatted} – ${formatHour(new Date().setHours(nextHour, 0, 0, 0), timeZone)}`;
      }

      if (best.prob <= 15 && best.temp >= 17 && best.temp <= 25) {
        status = 'Ideal';
        statusClass = 'status-ideal';
        ratingStars = 5;
        rationale = `Very comfortable ambient temperature and clear sidewalks throughout the window.`;
      } else if (best.prob >= 55) {
        status = 'Rain Risk';
        statusClass = 'status-fair';
        ratingStars = 2;
        rationale = `Showers likely. Keep an umbrella handy or choose covered walking routes.`;
      } else {
        status = 'Good';
        statusClass = 'status-good';
        ratingStars = 4;
        rationale = `Enjoyable walking weather with mild air and manageable conditions.`;
      }
      break;
    }
  }

  return {
    id: activity.id,
    name: activity.name,
    icon: activity.icon,
    status,
    statusClass,
    bestWindow,
    rationale,
    ratingStars
  };
}

/**
 * Calculate the Best Outdoor Window of the day
 * Evaluates consecutive 2-3 hour segments between 7 AM and 7 PM
 * @param {Object} rawData
 * @param {'C' | 'F'} unit
 * @param {string} [timeZone]
 * @returns {{ windowLabel: string, stars: string, criteria: Array<string>, score: number, summary: string }}
 */
export function calculateBestOutdoorWindow(rawData, unit = 'C', timeZone) {
  const hourly = rawData.hourly || {};
  const times = hourly.time || [];
  const probs = hourly.precipitation_probability || [];
  const temps = hourly.temperature_2m || [];
  const winds = hourly.wind_speed_10m || [];

  if (times.length === 0) {
    return {
      windowLabel: 'Midday',
      stars: '★★★★☆',
      criteria: ['Moderate temperatures', 'Average rain risk'],
      score: 75,
      summary: 'Outdoor plans are best timed before late evening.'
    };
  }

  // Find 3-hour windows within daylight (hours 7 to 19)
  const windows = [];
  const limit = Math.min(24, times.length - 2);

  for (let i = 0; i < limit; i++) {
    const d1 = new Date(times[i]);
    const d3 = new Date(times[i + 2]);
    const h1 = d1.getHours();

    if (h1 >= 7 && h1 <= 17) {
      const avgProb = [probs[i], probs[i + 1], probs[i + 2]].reduce(
        (sum, value) => sum + (typeof value === 'number' ? value : 0),
        0
      ) / 3;
      const avgTemp = [temps[i], temps[i + 1], temps[i + 2]].reduce(
        (sum, value) => sum + (typeof value === 'number' ? value : 20),
        0
      ) / 3;
      const avgWind = [winds[i], winds[i + 1], winds[i + 2]].reduce(
        (sum, value) => sum + (typeof value === 'number' ? value : 10),
        0
      ) / 3;

      // Score window (higher is better)
      let score = 100;
      score -= avgProb * 0.7; // Heavy penalty for rain
      score -= Math.abs(avgTemp - 21) * 2; // Optimal temp ~21°C
      score -= Math.max(0, avgWind - 15) * 1.5; // Penalty for wind > 15 km/h

      windows.push({
        startLabel: formatHour(times[i], timeZone),
        endLabel: formatHour(times[i + 2], timeZone),
        avgProb,
        avgTemp,
        avgWind,
        score
      });
    }
  }

  windows.sort((a, b) => b.score - a.score);
  const best = windows[0] || {
    startLabel: '8:00 AM',
    endLabel: '11:00 AM',
    avgProb: 10,
    avgTemp: 22,
    avgWind: 12,
    score: 88
  };

  let stars = '★★★★★';
  let starCount = 5;
  if (best.score < 60) {
    stars = '★★★☆☆';
    starCount = 3;
  } else if (best.score < 80) {
    stars = '★★★★☆';
    starCount = 4;
  }

  const criteria = [];
  if (best.avgTemp >= 18 && best.avgTemp <= 25) {
    criteria.push('Comfortable temperature');
  } else if (best.avgTemp > 25) {
    criteria.push('Warm sunlight');
  } else {
    criteria.push('Brisk & refreshing');
  }

  if (best.avgProb <= 15) {
    criteria.push('Low rain probability');
  } else if (best.avgProb <= 35) {
    criteria.push('Passing clouds / dry');
  } else {
    criteria.push('Manageable shower risk');
  }

  if (best.avgWind <= 18) {
    criteria.push('Moderate gentle wind');
  } else {
    criteria.push('Brisk breeze');
  }

  return {
    windowLabel: `${best.startLabel} — ${best.endLabel}`,
    stars,
    starCount,
    criteria,
    score: Math.round(best.score),
    summary: `Best thermal balance (${formatTemp(best.avgTemp, unit)}) and lowest precipitation chance (${Math.round(best.avgProb)}%).`
  };
}
