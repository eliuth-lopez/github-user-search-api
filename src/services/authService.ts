import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../shared/customErrors";
import { ErrorResponse } from "../services/responseService";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET;

export function auth(request: Request, response: Response, next: NextFunction) {

    const token = request.headers['authorization']

    if (!token) {
        const error = new AuthenticationError('Token is required');
        const result = ErrorResponse(error);
        return response.status(result.code).json(result);
    }

    try {
        const tokenString = token.toString();
        const decoded = jwt.verify(tokenString, SECRET!);
        request.headers['user'] = decoded.toString();
    } catch {
        const authError = new AuthenticationError('Invalid token');
        const result = ErrorResponse(authError);
        return response.status(result.code).json(result);
    }

    next();
}