const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const r = await axios.get('https://api.quotable.io/random', { timeout: 8000 });
    const d = r.data;
    res.json({ text: d.content, author: d.author, source: 'quotable.io' });
  } catch (err) {
    console.error(err && err.message);
    res.json({ text: "Stay curious, keep learning.", author: "InfoHub", source: "fallback" });
  }
};
