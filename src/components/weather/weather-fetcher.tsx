'use client';

import * as React from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { useWeatherStore } from '@/lib/store/weatherStore';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';

export function WeatherFetcher() {
  const { lat, lng } = useLocationStore();
  const { fetchWeather, data } = useWeatherStore();
  const updateTimeOfDay = useTimeOfDay((s) => s.updateTimeOfDay);

  // Fetch weather when location changes
  React.useEffect(() => {
    if (lat !== null && lng !== null) {
      fetchWeather(lat, lng);
    }
  }, [lat, lng, fetchWeather]);

  // Update theme engine when weather data arrives
  React.useEffect(() => {
    if (data?.daily?.sunrise?.[0] && data?.daily?.sunset?.[0]) {
      updateTimeOfDay(
        new Date(data.daily.sunrise[0]), 
        new Date(data.daily.sunset[0])
      );
    }
  }, [data, updateTimeOfDay]);

  return null;
}
