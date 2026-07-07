// E-commerce product types

export type Category = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
};

export type ProductImage = {
    id: number;
    product_id: number;
    path: string;
    sort_order: number;
};

export type Product = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    thumbnail: string | null;
    is_active: boolean;
    category?: Category;
    images?: ProductImage[];
    created_at: string;
    updated_at: string;
};

export type CartItemData = {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        thumbnail: string | null;
        category?: Category;
    } | null;
};

export type Address = {
    id: number;
    user_id: number;
    label: string;
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
};

export type OrderItemData = {
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
};

export type OrderData = {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    notes: string | null;
    payment_method?: string;
    payment_status?: string;
    address: Address | null;
    items: OrderItemData[];
    created_at: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

export type ProductFilters = {
    category: string;
    search: string;
};

