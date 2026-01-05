"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AmazonStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const axios_1 = require("axios");
let AmazonStrategy = AmazonStrategy_1 = class AmazonStrategy {
    constructor(configHelper) {
        this.configHelper = configHelper;
        this.name = 'Amazon';
        this.logger = new common_1.Logger(AmazonStrategy_1.name);
    }
    async search(query) {
        var _a, _b, _c, _d, _e, _f;
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
        const method = 'POST';
        const canonicalUri = path;
        const canonicalQuerystring = '';
        const canonicalHeaders = `content-encoding:amz-1.0\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:${target}\n`;
        const signedHeaders = 'content-encoding;host;x-amz-date;x-amz-target';
        const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
        const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
        const algorithm = 'AWS4-HMAC-SHA256';
        const credentialScope = `${dateStamp}/${region}/ProductAdvertisingAPI/aws4_request`;
        const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;
        const kDate = this.hmac(`AWS4${secretKey}`, dateStamp);
        const kRegion = this.hmac(kDate, region);
        const kService = this.hmac(kRegion, 'ProductAdvertisingAPI');
        const kSigning = this.hmac(kService, 'aws4_request');
        const signature = this.hmac(kSigning, stringToSign, 'hex');
        const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        try {
            const response = await axios_1.default.post(`https://${host}${path}`, payload, {
                headers: {
                    'content-encoding': 'amz-1.0',
                    'host': host,
                    'x-amz-date': amzDate,
                    'x-amz-target': target,
                    'Authorization': authorizationHeader,
                    'Content-Type': 'application/json; charset=utf-8',
                }
            });
            const items = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.SearchResult) === null || _b === void 0 ? void 0 : _b.Items) || [];
            return items.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return ({
                    id: item.ASIN,
                    title: ((_b = (_a = item.ItemInfo) === null || _a === void 0 ? void 0 : _a.Title) === null || _b === void 0 ? void 0 : _b.DisplayValue) || 'Titre Inconnu',
                    imageUrl: ((_e = (_d = (_c = item.Images) === null || _c === void 0 ? void 0 : _c.Primary) === null || _d === void 0 ? void 0 : _d.Medium) === null || _e === void 0 ? void 0 : _e.URL) || '',
                    price: ((_j = (_h = (_g = (_f = item.Offers) === null || _f === void 0 ? void 0 : _f.Listings) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.Price) === null || _j === void 0 ? void 0 : _j.Amount) || 0,
                    currency: ((_o = (_m = (_l = (_k = item.Offers) === null || _k === void 0 ? void 0 : _k.Listings) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.Price) === null || _o === void 0 ? void 0 : _o.Currency) || 'EUR',
                    vendorName: 'Amazon',
                    productUrl: item.DetailPageURL,
                });
            });
        }
        catch (error) {
            this.logger.error(`Amazon API Error: ${((_f = (_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.Errors) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.Message) || error.message}`);
            return [];
        }
    }
    hmac(key, data, encoding = 'buffer') {
        return crypto.createHmac('sha256', key).update(data).digest(encoding);
    }
};
exports.AmazonStrategy = AmazonStrategy;
exports.AmazonStrategy = AmazonStrategy = AmazonStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AmazonStrategy);
//# sourceMappingURL=amazon.strategy.js.map