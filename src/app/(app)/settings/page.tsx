'use client';

import { useState, useEffect } from 'react';

const AVAILABLE_MODELS = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', desc: 'Fast, efficient' },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', desc: 'Fastest, lightest' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Previous gen, fast' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'High quality' },
];

export default function SettingsPage() {
    const [hasApiKey, setHasApiKey] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    async function fetchSettings() {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setHasApiKey(data.hasApiKey);
                setSelectedModel(data.geminiModel || 'gemini-2.0-flash');
            }
        } catch { /* silent */ } finally { setLoading(false); }
    }

    async function saveSettings() {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ geminiModel: selectedModel }),
            });
            if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
        } catch { /* silent */ }
    }

    if (loading) return <div className="loading-overlay"><div className="spinner" /> Loading…</div>;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your NovaScript environment</p>
            </div>

            {saved && <div className="alert alert-success">✅ Settings saved!</div>}

            <div className="card mb-6">
                <h3 className="card-title">🔑 Gemini API Key</h3>
                <div style={{ marginTop: 'var(--space-4)' }}>
                    {hasApiKey ? (
                        <div className="alert alert-success" style={{ margin: 0 }}>✅ API key is configured and ready to use</div>
                    ) : (
                        <div className="alert alert-error" style={{ margin: 0 }}>
                            <p style={{ marginBottom: 'var(--space-3)' }}>⚠️ No API key found. Set your Gemini API key to use the Run feature.</p>
                            <ol style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2em', marginTop: 'var(--space-2)' }}>
                                <li>Get a free key at <strong>aistudio.google.com</strong></li>
                                <li>Open <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code></li>
                                <li>Set <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>GEMINI_API_KEY=your_key</code></li>
                                <li>Restart <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code></li>
                            </ol>
                        </div>
                    )}
                </div>
                <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    🔒 Stored locally in <code>.env.local</code> — never exposed client-side.
                </p>
            </div>

            <div className="card mb-6">
                <h3 className="card-title">🤖 Default Model</h3>
                <p className="card-description mb-4">Choose the Gemini model used when running modules</p>
                <div style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: '500px' }}>
                    {AVAILABLE_MODELS.map((model) => (
                        <label key={model.id} className="card" style={{
                            padding: 'var(--space-4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                            borderColor: selectedModel === model.id ? 'var(--nova-primary)' : undefined,
                            background: selectedModel === model.id ? 'rgba(108,92,231,0.1)' : undefined,
                        }}>
                            <input type="radio" name="model" value={model.id} checked={selectedModel === model.id}
                                onChange={() => setSelectedModel(model.id)} style={{ accentColor: 'var(--nova-primary)' }} />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{model.name}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{model.desc}</div>
                            </div>
                        </label>
                    ))}
                </div>
                <button className="btn btn-primary mt-6" onClick={saveSettings}>Save Settings</button>
            </div>

            <div className="card">
                <h3 className="card-title">ℹ️ About NovaScript</h3>
                <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <p><strong>Version:</strong> 0.1.0 (Local)</p>
                    <p><strong>Stack:</strong> Next.js + SQLite + Gemini</p>
                    <p><strong>Storage:</strong> <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>data/novascript.db</code></p>
                    <p style={{ marginTop: 'var(--space-3)' }}>Local-first prompt engineering studio. All data stays on your machine.</p>
                </div>
            </div>
        </>
    );
}
