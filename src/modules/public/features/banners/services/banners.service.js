import { getImageBanners, getVideoBanners } from '../api/banner.api.js';
import { handleServiceError } from '../../../../../utils/serviceError.js';

export const fetchImageBanners = async () => {
    try {
        const response = await getImageBanners();

        return response.data || [];
    } catch (error) {
        throw handleServiceError(error, 'Failed to fetch image banners', {
            service: 'banner',
            operation: 'fetchImageBanners'
        });
    }
};

export const fetchVideoBanners = async () => {
    try {
        const response = await getVideoBanners();

        return response.data || [];
    } catch (error) {
        throw handleServiceError(error, 'Failed to fetch video banners', {
            service: 'banner',
            operation: 'fetchVideoBanners'
        });
    }
};