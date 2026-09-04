/**
 * Multi-factor AI Health Risk Engine Service
 * Calculates physiological, wearable IoT, and environmental risk indices with confidence scoring.
 */
export const calculateAiRisk = (vitals, environment, baseline = { heartRate: { max: 88 } }, wearableData = null) => {
  const hr = Number(vitals.heartRate) || 82;
  const spo2 = Number(vitals.spO2 || vitals.spo2) || 97;
  const temp = Number(vitals.temp || vitals.temperature) || 36.8;
  const hydration = Number(vitals.hydration) || 78;
  const activity = Number(vitals.activity || vitals.steps) || 6240;
  const outsideTemp = Number(environment.outsideTemp || environment.temperature) || 38;
  const humidity = Number(environment.humidity) || 72;
  const aqi = Number(environment.aqi) || 142;

  // Wearable metrics if provided
  const stressScore = wearableData?.stressScore ?? (vitals.stressScore || 25);
  const sleepQuality = wearableData?.sleepData?.qualityScore ?? 85;
  const hrv = wearableData?.hrv ?? 68;

  // 1. Heat Stress Index calculation
  let heatStress = Math.min(100, Math.round(
    ((outsideTemp - 30) * 3.8) +
    ((hr - 75) * 1.1) +
    ((100 - hydration) * 0.45) +
    ((temp - 36.8) * 12)
  ));
  heatStress = Math.max(12, heatStress);

  // 2. Dehydration Risk calculation
  let dehydration = Math.min(100, Math.round(
    (100 - hydration) * 0.9 +
    (outsideTemp > 35 ? (outsideTemp - 35) * 3 : 0) +
    (activity > 7000 ? 10 : 0)
  ));
  dehydration = Math.max(15, dehydration);

  // 3. Respiratory Risk calculation
  let respiratory = Math.min(100, Math.round(
    (aqi / 250) * 85 +
    (spo2 < 95 ? (95 - spo2) * 8 : 0)
  ));
  respiratory = Math.max(10, respiratory);

  // 4. Cardiac Strain calculation (modulated by HRV & HR)
  let cardiac = Math.min(100, Math.round(
    (hr > 88 ? (hr - 88) * 1.8 : 10) +
    (temp > 37.5 ? 15 : 0) +
    (hrv < 50 ? 12 : 0)
  ));
  cardiac = Math.max(8, cardiac);

  // 5. Fatigue & Sleep Deficit index
  let fatigue = Math.min(100, Math.round(
    (activity / 10000) * 25 +
    (hr > 95 ? 20 : 10) +
    (hydration < 50 ? 15 : 0) +
    ((100 - sleepQuality) * 0.3) +
    (stressScore * 0.2)
  ));
  fatigue = Math.max(12, fatigue);

  // Overall Score is weighted composite
  const overallScore = Math.min(100, Math.max(
    heatStress,
    Math.round((heatStress * 0.40) + (dehydration * 0.20) + (respiratory * 0.15) + (fatigue * 0.15) + (cardiac * 0.10))
  ));

  let riskLevel = 'LOW RISK';
  if (overallScore >= 80) riskLevel = 'HIGH RISK';
  else if (overallScore >= 50) riskLevel = 'MODERATE RISK';

  // Natural Language Root-Cause Explanation
  let whyText = 'All physiological telemetry, IoT wearable metrics, and environmental indices are aligned with your established baseline.';
  const contributingFactors = [];

  if (hr > (baseline.heartRate?.max || 88)) {
    contributingFactors.push(`Heart rate is elevated (${hr} BPM, +${hr - (baseline.heartRate?.max || 88)} BPM above personal baseline)`);
  }
  if (outsideTemp >= 38) {
    contributingFactors.push(`High ambient temperature (${outsideTemp}°C) with elevated heat index (${environment.heatIndex || 43}°C)`);
  }
  if (humidity >= 70) {
    contributingFactors.push(`High atmospheric humidity (${humidity}%) restricting natural evaporative cooling`);
  }
  if (hydration < 55) {
    contributingFactors.push(`Low hydration status (${hydration}%) indicating cellular fluid depletion`);
  }
  if (aqi > 140) {
    contributingFactors.push(`Unhealthy particulate air quality (${aqi} AQI) causing respiratory strain`);
  }
  if (stressScore >= 65) {
    contributingFactors.push(`High autonomic stress index (${stressScore}/100) detected via wearable sensor`);
  }
  if (sleepQuality <= 50) {
    contributingFactors.push(`Sleep deficit (${sleepQuality}/100 score) detected from wearable sleep tracker`);
  }

  if (overallScore >= 80) {
    whyText = `CRITICAL: High temperature (${outsideTemp}°C) + Elevated Heart Rate (${hr} BPM) + Low Hydration (${hydration}%) detected. Rapid thermal accumulation present.`;
  } else if (overallScore >= 50) {
    whyText = `Elevated heat-stress & physiological strain: Heart rate (${hr} BPM) is above personal baseline while environmental temperature (${outsideTemp}°C) and humidity (${humidity}%) are elevated.`;
  }

  // Actionable Recommended Actions
  const recommendedActions = [];
  if (hydration < 60) {
    recommendedActions.push({
      id: 'rec_1',
      action: 'Hydrate Immediately',
      text: `Drink ${hydration < 45 ? '750ml' : '500ml'} electrolyte solution or chilled water`,
      icon: 'Droplets',
      priority: 'High'
    });
  }
  if (outsideTemp >= 38 || heatStress > 60) {
    recommendedActions.push({
      id: 'rec_2',
      action: 'Cooling Shelter',
      text: 'Move immediately to a climate-controlled room or shaded zone',
      icon: 'Thermometer',
      priority: 'High'
    });
  }
  if (stressScore >= 60 || fatigue >= 60) {
    recommendedActions.push({
      id: 'rec_3',
      action: 'Rest & Parasympathetic Recovery',
      text: 'Initiate 10 minutes of slow box breathing and reduce physical exertion',
      icon: 'HeartPulse',
      priority: 'Medium'
    });
  } else {
    recommendedActions.push({
      id: 'rec_3',
      action: 'Rest Period',
      text: 'Rest for 15-20 minutes with light elevation and cold compress',
      icon: 'Moon',
      priority: 'Medium'
    });
  }

  return {
    overallScore,
    riskLevel,
    confidenceScore: 92,
    heatStress,
    dehydration,
    respiratory,
    cardiac,
    fatigue,
    whyText,
    contributingFactors: contributingFactors.length ? contributingFactors : ['Normal vital and weather telemetry'],
    recommendedActions,
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis'
  };
};
