import axios from 'axios';

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken || '',
    },
});

export const getPortfolioData = async () => {
    try {
        const response = await api.get('/api/portfolio-data');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
        throw error;
    }
};

export const sendContactMessage = async (payload) => {
    const response = await api.post('/contact', payload);
    return response.data;
};

export default api;
