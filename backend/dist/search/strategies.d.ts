export interface SearchResult {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    currency: string;
    vendorName: string;
    productUrl: string;
    originalUrl?: string;
    rating?: number;
}
export interface IVendorStrategy {
    name: string;
    search(query: string): Promise<SearchResult[]>;
}
