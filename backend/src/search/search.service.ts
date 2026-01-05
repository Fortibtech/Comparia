import { Injectable, Logger } from '@nestjs/common';
import { IVendorStrategy, SearchResult } from './strategies';
import { AmazonStrategy } from './strategies/amazon.strategy';
import { CdiscountStrategy } from './strategies/cdiscount.strategy';
import { TemuStrategy, SheinStrategy } from './strategies/scrapers.strategy';

export interface AggegratedProduct {
    id: string;
    title: string;
    bestPrice: number;
    currency: string;
    imageUrl: string;
    offers: {
        vendor: string;
        price: number;
        url: string;
    }[];
    vendorCount: number;
}

@Injectable()
export class SearchService {
    private strategies: IVendorStrategy[] = [];
    private readonly logger = new Logger(SearchService.name);

    constructor(
        private amazonStrategy: AmazonStrategy,
        private cdiscountStrategy: CdiscountStrategy,
        private temuStrategy: TemuStrategy,
        private sheinStrategy: SheinStrategy
    ) {
        this.strategies = [
            amazonStrategy,
            cdiscountStrategy,
            temuStrategy,
            sheinStrategy
        ];
    }

    async searchProducts(query: string): Promise<AggegratedProduct[]> {
        this.logger.log(`Starting search for: ${query}`);

        const promises = this.strategies.map(async (strategy) => {
            try {
                const results = await strategy.search(query);
                return results;
            } catch (error) {
                this.logger.error(`Error fetching from ${strategy.name}`, error);
                return [];
            }
        });

        const resultsArray = await Promise.all(promises);
        const flatResults = resultsArray.flat();

        // Grouping by crude title matching
        const aggregated = this.groupByProduct(flatResults);

        // Sort logic
        return aggregated.sort((a, b) => {
            // If price is 0 (fallback link), put at end
            if (a.bestPrice === 0) return 1;
            if (b.bestPrice === 0) return -1;
            return a.bestPrice - b.bestPrice;
        });
    }

    private groupByProduct(results: SearchResult[]): AggegratedProduct[] {
        const map = new Map<string, AggegratedProduct>();

        results.forEach(res => {
            // Very simplifed Key generation for MVP
            // We assume if it came from the same query, and matches first 3 words, it's 'similar'
            // Or we just output everything separately if it varies too much.

            // Let's treat every result as unique for now unless exact match to avoid bad merging
            // except for aggregating offers (which we don't have multiple of for same product here usually)
            // Actually, for a comparator, we WANT to merge.
            // Let's use a simple slug from title.
            // E.g. "iPhone 14" -> "iphone14"

            const slug = res.title.toLowerCase().substring(0, 20).replace(/[^a-z0-9]/g, '');
            const key = slug.length < 5 ? res.id : slug;

            if (!map.has(key)) {
                map.set(key, {
                    id: res.id,
                    title: res.title,
                    imageUrl: res.imageUrl,
                    bestPrice: res.price,
                    currency: res.currency,
                    offers: [],
                    vendorCount: 0
                });
            }

            const group = map.get(key)!;
            group.offers.push({
                vendor: res.vendorName,
                price: res.price,
                url: res.productUrl
            });

            // Update best price logic
            // Ignore 0 price (fallback links) when finding min price
            if (res.price > 0 && (res.price < group.bestPrice || group.bestPrice === 0)) {
                group.bestPrice = res.price;
                group.imageUrl = res.imageUrl || group.imageUrl; // Use the one with image
                group.title = res.title; // Use the title of best offer (often cleaner)
            }
            group.vendorCount = group.offers.length;
        });

        return Array.from(map.values());
    }
}
