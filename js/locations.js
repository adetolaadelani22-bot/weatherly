/**
 * Weatherly — Geographic Intelligence & Location Directory
 * Provides smart resolution for regions, states, alternative city spellings,
 * and administrative divisions (e.g. Osun State, Oshogbo / Osogbo, Oyo State, etc.)
 */

export const NIGERIAN_STATES = [
  {
    name: 'Osun State',
    capital: 'Oshogbo',
    altCapitals: ['Osogbo'],
    admin1: 'Osun State',
    lat: 7.77104,
    lon: 4.55698,
    aliases: ['osun', 'osun state', 'oshogbo', 'osogbo', 'state of osun'],
    notableCities: [
      { name: 'Oshogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 },
      { name: 'Osogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 },
      { name: 'Osun State (Osogbo)', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 },
      { name: 'Ile-Ife', admin1: 'Osun State', lat: 7.4818, lon: 4.5615 },
      { name: 'Ilesa', admin1: 'Osun State', lat: 7.6294, lon: 4.7417 },
      { name: 'Ede', admin1: 'Osun State', lat: 7.7388, lon: 4.4447 },
      { name: 'Ikirun', admin1: 'Osun State', lat: 7.9138, lon: 4.6644 },
      { name: 'Iwo', admin1: 'Osun State', lat: 7.6292, lon: 4.1816 }
    ]
  },
  {
    name: 'Oyo State',
    capital: 'Ibadan',
    altCapitals: [],
    admin1: 'Oyo State',
    lat: 7.37756,
    lon: 3.90591,
    aliases: ['oyo', 'oyo state', 'ibadan'],
    notableCities: [
      { name: 'Ibadan', admin1: 'Oyo State', lat: 7.37756, lon: 3.90591 },
      { name: 'Oyo', admin1: 'Oyo State', lat: 7.84306, lon: 3.93684 },
      { name: 'Oyo State (Ibadan)', admin1: 'Oyo State', lat: 7.37756, lon: 3.90591 },
      { name: 'Ogbomoso', admin1: 'Oyo State', lat: 8.1333, lon: 4.2500 },
      { name: 'Iseyin', admin1: 'Oyo State', lat: 7.9667, lon: 3.6000 }
    ]
  },
  {
    name: 'Ekiti State',
    capital: 'Ado-Ekiti',
    altCapitals: ['Ado Ekiti'],
    admin1: 'Ekiti State',
    lat: 7.62111,
    lon: 5.22139,
    aliases: ['ekiti', 'ekiti state', 'ado ekiti', 'ado-ekiti'],
    notableCities: [
      { name: 'Ado-Ekiti', admin1: 'Ekiti State', lat: 7.62111, lon: 5.22139 },
      { name: 'Ekiti State (Ado-Ekiti)', admin1: 'Ekiti State', lat: 7.62111, lon: 5.22139 },
      { name: 'Ikere-Ekiti', admin1: 'Ekiti State', lat: 7.4974, lon: 5.2306 }
    ]
  },
  {
    name: 'Lagos State',
    capital: 'Ikeja',
    altCapitals: ['Lagos'],
    admin1: 'Lagos State',
    lat: 6.52438,
    lon: 3.37921,
    aliases: ['lagos', 'lagos state', 'ikeja', 'eko'],
    notableCities: [
      { name: 'Lagos', admin1: 'Lagos State', lat: 6.52438, lon: 3.37921 },
      { name: 'Ikeja', admin1: 'Lagos State', lat: 6.59651, lon: 3.34205 },
      { name: 'Lagos State', admin1: 'Lagos State', lat: 6.52438, lon: 3.37921 },
      { name: 'Lekki', admin1: 'Lagos State', lat: 6.4698, lon: 3.5852 },
      { name: 'Ikorodu', admin1: 'Lagos State', lat: 6.6194, lon: 3.5105 }
    ]
  },
  {
    name: 'Ogun State',
    capital: 'Abeokuta',
    altCapitals: [],
    admin1: 'Ogun State',
    lat: 7.1475,
    lon: 3.3619,
    aliases: ['ogun', 'ogun state', 'abeokuta'],
    notableCities: [
      { name: 'Abeokuta', admin1: 'Ogun State', lat: 7.1475, lon: 3.3619 },
      { name: 'Ogun State (Abeokuta)', admin1: 'Ogun State', lat: 7.1475, lon: 3.3619 },
      { name: 'Sagamu', admin1: 'Ogun State', lat: 6.8483, lon: 3.6467 },
      { name: 'Ijebu Ode', admin1: 'Ogun State', lat: 6.8194, lon: 3.9172 }
    ]
  },
  {
    name: 'Ondo State',
    capital: 'Akure',
    altCapitals: [],
    admin1: 'Ondo State',
    lat: 7.2571,
    lon: 5.2058,
    aliases: ['ondo', 'ondo state', 'akure'],
    notableCities: [
      { name: 'Akure', admin1: 'Ondo State', lat: 7.2571, lon: 5.2058 },
      { name: 'Ondo', admin1: 'Ondo State', lat: 7.0931, lon: 4.8347 },
      { name: 'Owo', admin1: 'Ondo State', lat: 7.1962, lon: 5.5868 }
    ]
  },
  {
    name: 'Kwara State',
    capital: 'Ilorin',
    altCapitals: [],
    admin1: 'Kwara State',
    lat: 8.4966,
    lon: 4.5421,
    aliases: ['kwara', 'kwara state', 'ilorin'],
    notableCities: [
      { name: 'Ilorin', admin1: 'Kwara State', lat: 8.4966, lon: 4.5421 },
      { name: 'Offa', admin1: 'Kwara State', lat: 8.1491, lon: 4.7206 }
    ]
  },
  {
    name: 'Federal Capital Territory',
    capital: 'Abuja',
    altCapitals: [],
    admin1: 'Federal Capital Territory',
    lat: 9.0765,
    lon: 7.3986,
    aliases: ['abuja', 'fct', 'federal capital territory'],
    notableCities: [
      { name: 'Abuja', admin1: 'Federal Capital Territory', lat: 9.0765, lon: 7.3986 }
    ]
  },
  {
    name: 'Rivers State',
    capital: 'Port Harcourt',
    altCapitals: ['PH'],
    admin1: 'Rivers State',
    lat: 4.8156,
    lon: 7.0498,
    aliases: ['rivers', 'rivers state', 'port harcourt', 'ph'],
    notableCities: [
      { name: 'Port Harcourt', admin1: 'Rivers State', lat: 4.8156, lon: 7.0498 }
    ]
  },
  {
    name: 'Kano State',
    capital: 'Kano',
    altCapitals: [],
    admin1: 'Kano State',
    lat: 12.0022,
    lon: 8.5919,
    aliases: ['kano', 'kano state'],
    notableCities: [
      { name: 'Kano', admin1: 'Kano State', lat: 12.0022, lon: 8.5919 }
    ]
  },
  {
    name: 'Kaduna State',
    capital: 'Kaduna',
    altCapitals: [],
    admin1: 'Kaduna State',
    lat: 10.5105,
    lon: 7.4165,
    aliases: ['kaduna', 'kaduna state', 'zaria'],
    notableCities: [
      { name: 'Kaduna', admin1: 'Kaduna State', lat: 10.5105, lon: 7.4165 },
      { name: 'Zaria', admin1: 'Kaduna State', lat: 11.0855, lon: 7.7199 }
    ]
  },
  {
    name: 'Edo State',
    capital: 'Benin City',
    altCapitals: [],
    admin1: 'Edo State',
    lat: 6.3350,
    lon: 5.6037,
    aliases: ['edo', 'edo state', 'benin city'],
    notableCities: [
      { name: 'Benin City', admin1: 'Edo State', lat: 6.3350, lon: 5.6037 }
    ]
  },
  {
    name: 'Delta State',
    capital: 'Asaba',
    altCapitals: ['Warri'],
    admin1: 'Delta State',
    lat: 6.1985,
    lon: 6.7337,
    aliases: ['delta', 'delta state', 'asaba', 'warri'],
    notableCities: [
      { name: 'Asaba', admin1: 'Delta State', lat: 6.1985, lon: 6.7337 },
      { name: 'Warri', admin1: 'Delta State', lat: 5.5167, lon: 5.7500 }
    ]
  },
  {
    name: 'Enugu State',
    capital: 'Enugu',
    altCapitals: [],
    admin1: 'Enugu State',
    lat: 6.4584,
    lon: 7.5464,
    aliases: ['enugu', 'enugu state'],
    notableCities: [
      { name: 'Enugu', admin1: 'Enugu State', lat: 6.4584, lon: 7.5464 },
      { name: 'Nsukka', admin1: 'Enugu State', lat: 6.8568, lon: 7.3958 }
    ]
  },
  {
    name: 'Anambra State',
    capital: 'Awka',
    altCapitals: ['Onitsha'],
    admin1: 'Anambra State',
    lat: 6.2209,
    lon: 7.0680,
    aliases: ['anambra', 'anambra state', 'awka', 'onitsha'],
    notableCities: [
      { name: 'Awka', admin1: 'Anambra State', lat: 6.2209, lon: 7.0680 },
      { name: 'Onitsha', admin1: 'Anambra State', lat: 6.1498, lon: 6.7858 }
    ]
  },
  {
    name: 'Imo State',
    capital: 'Owerri',
    altCapitals: [],
    admin1: 'Imo State',
    lat: 5.4833,
    lon: 7.0304,
    aliases: ['imo', 'imo state', 'owerri'],
    notableCities: [
      { name: 'Owerri', admin1: 'Imo State', lat: 5.4833, lon: 7.0304 }
    ]
  },
  {
    name: 'Abia State',
    capital: 'Umuahia',
    altCapitals: ['Aba'],
    admin1: 'Abia State',
    lat: 5.5260,
    lon: 7.4896,
    aliases: ['abia', 'abia state', 'umuahia', 'aba'],
    notableCities: [
      { name: 'Umuahia', admin1: 'Abia State', lat: 5.5260, lon: 7.4896 },
      { name: 'Aba', admin1: 'Abia State', lat: 5.1066, lon: 7.3667 }
    ]
  },
  {
    name: 'Akwa Ibom State',
    capital: 'Uyo',
    altCapitals: [],
    admin1: 'Akwa Ibom State',
    lat: 5.0377,
    lon: 7.9128,
    aliases: ['akwa ibom', 'akwa ibom state', 'uyo'],
    notableCities: [
      { name: 'Uyo', admin1: 'Akwa Ibom State', lat: 5.0377, lon: 7.9128 }
    ]
  },
  {
    name: 'Cross River State',
    capital: 'Calabar',
    altCapitals: [],
    admin1: 'Cross River State',
    lat: 4.9589,
    lon: 8.3269,
    aliases: ['cross river', 'cross river state', 'calabar'],
    notableCities: [
      { name: 'Calabar', admin1: 'Cross River State', lat: 4.9589, lon: 8.3269 }
    ]
  },
  {
    name: 'Plateau State',
    capital: 'Jos',
    altCapitals: [],
    admin1: 'Plateau State',
    lat: 9.8965,
    lon: 8.8583,
    aliases: ['plateau', 'plateau state', 'jos'],
    notableCities: [
      { name: 'Jos', admin1: 'Plateau State', lat: 9.8965, lon: 8.8583 }
    ]
  },
  {
    name: 'Borno State',
    capital: 'Maiduguri',
    altCapitals: [],
    admin1: 'Borno State',
    lat: 11.8333,
    lon: 13.1500,
    aliases: ['borno', 'borno state', 'maiduguri'],
    notableCities: [
      { name: 'Maiduguri', admin1: 'Borno State', lat: 11.8333, lon: 13.1500 }
    ]
  },
  {
    name: 'Benue State',
    capital: 'Makurdi',
    altCapitals: [],
    admin1: 'Benue State',
    lat: 7.7322,
    lon: 8.5391,
    aliases: ['benue', 'benue state', 'makurdi'],
    notableCities: [
      { name: 'Makurdi', admin1: 'Benue State', lat: 7.7322, lon: 8.5391 }
    ]
  },
  {
    name: 'Kogi State',
    capital: 'Lokoja',
    altCapitals: [],
    admin1: 'Kogi State',
    lat: 7.7969,
    lon: 6.7405,
    aliases: ['kogi', 'kogi state', 'lokoja'],
    notableCities: [
      { name: 'Lokoja', admin1: 'Kogi State', lat: 7.7969, lon: 6.7405 }
    ]
  },
  {
    name: 'Bayelsa State',
    capital: 'Yenagoa',
    altCapitals: [],
    admin1: 'Bayelsa State',
    lat: 4.9267,
    lon: 6.2642,
    aliases: ['bayelsa', 'bayelsa state', 'yenagoa'],
    notableCities: [
      { name: 'Yenagoa', admin1: 'Bayelsa State', lat: 4.9267, lon: 6.2642 }
    ]
  }
];

const NIGERIAN_STATE_NAMES = new Set([
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]);

/**
 * Ensures Nigerian states always display "State" for clarity
 * @param {string} admin1
 * @param {string} country
 * @returns {string}
 */
export function normalizeAdmin1(admin1, country = '') {
  if (!admin1) return '';
  const trimmed = admin1.trim();
  const isNigeria = country.toLowerCase().includes('nigeria') || country.toUpperCase() === 'NG' || !country;

  if (isNigeria && NIGERIAN_STATE_NAMES.has(trimmed)) {
    return `${trimmed} State`;
  }
  return trimmed;
}

/**
 * Searches the local database for curated Nigerian states and cities
 * @param {string} query
 * @returns {Array<Object>}
 */
export function getLocalMatches(query) {
  if (!query) return [];
  const norm = query.trim().toLowerCase().replace(/[,.-]/g, ' ').replace(/\s+/g, ' ');
  const results = [];
  const addedKeys = new Set();

  const addResult = city => {
    const key = `${city.name.toLowerCase()}-${city.admin1.toLowerCase()}`;
    if (!addedKeys.has(key)) {
      addedKeys.add(key);
      results.push({
        id: `loc-${city.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.round(city.lat * 100)}`,
        name: city.name,
        country: 'Nigeria',
        countryCode: 'NG',
        admin1: city.admin1,
        latitude: city.lat,
        longitude: city.lon,
        timezone: 'Africa/Lagos'
      });
    }
  };

  // 1. Check for Osun State / Oshogbo / Osogbo queries specifically
  const isOsunQuery = norm === 'osun' || norm === 'osun state' || norm.includes('osun state') || norm.startsWith('osun');
  const isOshogboQuery = norm === 'oshogbo' || norm.startsWith('oshogbo');
  const isOsogboQuery = norm === 'osogbo' || norm.startsWith('osogbo');

  if (isOshogboQuery) {
    addResult({ name: 'Oshogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Osogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Osun State (Osogbo)', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    return results;
  }

  if (isOsogboQuery) {
    addResult({ name: 'Osogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Oshogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Osun State (Osogbo)', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    return results;
  }

  if (isOsunQuery) {
    addResult({ name: 'Oshogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Osun State (Osogbo)', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Osogbo', admin1: 'Osun State', lat: 7.77104, lon: 4.55698 });
    addResult({ name: 'Ile-Ife', admin1: 'Osun State', lat: 7.4818, lon: 4.5615 });
    addResult({ name: 'Ilesa', admin1: 'Osun State', lat: 7.6294, lon: 4.7417 });
    addResult({ name: 'Ede', admin1: 'Osun State', lat: 7.7388, lon: 4.4447 });
    return results;
  }

  // 2. Check general Nigerian states & cities
  for (const state of NIGERIAN_STATES) {
    // Direct match against state aliases
    const matchedAlias = state.aliases.find(alias => norm === alias || norm.startsWith(alias) || alias.startsWith(norm));
    if (matchedAlias) {
      for (const city of state.notableCities) {
        addResult(city);
      }
      continue;
    }

    // Direct match against notable cities
    for (const city of state.notableCities) {
      const cityNameNorm = city.name.toLowerCase();
      if (cityNameNorm === norm || cityNameNorm.startsWith(norm) || norm.startsWith(cityNameNorm)) {
        addResult(city);
      }
    }
  }

  return results;
}
