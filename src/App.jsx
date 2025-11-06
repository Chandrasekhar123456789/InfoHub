import React, { useEffect, useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';

export default function App(){
  const [tab, setTab] = useState('Weather');
  const tabs = ['Weather','Currency','Quote'];
  const [coords, setCoords] = useState(null);

  useEffect(()=>{
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos)=> {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      }, (err) => {
        console.log('Geolocation denied or failed, using Udaipur default.');
      }, { timeout: 8000 });
    }
  },[]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <header className="mb-6">
          <h1 className="text-3xl font-heading text-gray-800">InFoHub</h1>
          <p className="text-slate-500"> It displays Local weather • INR → USD/EUR • Motivational quotes</p>
        </header>

        <nav className="flex gap-3 mb-6">
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-2 rounded-2xl ${tab===t ? 'bg-accent text-white' : 'bg-white text-accent border border-accent'}`}>
              {t}
            </button>
          ))}
        </nav>

        <main className="space-y-6">
          <div className="card p-6 rounded-2xl bg-white">
            {tab==='Weather' && <WeatherModule coords={coords} />}
            {tab==='Currency' && <CurrencyConverter />}
            {tab==='Quote' && <QuoteGenerator />}
          </div>

          <footer className="text-sm text-slate-500 mt-4">
           @Chandu0921
          </footer>
        </main>
      </div>
    </div>
  );
}
