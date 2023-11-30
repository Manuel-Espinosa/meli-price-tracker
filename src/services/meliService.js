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