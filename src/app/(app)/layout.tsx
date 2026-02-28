'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Project {
    id: string;
    name: string;
    module_count: number;
}

type Theme = 'dark' | 'light';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [projects, setProjects] = useState<Project[]>([]);
    const [theme, setTheme] = useState<Theme>('dark');

    // Sync theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('nova-theme') as Theme | null;
        if (saved === 'light') {
            setTheme('light');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, []);

    function toggleTheme() {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        if (next === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('nova-theme', next);
    }

    useEffect(() => { fetchProjects(); }, []);

    async function fetchProjects() {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) setProjects(await res.json());
        } catch { /* silent */ }
    }

    useEffect(() => {
        const handler = () => fetchProjects();
        window.addEventListener('projects-updated', handler);
        return () => window.removeEventListener('projects-updated', handler);
    }, []);

    const navLinks = [
        { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
        { href: '/welcome', icon: '◎', label: 'Getting Started' },
        { href: '/settings', icon: '◉', label: 'Settings' },
    ];

    return (
        <div className="app-layout">
            {/* ──── SIDEBAR ──── */}
            <aside className="sidebar">
                {/* Logo area */}
                <div className="sidebar-header">
                    <Link href="/dashboard" className="sidebar-logo">
                        <div className="sidebar-logo-icon">N</div>
                        <div>
                            <div className="sidebar-logo-text">NovaScript</div>
                            <div className="sidebar-logo-version">v0 · Local</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {/* Main nav */}
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Navigation</div>
                        {navLinks.map(({ href, icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`sidebar-link ${pathname === href ? 'active' : ''}`}
                            >
                                <span className="sidebar-link-icon" style={{ fontStyle: 'normal', fontSize: '1rem' }}>{icon}</span>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Separator */}
                    <div style={{ height: '1px', background: 'rgba(108,92,231,0.12)', margin: '0 var(--space-3) var(--space-4)' }} />

                    {/* Projects list */}
                    <div className="sidebar-section">
                        <div className="sidebar-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Projets</span>
                            <span style={{
                                background: 'rgba(108,92,231,0.18)', color: 'var(--nova-primary-light)',
                                fontSize: '0.65rem', fontWeight: 700, borderRadius: 'var(--radius-full)',
                                padding: '1px 7px', letterSpacing: '0.03em'
                            }}>
                                {projects.length}
                            </span>
                        </div>

                        {projects.length === 0 ? (
                            <div style={{ padding: '8px 14px', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Aucun projet encore
                            </div>
                        ) : (
                            projects.map((project) => {
                                const isActive = pathname === `/projects/${project.id}` || pathname?.startsWith(`/projects/${project.id}/`);
                                return (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className={`sidebar-project-item ${isActive ? 'active' : ''}`}
                                    >
                                        <span style={{
                                            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                                            background: isActive ? 'var(--nova-primary-light)' : 'var(--nova-primary)',
                                            boxShadow: isActive ? '0 0 8px rgba(162,155,254,0.6)' : 'none',
                                            display: 'inline-block',
                                        }} />
                                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {project.name}
                                        </span>
                                        <span style={{
                                            flexShrink: 0, fontSize: '0.65rem', fontWeight: 700,
                                            background: 'rgba(108,92,231,0.14)', color: 'var(--nova-primary-light)',
                                            borderRadius: 'var(--radius-full)', padding: '1px 6px',
                                        }}>
                                            {project.module_count}
                                        </span>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    {/* Landing page link */}
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textDecoration: 'none',
                        transition: 'all var(--transition-fast)', marginBottom: 'var(--space-2)',
                    }}>
                        ← Landing page
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: 'var(--space-2) var(--space-3)',
                            background: 'transparent', border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', fontWeight: 500,
                            transition: 'all var(--transition-fast)', marginBottom: 'var(--space-2)',
                            fontFamily: 'var(--font-sans)',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(108,92,231,0.35)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(108,92,231,0.06)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{ fontSize: '0.9rem' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
                            <span>{theme === 'dark' ? 'Mode sombre' : 'Mode clair'}</span>
                        </span>
                        {/* Toggle pill */}
                        <span style={{
                            width: 32, height: 18, borderRadius: 'var(--radius-full)',
                            background: theme === 'light' ? 'var(--nova-primary)' : 'rgba(108,92,231,0.25)',
                            display: 'inline-flex', alignItems: 'center', padding: '2px',
                            transition: 'background var(--transition-base)', flexShrink: 0,
                        }}>
                            <span style={{
                                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                                transform: theme === 'light' ? 'translateX(14px)' : 'translateX(0)',
                                transition: 'transform var(--transition-base)',
                                display: 'block',
                            }} />
                        </span>
                    </button>

                    {/* Gemini badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        background: 'rgba(0,210,211,0.06)', border: '1px solid rgba(0,210,211,0.12)',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <span style={{ fontSize: '0.8rem' }}>⚡</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--nova-accent-light)', fontWeight: 500 }}>
                            Powered by Gemini
                        </span>
                    </div>
                </div>
            </aside>

            {/* ──── MAIN CONTENT ──── */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
