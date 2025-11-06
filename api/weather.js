const axios = require('axios');

module.exports = async (req, res) => {
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
};
