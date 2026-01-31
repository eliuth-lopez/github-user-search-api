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
