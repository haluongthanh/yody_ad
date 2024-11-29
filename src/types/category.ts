interface CategoryType {
    id: number;
    name: string;
    slug: string;
    status: number;
    created_time: Date;
    updated_time: Date;
    created_by: bigint;
    updated_by: bigint;

}


export type { CategoryType };   