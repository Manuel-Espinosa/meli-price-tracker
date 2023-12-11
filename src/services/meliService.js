import axiosInstance from "./axiosInstance.js";

export const fetchProductPrices = async (productId) => {
  const response = await axiosInstance.get(
    `https://api.mercadolibre.com/items/${productId}/prices`
  );
  return response.data;
};

export const fetchProductSpecs = async (productId) => {
  const queryParams = new URLSearchParams({ ids: productId }).toString();
  const response = await axiosInstance.get(
    `https://api.mercadolibre.com/items/?${queryParams}`
  );
  return response.data;
};

export const searchProductsService = async (searchString) => {
  const queryParams = new URLSearchParams({
    q: searchString,
    status: "active",
    site_id: "MLM",
  }).toString();
  const response = await axiosInstance.get(
    `https://api.mercadolibre.com/products/search?${queryParams}`
  );
  return response.data;
};

export const getProductIDService = async (productId) => {
  const response = await axiosInstance.get(
    `https://api.mercadolibre.com/items/${productId}?include_attributes=all`
  );
  console.log(response.data)
  return response.data;
};
