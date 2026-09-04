export const validateHealthReading = (reading) => {
  const errors = [];

  if (reading.heartRate !== undefined) {
    const hr = Number(reading.heartRate);
    if (isNaN(hr) || hr < 30 || hr > 240) {
      errors.push('Heart rate must be a valid integer between 30 and 240 BPM.');
    }
  }

  if (reading.spO2 !== undefined) {
    const spo2 = Number(reading.spO2);
    if (isNaN(spo2) || spo2 < 50 || spo2 > 100) {
      errors.push('SpO2 oxygen saturation must be a percentage between 50% and 100%.');
    }
  }

  if (reading.temp !== undefined) {
    const temp = Number(reading.temp);
    if (isNaN(temp) || temp < 30.0 || temp > 45.0) {
      errors.push('Body temperature must be a realistic reading between 30.0°C and 45.0°C.');
    }
  }

  if (reading.hydration !== undefined) {
    const hydration = Number(reading.hydration);
    if (isNaN(hydration) || hydration < 0 || hydration > 100) {
      errors.push('Hydration index must be between 0% and 100%.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
