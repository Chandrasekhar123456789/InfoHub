import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WeatherModule({ coords }){
  const [city, setCity] = useState('Udaipur');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchWeather = async ({c, lat, lon} = {}) => {
    try {
      setLoading(true); setErr('');
      let url = '/api/weather';
      if (lat && lon) url += `?lat=${lat}&lon=${lon}`;
      else if (c) url += `?city=${encodeURIComponent(c)}`;
      else url += `?city=${encodeURIComponent(city)}`;
      const res = await axios.get(url);
      setData(res.data);
      if (res.data && res.data.city) setCity(res.data.city);
    } catch (e) {
      setErr('Unable to fetch weather.');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ 
    if (coords && coords.lat && coords.lon) {
      fetchWeather({ lat: coords.lat, lon: coords.lon });
    } else {
      fetchWeather({ c: city });
    }
  }, [coords]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Weather — {city}</h2>
          <p className="text-slate-500 text-sm">Live data (wttr.in)</p>
        </div>
        <div className="flex gap-2">
          <input value={city} onChange={e=>setCity(e.target.value)} className="px-3 py-2 rounded-lg border" />
          <button onClick={()=>fetchWeather({ c: city })} className="px-3 py-2 rounded-lg bg-accent text-white">Check</button>
        </div>
      </div>

      <div className="rounded-lg p-4 bg-slate-50">
        {loading && <div>Loading weather…</div>}
        {err && <div className="text-red-600">{err}</div>}
        {data && (
          <div>
            <div className="text-4xl font-bold">{data.temperature}°C</div>
            <div className="text-slate-600">{data.description} <span className="text-xs text-slate-400">({data.source})</span></div>
            <div className="text-sm text-slate-500 mt-1">Humidity: {data.humidity}% • Feels like {data.feelsLike}°C</div>
          </div>
        )}
      </div>
    </div>
  );
}
