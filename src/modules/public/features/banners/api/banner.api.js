import API from '../../../../../api/client.js';

export const getBanners = async () => {
    const response = await API.get('/banners/public/images');
    return response.data;
};