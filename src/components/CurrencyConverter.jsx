import React, {useState} from 'react';
import axios from 'axios';

export default function CurrencyConverter(){
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const convert = async () => {
    try {
      setLoading(true); setErr('');
      const resUSD = await axios.get(`/api/currency?amount=${Number(amount)}&to=USD`);
      // Our API returns USD and EUR together; call once:
      const res = await axios.get(`/api/currency?amount=${Number(amount)}`);
      setResult(res.data);
    } catch (e) {
      setErr('Conversion failed.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">INR → USD / EUR</h2>
      <div className="flex gap-3 items-center mb-4">
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="px-3 py-2 rounded-lg border w-32" />
        <button onClick={convert} className="px-4 py-2 rounded-lg bg-accent text-white">Convert</button>
      </div>

      <div className="p-4 rounded-lg bg-slate-50">
        {loading && <div>Converting…</div>}
        {err && <div className="text-red-600">{err}</div>}
        {result && (
          <div>
            <div className="text-slate-700">Base: {result.base} • Amount: {result.amount}</div>
            <div className="mt-2 text-2xl font-bold">USD: {result.results.USD} • EUR: {result.results.EUR}</div>
            <div className="text-xs text-slate-400">Source: {result.source}</div>
          </div>
        )}
      </div>
    </div>
  );
}
