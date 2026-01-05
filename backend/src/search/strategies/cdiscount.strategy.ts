import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVendorStrategy, SearchResult } from '../strategies';
import { AffiliationService } from '../../affiliation/affiliation.service';
import axios from 'axios';

@Injectable()
export class CdiscountStrategy implements IVendorStrategy {
    name = 'Cdiscount';
    private readonly logger = new Logger(CdiscountStrategy.name);

    constructor(
        private config: ConfigService,
        private affiliationService: AffiliationService
    ) { }

    async search(query: string): Promise<SearchResult[]> {
        const apiKey = this.config.get('cdiscount.apiKey');

        // Fallback if no key (so the code runs but returns empty)
        if (!apiKey) {
            this.logger.warn('Cdiscount API Key missing');
            return [];
        }

        try {
            const payload = {
                ApiKey: apiKey,
                SearchRequest: {
                    Keyword: query,
                    Pagination: { ItemsPerPage: 5, PageNumber: 0 },
                    Filters: { Price: { Min: 0, Max: 10000 }, IncludeMarketPlace: true },
                }
            };

            const response = await axios.post('https://api.cdiscount.com/OpenApi/json/Search', payload);
            const items = response.data?.Products || [];

            return items.map((p: any) => {
                // Construct Affiliate Link
                // Usually Cdiscount affiliation works via "DeepLink" generator platform like Awin/Tradedoubler
                // Or simple `?tag=` if direct. 
                // We will assume Aggregator logic: Wrap the URL.
                const originalUrl = `https://www.cdiscount.com/dp/${p.Id}`;
                // Note: Cdiscount API might not return URL in the minimal Search obj, so we construct it.

                return {
                    id: p.Id,
                    title: p.Name,
                    imageUrl: p.MainImageUrl,
                    price: parseFloat(p.BestOffer?.SalePrice || '0'),
                    currency: 'EUR',
                    vendorName: 'Cdiscount',
                    productUrl: this.affiliationService.getAffiliateUrl('cdiscount', originalUrl),
                    rating: 4.0 // API doesn't always return rating in search list
                };
            });

        } catch (error) {
            this.logger.error(`Cdiscount Error: ${error.message}`);
            return [];
        }
    }
}
