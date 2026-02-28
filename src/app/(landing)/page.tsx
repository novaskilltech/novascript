'use client';

import Link from 'next/link';
import { useState } from 'react';

const FEATURES = [
    {
        icon: '🔤',
        title: 'Variables Dynamiques',
        desc: 'Détecte automatiquement les {variables} dans tes prompts et génère un formulaire interactif.',
    },
    {
        icon: '⚡',
        title: 'Run with Gemini',
        desc: 'Un clic pour exécuter ton prompt. Latence, modèle et output affiché instantanément.',
    },
    {
        icon: '📌',
        title: 'Versioning',
        desc: 'Sauvegarde chaque itération avec un changelog. Rollback en un clic.',
    },
    {
        icon: '⬇️',
        title: 'Export Markdown & JSON',
        desc: 'Exporte tes modules dans le format de ton choix pour les partager ou les archiver.',
    },
];

const STEPS = [
    { num: '01', title: 'Crée un projet', desc: 'Organise tes prompts par sujet, client ou campagne.' },
    { num: '02', title: 'Écris & teste', desc: 'Rédige ton template, remplis les variables, clique Run.' },
    { num: '03', title: 'Itère & exporte', desc: 'Sauvegarde les versions, compare, exporte en MD ou JSON.' },
];

const PLANS = [
    {
        name: 'Free',
        price: '0€',
        period: '/mois',
        features: ['3 prompts / mois', '30 runs / mois', 'Scoring basique'],
        cta: 'Commencer',
        href: '/dashboard',
        popular: false,
        highlight: false,
    },
    {
        name: 'Creator',
        price: '19€',
        period: '/mois',
        features: ['20 prompts / mois', '300 runs / mois', 'Full TikTok Pack'],
        cta: 'Choisir Creator',
        href: '/dashboard',
        popular: false,
        highlight: false,
    },
    {
        name: 'Creator+',
        price: '49€',
        period: '/mois',
        features: ['Unlimited prompts', '1 500 runs / mois', 'Advanced Testing'],
        cta: 'Choisir Creator+',
        href: '/dashboard',
        popular: true,
        highlight: true,
    },
    {
        name: 'Service',
        price: '199€',
        period: '/mois',
        features: ['Pack Customisé', 'Livré en 72h', 'Accompagnement'],
        cta: 'Commander',
        href: '/dashboard',
        popular: false,
        highlight: false,
    },
];

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 var(--space-8)', height: 64,
                background: 'rgba(10,10,26,0.85)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-color)',
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--nova-primary), var(--nova-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', color: 'white',
                        boxShadow: '0 0 20px rgba(108,92,231,0.35)',
                    }}>N</div>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: '-0.02em' }}>NovaScript</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                    <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Features</a>
                    <a href="#how" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Comment ça marche</a>
                    <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Pricing</a>
                    <Link href="/dashboard" className="btn btn-primary btn-sm">Ouvrir l'app →</Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section style={{
                position: 'relative', overflow: 'hidden',
                padding: 'var(--space-12) var(--space-8) 100px',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                {/* Spline 3D Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.7,
                }}>
                    <iframe
                        src='https://my.spline.design/clonercubesimplecopy-Pa2DAuHMT2OrX36XRlVLR42B/'
                        frameBorder='0'
                        width='100%'
                        height='100%'
                        style={{ border: 'none' }}
                    />
                </div>

                {/* Content Wrapper */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Gradient orbs (secondary) */}
                    <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(108,92,231,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: -1 }} />

                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: '6px 16px', borderRadius: 'var(--radius-full)',
                        background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(108,92,231,0.25)',
                        fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--nova-primary-light)',
                        marginBottom: 'var(--space-6)',
                    }}>
                        ⚡ Powered by Google Gemini
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em',
                        lineHeight: 1.05, maxWidth: 820,
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #6C5CE7 50%, #2D3436 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        marginBottom: 'var(--space-6)',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}>
                        Le Studio de Prompts IA pour Créateurs
                    </h1>

                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
                        Écris, teste, versione et exporte tes prompts Gemini. Local-first, zéro friction, résultats immédiats.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                            Ouvrir l'app →
                        </Link>
                        <a href="#pricing" className="btn btn-secondary btn-lg" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                            Voir les prix
                        </a>
                    </div>

                    {/* Preview card */}
                    <div style={{
                        marginTop: 'var(--space-12)', width: '100%', maxWidth: 780,
                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
                        backdropFilter: 'blur(12px)', boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 60px rgba(108,92,231,0.1)',
                    }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 2, textAlign: 'left' }}>
                            <span style={{ color: 'var(--text-muted)' }}>// Prompt Template</span><br />
                            Write a <span style={{ color: 'var(--nova-accent-light)', background: 'rgba(0,210,211,0.1)', padding: '1px 6px', borderRadius: 4 }}>{'{tone}'}</span> script about <span style={{ color: 'var(--nova-accent-light)', background: 'rgba(0,210,211,0.1)', padding: '1px 6px', borderRadius: 4 }}>{'{topic}'}</span> for TikTok.<br />
                            Target audience: <span style={{ color: 'var(--nova-accent-light)', background: 'rgba(0,210,211,0.1)', padding: '1px 6px', borderRadius: 4 }}>{'{audience}'}</span>. Duration: <span style={{ color: 'var(--nova-accent-light)', background: 'rgba(0,210,211,0.1)', padding: '1px 6px', borderRadius: 4 }}>{'{duration}'}</span>.<br /><br />
                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                <div style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #00B894, #00A884)', borderRadius: 'var(--radius-md)', color: 'white', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer' }}>▶ Run with Gemini</div>
                                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>⚡ gemini-2.0-flash · 842ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" style={{ padding: '80px var(--space-8)', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                    <p style={{ color: 'var(--nova-primary-light)', fontWeight: 600, fontSize: 'var(--text-sm)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Features</p>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                        Tout ce qu'il te faut pour itérer vite
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
                    {FEATURES.map((f) => (
                        <div key={f.title} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>{f.icon}</div>
                            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)', fontSize: 'var(--text-base)' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{f.desc}</p>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 70%)' }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ padding: '80px var(--space-8)', background: 'rgba(18,18,42,0.4)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ color: 'var(--nova-accent)', fontWeight: 600, fontSize: 'var(--text-sm)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Comment ça marche</p>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-10)' }}>
                        De l'idée au prompt en 3 étapes
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
                        {STEPS.map((step, i) => (
                            <div key={step.num} style={{ position: 'relative' }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                                    background: 'linear-gradient(135deg, var(--nova-primary), var(--nova-primary-dark))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                                    fontWeight: 800, fontSize: '1.1rem', color: 'white',
                                    boxShadow: '0 4px 20px rgba(108,92,231,0.3)',
                                }}>{step.num}</div>
                                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>{step.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{step.desc}</p>
                                {i < STEPS.length - 1 && (
                                    <div style={{
                                        display: 'none',
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section id="pricing" style={{ padding: '80px var(--space-8)', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                    <p style={{ color: 'var(--nova-primary-light)', fontWeight: 600, fontSize: 'var(--text-sm)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Pricing</p>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Simple, transparent</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-3)', fontSize: 'var(--text-base)' }}>Commence gratuitement, scale quand tu es prêt.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
                    {PLANS.map((plan) => (
                        <div key={plan.name} style={{
                            background: plan.highlight ? 'linear-gradient(135deg, rgba(108,92,231,0.15), rgba(0,210,211,0.08))' : 'var(--bg-card)',
                            border: plan.highlight ? '2px solid var(--nova-primary)' : '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-6)',
                            backdropFilter: 'blur(12px)',
                            position: 'relative',
                            boxShadow: plan.highlight ? '0 0 40px rgba(108,92,231,0.2)' : undefined,
                            transform: plan.highlight ? 'scale(1.02)' : undefined,
                        }}>
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, var(--nova-primary), var(--nova-accent))',
                                    color: 'white', fontWeight: 700, fontSize: 'var(--text-xs)',
                                    padding: '4px 16px', borderRadius: 'var(--radius-full)',
                                    whiteSpace: 'nowrap',
                                }}>⭐ Populaire</div>
                            )}

                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{plan.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                    <span style={{
                                        fontSize: '2.5rem', fontWeight: 800,
                                        background: plan.highlight ? 'linear-gradient(135deg, var(--nova-primary-light), var(--nova-accent))' : 'none',
                                        WebkitBackgroundClip: plan.highlight ? 'text' : undefined,
                                        WebkitTextFillColor: plan.highlight ? 'transparent' : undefined,
                                        backgroundClip: plan.highlight ? 'text' : undefined,
                                    }}>{plan.price}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{plan.period}</span>
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {plan.features.map((f) => (
                                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                        <span style={{ color: 'var(--nova-success)', flexShrink: 0 }}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section style={{
                margin: '0 var(--space-8) 80px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,210,211,0.1))',
                border: '1px solid rgba(108,92,231,0.3)',
                padding: '60px var(--space-8)',
                textAlign: 'center',
                maxWidth: 1100,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>
                    Prêt à booster ta création de contenu ?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-8)' }}>
                    Ouvre l'app locale, crée ton premier projet et génère ton premier script en 2 minutes.
                </p>
                <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                    Ouvrir NovaScript →
                </Link>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{
                borderTop: '1px solid var(--border-color)',
                padding: 'var(--space-8)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)',
                textAlign: 'center',
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--nova-primary), var(--nova-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.9rem', color: 'white',
                    }}>N</div>
                    <span style={{ fontWeight: 700 }}>NovaScript</span>
                </Link>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                    Local-first prompt engineering studio · Powered by Gemini ⚡
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                    © 2026 NovaScript · v0.1.0
                </p>
            </footer>
        </div>
    );
}
