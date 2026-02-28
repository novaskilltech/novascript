'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project { id: string; name: string; description: string; module_count: number; created_at: string; updated_at: string; }
interface Stats { projects: number; modules: number; runs: number; }

/* ── PROMPT TEMPLATES ─────────────────────────────────────── */
const TEMPLATES = [
    {
        emoji: '🎬',
        title: 'Script TikTok',
        desc: 'Accroches, transitions et CTA en {duration}s',
        color: 'rgba(255,75,110,0.18)',
        border: 'rgba(255,75,110,0.3)',
        tag: 'Social',
        prompt: `Tu es un expert en création de contenu TikTok viral.

Écris un script TikTok de {duration} secondes sur le sujet : {topic}.

Ton : {tone} (ex: humoristique, éducatif, inspirant)
Public cible : {audience}

Structure imposée :
1. [0-3s] ACCROCHE — phrase qui arrête le scroll
2. [3-{mid}s] CONTENU — valeur principale, exemples concrets
3. [{mid}-{duration}s] CTA — appel à l'action clair

Inclure : indications de transitions visuelles, emojis stratégiques, hashtags recommandés.`,
    },
    {
        emoji: '📺',
        title: 'Script YouTube',
        desc: 'Intro hook, structure narration, outro CTA',
        color: 'rgba(255,80,0,0.15)',
        border: 'rgba(255,80,0,0.28)',
        tag: 'Vidéo',
        prompt: `Tu es un scriptwriter YouTube spécialisé en {niche}.

Crée un script complet pour une vidéo YouTube sur : {topic}
Durée cible : {duration} minutes
Style : {style} (ex: tutoriel, vlog, documentaire, essai)
Chaîne : {channel_name}

Structure :
1. HOOK (0-30s) — question ou affirmation choc qui donne envie de rester
2. INTRO — qui tu es, ce qu'ils vont apprendre
3. DÉVELOPPEMENT — 3-5 parties avec transitions naturelles
4. CONCLUSION — résumé des points clés
5. OUTRO & CTA — like, abonnement, vidéo suivante

Ton : {tone}. Inclure timestamps suggérés.`,
    },
    {
        emoji: '📧',
        title: 'Newsletter / Email',
        desc: 'Histoire engageante + valeur + CTA irrésistible',
        color: 'rgba(108,92,231,0.2)',
        border: 'rgba(108,92,231,0.35)',
        tag: 'Email',
        prompt: `Tu es un expert en copywriting email avec un taux d'ouverture de 40%+.

Rédige une newsletter sur : {topic}
Audience : {audience}
Objectif : {goal} (ex: vendre, informer, fidéliser)
Ton : {tone}

Format :
- Objet principal : [accroche curiosité/bénéfice]
- Objet alternatif : [version A/B test]
- Pré-header : [complète l'objet]
- Corps : intro story (3 lignes max), transition, valeur principale, mini-CTA
- CTA final : bouton avec texte exact

Longueur : {length} mots environ. Éviter le spam words.`,
    },
    {
        emoji: '🐦',
        title: 'Thread X / Twitter',
        desc: '8-10 tweets, hook viral, engagement maximal',
        color: 'rgba(0,180,255,0.15)',
        border: 'rgba(0,180,255,0.28)',
        tag: 'Social',
        prompt: `Tu es un créateur de contenu avec +100K followers sur X/Twitter.

Écris un thread viral sur : {topic}
Ton : {tone} (ex: éducatif, provocateur, storytelling)
Domaine d'expertise : {niche}

Règles :
- Tweet 1 : hook ultra fort qui donne envie de lire la suite (max 280 chars)
- Tweets 2-8 : une idée par tweet, chiffres ou exemples concrets
- Tweet 9 : récap ou insight surprenant
- Tweet 10 : CTA + question pour l'engagement

Chaque tweet doit se tenir seul. Utiliser des listes, emojis stratégiques.`,
    },
    {
        emoji: '📝',
        title: 'Article de Blog SEO',
        desc: 'Structure H1/H2/H3, mots-clés, méta-description',
        color: 'rgba(0,210,150,0.15)',
        border: 'rgba(0,210,150,0.28)',
        tag: 'SEO',
        prompt: `Tu es un expert SEO et rédacteur web.

Rédige un article optimisé pour : {keyword}
Titre H1 : à définir (inclure le mot-clé principal)
Intention de recherche : {intent} (informationnelle/transactionnelle/navigationnelle)
Longueur : {word_count} mots
Public : {audience}

Structure :
1. Introduction (problème + promesse de solution)
2. {section_1} — H2 avec sous-sections H3
3. {section_2} — exemples concrets, données chiffrées
4. {section_3} — conseils actionnables
5. Conclusion + CTA

Méta-description (155 chars max) : inclure le mot-clé.
Ton : {tone}. Éviter le keyword stuffing.`,
    },
    {
        emoji: '💼',
        title: 'Post LinkedIn',
        desc: 'Format storytelling, expertise + question finale',
        color: 'rgba(0,120,255,0.15)',
        border: 'rgba(0,120,255,0.28)',
        tag: 'Pro',
        prompt: `Tu es un personal branding expert sur LinkedIn avec fort engagement.

Crée un post LinkedIn sur : {topic}
Domaine : {field}
Objectif : {goal} (ex: visibilité, leads, recrutement)
Ton : {tone} (authentique, expert, inspirant)

Structure optimale LinkedIn :
- Ligne 1 : hook qui force le "voir plus" (chiffre ou affirmation forte)
- Ligne 2-3 : contexte / problème
- Corps : histoire personnelle ou cas concret (3-5 paragraphes courts)
- Insight : la leçon apprise
- Question finale : pour maximiser les commentaires

Emojis : 2-3 max. Hashtags : 3-5 pertinents en fin de post.`,
    },
    {
        emoji: '🛍️',
        title: 'Description Produit',
        desc: 'Bénéfices émotionnels, features, social proof',
        color: 'rgba(255,200,0,0.15)',
        border: 'rgba(255,200,0,0.28)',
        tag: 'E-com',
        prompt: `Tu es un copywriter e-commerce spécialisé en conversion.

Rédige une description produit pour : {product}
Bénéfice clé : {key_benefit}
Public cible : {audience}
Prix : {price}
Plateforme : {platform} (Shopify, Amazon, Etsy…)

Format :
- Titre accrocheur (inclure le bénéfice principal)
- Sous-titre émotionnel
- 3-5 bullet points : feature → bénéfice → résultat
- Paragraphe storytelling (comment ce produit change leur vie)
- Objections traitées + garanties
- CTA urgent

Ton : {tone}. Longueur : {length} mots.`,
    },
    {
        emoji: '📱',
        title: 'Script Réels / Shorts',
        desc: '30-60s, hook 3s, visuel dynamique, CTA fort',
        color: 'rgba(200,0,255,0.15)',
        border: 'rgba(200,0,255,0.28)',
        tag: 'Vidéo',
        prompt: `Tu es un expert en content vidéo court-format (Reels, Shorts, TikTok).

Crée un script de {duration} secondes sur : {topic}
Plateforme : {platform} (Instagram Reels / YouTube Shorts / TikTok)
Public : {audience}
Objectif : {goal} (divertir, éduquer, vendre)

Format obligatoire :
- [0-3s] HOOK VISUEL — action ou phrase qui arrête immédiatement
- [3-15s] PROMESSE — "Dans cette vidéo tu vas découvrir…"
- [15-{mid}s] CONTENU — une seule idée forte, illustrée visuellement
- [{mid}-{duration}s] CTA — action claire + musique/son tendance suggéré

Indications caméra : plan suggéré, texte à l'écran, transitions.`,
    },
    {
        emoji: '📢',
        title: 'Ads Meta / Google',
        desc: 'Hooks accrocheurs et copy haute conversion pour tes pubs',
        color: 'rgba(52,152,219,0.18)',
        border: 'rgba(52,152,219,0.3)',
        tag: 'Ads',
        prompt: `Tu es un media buyer et copywriter spécialisé en publicité payante (Meta/Google Ads).

Crée 3 variations de textes publicitaires pour : {product_service}
Objectif : {goal} (Ventes, Leads, Trafic)
Cible : {audience}

Pour chaque variation, fournis :
1. LE HOOK (Accroche) — 1ère ligne impactante
2. LE CORPS (Body copy) — bénéfices, transformation, preuve sociale
3. LE CTA — appel à l'action clair et pressant

Ton : {tone}. Respecte les limitations de caractères des plateformes.`,
    },
    {
        emoji: '🎙️',
        title: 'Plan Podcast',
        desc: "Structure d'épisode, questions clés et intro percutante",
        color: 'rgba(231,76,60,0.18)',
        border: 'rgba(231,76,60,0.3)',
        tag: 'Podcast',
        prompt: `Tu es un producteur de podcast à succès.

Prépare la structure d'un épisode sur : {topic}
Invité (si applicable) : {guest}
Format : {format} (Solo, Interview, Table ronde)

Contenu demandé :
- Titre accrocheur et intrigant
- Intro Scriptée (Hook + problématique + promesse de l'épisode)
- Plan détaillé (Points clés à aborder, transitions)
- Questions d'or (3-5 questions percutantes pour l'invité)
- Conclusion & Appel à l'action (Newsletter, Review, etc.)`,
    },
    {
        emoji: '🧲',
        title: 'Lead Magnet',
        desc: 'Structure de PDF/Guide offert pour capturer des emails',
        color: 'rgba(46,204,113,0.18)',
        border: 'rgba(46,204,113,0.3)',
        tag: 'Marketing',
        prompt: `Tu es un expert en inbound marketing et conversion.

Conçois la structure d'un Lead Magnet (aimant à clients) sur : {topic}
Format : {magnet_format} (Ebook, Checklist, Template, Mini-cours)
Cible : {audience}

Détails requis :
- Titre irrésistible (Promesse forte + Résultat immédiat)
- Sommaire structuré (5-7 parties)
- Points de douleur adressés
- CTA final vers : {next_step} (Appel offrer, Produit payant, etc.)`,
    },
    {
        emoji: '🌐',
        title: 'Landing Page Copy',
        desc: 'Structure de page de vente, titres H1 et sections bénéfices',
        color: 'rgba(241,196,15,0.18)',
        border: 'rgba(241,196,15,0.3)',
        tag: 'Web',
        prompt: `Tu es un copywriter spécialisé en Landing Pages haute conversion.

Rédige le contenu d'une page de vente pour : {product_service}
Proposition de valeur : {uvp}
Cible : {audience}

Structure demandée :
- HERO : Titre H1 percutant + Sous-titre + Texte du bouton
- SECTION PROBLÈME : Agitation de la douleur actuelle de l'utilisateur
- SECTION SOLUTION : Présentation du produit comme le remède
- BÉNÉFICES : 3 points clés avec focus sur la transformation
- PREUVE SOCIALE : Emplacement pour témoignages
- FAQ : Réponse aux 3 objections majeures
- FOOTER : Rappel du CTA final`,
    },
    {
        emoji: '🤝',
        title: 'Réponse Support',
        desc: 'Réponses empathiques et professionnelles aux clients',
        color: 'rgba(149,165,166,0.18)',
        border: 'rgba(149,165,166,0.3)',
        tag: 'Support',
        prompt: `Tu es un expert en service client et Customer Success.

Rédige une réponse professionnelle et empathique pour : {customer_issue}
Ton souhaité : {tone} (Ferme mais poli, Désolé et pro-actif, Amical)

Structure de la réponse :
- Salutation personnalisée
- Validation du problème (empathie)
- Explication/Solution proposée
- Prochaine étape claire
- Formule de politesse adaptée`,
    },
    {
        emoji: '🎓',
        title: 'Plan de Cours',
        desc: 'Syllabus, modules et objectifs pédagogiques clairs',
        color: 'rgba(52,73,94,0.18)',
        border: 'rgba(52,73,94,0.3)',
        tag: 'Edu',
        prompt: `Tu es un ingénieur pédagogique et concepteur de formations.

Crée le syllabus d'un cours/formation sur : {course_topic}
Niveau : {level} (Débutant, Intermédiaire, Avancé)
Durée visée : {duration}

Éléments demandés :
- Objectifs pédagogiques (Ce que l'élève saura faire à la fin)
- Plan des modules (3-5 modules avec titres et sous-points)
- Exercice pratique ou quiz suggéré pour chaque module
- Ressource complémentaire recommandée`,
    },
];

/* ── TAG COLORS ──────────────────────────────────────────── */
const TAG_COLORS: Record<string, string> = {
    Social: 'rgba(255,75,110,0.2)',
    Vidéo: 'rgba(255,80,0,0.18)',
    Email: 'rgba(108,92,231,0.2)',
    SEO: 'rgba(0,210,150,0.18)',
    Pro: 'rgba(0,120,255,0.18)',
    'E-com': 'rgba(255,200,0,0.18)',
    Ads: 'rgba(52,152,219,0.18)',
    Podcast: 'rgba(231,76,60,0.18)',
    Marketing: 'rgba(46,204,113,0.18)',
    Web: 'rgba(241,196,15,0.18)',
    Support: 'rgba(149,165,166,0.18)',
    Edu: 'rgba(52,73,94,0.18)',
};

/* ── COMPONENT ───────────────────────────────────────────── */
export default function Dashboard() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<Stats>({ projects: 0, modules: 0, runs: 0 });
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [loading, setLoading] = useState(true);
    const [usingTemplate, setUsingTemplate] = useState<(typeof TEMPLATES)[0] | null>(null);
    const [templateProject, setTemplateProject] = useState('');

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            const [pr, mr] = await Promise.all([fetch('/api/projects'), fetch('/api/modules')]);
            const pd = await pr.json(); const md = await mr.json();
            setProjects(pd);
            setStats({ projects: pd.length, modules: md.length, runs: md.reduce((s: number, m: { run_count?: number }) => s + (m.run_count || 0), 0) });
        } catch { /* silent */ } finally { setLoading(false); }
    }

    async function createProject() {
        if (!newName.trim()) return;
        try {
            const res = await fetch('/api/projects', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() }),
            });
            if (res.ok) {
                const p = await res.json();
                setShowModal(false); setNewName(''); setNewDesc('');
                window.dispatchEvent(new Event('projects-updated'));
                router.push(`/projects/${p.id}`);
            }
        } catch { /* silent */ }
    }

    async function deleteProject(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm('Supprimer ce projet et tous ses modules ?')) return;
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            window.dispatchEvent(new Event('projects-updated'));
            fetchData();
        } catch { /* silent */ }
    }

    async function applyTemplate() {
        if (!usingTemplate) return;
        const projectName = templateProject.trim() || usingTemplate.title;
        try {
            // Create project
            const pr = await fetch('/api/projects', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName, description: `Projet ${usingTemplate.title}` }),
            });
            if (!pr.ok) return;
            const project = await pr.json();
            // Create module with template
            const mr = await fetch('/api/modules', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: project.id, title: usingTemplate.title, content: usingTemplate.prompt, tags: [usingTemplate.tag] }),
            });
            if (!mr.ok) return;
            const module = await mr.json();
            window.dispatchEvent(new Event('projects-updated'));
            setUsingTemplate(null); setTemplateProject('');
            router.push(`/modules/${module.id}`);
        } catch { /* silent */ }
    }

    if (loading) return <div className="loading-overlay"><div className="spinner" /> Chargement…</div>;

    return (
        <>
            {/* ── AMBIENT ORBS ── */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 600, height: 600, top: '-150px', right: '-50px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,92,231,0.09) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', width: 400, height: 400, bottom: '5%', left: '-80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,210,211,0.07) 0%, transparent 70%)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* ── HEADER ── */}
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'rgba(108,92,231,0.12)', border: '1px solid rgba(108,92,231,0.25)',
                                borderRadius: 'var(--radius-full)', padding: '4px 14px',
                                fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--nova-primary-light)',
                                marginBottom: 'var(--space-3)',
                            }}>⚡ Studio de Prompts IA</div>
                            <h1 style={{
                                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em',
                                background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--nova-primary-light) 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Tableau de bord</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 'var(--text-base)' }}>
                                Crée, teste et itère tes prompts Gemini — local-first, zéro friction.
                            </p>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)} style={{ alignSelf: 'flex-end' }}>
                            + Nouveau Projet
                        </button>
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
                    {[
                        { icon: '📁', val: stats.projects, label: 'Projets', color: 'rgba(108,92,231,0.12)' },
                        { icon: '⚡', val: stats.modules, label: 'Modules', color: 'rgba(0,210,211,0.1)' },
                        { icon: '🚀', val: stats.runs, label: 'Runs totaux', color: 'rgba(253,203,110,0.1)' },
                    ].map(s => (
                        <div key={s.label} className="stat-card" style={{ background: s.color }}>
                            <span className="stat-icon">{s.icon}</span>
                            <div className="stat-value">{s.val}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── QUICK START TEMPLATES ── */}
                <div style={{ marginBottom: 'var(--space-10)' }}>
                    <div style={{ marginBottom: 'var(--space-5)' }}>
                        <h2 style={{
                            fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em',
                            background: 'linear-gradient(90deg, var(--text-primary) 60%, var(--nova-primary-light) 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>⚡ Démarrage rapide</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                            Choisis un template de prompt prêt à l'emploi — un projet + module sont créés automatiquement.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                        {TEMPLATES.map((t) => (
                            <TemplateCard key={t.title} t={t} onUse={() => { setUsingTemplate(t); setTemplateProject(t.title); }} />
                        ))}
                    </div>
                </div>

                {/* ── PROJECTS ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Mes Projets</h2>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
                            {projects.length} projet{projects.length !== 1 ? 's' : ''} au total
                        </p>
                    </div>
                    {projects.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)}>+ Nouveau</button>
                    )}
                </div>

                {projects.length === 0 ? (
                    <div style={{
                        border: '1px dashed rgba(108,92,231,0.22)', borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-10)', textAlign: 'center', background: 'rgba(108,92,231,0.03)',
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📁</div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Aucun projet encore</div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                            Utilise un template ci-dessus ou crée un projet vide.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>✨ Créer un projet vide</button>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {projects.map((p) => (
                            <div key={p.id} className="card" onClick={() => router.push(`/projects/${p.id}`)}
                                style={{
                                    cursor: 'pointer',
                                    background: 'rgba(18, 18, 42, 0.7)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(108, 92, 231, 0.2)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                {/* Glass Reflection Effect */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'var(--glass-reflection)',
                                    pointerEvents: 'none', zIndex: 0,
                                    opacity: 0.5
                                }} />

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        position: 'absolute', top: 'calc(-1 * var(--space-6))', left: 0, right: 0, height: 2,
                                        background: 'linear-gradient(90deg, var(--nova-primary), var(--nova-accent))',
                                        borderRadius: '2px 2px 0 0',
                                    }} />
                                    <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                            background: 'rgba(108, 92, 231, 0.15)', border: '1px solid rgba(108, 92, 231, 0.25)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                            boxShadow: 'inset 0 0 12px rgba(108, 92, 231, 0.2)'
                                        }}>📁</div>
                                        <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => deleteProject(p.id, e)}
                                            style={{ opacity: 0.4, transition: 'opacity 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}>🗑️</button>
                                    </div>
                                    <h3 className="card-title" style={{ fontSize: '1.15rem', letterSpacing: '-0.01em' }}>{p.name}</h3>
                                    {p.description && <p className="card-description" style={{ fontSize: '0.82rem', opacity: 0.8 }}>{p.description}</p>}
                                    <div style={{
                                        marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)',
                                        borderTop: '1px solid rgba(108, 92, 231, 0.12)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <span style={{
                                            fontSize: '0.68rem', fontWeight: 700, color: 'var(--nova-primary-light)',
                                            background: 'rgba(108, 92, 231, 0.15)', borderRadius: 'var(--radius-full)',
                                            padding: '3px 12px', textTransform: 'uppercase', letterSpacing: '0.02em',
                                            border: '1px solid rgba(108, 92, 231, 0.1)'
                                        }}>
                                            ⚡ {p.module_count} module{p.module_count !== 1 ? 's' : ''}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            {new Date(p.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── NEW PROJECT MODAL ── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">✨ Nouveau Projet</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>
                            Organise tes modules de prompts autour d'un thème ou objectif.
                        </p>
                        <div className="form-group">
                            <label className="form-label">Nom du projet *</label>
                            <input className="form-input" placeholder="ex: TikTok Content, Newsletter IA…" value={newName}
                                onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createProject()} autoFocus />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input className="form-input" placeholder="À quoi sert ce projet ?" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                            <button className="btn btn-primary" onClick={createProject} disabled={!newName.trim()}>✨ Créer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── USE TEMPLATE MODAL ── */}
            {usingTemplate && (
                <div className="modal-overlay" onClick={() => setUsingTemplate(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', alignItems: 'center' }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 'var(--radius-lg)', flexShrink: 0,
                                background: usingTemplate.color, border: `1px solid ${usingTemplate.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                            }}>{usingTemplate.emoji}</div>
                            <div>
                                <h3 className="modal-title" style={{ margin: 0 }}>Template — {usingTemplate.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{usingTemplate.desc}</p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(108,92,231,0.07)', border: '1px solid rgba(108,92,231,0.15)',
                            borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)',
                            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)',
                            maxHeight: 160, overflowY: 'auto', lineHeight: 1.7,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>
                            {usingTemplate.prompt.substring(0, 320)}…
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Nom du projet à créer</label>
                            <input className="form-input" value={templateProject}
                                onChange={(e) => setTemplateProject(e.target.value)}
                                placeholder={usingTemplate.title} autoFocus />
                            <div className="form-hint">Un nouveau projet + module seront créés automatiquement.</div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setUsingTemplate(null)}>Annuler</button>
                            <button className="btn btn-primary" onClick={applyTemplate}>
                                {usingTemplate.emoji} Utiliser ce template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ── TEMPLATE CARD ─────────────────────────────────────────── */
function TemplateCard({ t, onUse }: { t: typeof TEMPLATES[0]; onUse: () => void }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? `rgba(18,18,42,0.85)` : 'rgba(14,14,32,0.7)',
                border: `1px solid ${hovered ? t.border : 'rgba(108,92,231,0.15)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                transition: 'all 250ms ease',
                cursor: 'default',
                boxShadow: hovered ? `0 8px 32px ${t.color}` : 'none',
                transform: hovered ? 'translateY(-3px)' : 'none',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* top accent */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: hovered ? `linear-gradient(90deg, ${t.border}, transparent)` : 'transparent',
                transition: 'all 250ms ease',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: t.color, border: `1px solid ${t.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                    boxShadow: hovered ? `0 4px 20px ${t.color}` : 'none',
                    transition: 'box-shadow 250ms ease',
                }}>{t.emoji}</div>
                <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
                    background: TAG_COLORS[t.tag] || 'rgba(108,92,231,0.15)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-full)', padding: '2px 8px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>{t.tag}</span>
            </div>

            <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 4, color: 'var(--text-primary)' }}>{t.title}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 'var(--space-4)' }}>{t.desc}</div>

            <button
                className="btn btn-secondary btn-sm"
                onClick={onUse}
                style={{
                    width: '100%', justifyContent: 'center',
                    background: hovered ? t.color : 'rgba(108,92,231,0.08)',
                    borderColor: hovered ? t.border : 'rgba(108,92,231,0.15)',
                    color: 'var(--text-primary)',
                    transition: 'all 250ms ease',
                }}
            >
                Utiliser ce template →
            </button>
        </div>
    );
}
