'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-8)',
            textAlign: 'center',
            position: 'relative',
        }}>
            {/* Glow background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(108,92,231,0.18) 0%, transparent 70%)',
            }} />

            {/* Logo */}
            <div style={{
                width: 72, height: 72, borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--nova-primary), var(--nova-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: 'white',
                boxShadow: '0 0 40px rgba(108,92,231,0.4)',
                marginBottom: 'var(--space-6)',
            }}>N</div>

            <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--nova-primary-light) 50%, var(--nova-accent) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: 'var(--space-4)',
            }}>
                Welcome to NovaScript ✨
            </h1>

            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: 520, marginBottom: 'var(--space-10)' }}>
                Your local-first AI prompt engineering studio. Powered by Gemini.
            </p>

            {/* Steps */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 780, marginBottom: 'var(--space-10)' }}>
                {[
                    { num: '1', icon: '📝', title: 'Create a Project', desc: 'Organize your prompts by topic or client' },
                    { num: '2', icon: '⚡', title: 'Write & Run', desc: 'Use {variables} and run with Gemini instantly' },
                    { num: '3', icon: '📌', title: 'Version & Export', desc: 'Track changes and export as Markdown or JSON' },
                ].map((step) => (
                    <div key={step.num} className="card" style={{ textAlign: 'left', position: 'relative', padding: 'var(--space-6)' }}>
                        <div style={{
                            position: 'absolute', top: '-12px', left: 'var(--space-5)',
                            background: 'linear-gradient(135deg, var(--nova-primary), var(--nova-primary-dark))',
                            color: 'white', fontWeight: 800, fontSize: 'var(--text-xs)',
                            padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        }}>STEP {step.num}</div>
                        <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-3)', marginTop: 'var(--space-2)' }}>{step.icon}</div>
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>{step.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{step.desc}</p>
                    </div>
                ))}
            </div>

            <button className="btn btn-primary btn-lg" onClick={() => router.push('/dashboard')}>
                Get Started →
            </button>
            <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                Don't forget to add your{' '}
                <Link href="/settings" style={{ color: 'var(--nova-primary-light)', textDecoration: 'underline' }}>
                    Gemini API key in Settings
                </Link>
            </p>
        </div>
    );
}
