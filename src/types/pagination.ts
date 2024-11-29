interface Pagination{
    page: number;
    limit: number;
    total: number;
    data: any[];
}

export type IPagination = Pagination;