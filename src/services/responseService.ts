

import { SuccessResponse, ErrorResponse } from "../shared/customInterfaces";
import { AuthenticationError, GithubError, ValidationError } from "../shared/customErrors";


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


    if (error instanceof ValidationError) {
        console.log("Validation Error", error.message)
        return {
            status: "error",
            message: "Invalid request",
            warnings: error.warnings || [],
            code: 400,
        }
    }

    if (error instanceof GithubError) {
        console.log("Github Error", error)
        return {
            status: "error",
            message: "Github API error",
            code: 500,
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