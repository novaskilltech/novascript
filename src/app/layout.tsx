import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovaScript — Prompt Engineering Studio',
  description: 'Local-first AI prompt management studio powered by Gemini',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Anti-flash: restore theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nova-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
