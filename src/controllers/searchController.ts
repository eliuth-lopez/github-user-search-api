import { Request, Response } from 'express';
import { searchUsers as searchGithubUsers } from '../services/githubService';
import { validateSearchRequest } from '../shared/validators';
import { ErrorResponse, SuccessResponse } from '../services/responseService';

interface SearchBody {
    query: string;
    limit?: number;
}

export const searchUsers = async (req: Request<{}, {}, SearchBody>, res: Response) => {
    try {
        const { query, limit } = validateSearchRequest(req.body);

        const data = await searchGithubUsers({
            q: query,
            per_page: limit || 10
        });

        res.status(200).json(SuccessResponse({
            total_found_on_github: data.total_count,
            query_interpreted: query
        }, data.items));

    } catch (error: any) {
        const result = ErrorResponse(error);
        res.status(result.code).json(result);
    }
};
