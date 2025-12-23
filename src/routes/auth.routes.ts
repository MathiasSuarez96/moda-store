import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Los campos son obligatorios"
      });
    }
    const userExist = await prisma.usuario.findUnique({
      where: { email }
    });
    if (userExist) {
      return res.status(409).json({ message: "El email ya esta registrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: "Usuario registrado",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y Password son obligatorios" });
    }
    const user = await prisma.usuario.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      "secreto123",
      { expiresIn: "1d" }
    );
    
    res.status(200).json({ 
      message: "Login exitoso",
      token
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default authRouter;