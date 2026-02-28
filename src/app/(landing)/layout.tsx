import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'NovaScript — Prompt Engineering Studio for Creators',
    description: 'Gérez vos prompts IA, exécutez-les avec Gemini, versionnez et exportez. Local-first prompt studio.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
