
export interface SuccessResponse {
    status: string;
    message: string;
    meta: any;
    data: any;
}


export interface ErrorResponse {
    status: string;
    message: string;
    warnings?: ValidationWarning[];
    code: number;
}

export interface SearchRequest {
    query: string;
    limit?: number;
}

export interface ValidationWarning {
    param: string;
    message: string;
}

export interface GithubSearchParams {
    q?: string;
    username?: string;
    location?: string;
    language?: string;
    sponsor?: boolean;
    repos?: string;
    followers?: string;
    type?: string;
    per_page?: number | string;
    page?: number | string;
}

export interface GithubSearchResponse {
    query_interpreted: string;
    total_count: number;
    incomplete_results: boolean;
    items: any[];
}
