export type Scenario = 'normal' | 'moderate' | 'heavy' | 'extreme';
export type RiskLevel = 'Low' | 'Watch' | 'High' | 'Severe';
export type Confidence = 'Low' | 'Medium' | 'High';

export type Zone = {
  zone_id: string;
  zone_name: string;
  polygon: [number, number][];
  center: [number, number];
  baselineElevation: number;
  drainProximity: number;
  historicalWaterlogging: number;
  populationExposure: number;
  criticalAsset: string;
  criticalWeight: number;
  road: string;
  drivers: string[];
};

export type ScoredZone = Zone & {
  rainfallFactor: number;
  riskScore: number;
  priorityScore: number;
  riskLevel: RiskLevel;
  onset: 'Within 1 hour' | 'Within 1–3 hours';
  confidence: Confidence;
};

export const scenarioMeta: Record<Scenario, { label: string; shortLabel: string; rainfall: string; factor: number; description: string }> = {
  normal: {
    label: 'Normal rain',
    shortLabel: 'Normal',
    rainfall: 'Light showers',
    factor: 4,
    description: 'Mostly low / watch conditions. Use this as the baseline to see which places are naturally more exposed.',
  },
  moderate: {
    label: 'Moderate rain',
    shortLabel: 'Moderate',
    rainfall: 'Steady rain',
    factor: 22,
    description: 'Drainage pressure begins to concentrate around the canal edge, hospital access road, and underpass.',
  },
  heavy: {
    label: 'Heavy rain',
    shortLabel: 'Heavy',
    rainfall: 'Intense rainfall',
    factor: 48,
    description: 'Three priority hotspots emerge for early response within the next 1–3 hours.',
  },
  extreme: {
    label: 'Extreme rain',
    shortLabel: 'Extreme',
    rainfall: 'Cloudburst conditions',
    factor: 68,
    description: 'Severe inundation risk spreads across the pilot area. Start with the ranked top three actions.',
  },
};

const polygon = (lat: number, lon: number): [number, number][] => [
  [lat - 0.006, lon - 0.009],
  [lat - 0.006, lon + 0.009],
  [lat + 0.006, lon + 0.009],
  [lat + 0.006, lon - 0.009],
];

export const zones: Zone[] = [
  {
    zone_id: 'GUM-01', zone_name: 'Canal-Side Settlement', center: [13.413, 80.105], polygon: polygon(13.413, 80.105),
    baselineElevation: 92, drainProximity: 95, historicalWaterlogging: 94, populationExposure: 860,
    criticalAsset: 'Emergency shelter · Community Hall', criticalWeight: 70, road: 'Canal Bund Road',
    drivers: ['Low elevation basin', 'Near storm-water canal', 'Historical waterlogging hotspot', 'Intense forecast rainfall'],
  },
  {
    zone_id: 'GUM-02', zone_name: 'Government Hospital Access Road', center: [13.425, 80.105], polygon: polygon(13.425, 80.105),
    baselineElevation: 78, drainProximity: 88, historicalWaterlogging: 82, populationExposure: 1250,
    criticalAsset: 'Government Primary Health Centre', criticalWeight: 98, road: 'PHC Access Road',
    drivers: ['Hospital access dependency', 'Near storm-water drain', 'Low-lying junction', 'Intense forecast rainfall'],
  },
  {
    zone_id: 'GUM-03', zone_name: 'Railway Underpass', center: [13.437, 80.105], polygon: polygon(13.437, 80.105),
    baselineElevation: 88, drainProximity: 83, historicalWaterlogging: 87, populationExposure: 620,
    criticalAsset: 'Railway underpass · NH access', criticalWeight: 92, road: 'Railway Station Link Road',
    drivers: ['Underpass low point', 'Historical waterlogging hotspot', 'Near storm-water drain', 'Intense forecast rainfall'],
  },
  {
    zone_id: 'GUM-04', zone_name: 'Old Market Street', center: [13.413, 80.125], polygon: polygon(13.413, 80.125),
    baselineElevation: 66, drainProximity: 62, historicalWaterlogging: 78, populationExposure: 960,
    criticalAsset: 'Old Market commercial strip', criticalWeight: 45, road: 'Market Street',
    drivers: ['Historical waterlogging hotspot', 'Dense frontage', 'Drain inlet constraint'],
  },
  {
    zone_id: 'GUM-05', zone_name: 'Bus Stand Junction', center: [13.425, 80.125], polygon: polygon(13.425, 80.125),
    baselineElevation: 64, drainProximity: 75, historicalWaterlogging: 67, populationExposure: 1400,
    criticalAsset: 'Major junction · bus stand', criticalWeight: 60, road: 'Gummidipundi Bus Stand Road',
    drivers: ['High daily footfall', 'Near storm-water drain', 'Traffic choke point'],
  },
  {
    zone_id: 'GUM-06', zone_name: 'Government School Zone', center: [13.437, 80.125], polygon: polygon(13.437, 80.125),
    baselineElevation: 58, drainProximity: 56, historicalWaterlogging: 55, populationExposure: 780,
    criticalAsset: 'Government Higher Secondary School', criticalWeight: 85, road: 'School Main Road',
    drivers: ['School-adjacent low point', 'Children and staff exposure', 'Moderate drain pressure'],
  },
  {
    zone_id: 'GUM-07', zone_name: 'Industrial Estate Road', center: [13.413, 80.145], polygon: polygon(13.413, 80.145),
    baselineElevation: 48, drainProximity: 52, historicalWaterlogging: 42, populationExposure: 510,
    criticalAsset: 'Industrial worker corridor', criticalWeight: 42, road: 'SIPCOT Estate Road',
    drivers: ['Runoff from paved yards', 'Shift-change traffic', 'Drain inlet constraint'],
  },
  {
    zone_id: 'GUM-08', zone_name: 'Lake Bund Road', center: [13.425, 80.145], polygon: polygon(13.425, 80.145),
    baselineElevation: 54, drainProximity: 68, historicalWaterlogging: 59, populationExposure: 430,
    criticalAsset: 'Lake bund / maintenance gate', criticalWeight: 52, road: 'Lake Bund Road',
    drivers: ['Near storm-water canal', 'Low bund shoulder', 'Historical waterlogging hotspot'],
  },
  {
    zone_id: 'GUM-09', zone_name: 'Ponneri Road Low Point', center: [13.437, 80.145], polygon: polygon(13.437, 80.145),
    baselineElevation: 45, drainProximity: 49, historicalWaterlogging: 38, populationExposure: 390,
    criticalAsset: 'Ponneri Road bus stop', criticalWeight: 32, road: 'Ponneri Road',
    drivers: ['Road depression', 'Limited surface outfall', 'Moderate rainfall loading'],
  },
  {
    zone_id: 'GUM-10', zone_name: 'Periya Colony Lane', center: [13.401, 80.125], polygon: polygon(13.401, 80.125),
    baselineElevation: 42, drainProximity: 46, historicalWaterlogging: 34, populationExposure: 520,
    criticalAsset: 'Neighbourhood anganwadi', criticalWeight: 40, road: 'Periya Colony Lane',
    drivers: ['Narrow local lanes', 'Slow surface drainage', 'Low elevation pocket'],
  },
  {
    zone_id: 'GUM-11', zone_name: 'Kavaraipettai Link', center: [13.401, 80.145], polygon: polygon(13.401, 80.145),
    baselineElevation: 38, drainProximity: 35, historicalWaterlogging: 28, populationExposure: 300,
    criticalAsset: 'Rural link road', criticalWeight: 28, road: 'Kavaraipettai Link Road',
    drivers: ['Unsealed shoulder', 'Low historical exposure', 'Moderate surface runoff'],
  },
  {
    zone_id: 'GUM-12', zone_name: 'North Service Road', center: [13.437, 80.165], polygon: polygon(13.437, 80.165),
    baselineElevation: 32, drainProximity: 28, historicalWaterlogging: 21, populationExposure: 260,
    criticalAsset: 'Utility service corridor', criticalWeight: 22, road: 'North Service Road',
    drivers: ['Higher ground', 'Open roadside shoulder', 'Low historical exposure'],
  },
];

export const assets = [
  { id: 'hospital', name: 'Primary Health Centre', type: 'Hospital', position: [13.425, 80.105] as [number, number] },
  { id: 'school', name: 'Government Higher Secondary School', type: 'School', position: [13.437, 80.125] as [number, number] },
  { id: 'shelter', name: 'Emergency Shelter · Community Hall', type: 'Shelter', position: [13.413, 80.105] as [number, number] },
  { id: 'underpass', name: 'Railway Underpass', type: 'Underpass', position: [13.437, 80.105] as [number, number] },
  { id: 'junction', name: 'Bus Stand Junction', type: 'Junction', position: [13.425, 80.125] as [number, number] },
  { id: 'canal', name: 'Storm-water Canal', type: 'Canal', position: [13.413, 80.115] as [number, number] },
];

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function levelForScore(score: number): RiskLevel {
  if (score >= 80) return 'Severe';
  if (score >= 60) return 'High';
  if (score >= 35) return 'Watch';
  return 'Low';
}

export function scoreZone(zone: Zone, scenario: Scenario): ScoredZone {
  const rainfallFactor = scenarioMeta[scenario].factor;
  const rawFloodRisk = rainfallFactor + zone.baselineElevation * 0.2 + zone.drainProximity * 0.18 + zone.historicalWaterlogging * 0.18;
  const riskScore = Math.round(clamp(
    rawFloodRisk,
  ));
  const populationFactor = clamp(zone.populationExposure / 16);
  const priorityScore = Math.round(clamp(rawFloodRisk * 0.6 + populationFactor * 0.12 + zone.criticalWeight * 0.12));
  const riskLevel = levelForScore(riskScore);
  const onset = riskScore >= 75 ? 'Within 1 hour' : 'Within 1–3 hours';
  const confidence: Confidence = riskScore >= 80 ? 'High' : riskScore >= 55 ? 'Medium' : 'Low';
  return { ...zone, rainfallFactor, riskScore, priorityScore, riskLevel, onset, confidence };
}

export function scoreAllZones(scenario: Scenario) {
  return zones.map((zone) => scoreZone(zone, scenario));
}

export function rankedHotspots(scenario: Scenario) {
  return [...scoreAllZones(scenario)].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);
}

export function riskColor(level: RiskLevel) {
  return {
    Low: '#2ca66f',
    Watch: '#e8bf32',
    High: '#ed8b2f',
    Severe: '#e04a4a',
  }[level];
}

export function riskTint(level: RiskLevel) {
  return {
    Low: '#e8f7ef',
    Watch: '#fff8dc',
    High: '#fff0e3',
    Severe: '#fff0f0',
  }[level];
}
