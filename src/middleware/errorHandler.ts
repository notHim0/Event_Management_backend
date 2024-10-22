import AppError from "../AppError";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export default function (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {

    if (error instanceof ZodError) {
        return res.status(400).json({
            status: "error",
            data: null,
            error: {
                code: "VALIDATION_ERROR",
                errors: error.errors.map((e) => ({
                    path: e.path.join("."),
                    message: e.message
                }))
            }
        })

    }

    if (error instanceof AppError) {
        console.log("app error")
        return res.status(error.statusCode).json({
            status: "error",
            data: null,
            error: {
                code: error.errorCode,
                message: error.message
            }
        })
    }

    console.log(error);
    res.status(500).json({
        status: "error",
        data: null,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something Unexpected Happended",
        }
    })

}