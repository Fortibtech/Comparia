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
var TemuStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheinStrategy = exports.TemuStrategy = void 0;
const common_1 = require("@nestjs/common");
const affiliation_service_1 = require("../../affiliation/affiliation.service");
const axios_1 = require("axios");
const cheerio = require("cheerio");
let TemuStrategy = TemuStrategy_1 = class TemuStrategy {
    constructor(affiliation) {
        this.affiliation = affiliation;
        this.name = 'Temu';
        this.logger = new common_1.Logger(TemuStrategy_1.name);
    }
    async search(query) {
        const searchUrl = `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(query)}`;
        try {
            const { data } = await axios_1.default.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            const results = [];
            $('.goods-item').each((i, el) => {
                if (i > 5)
                    return;
                const title = $(el).find('h3').text().trim();
                const priceTxt = $(el).find('[class*="price"]').first().text().trim();
                const price = parseFloat(priceTxt.replace(/[^0-9,.]/g, '').replace(',', '.'));
                const img = $(el).find('img').attr('src');
                const link = $(el).find('a').attr('href');
                if (title && price) {
                    results.push({
                        id: `temu-${i}`,
                        title,
                        price,
                        imageUrl: img || '',
                        currency: 'EUR',
                        vendorName: 'Temu',
                        productUrl: this.affiliation.getAffiliateUrl('temu', link.startsWith('http') ? link : `https://temu.com${link}`)
                    });
                }
            });
            if (results.length === 0)
                throw new Error('No DOM parsing matches');
            return results;
        }
        catch (e) {
            this.logger.warn(`Temu Scraping failed (${e.message}). Returning DeepLink fallback.`);
            return [{
                    id: 'temu-search-link',
                    title: `Voir les résultats pour "${query}" sur Temu`,
                    price: 0,
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Muji-Temu-Logo.svg/1200px-Muji-Temu-Logo.svg.png',
                    currency: 'EUR',
                    vendorName: 'Temu',
                    productUrl: this.affiliation.getAffiliateUrl('temu', searchUrl)
                }];
        }
    }
};
exports.TemuStrategy = TemuStrategy;
exports.TemuStrategy = TemuStrategy = TemuStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [affiliation_service_1.AffiliationService])
], TemuStrategy);
let SheinStrategy = class SheinStrategy {
    constructor(affiliation) {
        this.affiliation = affiliation;
        this.name = 'Shein';
    }
    async search(query) {
        const searchUrl = `https://fr.shein.com/pdsearch/${encodeURIComponent(query)}`;
        return [{
                id: 'shein-search-link',
                title: `Voir les résultats Shein pour "${query}"`,
                price: 0,
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Shein-Logo-300x158.png/640px-Shein-Logo-300x158.png',
                currency: 'EUR',
                vendorName: 'Shein',
                productUrl: this.affiliation.getAffiliateUrl('shein', searchUrl)
            }];
    }
};
exports.SheinStrategy = SheinStrategy;
exports.SheinStrategy = SheinStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [affiliation_service_1.AffiliationService])
], SheinStrategy);
//# sourceMappingURL=scrapers.strategy.js.map