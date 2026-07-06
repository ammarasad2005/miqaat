import { create } from 'zustand';

export type WeatherData = {
  current: {
    tempC: number;
    apparentTempC?: number;
    conditionCode: number;
    isDay?: number;
    humidity?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
};

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: boolean;
  fetchWeather: (lat: number, lng: number) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  data: null,
  loading: false,
  error: false,
  fetchWeather: async (lat, lng) => {
    set({ loading: true, error: false });
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error('Weather fetch failed');
      const json = await res.json();
      if (json.current && json.current.tempC !== undefined) {
        set({ data: json, loading: false, error: false });
      } else {
        throw new Error('Invalid weather data');
      }
    } catch {
      set({ error: true, loading: false });
    }
  },
}));
