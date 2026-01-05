import { ConfigService } from '@nestjs/config';
import { IVendorStrategy, SearchResult } from '../strategies';
import { AffiliationService } from '../../affiliation/affiliation.service';
export declare class CdiscountStrategy implements IVendorStrategy {
    private config;
    private affiliationService;
    name: string;
    private readonly logger;
    constructor(config: ConfigService, affiliationService: AffiliationService);
    search(query: string): Promise<SearchResult[]>;
}
