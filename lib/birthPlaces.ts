// Birth places for the "For You" form.
//
// The gemstone reading needs to know which clock the stated birth time was read
// from. The whole of India has been on a single offset (UTC+5:30) since 1945, so
// for an Indian birth the city itself never changes the answer — anyone born in
// India can type a town that isn't listed here and still get the right rashi.
//
// The coordinates are city-centre approximations and are not used by the current
// reading at all. They are stored so that the ascendant (lagna), which genuinely
// needs a latitude and longitude, can be added later without having to go back
// and re-ask every visitor for their birth place.

export interface BirthPlace {
  city: string;
  state: string;
  lat: number;
  lon: number;
}

export const INDIA_UTC_OFFSET_MINUTES = 330;

// Deliberately not exhaustive — it covers the state capitals and the larger
// cities so the picker feels alive, and the free-text fallback handles the rest.
export const INDIAN_CITIES: readonly BirthPlace[] = [
  { city: 'Agartala', state: 'Tripura', lat: 23.83, lon: 91.28 },
  { city: 'Agra', state: 'Uttar Pradesh', lat: 27.18, lon: 78.01 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.03, lon: 72.58 },
  { city: 'Aizawl', state: 'Mizoram', lat: 23.73, lon: 92.72 },
  { city: 'Ajmer', state: 'Rajasthan', lat: 26.45, lon: 74.64 },
  { city: 'Aligarh', state: 'Uttar Pradesh', lat: 27.90, lon: 78.08 },
  { city: 'Allahabad (Prayagraj)', state: 'Uttar Pradesh', lat: 25.44, lon: 81.85 },
  { city: 'Alwar', state: 'Rajasthan', lat: 27.55, lon: 76.63 },
  { city: 'Ambala', state: 'Haryana', lat: 30.38, lon: 76.78 },
  { city: 'Amravati', state: 'Maharashtra', lat: 20.93, lon: 77.75 },
  { city: 'Amritsar', state: 'Punjab', lat: 31.63, lon: 74.87 },
  { city: 'Asansol', state: 'West Bengal', lat: 23.68, lon: 86.98 },
  { city: 'Aurangabad', state: 'Maharashtra', lat: 19.88, lon: 75.34 },
  { city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.37, lon: 79.43 },
  { city: 'Belgaum', state: 'Karnataka', lat: 15.85, lon: 74.50 },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.97, lon: 77.59 },
  { city: 'Bhagalpur', state: 'Bihar', lat: 25.24, lon: 86.99 },
  { city: 'Bharatpur', state: 'Rajasthan', lat: 27.22, lon: 77.49 },
  { city: 'Bhavnagar', state: 'Gujarat', lat: 21.76, lon: 72.15 },
  { city: 'Bhilai', state: 'Chhattisgarh', lat: 21.19, lon: 81.35 },
  { city: 'Bhilwara', state: 'Rajasthan', lat: 25.35, lon: 74.64 },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.26, lon: 77.41 },
  { city: 'Bhubaneswar', state: 'Odisha', lat: 20.30, lon: 85.82 },
  { city: 'Bikaner', state: 'Rajasthan', lat: 28.02, lon: 73.31 },
  { city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.08, lon: 82.15 },
  { city: 'Chandigarh', state: 'Chandigarh', lat: 30.73, lon: 76.78 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.08, lon: 80.27 },
  { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.02, lon: 76.96 },
  { city: 'Cuttack', state: 'Odisha', lat: 20.46, lon: 85.88 },
  { city: 'Darbhanga', state: 'Bihar', lat: 26.15, lon: 85.90 },
  { city: 'Dehradun', state: 'Uttarakhand', lat: 30.32, lon: 78.03 },
  { city: 'Delhi', state: 'Delhi', lat: 28.61, lon: 77.21 },
  { city: 'Dhanbad', state: 'Jharkhand', lat: 23.80, lon: 86.43 },
  { city: 'Dibrugarh', state: 'Assam', lat: 27.47, lon: 94.91 },
  { city: 'Dindigul', state: 'Tamil Nadu', lat: 10.37, lon: 77.98 },
  { city: 'Durgapur', state: 'West Bengal', lat: 23.55, lon: 87.29 },
  { city: 'Erode', state: 'Tamil Nadu', lat: 11.34, lon: 77.72 },
  { city: 'Faridabad', state: 'Haryana', lat: 28.41, lon: 77.32 },
  { city: 'Gandhinagar', state: 'Gujarat', lat: 23.22, lon: 72.68 },
  { city: 'Gangtok', state: 'Sikkim', lat: 27.33, lon: 88.61 },
  { city: 'Gaya', state: 'Bihar', lat: 24.80, lon: 84.99 },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.67, lon: 77.43 },
  { city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.76, lon: 83.37 },
  { city: 'Gurugram', state: 'Haryana', lat: 28.46, lon: 77.03 },
  { city: 'Guwahati', state: 'Assam', lat: 26.14, lon: 91.74 },
  { city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.22, lon: 78.18 },
  { city: 'Haridwar', state: 'Uttarakhand', lat: 29.95, lon: 78.16 },
  { city: 'Hisar', state: 'Haryana', lat: 29.15, lon: 75.72 },
  { city: 'Hubli', state: 'Karnataka', lat: 15.36, lon: 75.12 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.39, lon: 78.49 },
  { city: 'Imphal', state: 'Manipur', lat: 24.82, lon: 93.94 },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.72, lon: 75.86 },
  { city: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.08, lon: 93.61 },
  { city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.18, lon: 79.99 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.91, lon: 75.79 },
  { city: 'Jaisalmer', state: 'Rajasthan', lat: 26.92, lon: 70.91 },
  { city: 'Jalandhar', state: 'Punjab', lat: 31.33, lon: 75.58 },
  { city: 'Jammu', state: 'Jammu and Kashmir', lat: 32.73, lon: 74.86 },
  { city: 'Jamnagar', state: 'Gujarat', lat: 22.47, lon: 70.06 },
  { city: 'Jamshedpur', state: 'Jharkhand', lat: 22.80, lon: 86.20 },
  { city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.45, lon: 78.57 },
  { city: 'Jodhpur', state: 'Rajasthan', lat: 26.24, lon: 73.02 },
  { city: 'Junagadh', state: 'Gujarat', lat: 21.52, lon: 70.46 },
  { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.45, lon: 80.33 },
  { city: 'Karnal', state: 'Haryana', lat: 29.69, lon: 76.99 },
  { city: 'Kochi', state: 'Kerala', lat: 9.93, lon: 76.27 },
  { city: 'Kohima', state: 'Nagaland', lat: 25.67, lon: 94.11 },
  { city: 'Kolhapur', state: 'Maharashtra', lat: 16.70, lon: 74.24 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.57, lon: 88.36 },
  { city: 'Kollam', state: 'Kerala', lat: 8.89, lon: 76.61 },
  { city: 'Kota', state: 'Rajasthan', lat: 25.21, lon: 75.86 },
  { city: 'Kottayam', state: 'Kerala', lat: 9.59, lon: 76.52 },
  { city: 'Kozhikode', state: 'Kerala', lat: 11.26, lon: 75.78 },
  { city: 'Kurnool', state: 'Andhra Pradesh', lat: 15.83, lon: 78.04 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.85, lon: 80.95 },
  { city: 'Ludhiana', state: 'Punjab', lat: 30.90, lon: 75.86 },
  { city: 'Madurai', state: 'Tamil Nadu', lat: 9.93, lon: 78.12 },
  { city: 'Mangaluru', state: 'Karnataka', lat: 12.91, lon: 74.86 },
  { city: 'Mathura', state: 'Uttar Pradesh', lat: 27.49, lon: 77.67 },
  { city: 'Meerut', state: 'Uttar Pradesh', lat: 28.98, lon: 77.71 },
  { city: 'Moradabad', state: 'Uttar Pradesh', lat: 28.84, lon: 78.77 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.08, lon: 72.88 },
  { city: 'Muzaffarpur', state: 'Bihar', lat: 26.12, lon: 85.39 },
  { city: 'Mysuru', state: 'Karnataka', lat: 12.30, lon: 76.64 },
  { city: 'Nagpur', state: 'Maharashtra', lat: 21.15, lon: 79.09 },
  { city: 'Nanded', state: 'Maharashtra', lat: 19.15, lon: 77.32 },
  { city: 'Nashik', state: 'Maharashtra', lat: 20.00, lon: 73.79 },
  { city: 'Navi Mumbai', state: 'Maharashtra', lat: 19.03, lon: 73.03 },
  { city: 'Nellore', state: 'Andhra Pradesh', lat: 14.44, lon: 79.99 },
  { city: 'Noida', state: 'Uttar Pradesh', lat: 28.54, lon: 77.39 },
  { city: 'Panaji', state: 'Goa', lat: 15.49, lon: 73.83 },
  { city: 'Panipat', state: 'Haryana', lat: 29.39, lon: 76.97 },
  { city: 'Patiala', state: 'Punjab', lat: 30.34, lon: 76.39 },
  { city: 'Patna', state: 'Bihar', lat: 25.59, lon: 85.14 },
  { city: 'Puducherry', state: 'Puducherry', lat: 11.93, lon: 79.83 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.52, lon: 73.86 },
  { city: 'Raipur', state: 'Chhattisgarh', lat: 21.25, lon: 81.63 },
  { city: 'Rajkot', state: 'Gujarat', lat: 22.30, lon: 70.80 },
  { city: 'Ranchi', state: 'Jharkhand', lat: 23.34, lon: 85.31 },
  { city: 'Ratlam', state: 'Madhya Pradesh', lat: 23.33, lon: 75.04 },
  { city: 'Rohtak', state: 'Haryana', lat: 28.90, lon: 76.61 },
  { city: 'Rourkela', state: 'Odisha', lat: 22.26, lon: 84.85 },
  { city: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.97, lon: 77.55 },
  { city: 'Salem', state: 'Tamil Nadu', lat: 11.66, lon: 78.15 },
  { city: 'Sangli', state: 'Maharashtra', lat: 16.85, lon: 74.58 },
  { city: 'Satna', state: 'Madhya Pradesh', lat: 24.58, lon: 80.83 },
  { city: 'Shillong', state: 'Meghalaya', lat: 25.58, lon: 91.89 },
  { city: 'Shimla', state: 'Himachal Pradesh', lat: 31.10, lon: 77.17 },
  { city: 'Sikar', state: 'Rajasthan', lat: 27.61, lon: 75.14 },
  { city: 'Siliguri', state: 'West Bengal', lat: 26.73, lon: 88.40 },
  { city: 'Solapur', state: 'Maharashtra', lat: 17.66, lon: 75.91 },
  { city: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.08, lon: 74.80 },
  { city: 'Surat', state: 'Gujarat', lat: 21.17, lon: 72.83 },
  { city: 'Thane', state: 'Maharashtra', lat: 19.22, lon: 72.98 },
  { city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.52, lon: 76.94 },
  { city: 'Thrissur', state: 'Kerala', lat: 10.53, lon: 76.21 },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.79, lon: 78.70 },
  { city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.63, lon: 79.42 },
  { city: 'Udaipur', state: 'Rajasthan', lat: 24.58, lon: 73.71 },
  { city: 'Ujjain', state: 'Madhya Pradesh', lat: 23.18, lon: 75.78 },
  { city: 'Vadodara', state: 'Gujarat', lat: 22.31, lon: 73.18 },
  { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.32, lon: 82.97 },
  { city: 'Vellore', state: 'Tamil Nadu', lat: 12.92, lon: 79.13 },
  { city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.51, lon: 80.65 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.69, lon: 83.22 },
  { city: 'Warangal', state: 'Telangana', lat: 17.97, lon: 79.59 },
];

// Offsets a visitor born abroad can pick from. Kept as plain offsets rather than
// named zones on purpose: a named zone would need the historical daylight-saving
// rules for the year of birth to be right, and quietly guessing those would be
// worse than asking someone who was born abroad what their clock actually read.
export interface UtcOffsetOption {
  label: string;
  minutes: number;
}

export const UTC_OFFSET_OPTIONS: readonly UtcOffsetOption[] = [
  { label: 'UTC-08:00 — US Pacific', minutes: -480 },
  { label: 'UTC-07:00 — US Mountain', minutes: -420 },
  { label: 'UTC-06:00 — US Central', minutes: -360 },
  { label: 'UTC-05:00 — US Eastern', minutes: -300 },
  { label: 'UTC-04:00 — Atlantic, Caribbean', minutes: -240 },
  { label: 'UTC-03:00 — Brazil, Argentina', minutes: -180 },
  { label: 'UTC+00:00 — UK, Ireland, Portugal', minutes: 0 },
  { label: 'UTC+01:00 — Central Europe, West Africa', minutes: 60 },
  { label: 'UTC+02:00 — Eastern Europe, South Africa', minutes: 120 },
  { label: 'UTC+03:00 — East Africa, Gulf', minutes: 180 },
  { label: 'UTC+04:00 — UAE, Oman, Mauritius', minutes: 240 },
  { label: 'UTC+05:00 — Pakistan, Uzbekistan', minutes: 300 },
  { label: 'UTC+05:30 — India, Sri Lanka', minutes: 330 },
  { label: 'UTC+05:45 — Nepal', minutes: 345 },
  { label: 'UTC+06:00 — Bangladesh, Bhutan', minutes: 360 },
  { label: 'UTC+07:00 — Thailand, Vietnam, Indonesia (W)', minutes: 420 },
  { label: 'UTC+08:00 — Singapore, Malaysia, Hong Kong', minutes: 480 },
  { label: 'UTC+09:00 — Japan, Korea', minutes: 540 },
  { label: 'UTC+10:00 — Australia (East)', minutes: 600 },
  { label: 'UTC+12:00 — New Zealand', minutes: 720 },
];

/** Ranks a query so a prefix match on the city beats a match buried in the state. */
export const searchIndianCities = (query: string, limit = 6): BirthPlace[] => {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  const scored: Array<{ place: BirthPlace; score: number }> = [];
  for (const place of INDIAN_CITIES) {
    const city = place.city.toLowerCase();
    const state = place.state.toLowerCase();
    let score: number;
    if (city.startsWith(needle)) score = 0;
    else if (city.includes(needle)) score = 1;
    else if (state.startsWith(needle)) score = 2;
    else if (state.includes(needle)) score = 3;
    else continue;
    scored.push({ place, score });
  }

  return scored
    .sort((a, b) => a.score - b.score || a.place.city.localeCompare(b.place.city))
    .slice(0, limit)
    .map((entry) => entry.place);
};
