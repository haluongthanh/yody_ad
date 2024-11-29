interface Variant {
    id: number;
    product_id: number;
    color_id: number;
    size_id: number;
    stock: number;
    status: number;
    warehouse_id: number;
    created_time: Date;
    updated_time: Date;
    created_by: number;
    updated_by: number;
}

export type variant = Variant


