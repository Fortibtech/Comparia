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
export declare class SearchService {
    private amazonStrategy;
    private cdiscountStrategy;
    private temuStrategy;
    private sheinStrategy;
    private strategies;
    private readonly logger;
    constructor(amazonStrategy: AmazonStrategy, cdiscountStrategy: CdiscountStrategy, temuStrategy: TemuStrategy, sheinStrategy: SheinStrategy);
    searchProducts(query: string): Promise<AggegratedProduct[]>;
    private groupByProduct;
}
