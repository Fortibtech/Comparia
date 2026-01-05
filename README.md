# Compario MVP

Ce projet contient le code source du MVP de comparateur de prix e-commerce.

## Structure du Projet

*   `backend/` : API NestJS centralisée (Search, Aggregation, Vendors).
*   `mobile/` : Application React Native / Expo pour les utilisateurs.
*   `admin/` : Dashboard Next.js pour l'administration des marchands.
*   `ARCHITECTURE.md` : Documentation technique détaillée.

## Démarrage Rapide

### 1. Backend (NestJS)
```bash
cd backend
npm install
npm run start
# L'API sera accessible sur http://localhost:3000
# Test: http://localhost:3000/search?q=iphone
```

### 2. Admin Dashboard (Next.js)
```bash
cd admin
npm install
npm run dev
# Le dashboard sera accessible sur http://localhost:3001
```

### 3. Application Mobile (Expo)
```bash
cd mobile
npm install
npx expo start
# Scannez le QR code avec l'app Expo Go sur votre téléphone
```

## Fonctionnalités Implémentées (Code Squelette)

*   **Backend**: 
    *   Service d'agrégation "Strategy Pattern" (Amazon, Cdiscount mockés).
    *   Endpoint `/search` fonctionnel (simulé).
*   **Mobile**: 
    *   Écran de recherche.
    *   Affichage des résultats multi-marchands.
    *   Mise en avant "Meilleur Prix".
    *   Gestion des Favoris (Local State).
    *   Redirection vers les sites marchands.
*   **Admin**:
    *   Vue d'ensemble des stats.
    *   Gestion (Activer/Désactiver) des marchands.
