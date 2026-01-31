import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

interface GithubSearchParams {
    q?: string;
    username?: string;
    location?: string;
    language?: string;
    per_page?: number | string;
    page?: number | string;
}

interface GithubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: any[]; // Using any[] for simplicity, but could be typed further if needed
}

const getAuthHeader = (): { Authorization?: string } => {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
        return { Authorization: `token ${token}` };
    }
    return {};
};

export const searchUsers = async (queryParams: GithubSearchParams): Promise<GithubSearchResponse> => {
    try {
        // Construct the query string for GitHub API
        // Format: q=keyword+qualifier:value
        let q = queryParams.q || '';

        if (queryParams.username) {
            q += ` ${queryParams.username} in:login`;
        }
        if (queryParams.location) {
            q += ` location:${queryParams.location}`;
        }
        if (queryParams.language) {
            q += ` language:${queryParams.language}`;
        }

        // Clean up query
        q = q.trim();

        if (!q) {
            throw new Error('Query parameter is required');
        }

        const params = {
            q,
            per_page: queryParams.per_page || 10,
            page: queryParams.page || 1
        };

        const response = await axios.get<GithubSearchResponse>(`${GITHUB_API_URL}/search/users`, {
            headers: getAuthHeader(),
            params
        });

        return response.data;
    } catch (error: any) {
        console.error('Error in githubService.searchUsers:', error.message);
        throw error;
    }
};
