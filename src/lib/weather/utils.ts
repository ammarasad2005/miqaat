import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudDrizzle,
  CloudFog,
  CloudOff
} from 'lucide-react';

export function getWeatherIcon(code: number | undefined) {
  if (code === undefined) return CloudOff;
  if (code === 0) return Sun; // Clear sky
  if (code === 1 || code === 2 || code === 3) return Cloud; // Mainly clear, partly cloudy, overcast
  if (code === 45 || code === 48) return CloudFog; // Fog
  if (code >= 51 && code <= 57) return CloudDrizzle; // Drizzle
  if (code >= 61 && code <= 67) return CloudRain; // Rain
  if (code >= 71 && code <= 77) return Snowflake; // Snow
  if (code >= 80 && code <= 82) return CloudRain; // Rain showers
  if (code === 85 || code === 86) return Snowflake; // Snow showers
  if (code >= 95) return CloudLightning; // Thunderstorm
  return Cloud;
}

export function getWeatherDescription(code: number | undefined) {
  if (code === undefined) return 'Offline';
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2 || code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code === 85 || code === 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
}
