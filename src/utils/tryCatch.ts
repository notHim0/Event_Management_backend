import { NextFunction, Request, Response } from "express";

export default function tryCatch(controllers) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controllers(req, res);
        } catch (error) {
            return next(error)
        }
    }

}