'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    description: string;
    module_count: number;
    created_at: string;
    updated_at: string;
}

interface Module {
    id: string;
    title: string;
    content: string;
    tags: string;
    status: string;
    run_count: number;
    version_count: number;
    created_at: string;
    updated_at: string;
}

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewModule, setShowNewModule] = useState(false);
    const [editingProject, setEditingProject] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newTags, setNewTags] = useState('');
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => { fetchProject(); fetchModules(); }, [projectId]);

    async function fetchProject() {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setProject(data);
                setEditName(data.name);
                setEditDesc(data.description);
            }
        } catch { /* silent */ }
    }

    async function fetchModules() {
        try {
            const res = await fetch(`/api/modules?project_id=${projectId}`);
            if (res.ok) setModules(await res.json());
        } catch { /* silent */ } finally { setLoading(false); }
    }

    async function updateProject() {
        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, description: editDesc }),
            });
            fetchProject();
            setEditingProject(false);
            window.dispatchEvent(new Event('projects-updated'));
        } catch { /* silent */ }
    }

    async function createModule() {
        if (!newTitle.trim()) return;
        try {
            const tags = newTags.split(',').map((t) => t.trim()).filter(Boolean);
            const res = await fetch('/api/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: projectId, title: newTitle.trim(), content: newContent, tags }),
            });
            if (res.ok) {
                const module = await res.json();
                setShowNewModule(false); setNewTitle(''); setNewContent(''); setNewTags('');
                router.push(`/modules/${module.id}`);
            }
        } catch { /* silent */ }
    }

    async function deleteModule(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm('Delete this module?')) return;
        try {
            await fetch(`/api/modules/${id}`, { method: 'DELETE' });
            fetchModules();
            window.dispatchEvent(new Event('projects-updated'));
        } catch { /* silent */ }
    }

    async function duplicateModule(mod: Module, e: React.MouseEvent) {
        e.stopPropagation();
        try {
            const tags = JSON.parse(mod.tags || '[]');
            await fetch('/api/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: projectId, title: `${mod.title} (copy)`, content: mod.content, tags }),
            });
            fetchModules();
            window.dispatchEvent(new Event('projects-updated'));
        } catch { /* silent */ }
    }

    const filteredModules = modules.filter((m) => {
        const q = search.toLowerCase();
        if (!q) return true;
        const tags = JSON.parse(m.tags || '[]').join(' ').toLowerCase();
        return m.title.toLowerCase().includes(q) || tags.includes(q);
    });

    if (loading) return <div className="loading-overlay"><div className="spinner" /> Loading…</div>;

    if (!project) return (
        <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <div className="empty-state-title">Project not found</div>
            <Link href="/dashboard" className="btn btn-primary mt-4">← Back to Dashboard</Link>
        </div>
    );

    return (
        <>
            <div className="page-header">
                <div className="flex-between">
                    {editingProject ? (
                        <div style={{ flex: 1, maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                            <input className="form-input" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description…" />
                            <div className="action-row">
                                <button className="btn btn-primary btn-sm" onClick={updateProject}>Save</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditingProject(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="page-title">{project.name}</h1>
                            {project.description && <p className="page-subtitle">{project.description}</p>}
                        </div>
                    )}
                    {!editingProject && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingProject(true)}>✏️ Edit</button>
                    )}
                </div>
            </div>

            <div className="toolbar">
                <div className="toolbar-left">
                    <input className="form-input search-input" placeholder="🔍 Search modules or tags…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="toolbar-right">
                    <button className="btn btn-primary" onClick={() => setShowNewModule(true)}>+ New Module</button>
                </div>
            </div>

            {filteredModules.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-title">{search ? 'No modules match your search' : 'No modules yet'}</div>
                    <div className="empty-state-text">{search ? 'Try a different search term' : 'Create your first module to start building prompts'}</div>
                    {!search && <button className="btn btn-primary" onClick={() => setShowNewModule(true)}>+ Create Module</button>}
                </div>
            ) : (
                <div className="cards-grid">
                    {filteredModules.map((mod) => {
                        const tags = JSON.parse(mod.tags || '[]');
                        return (
                            <div key={mod.id} className="card" onClick={() => router.push(`/modules/${mod.id}`)} style={{ cursor: 'pointer' }}>
                                <div className="flex-between">
                                    <h3 className="card-title">{mod.title}</h3>
                                    <div className="action-row">
                                        <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => duplicateModule(mod, e)} title="Duplicate">📋</button>
                                        <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => deleteModule(mod.id, e)} title="Delete">🗑️</button>
                                    </div>
                                </div>
                                {mod.content && (
                                    <p className="card-description" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                        {mod.content.substring(0, 120)}{mod.content.length > 120 ? '…' : ''}
                                    </p>
                                )}
                                {tags.length > 0 && (
                                    <div className="tags-list mt-2">{tags.map((tag: string) => <span key={tag} className="tag">{tag}</span>)}</div>
                                )}
                                <div className="card-meta">
                                    <span className="card-meta-item">▶ {mod.run_count} runs</span>
                                    <span className="card-meta-item">📌 v{mod.version_count}</span>
                                    <span className="card-meta-item">{new Date(mod.updated_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showNewModule && (
                <div className="modal-overlay" onClick={() => setShowNewModule(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">New Module</h3>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input className="form-input" placeholder="e.g. TikTok Script Generator…" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Prompt Template</label>
                            <textarea className="form-textarea" placeholder={"Write a {tone} script about {topic} for {platform}…"} value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} style={{ minHeight: '100px' }} />
                            <div className="form-hint">Use {'{variable}'} for dynamic inputs</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <input className="form-input" placeholder="tiktok, content, video (comma-separated)" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowNewModule(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={createModule} disabled={!newTitle.trim()}>Create Module</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
