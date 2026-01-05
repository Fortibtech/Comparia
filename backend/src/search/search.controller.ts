import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    async search(@Query('q') query: string) {
        if (!query || query.length < 2) {
            throw new BadRequestException('Parameter "q" missing or too short');
        }
        const results = await this.searchService.searchProducts(query);
        return {
            success: true,
            data: results
        };
    }
}
