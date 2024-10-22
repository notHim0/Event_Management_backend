export default class AppError extends Error {
    errorCode: string;
    statusCode: number;
    constructor(errorMessage: string, errorCode: string, statusCode: number) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
