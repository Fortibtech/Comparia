import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AffiliationService {
    constructor(private configService: ConfigService) { }

    /**
     * Transforms a raw product URL into a monetized affiliate URL.
     */
    getAffiliateUrl(vendor: string, rawUrl: string): string {
        const v = vendor.toLowerCase();

        if (v === 'amazon') {
            // Amazon usually returns affiliate links via API, but we can enforce the tag
            const tag = this.configService.get('amazon.partnerTag');
            if (rawUrl.includes('tag=')) return rawUrl;
            const separator = rawUrl.includes('?') ? '&' : '?';
            return `${rawUrl}${separator}tag=${tag}`;
        }

        if (v === 'temu') {
            const aid = this.configService.get('affiliation.temuId');
            // Temu logical structure (example)
            return `${rawUrl}&_x_sessn_id=${aid}`;
        }

        if (v === 'shein') {
            const aid = this.configService.get('affiliation.sheinId');
            return `${rawUrl}?aff_id=${aid}`;
        }

        // Default: return raw if no specific strategy
        return rawUrl;
    }
}
