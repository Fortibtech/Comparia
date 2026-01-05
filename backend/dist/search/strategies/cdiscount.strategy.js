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
var CdiscountStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdiscountStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const affiliation_service_1 = require("../../affiliation/affiliation.service");
const axios_1 = require("axios");
let CdiscountStrategy = CdiscountStrategy_1 = class CdiscountStrategy {
    constructor(config, affiliationService) {
        this.config = config;
        this.affiliationService = affiliationService;
        this.name = 'Cdiscount';
        this.logger = new common_1.Logger(CdiscountStrategy_1.name);
    }
    async search(query) {
        var _a;
        const apiKey = this.config.get('cdiscount.apiKey');
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
            const response = await axios_1.default.post('https://api.cdiscount.com/OpenApi/json/Search', payload);
            const items = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.Products) || [];
            return items.map((p) => {
                var _a;
                const originalUrl = `https://www.cdiscount.com/dp/${p.Id}`;
                return {
                    id: p.Id,
                    title: p.Name,
                    imageUrl: p.MainImageUrl,
                    price: parseFloat(((_a = p.BestOffer) === null || _a === void 0 ? void 0 : _a.SalePrice) || '0'),
                    currency: 'EUR',
                    vendorName: 'Cdiscount',
                    productUrl: this.affiliationService.getAffiliateUrl('cdiscount', originalUrl),
                    rating: 4.0
                };
            });
        }
        catch (error) {
            this.logger.error(`Cdiscount Error: ${error.message}`);
            return [];
        }
    }
};
exports.CdiscountStrategy = CdiscountStrategy;
exports.CdiscountStrategy = CdiscountStrategy = CdiscountStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        affiliation_service_1.AffiliationService])
], CdiscountStrategy);
//# sourceMappingURL=cdiscount.strategy.js.map