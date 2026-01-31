import { ValidationWarning } from "./customInterfaces";

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}


export class ValidationError extends Error {
    warnings: ValidationWarning[];
    constructor(message: string, warnings: ValidationWarning[]) {
        super(message);
        this.name = "ValidationError";
        this.warnings = warnings;
    }

}

export class GithubError extends Error {
    constructor(message: string, error: any) {
        super(message);
        this.name = "GithubError";
        this.stack = error.stack
    }
}
