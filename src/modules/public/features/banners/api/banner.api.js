import API from '../../../../../api/client.js';

export const getImageBanners = async () => {
    const response = await API.get('/banners/public/images');
    return response.data;
};

export const getVideoBanners = async () => {
    const response = await API.get('/banners/public/video');
    return response.data;
};