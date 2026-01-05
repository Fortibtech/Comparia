import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <body>
                <div className="sidebar">
                    <h2 style={{ marginBottom: '40px', fontSize: '1.25rem' }}>Compario Admin</h2>
                    <nav>
                        <Link href="/" className="nav-link">📊 Dashboard</Link>
                        <Link href="/vendors" className="nav-link">🛍️ Marchands</Link>
                    </nav>
                </div>
                <div className="main-content">
                    {children}
                </div>
            </body>
        </html>
    );
}
