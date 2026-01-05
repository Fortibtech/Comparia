
import { ConfigService } from '@nestjs/config';
import { AffiliationService } from './affiliation/affiliation.service';
import { SearchService } from './search/search.service';
import { AmazonStrategy } from './search/strategies/amazon.strategy';
import { CdiscountStrategy } from './search/strategies/cdiscount.strategy';
import { TemuStrategy, SheinStrategy } from './search/strategies/scrapers.strategy';

// Mock Config
const mockConfig = {
    get: (key: string) => {
        const config = {
            'amazon.partnerTag': 'TEST-TAG-21',
            'affiliation.temuId': 'TEMU-REF-123',
            'affiliation.sheinId': 'SHEIN-REF-456'
        };
        return config[key];
    }
};

async function runTest() {
    console.log('--- Démarrage du Test des Interfaces & Affiliation ---\n');

    // 1. Test Affiliation Service
    console.log('1. Test Unitaire: AffiliationService');
    const affService = new AffiliationService(mockConfig as any);

    const rawLinks = [
        { vendor: 'Amazon', url: 'https://amazon.fr/dp/B08?' },
        { vendor: 'Temu', url: 'https://temu.com/goods.html?id=123' },
        { vendor: 'Shein', url: 'https://shein.com/dress.html' },
        { vendor: 'Cdiscount', url: 'https://cdiscount.com/phone.html' },
    ];

    rawLinks.forEach(link => {
        const result = affService.getAffiliateUrl(link.vendor, link.url);
        console.log(`[${link.vendor}] ${link.url} \n   -> ${result}`);
    });

    console.log('\n-----------------------------------------------------\n');

    // 2. Test Aggregation Logic (SearchService) using Stubbed Strategies
    console.log('2. Test Intégration: SearchService (Aggregation & Sorting)');

    // Create Stubs
    const mockAmazon = {
        name: 'Amazon', search: async () => [{
            id: 'amz-1', title: 'iPhone 15 Pro', price: 999, currency: 'EUR', vendorName: 'Amazon', productUrl: 'http://amz', imageUrl: ''
        }]
    };
    const mockCdiscount = {
        name: 'Cdiscount', search: async () => [{
            id: 'cd-1', title: 'iPhone 15 Pro Max', price: 1200, currency: 'EUR', vendorName: 'Cdiscount', productUrl: 'http://cd', imageUrl: ''
        }]
    };
    // Mock Temu returning a cheaper price for "Pro"
    const mockTemu = {
        name: 'Temu', search: async () => [{
            id: 'temu-1', title: 'Iphone 15 Pro Coque', price: 5, currency: 'EUR', vendorName: 'Temu', productUrl: 'http://temu', imageUrl: ''
        }]
    };
    const mockShein = { name: 'Shein', search: async () => [] };

    const searchService = new SearchService(
        mockAmazon as any,
        mockCdiscount as any,
        mockTemu as any,
        mockShein as any
    );

    const results = await searchService.searchProducts('iphone');

    console.log(`\nRésultats Agrégés (${results.length} groupes):`);
    results.forEach(p => {
        console.log(`\n📦 Groupe: "${p.title}" (Meilleur Prix: ${p.bestPrice}€)`);
        console.log(`   Offers: ${p.offers.map(o => `${o.vendor}(${o.price}€)`).join(', ')}`);
    });
}

runTest();
