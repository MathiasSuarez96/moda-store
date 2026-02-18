import {Request , Response , NextFunction} from "express";

export const isAdmin = (req: Request , res: Response , next: NextFunction) => {
    if(!req.user) {
        return res.status(401).json({error: "No autenticado"});
    }

    if(req.user.rol !== "ADMIN") {
        return res.status(403).json({error: "No tiene permiso"});
    }
    next();
}