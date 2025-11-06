const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const amount = Number(req.query.amount) || 1;
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
    const amount = Number(req.query.amount) || 1;
    res.json({
      base: 'INR',
      amount,
      results: { USD: Number((amount*0.012).toFixed(6)), EUR: Number((amount*0.011).toFixed(6)) },
      source: 'mock-fallback'
    });
  }
};
