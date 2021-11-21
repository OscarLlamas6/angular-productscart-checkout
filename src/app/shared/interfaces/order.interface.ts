export interface Order {
    id: number,
    name: string,
    date: string,
    shippingAddress: string,
    city: string,
    pickup: boolean,
}

export interface Detail {
    productId: number,
    productName: string,
    quantity: number,
}

export interface DetailOrder {
    id?: number,
    orderId: number,
    details: Detail[],
}