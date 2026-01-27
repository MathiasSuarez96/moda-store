import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string }; 

    const usuario = await prisma.usuario.findUnique({
      where: {id: decoded.id}
    });
    
    if(!usuario) {
      return res.status(401).json({error: "Usuario no encontrado"}); 
    }
    
    req.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };
    
    next();
    
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};