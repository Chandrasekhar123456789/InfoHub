
import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function QuoteGenerator(){
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(3); // number of quotes to fetch per click

  const fetchOne = async () => {
    try {
      const res = await axios.get('/api/quote');
      return res.data;
    } catch (e) {
      return { text: 'Stay curious, keep learning.', author: 'InfoHub' };
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const q = await fetchOne();
      setQuotes([q]);
      setLoading(false);
    })();
  }, []);

  const handleNew = async () => {
    setLoading(true);
    try {
      const promises = Array.from({length: count}, () => fetchOne());
      const results = await Promise.all(promises);
      setQuotes(prev => [...results, ...prev].slice(0, 15));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setQuotes([]);

  return (
    <div className="card" aria-live="polite">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h3 style={{margin:0}}>Quotes</h3>
        <div className="controls">
          <label style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:12, color:'var(--muted)'}}>Per click</span>
            <select className="select-small" value={count} onChange={(e)=>setCount(Number(e.target.value))} aria-label="Quotes per click">
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </label>
          <button className="btn btn-ghost" onClick={handleClear} aria-label="Clear quotes">Clear</button>
          <button className="btn btn-accent" onClick={handleNew} aria-label="New quotes">
            {loading ? 'Loading…' : 'New'}
          </button>
        </div>
      </div>

      <div className="quote-wrap">
        {quotes.length === 0 && !loading && (
          <div className="quote-card pop-in">
            <div className="quote-inner card">
              <p className="quote-text">No quotes yet. Click <strong>New</strong> to fetch fresh wisdom.</p>
            </div>
          </div>
        )}

        {quotes.map((q, i) => (
          <div key={i} className={`quote-card pop-in quote-float`}>
            <div className="quote-inner">
              <blockquote style={{margin:0}}>
                <p className="quote-text">“{q.text}”</p>
                <footer className="quote-author">— {q.author || 'Unknown'}</footer>
              </blockquote>
            </div>
          </div>
        ))}
      </div>

      <div className="quote-footer card" style={{marginTop:14, background:'transparent', boxShadow:'none', border:'none', padding:0}}>
        <span>💡 <em>Powered by InfoHub</em></span>
      </div>
    </div>
  );
}
