'use client';

import { useState } from 'react';

interface FormData {
  companyName: string;
  tagline: string;
  problem: string;
  solution: string;
  market: string;
  businessModel: string;
  traction: string;
  team: string;
  askAmount: string;
}

const initialForm: FormData = {
  companyName: '',
  tagline: '',
  problem: '',
  solution: '',
  market: '',
  businessModel: '',
  traction: '',
  team: '',
  askAmount: '',
};

export default function Home() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ editUrl: string; viewUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setResult({ editUrl: data.editUrl, viewUrl: data.viewUrl });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Pitch Deck Generator</h1>
      <p className="subtitle">Fill in the form to generate a Google Slides pitch deck</p>

      {result ? (
        <div className="success-box">
          <h2 className="success-title">✅ Pitch Deck Created!</h2>
          <a href={result.editUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open in Google Slides →
          </a>
          <button
            onClick={() => {
              setResult(null);
              setForm(initialForm);
            }}
            className="btn-secondary"
          >
            Create Another
          </button>
          <p className="preview-label">Preview:</p>
          <iframe src={result.viewUrl} width="100%" height="400" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Acme Inc."
              required
            />
          </div>

          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="Making the world a better place"
              required
            />
          </div>

          <div className="form-group">
            <label>Problem</label>
            <textarea
              name="problem"
              value={form.problem}
              onChange={handleChange}
              placeholder="What problem are you solving?"
              required
            />
          </div>

          <div className="form-group">
            <label>Solution</label>
            <textarea
              name="solution"
              value={form.solution}
              onChange={handleChange}
              placeholder="How does your product solve it?"
              required
            />
          </div>

          <div className="form-group">
            <label>Market Opportunity</label>
            <textarea
              name="market"
              value={form.market}
              onChange={handleChange}
              placeholder="TAM, SAM, SOM - how big is the market?"
              required
            />
          </div>

          <div className="form-group">
            <label>Business Model</label>
            <textarea
              name="businessModel"
              value={form.businessModel}
              onChange={handleChange}
              placeholder="How do you make money?"
              required
            />
          </div>

          <div className="form-group">
            <label>Traction</label>
            <textarea
              name="traction"
              value={form.traction}
              onChange={handleChange}
              placeholder="Revenue, users, partnerships, milestones..."
              required
            />
          </div>

          <div className="form-group">
            <label>Team</label>
            <textarea
              name="team"
              value={form.team}
              onChange={handleChange}
              placeholder="Who are the founders? Relevant experience?"
              required
            />
          </div>

          <div className="form-group">
            <label>The Ask</label>
            <input
              type="text"
              name="askAmount"
              value={form.askAmount}
              onChange={handleChange}
              placeholder="$500K for 10% equity"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Pitch Deck'}
          </button>
        </form>
      )}
    </main>
  );
}
