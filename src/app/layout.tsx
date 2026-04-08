import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cyberbriefing Sverige',
  description: 'Daglig cyberhot-briefing för svenska beslutsfattare.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <div className="site-shell">
          <header className="topbar">
            <div>
              <p className="brand-eyebrow">Daglig säkerhetsbrief</p>
              <h1 className="brand-title">Cyberbriefing Sverige</h1>
            </div>
            <nav className="topnav">
              <a href="/">Idag</a>
              <a href="/archive">Arkiv</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
