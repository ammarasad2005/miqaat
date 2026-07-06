import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  try {
    // Open-Meteo API (No API key required)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7`;
    
    const response = await fetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes (1800 seconds)
    });

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Return all necessary pieces to the client
    return NextResponse.json({
      current: {
        tempC: Math.round(data.current?.temperature_2m),
        apparentTempC: Math.round(data.current?.apparent_temperature),
        conditionCode: data.current?.weather_code,
        isDay: data.current?.is_day,
        humidity: data.current?.relative_humidity_2m,
      },
      hourly: data.hourly,
      daily: data.daily
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
