import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { AffiliationService } from './affiliation/affiliation.service';
import { AmazonStrategy } from './search/strategies/amazon.strategy';
import { CdiscountStrategy } from './search/strategies/cdiscount.strategy';
import { TemuStrategy, SheinStrategy } from './search/strategies/scrapers.strategy';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
    ],
    controllers: [SearchController],
    providers: [
        SearchService,
        AffiliationService,
        AmazonStrategy,
        CdiscountStrategy,
        TemuStrategy,
        SheinStrategy,
        ConfigService // Explicitly providing if not global, but isGlobal: true handles it
    ],
})
export class AppModule { }
