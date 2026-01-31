
export interface SuccessResponse {
    status: string;
    message: string;
    meta: any;
    data: any;
}


export interface ErrorResponse {
    status: string;
    message: string;
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