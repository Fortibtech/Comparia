import { ConfigService } from '@nestjs/config';
import { IVendorStrategy, SearchResult } from '../strategies';
export declare class AmazonStrategy implements IVendorStrategy {
    private configHelper;
    name: string;
    private readonly logger;
    constructor(configHelper: ConfigService);
    search(query: string): Promise<SearchResult[]>;
    private hmac;
}
