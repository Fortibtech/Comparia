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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AffiliationService = class AffiliationService {
    constructor(configService) {
        this.configService = configService;
    }
    getAffiliateUrl(vendor, rawUrl) {
        const v = vendor.toLowerCase();
        if (v === 'amazon') {
            const tag = this.configService.get('amazon.partnerTag');
            if (rawUrl.includes('tag='))
                return rawUrl;
            const separator = rawUrl.includes('?') ? '&' : '?';
            return `${rawUrl}${separator}tag=${tag}`;
        }
        if (v === 'temu') {
            const aid = this.configService.get('affiliation.temuId');
            return `${rawUrl}&_x_sessn_id=${aid}`;
        }
        if (v === 'shein') {
            const aid = this.configService.get('affiliation.sheinId');
            return `${rawUrl}?aff_id=${aid}`;
        }
        return rawUrl;
    }
};
exports.AffiliationService = AffiliationService;
exports.AffiliationService = AffiliationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AffiliationService);
//# sourceMappingURL=affiliation.service.js.map