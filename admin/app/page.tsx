import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '20px' }}>Vue d'ensemble</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="card">
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Requêtes totales (24h)</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>12,450</p>
                </div>
                <div className="card">
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Marchands Actifs</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px', color: '#10b981' }}>4 / 5</p>
                </div>
                <div className="card">
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Temps moyen réponse</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>850ms</p>
                </div>
            </div>

            <div className="card">
                <h3>Activités récentes</h3>
                <p style={{ color: '#6b7280', padding: '20px 0' }}>Aucune alerte critique.</p>
                <Link href="/vendors" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    Gérer les marchands
                </Link>
            </div>
        </div>
    );
}
