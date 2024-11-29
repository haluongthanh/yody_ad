interface ProductImage {
    id: number;
    link: string;
    product_id: number;
    color_id: number;
    status: number;
    created_time: Date;
    updated_time: Date;
    created_by: number;
    updated_by: number;
}


export type  productImage = ProductImage;