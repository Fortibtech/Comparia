"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    amazon: {
        accessKey: process.env.AMAZON_ACCESS_KEY,
        secretKey: process.env.AMAZON_SECRET_KEY,
        partnerTag: process.env.AMAZON_PARTNER_TAG,
        region: 'eu-west-1',
        host: 'webservices.amazon.fr'
    },
    cdiscount: {
        apiKey: process.env.CDISCOUNT_API_KEY,
        login: process.env.CDISCOUNT_LOGIN,
        password: process.env.CDISCOUNT_PASSWORD,
    },
    affiliation: {
        temuId: process.env.TEMU_AFFILIATE_ID,
        sheinId: process.env.SHEIN_AFFILIATE_ID,
    }
});
//# sourceMappingURL=configuration.js.map