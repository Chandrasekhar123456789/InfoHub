const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoints (same logic as serverless functions)
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let query = '';
    if (lat && lon) {
      query = `${lat},${lon}`;
    } else {
      query = city ? city : 'Udaipur';
    }
    const url = `https://wttr.in/${encodeURIComponent(query)}?format=j1`;
    const r = await axios.get(url, { timeout: 10000 });
    const d = r.data;
    const current = d.current_condition && d.current_condition[0] ? d.current_condition[0] : null;
    if (!current) return res.status(502).json({ error: 'Bad weather response' });
    res.json({
      city: d.nearest_area && d.nearest_area[0] && d.nearest_area[0].areaName ? d.nearest_area[0].areaName[0].value : (city || 'Udaipur'),
      temperature: Number(current.temp_C),
      description: current.weatherDesc && current.weatherDesc[0] ? current.weatherDesc[0].value : '',
      humidity: current.humidity,
      feelsLike: current.FeelsLikeC,
      source: 'wttr.in'
    });
  } catch (err) {
    console.error(err && err.message);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

app.get('/api/currency', async (req, res) => {
  try {
    const amount = Number(req.query.amount) || 1;
    // Get rates with base INR
    const r = await axios.get('https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR', { timeout: 10000 });
    const rates = r.data && r.data.rates;
    if (!rates) throw new Error('No rates');
    res.json({
      base: 'INR',
      amount,
      results: {
        USD: Number((amount * rates.USD).toFixed(6)),
        EUR: Number((amount * rates.EUR).toFixed(6))
      },
      source: 'exchangerate.host'
    });
  } catch (err) {
    console.error(err && err.message);
    // fallback
    const amount = Number(req.query.amount) || 1;
    res.json({
      base: 'INR',
      amount,
      results: { USD: Number((amount*0.012).toFixed(6)), EUR: Number((amount*0.011).toFixed(6)) },
      source: 'mock-fallback'
    });
  }
});

app.get('/api/quote', async (req, res) => {
  try {
    const r = await axios.get('https://api.quotable.io/random', { timeout: 8000 });
    const d = r.data;
    res.json({ text: d.content, author: d.author, source: 'quotable.io' });
  } catch (err) {
    console.error(err && err.message);
    res.json({ text: "Stay curious, keep learning.", author: "InfoHub", source: "fallback" });
  }
});

// Serve index.html for any other route (for local preview)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, ()=> console.log(`Local dev server running on http://localhost:${PORT}`));
