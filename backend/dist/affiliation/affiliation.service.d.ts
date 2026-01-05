import { ConfigService } from '@nestjs/config';
export declare class AffiliationService {
    private configService;
    constructor(configService: ConfigService);
    getAffiliateUrl(vendor: string, rawUrl: string): string;
}
