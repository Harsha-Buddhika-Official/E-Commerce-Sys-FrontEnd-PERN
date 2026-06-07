import { getBanners } from '../api/banner.api.js';
import { handleServiceError } from '../../../../../utils/serviceError.js';

export const fetchBanners = async () => {
    try {
        const response = await getBanners();

        return response.data || [];
    } catch (error) {
        throw handleServiceError(error, 'Failed to fetch banners', {
            service: 'banner',
            operation: 'fetchBanners'
        });
    }
};