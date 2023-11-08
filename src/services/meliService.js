import axiosInstance from './axiosInstance.js';

const fetchProductPrices = async (productId) => {
  const response = await axiosInstance.get(`https://api.mercadolibre.com/items/${productId}/prices`);
  return response.data;
};

export default fetchProductPrices;
