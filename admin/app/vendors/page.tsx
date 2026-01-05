"use client";
import { useState } from 'react';

type Vendor = {
    id: string;
    name: string;
    baseUrl: string;
    isActive: boolean;
    successRate: number;
};

const INITIAL_VENDORS: Vendor[] = [
    { id: '1', name: 'Amazon', baseUrl: 'https://amazon.fr', isActive: true, successRate: 99.8 },
    { id: '2', name: 'Cdiscount', baseUrl: 'https://cdiscount.com', isActive: true, successRate: 98.5 },
    { id: '3', name: 'Temu', baseUrl: 'https://temu.com', isActive: true, successRate: 94.2 },
    { id: '4', name: 'Shein', baseUrl: 'https://shein.com', isActive: false, successRate: 0 },
    { id: '5', name: 'Fnac', baseUrl: 'https://fnac.com', isActive: true, successRate: 97.1 },
];

export default function VendorsPage() {
    const [vendors, setVendors] = useState(INITIAL_VENDORS);

    const toggleVendor = (id: string) => {
        setVendors(prev => prev.map(v => {
            if (v.id === id) {
                // In real app: await fetch(`/api/vendors/${id}`, { method: 'PATCH', body: { isActive: !v.isActive }})
                return { ...v, isActive: !v.isActive };
            }
            return v;
        }));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Gestion des Marchands</h1>
                <button className="btn btn-primary">+ Ajouter un marchand</button>
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>URL Base</th>
                            <th>Taux de succès (24h)</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(vendor => (
                            <tr key={vendor.id}>
                                <td style={{ fontWeight: '500' }}>{vendor.name}</td>
                                <td style={{ color: '#6b7280' }}>{vendor.baseUrl}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem',
                                        backgroundColor: vendor.successRate > 95 ? '#d1fae5' : '#fee2e2',
                                        color: vendor.successRate > 95 ? '#065f46' : '#991b1b'
                                    }}>
                                        {vendor.successRate}%
                                    </span>
                                </td>
                                <td>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={vendor.isActive}
                                            onChange={() => toggleVendor(vendor.id)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <span style={{ marginLeft: '10px', fontSize: '0.875rem', color: vendor.isActive ? '#10b981' : '#9ca3af' }}>
                                        {vendor.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn" style={{ color: '#6b7280' }}>Config</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
