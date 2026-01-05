import { IVendorStrategy, SearchResult } from '../strategies';
import { AffiliationService } from '../../affiliation/affiliation.service';
export declare class TemuStrategy implements IVendorStrategy {
    private affiliation;
    name: string;
    private readonly logger;
    constructor(affiliation: AffiliationService);
    search(query: string): Promise<SearchResult[]>;
}
export declare class SheinStrategy implements IVendorStrategy {
    private affiliation;
    name: string;
    constructor(affiliation: AffiliationService);
    search(query: string): Promise<SearchResult[]>;
}
