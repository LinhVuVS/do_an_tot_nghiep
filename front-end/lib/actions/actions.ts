export const getCollections = async () => {
    const collections = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
        cache: "no-store", // Ngăn chặn việc cache
    });
    return await collections.json();
};

export const getCollectionDetails = async (collectionId: string) => {
    const collection = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`, {
        cache: "no-store", // Ngăn chặn việc cache
    });
    return await collection.json();
};

export const getProducts = async () => {
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        cache: "no-store", // Ngăn chặn việc cache
    });
    return await products.json();
};

export const getProductDetails = async (productId: string) => {
    const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        cache: "no-store", // Ngăn chặn việc cache
    });
    return await product.json();
};

export const getSearchedProducts = async (query: string) => {
    const searchedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`);
    return await searchedProducts.json();
};

export const getOrders = async (customerId: string) => {
    const orders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`);
    return await orders.json();
};

export const getRelatedProducts = async (productId: string) => {
    const relatedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`);
    return await relatedProducts.json();
};

export const getBanner = async (bannerId: string) => {
    const banner = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${bannerId}`);
    return await banner.json();
};
