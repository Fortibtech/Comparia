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
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const amazon_strategy_1 = require("./strategies/amazon.strategy");
const cdiscount_strategy_1 = require("./strategies/cdiscount.strategy");
const scrapers_strategy_1 = require("./strategies/scrapers.strategy");
let SearchService = SearchService_1 = class SearchService {
    constructor(amazonStrategy, cdiscountStrategy, temuStrategy, sheinStrategy) {
        this.amazonStrategy = amazonStrategy;
        this.cdiscountStrategy = cdiscountStrategy;
        this.temuStrategy = temuStrategy;
        this.sheinStrategy = sheinStrategy;
        this.strategies = [];
        this.logger = new common_1.Logger(SearchService_1.name);
        this.strategies = [
            amazonStrategy,
            cdiscountStrategy,
            temuStrategy,
            sheinStrategy
        ];
    }
    async searchProducts(query) {
        this.logger.log(`Starting search for: ${query}`);
        const promises = this.strategies.map(async (strategy) => {
            try {
                const results = await strategy.search(query);
                return results;
            }
            catch (error) {
                this.logger.error(`Error fetching from ${strategy.name}`, error);
                return [];
            }
        });
        const resultsArray = await Promise.all(promises);
        const flatResults = resultsArray.flat();
        const aggregated = this.groupByProduct(flatResults);
        return aggregated.sort((a, b) => {
            if (a.bestPrice === 0)
                return 1;
            if (b.bestPrice === 0)
                return -1;
            return a.bestPrice - b.bestPrice;
        });
    }
    groupByProduct(results) {
        const map = new Map();
        results.forEach(res => {
            const slug = res.title.toLowerCase().substring(0, 20).replace(/[^a-z0-9]/g, '');
            const key = slug.length < 5 ? res.id : slug;
            if (!map.has(key)) {
                map.set(key, {
                    id: res.id,
                    title: res.title,
                    imageUrl: res.imageUrl,
                    bestPrice: res.price,
                    currency: res.currency,
                    offers: [],
                    vendorCount: 0
                });
            }
            const group = map.get(key);
            group.offers.push({
                vendor: res.vendorName,
                price: res.price,
                url: res.productUrl
            });
            if (res.price > 0 && (res.price < group.bestPrice || group.bestPrice === 0)) {
                group.bestPrice = res.price;
                group.imageUrl = res.imageUrl || group.imageUrl;
                group.title = res.title;
            }
            group.vendorCount = group.offers.length;
        });
        return Array.from(map.values());
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [amazon_strategy_1.AmazonStrategy,
        cdiscount_strategy_1.CdiscountStrategy,
        scrapers_strategy_1.TemuStrategy,
        scrapers_strategy_1.SheinStrategy])
], SearchService);
//# sourceMappingURL=search.service.js.map