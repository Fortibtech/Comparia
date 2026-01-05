import { Injectable, Logger } from '@nestjs/common';
import { IVendorStrategy, SearchResult } from '../strategies';
import { AffiliationService } from '../../affiliation/affiliation.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class TemuStrategy implements IVendorStrategy {
    name = 'Temu';
    private readonly logger = new Logger(TemuStrategy.name);

    constructor(private affiliation: AffiliationService) { }

    async search(query: string): Promise<SearchResult[]> {
        const searchUrl = `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(query)}`;

        try {
            // Note: Temu is very aggressive with anti-bot. This simple GET often fails or returns captcha.
            // For MVP, if it fails, we fall back to a "See on Temu" Generic Result.
            const { data } = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
                }
            });

            // Attempt generic parsing (Selectors change often)
            const $ = cheerio.load(data);
            const results: SearchResult[] = [];

            // Pseudo-selectors based on common classnames (often randomized in Temu)
            // If parsing fails (empty list), we add a fallback
            $('.goods-item').each((i, el) => {
                if (i > 5) return;
                const title = $(el).find('h3').text().trim();
                const priceTxt = $(el).find('[class*="price"]').first().text().trim();
                const price = parseFloat(priceTxt.replace(/[^0-9,.]/g, '').replace(',', '.'));
                const img = $(el).find('img').attr('src');
                const link = $(el).find('a').attr('href');

                if (title && price) {
                    results.push({
                        id: `temu-${i}`,
                        title,
                        price,
                        imageUrl: img || '',
                        currency: 'EUR',
                        vendorName: 'Temu',
                        productUrl: this.affiliation.getAffiliateUrl('temu', link.startsWith('http') ? link : `https://temu.com${link}`)
                    });
                }
            });

            if (results.length === 0) throw new Error('No DOM parsing matches');
            return results;

        } catch (e) {
            this.logger.warn(`Temu Scraping failed (${e.message}). Returning DeepLink fallback.`);

            // Fallback: One generic Result that leads to the search page
            // This ensures we still monetize traffic even if scraping fails
            return [{
                id: 'temu-search-link',
                title: `Voir les résultats pour "${query}" sur Temu`,
                price: 0,
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Muji-Temu-Logo.svg/1200px-Muji-Temu-Logo.svg.png',
                currency: 'EUR',
                vendorName: 'Temu',
                productUrl: this.affiliation.getAffiliateUrl('temu', searchUrl)
            }];
        }
    }
}

@Injectable()
export class SheinStrategy implements IVendorStrategy {
    name = 'Shein';

    constructor(private affiliation: AffiliationService) { }

    async search(query: string): Promise<SearchResult[]> {
        const searchUrl = `https://fr.shein.com/pdsearch/${encodeURIComponent(query)}`;
        // Similar fallback logic
        return [{
            id: 'shein-search-link',
            title: `Voir les résultats Shein pour "${query}"`,
            price: 0,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Shein-Logo-300x158.png/640px-Shein-Logo-300x158.png',
            currency: 'EUR',
            vendorName: 'Shein',
            productUrl: this.affiliation.getAffiliateUrl('shein', searchUrl)
        }];
    }
}
