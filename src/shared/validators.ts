import { z } from 'zod';
import { ValidationError } from './customErrors';
import { SearchRequest } from './customInterfaces';

export const searchRequestValidator = z.object({
    query: z.string(),
    limit: z.number().optional(),
    page: z.number().optional()
});


export function validateSearchRequest(request: SearchRequest) {
    const result = searchRequestValidator.safeParse(request);
    if (!result.success) {
        const warnings = result.error.issues.map((issue: any) => {
            return {
                param: issue.path[0],
                message: `${issue.path[0]} must be ${issue.expected}`
            }
        })

        console.log(warnings)
        throw new ValidationError("Invalid Request", warnings);
    }
    return result.data;
}