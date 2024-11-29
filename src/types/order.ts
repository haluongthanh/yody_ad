interface Order {
    id: number,
    custommer_id: number,
    shipping_address: string,
    order_date: Date,
    total_amount: number,
    created_time: Date,
    order_code: string,
    status: string,
    customer_name: string,
}

export type IOrder = Order;