import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema, source: "body" | "params" | "query" = "body") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        
        if (!result.success) {
            res.status(400).json({
                error: "Datos inválidos",
                detalles: result.error.issues.map(e => ({
                    campo: e.path.join("."),
                    mensaje: e.message
                }))
            });
            return;
        }
        
        next();
    };
};