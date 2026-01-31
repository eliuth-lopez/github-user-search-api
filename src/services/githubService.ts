import axios from 'axios';
import { GithubError } from '../shared/customErrors';
import { GithubSearchParams, GithubSearchResponse } from '../shared/customInterfaces';


const getAuthHeader = (): { Authorization?: string } => {
    const token = process.env.GITHUB_API_TOKEN;
    if (token) {
        return { Authorization: `Bearer ${token}` };
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

        if (queryParams.sponsor) {
            q += ` in:sponsorable`;
        }

        if (queryParams.repos) {
            q += ` repos:${queryParams.repos}`;
        }

        if (queryParams.followers) {
            q += ` followers:${queryParams.followers}`;
        }

        if (queryParams.type) {
            q += ` type:${queryParams.type}`;
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

        const response = await axios.get<GithubSearchResponse>(`${process.env.GITHUB_API_URL}search/users`, {
            headers: getAuthHeader(),
            params
        });

        return { ...response.data, query_interpreted: q };
    } catch (error: any) {
        throw new GithubError('Error in githubService.searchUsers', error);
    }
};
