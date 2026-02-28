'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ModuleData {
    id: string;
    project_id: string;
    project_name: string;
    title: string;
    content: string;
    tags: string;
    status: string;
    run_count: number;
    version_count: number;
    created_at: string;
    updated_at: string;
}

interface Run {
    id: string;
    inputs_json: string;
    output_text: string;
    model: string;
    latency_ms: number;
    created_at: string;
}

interface Version {
    id: string;
    content: string;
    changelog: string;
    version_number: number;
    created_at: string;
}

export default function ModuleEditor() {
    const params = useParams();
    const moduleId = params.id as string;

    const [mod, setMod] = useState<ModuleData | null>(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    const [variables, setVariables] = useState<string[]>([]);
    const [varValues, setVarValues] = useState<Record<string, string>>({});

    const [running, setRunning] = useState(false);
    const [lastRun, setLastRun] = useState<Run | null>(null);
    const [runError, setRunError] = useState('');

    const [activeTab, setActiveTab] = useState<'output' | 'history' | 'versions'>('output');
    const [runs, setRuns] = useState<Run[]>([]);
    const [versions, setVersions] = useState<Version[]>([]);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [changelog, setChangelog] = useState('');

    useEffect(() => { fetchModule(); }, [moduleId]);

    async function fetchModule() {
        try {
            const res = await fetch(`/api/modules/${moduleId}`);
            if (res.ok) {
                const data = await res.json();
                setMod(data); setContent(data.content); setTitle(data.title);
                setTagsInput(JSON.parse(data.tags || '[]').join(', '));
                setDirty(false);
            }
        } catch { /* silent */ } finally { setLoading(false); }
    }

    useEffect(() => {
        const regex = /\{(\w+)\}/g;
        const vars: string[] = [];
        const seen = new Set<string>();
        let match;
        while ((match = regex.exec(content)) !== null) {
            if (!seen.has(match[1])) { seen.add(match[1]); vars.push(match[1]); }
        }
        setVariables(vars);
    }, [content]);

    const saveModule = useCallback(async () => {
        if (!dirty) return;
        setSaving(true);
        try {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            await fetch(`/api/modules/${moduleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags }),
            });
            setDirty(false);
        } catch { /* silent */ } finally { setSaving(false); }
    }, [moduleId, title, content, tagsInput, dirty]);

    useEffect(() => {
        const timeout = setTimeout(() => { if (dirty) saveModule(); }, 1500);
        return () => clearTimeout(timeout);
    }, [content, title, tagsInput, dirty, saveModule]);

    async function runModule() {
        setRunning(true); setRunError(''); setActiveTab('output');
        if (dirty) await saveModule();
        try {
            const res = await fetch(`/api/modules/${moduleId}/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variables: varValues }),
            });
            const data = await res.json();
            if (!res.ok) setRunError(data.error || 'Run failed');
            else { setLastRun(data); fetchRuns(); }
        } catch { setRunError('Network error'); } finally { setRunning(false); }
    }

    async function fetchRuns() {
        try {
            const res = await fetch(`/api/modules/${moduleId}/runs`);
            if (res.ok) setRuns(await res.json());
        } catch { /* silent */ }
    }

    async function fetchVersions() {
        try {
            const res = await fetch(`/api/modules/${moduleId}/versions`);
            if (res.ok) setVersions(await res.json());
        } catch { /* silent */ }
    }

    useEffect(() => {
        if (activeTab === 'history') fetchRuns();
        if (activeTab === 'versions') fetchVersions();
    }, [activeTab, moduleId]);

    async function saveVersion() {
        try {
            if (dirty) await saveModule();
            const res = await fetch(`/api/modules/${moduleId}/versions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ changelog: changelog.trim() }),
            });
            if (res.ok) { setShowVersionModal(false); setChangelog(''); fetchVersions(); fetchModule(); }
        } catch { /* silent */ }
    }

    async function rollbackTo(versionId: string) {
        if (!confirm('Rollback? Current changes will be replaced.')) return;
        try {
            const res = await fetch(`/api/modules/${moduleId}/rollback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ version_id: versionId }),
            });
            if (res.ok) {
                const data = await res.json();
                setContent(data.content); setTitle(data.title); setDirty(false); fetchModule();
            }
        } catch { /* silent */ }
    }

    function exportModule(format: 'md' | 'json') {
        window.open(`/api/modules/${moduleId}/export?format=${format}`, '_blank');
    }

    const renderColoredContent = () => {
        const parts = content.split(/(\{.*?\})/g);
        return parts.map((part, i) => {
            if (part.startsWith('{') && part.endsWith('}')) {
                return (
                    <span key={i} style={{
                        color: 'var(--nova-accent)',
                        fontWeight: 700,
                        textShadow: '0 0 10px rgba(0, 210, 211, 0.4)'
                    }}>
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    if (loading) return <div className="loading-overlay"><div className="spinner" /> Loading…</div>;

    if (!mod) return (
        <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <div className="empty-state-title">Module not found</div>
            <Link href="/dashboard" className="btn btn-primary mt-4">← Back to Dashboard</Link>
        </div>
    );

    return (
        <>
            <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                    <Link href={`/projects/${mod.project_id}`} style={{ color: 'var(--nova-primary-light)', textDecoration: 'none' }}>
                        {mod.project_name}
                    </Link>
                    {' / '}
                    <span>{mod.title}</span>
                </div>
                <div className="flex-between">
                    <input className="form-input" value={title}
                        onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
                        style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: 0, maxWidth: '600px' }} />
                    <div className="action-row">
                        <span style={{ fontSize: 'var(--text-xs)', color: dirty ? 'var(--nova-warning)' : 'var(--nova-success)' }}>
                            {saving ? '💾 Saving…' : dirty ? '● Unsaved' : '✓ Saved'}
                        </span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowVersionModal(true)}>📌 Save Version</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => exportModule('md')}>⬇ MD</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => exportModule('json')}>⬇ JSON</button>
                    </div>
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <input className="form-input" placeholder="Tags: tiktok, content, video" value={tagsInput}
                    onChange={(e) => { setTagsInput(e.target.value); setDirty(true); }}
                    style={{ maxWidth: '500px', fontSize: 'var(--text-xs)' }} />
            </div>

            <div className="editor-layout">
                <div className="editor-main">
                    <div style={{ position: 'relative' }}>
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Prompt Template
                            <span style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>Coloration active ✨</span>
                        </label>
                        <div style={{ position: 'relative', width: '100%', minHeight: 400 }}>
                            <div className="form-textarea prompt-editor"
                                style={{
                                    position: 'absolute', inset: 0,
                                    pointerEvents: 'none',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    color: 'transparent',
                                    caretColor: 'var(--nova-primary-light)',
                                    background: 'rgba(10, 10, 26, 0.9)',
                                    overflow: 'hidden'
                                }}>
                                {renderColoredContent()}
                            </div>
                            <textarea
                                className="form-textarea prompt-editor"
                                value={content}
                                onChange={(e) => { setContent(e.target.value); setDirty(true); }}
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    minHeight: 400,
                                    background: 'transparent',
                                    color: 'var(--text-primary)',
                                    zIndex: 1,
                                    WebkitTextFillColor: 'rgba(255, 255, 255, 0.1)', // Légère visibilité pour l'édition
                                }}
                                placeholder={"Write your prompt here…\nUse {variable_name} for dynamic inputs."}
                            />
                        </div>
                    </div>

                    {variables.length > 0 && (
                        <div className="card" style={{ padding: 'var(--space-5)' }}>
                            <div className="flex-between mb-4">
                                <span className="form-label" style={{ margin: 0 }}>Variables Detected ({variables.length})</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
                                {variables.map((v) => (
                                    <div key={v}>
                                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>
                                            <span className="variable-chip">{`{${v}}`}</span>
                                        </label>
                                        <input className="form-input" placeholder={`Enter ${v}…`}
                                            value={varValues[v] || ''}
                                            onChange={(e) => setVarValues((prev) => ({ ...prev, [v]: e.target.value }))} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="action-row">
                        <button className="btn btn-success btn-lg btn-aura" onClick={runModule} disabled={running} style={{ minWidth: 180 }}>
                            {running ? (<><div className="spinner" style={{ width: 16, height: 16, borderWidth: '2px' }} /> Running…</>) : '▶ Run with Gemini'}
                        </button>
                        {variables.length > 0 && !variables.every(v => varValues[v]) && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--nova-warning)' }}>⚠ Some variables are empty</span>
                        )}
                    </div>
                </div>

                <div className="editor-sidebar">
                    <div className="tabs">
                        <button className={`tab ${activeTab === 'output' ? 'active' : ''}`} onClick={() => setActiveTab('output')}>Output</button>
                        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
                        <button className={`tab ${activeTab === 'versions' ? 'active' : ''}`} onClick={() => setActiveTab('versions')}>Versions</button>
                    </div>

                    {activeTab === 'output' && (
                        <>
                            {runError && <div className="alert alert-error">{runError}</div>}
                            {lastRun ? (
                                <div className="output-panel">
                                    <div className="output-header">
                                        <span className="output-header-title">✨ Gemini Output</span>
                                        <div className="output-meta">
                                            <span className="output-meta-item">🤖 {lastRun.model}</span>
                                            <span className="output-meta-item">⚡ {lastRun.latency_ms}ms</span>
                                        </div>
                                    </div>
                                    <div className="output-body">{lastRun.output_text}</div>
                                </div>
                            ) : (
                                <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                                    <div className="empty-state-icon">🚀</div>
                                    <div className="empty-state-title">Ready to run</div>
                                    <div className="empty-state-text">Fill in your variables and click Run.</div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-list">
                            {runs.length === 0 ? (
                                <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                                    <div className="empty-state-text">No runs yet</div>
                                </div>
                            ) : runs.map((run) => (
                                <div key={run.id} className="history-item" onClick={() => { setLastRun(run); setActiveTab('output'); }}>
                                    <div className="history-item-header">
                                        <span className="history-item-date">{new Date(run.created_at).toLocaleString('fr-FR')}</span>
                                        <div className="history-item-meta">
                                            <span>🤖 {run.model}</span>
                                            <span>⚡ {run.latency_ms}ms</span>
                                        </div>
                                    </div>
                                    <p className="history-item-preview">{run.output_text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'versions' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowVersionModal(true)}>📌 Save Current as Version</button>
                            {versions.length === 0 ? (
                                <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                                    <div className="empty-state-text">No versions saved yet</div>
                                </div>
                            ) : versions.map((ver) => (
                                <div key={ver.id} className="version-item">
                                    <div className="version-info">
                                        <span className="version-number">v{ver.version_number}</span>
                                        {ver.changelog && <span className="version-changelog">{ver.changelog}</span>}
                                        <span className="version-date">{new Date(ver.created_at).toLocaleString('fr-FR')}</span>
                                    </div>
                                    <button className="btn btn-ghost btn-sm" onClick={() => rollbackTo(ver.id)}>↩ Rollback</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showVersionModal && (
                <div className="modal-overlay" onClick={() => setShowVersionModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">📌 Save Version</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                            Snapshot the current state of this module
                        </p>
                        <div className="form-group">
                            <label className="form-label">Changelog / Notes</label>
                            <textarea className="form-textarea" placeholder="What changed in this version…" value={changelog}
                                onChange={(e) => setChangelog(e.target.value)} rows={3} style={{ minHeight: 80 }} autoFocus />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowVersionModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveVersion}>📌 Save Version</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
