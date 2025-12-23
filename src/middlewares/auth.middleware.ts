import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Token Requerido" });
    }
    
    const parts = authHeader.split(" ");
    
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Formato de token inválido" });
    }
    
    const token = parts[1];
    
    const decoded = jwt.verify(token, "secreto123") as { id: number; email: string };
    
    next();
    
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};