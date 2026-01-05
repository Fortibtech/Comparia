import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVendorStrategy, SearchResult } from '../strategies';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class AmazonStrategy implements IVendorStrategy {
    name = 'Amazon';
    private readonly logger = new Logger(AmazonStrategy.name);

    constructor(private configHelper: ConfigService) { }

    async search(query: string): Promise<SearchResult[]> {
        const accessKey = this.configHelper.get('amazon.accessKey');
        const secretKey = this.configHelper.get('amazon.secretKey');
        const partnerTag = this.configHelper.get('amazon.partnerTag');
        const host = this.configHelper.get('amazon.host') || 'webservices.amazon.fr';
        const region = this.configHelper.get('amazon.region') || 'eu-west-1';

        if (!accessKey || !secretKey || !partnerTag) {
            this.logger.warn('Amazon credentials missing. Returning empty.');
            return [];
        }

        const path = '/paapi5/searchitems';
        const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';

        // Payload
        const payload = {
            Keywords: query,
            Resources: [
                'Images.Primary.Medium',
                'ItemInfo.Title',
                'Offers.Listings.Price',
                'ItemInfo.ExternalIds'
            ],
            PartnerTag: partnerTag,
            PartnerType: 'Associates',
            Marketplace: 'www.amazon.fr'
        };

        const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
        const dateStamp = amzDate.substr(0, 8);

        // Canonical Request
        const method = 'POST';
        const canonicalUri = path;
        const canonicalQuerystring = '';
        const canonicalHeaders = `content-encoding:amz-1.0\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:${target}\n`;
        const signedHeaders = 'content-encoding;host;x-amz-date;x-amz-target';
        const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
        const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

        // String to Sign
        const algorithm = 'AWS4-HMAC-SHA256';
        const credentialScope = `${dateStamp}/${region}/ProductAdvertisingAPI/aws4_request`;
        const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

        // Signing Key
        const kDate = this.hmac(`AWS4${secretKey}`, dateStamp);
        const kRegion = this.hmac(kDate, region);
        const kService = this.hmac(kRegion, 'ProductAdvertisingAPI');
        const kSigning = this.hmac(kService, 'aws4_request');
        const signature = this.hmac(kSigning, stringToSign, 'hex');

        const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        try {
            const response = await axios.post(`https://${host}${path}`, payload, {
                headers: {
                    'content-encoding': 'amz-1.0',
                    'host': host,
                    'x-amz-date': amzDate,
                    'x-amz-target': target,
                    'Authorization': authorizationHeader,
                    'Content-Type': 'application/json; charset=utf-8',
                }
            });

            // Transform Response
            const items = response.data?.SearchResult?.Items || [];
            return items.map((item: any) => ({
                id: item.ASIN,
                title: item.ItemInfo?.Title?.DisplayValue || 'Titre Inconnu',
                imageUrl: item.Images?.Primary?.Medium?.URL || '',
                price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
                currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'EUR',
                vendorName: 'Amazon',
                productUrl: item.DetailPageURL, // Affiliation tag is already inside if PartnerTag was valid
            }));

        } catch (error) {
            this.logger.error(`Amazon API Error: ${error.response?.data?.Errors?.[0]?.Message || error.message}`);
            return [];
        }
    }

    private hmac(key: string | Buffer, data: string, encoding: 'hex' | 'buffer' = 'buffer'): any {
        return crypto.createHmac('sha256', key).update(data).digest(encoding as any);
    }
}
