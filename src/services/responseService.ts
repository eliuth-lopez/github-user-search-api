

import { SuccessResponse, ErrorResponse } from "../shared/customInterfaces";
import { AuthenticationError } from "../shared/customErrors";


/**
 * Error Response Handler
 * @param error Error object
 * @returns Error response object
 */
export function ErrorResponse(error: Error | AuthenticationError): ErrorResponse {


    if (error instanceof AuthenticationError) {
        return {
            status: "error",
            message: error.message,
            code: 401,
        }
    }

    return {
        status: "error",
        message: "Unknown error",
        code: 500,
    }
}

/**
 * Success Response Handler
 * @param meta Metadata of the response
 * @param data Data to return
 * @returns Success response object
 */
export function SuccessResponse(meta: any, data: any): SuccessResponse {
    return {
        status: "success",
        message: "Search processed successfully",
        meta: meta,
        data: data
    };
}