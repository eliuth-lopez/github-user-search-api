import { Request, Response } from 'express';
import { searchUsers as searchGithubUsers } from '../services/githubService';

interface SearchBody {
    query: string;
    limit?: number;
}

export const searchUsers = async (req: Request<{}, {}, SearchBody>, res: Response) => {
    try {
        const { query, limit } = req.body;

        // Validar que al menos un criterio de búsqueda exista
        if (!query) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'At least one search criteria (query) must be provided'
            });
            return;
        }

        const data = await searchGithubUsers({
            q: query,
            per_page: limit || 10
        });

        res.json({
            success: true,
            total_count: data.total_count,
            items: data.items
        });

    } catch (error: any) {
        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.statusText,
                message: error.response.data.message
            });
            return;
        }
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
