import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string): Promise<{
        success: boolean;
        data: import("./search.service").AggegratedProduct[];
    }>;
}
