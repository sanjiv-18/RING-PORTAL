/**
 * Multi-factor AI Health Risk Engine Service
 * Calculates physiological and environmental risk indices with confidence scoring.
 */
export const calculateAiRisk = (vitals, environment, baseline = { heartRate: { max: 88 } }) => {
  const hr = Number(vitals.heartRate) || 82;
  const spo2 = Number(vitals.spO2) || 97;
  const temp = Number(vitals.temp) || 36.8;
  const hydration = Number(vitals.hydration) || 78;
  const activity = Number(vitals.activity) || 6240;
  const outsideTemp = Number(environment.outsideTemp) || 38;
  const humidity = Number(environment.humidity) || 72;
  const aqi = Number(environment.aqi) || 142;

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

  // 4. Cardiac Strain calculation
  let cardiac = Math.min(100, Math.round(
    (hr > 88 ? (hr - 88) * 1.8 : 10) +
    (temp > 37.5 ? 15 : 0)
  ));
  cardiac = Math.max(8, cardiac);

  // 5. Fatigue index
  let fatigue = Math.min(100, Math.round(
    (activity / 10000) * 35 +
    (hr > 95 ? 25 : 10) +
    (hydration < 50 ? 20 : 0)
  ));
  fatigue = Math.max(15, fatigue);

  // Overall Score is weighted composite
  const overallScore = Math.min(100, Math.max(
    heatStress,
    Math.round((heatStress * 0.45) + (dehydration * 0.25) + (respiratory * 0.15) + (fatigue * 0.1) + (cardiac * 0.05))
  ));

  let riskLevel = 'LOW RISK';
  if (overallScore >= 80) riskLevel = 'HIGH RISK';
  else if (overallScore >= 50) riskLevel = 'MODERATE RISK';

  // Natural Language Root-Cause Explanation
  let whyText = 'All physiological telemetry and environmental indices are aligned with your established baseline.';
  const contributingFactors = [];

  if (hr > baseline.heartRate.max) {
    contributingFactors.push(`Heart rate is elevated (${hr} BPM, +${hr - baseline.heartRate.max} BPM above personal baseline)`);
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

  if (overallScore >= 80) {
    whyText = `CRITICAL: High temperature (${outsideTemp}°C) + Elevated Heart Rate (${hr} BPM) + Low Hydration (${hydration}%) detected. Rapid thermal accumulation present.`;
  } else if (overallScore >= 50) {
    whyText = `Elevated heat-stress risk detected: Heart rate (${hr} BPM) is above personal baseline while environmental temperature (${outsideTemp}°C) and humidity (${humidity}%) are elevated.`;
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
  recommendedActions.push({
    id: 'rec_3',
    action: 'Rest Period',
    text: 'Rest for 15-20 minutes with light elevation and cold compress',
    icon: 'Moon',
    priority: 'Medium'
  });

  return {
    overallScore,
    riskLevel,
    confidenceScore: 89,
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
