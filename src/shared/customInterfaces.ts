
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
