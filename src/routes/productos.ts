import { Router, type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { validate } from "../middlewares/validate";
import { crearProductoSchema } from "../schema/producto.schema";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const productos = await prisma.producto.findMany({
            include: { categoria: true, talles: true },
        });
        res.json(productos);
    } catch {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const producto = await prisma.producto.findUnique({
            where: { id: Number(id) },
            include: { categoria: true, talles: true },
        });
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(producto);
    } catch {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.get("/categoria/:categoriaId", async (req: Request, res: Response) => {
    try {
        const { categoriaId } = req.params;
        const productos = await prisma.producto.findMany({
            where: { categoriaId: Number(categoriaId) },
            include: { categoria: true, talles: true },
        });
        res.json(productos);
    } catch {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

router.post(
    "/",
    authMiddleware,
    isAdmin,
    validate(crearProductoSchema),
    async (req: Request, res: Response) => {
        try {
            const { nombre, descripcion, precio, imagen, stock, categoriaId } = req.body;

            const categoriaExist = await prisma.categoria.findUnique({
                where: { id: categoriaId },
            });
            if (!categoriaExist) {
                return res.status(404).json({ error: "Categoria no encontrada" });
            }

            const producto = await prisma.producto.create({
                data: {
                    nombre,
                    descripcion,
                    precio,
                    imagen: imagen || "https://via.placeholder.com/400x400?text=Producto",
                    stock: stock || 0,
                    categoriaId,
                },
            });
            res.status(201).json(producto);
        } catch {
            res.status(500).json({ error: "Error al crear producto" });
        }
    }
);

router.put("/:id", authMiddleware, isAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, imagen, stock, categoriaId } = req.body;

        const productoExiste = await prisma.producto.findUnique({
            where: { id: Number(id) },
        });
        if (!productoExiste) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const productoActualizado = await prisma.producto.update({
            where: { id: Number(id) },
            data: { nombre, descripcion, precio, imagen, stock, categoriaId },
        });
        res.json(productoActualizado);
    } catch {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:id", authMiddleware, isAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productoExiste = await prisma.producto.findUnique({
            where: { id: Number(id) },
        });
        if (!productoExiste) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await prisma.talle.deleteMany({ where: { productoId: Number(id) } });
        await prisma.producto.delete({ where: { id: Number(id) } });

        res.json({ message: "Producto eliminado correctamente" });
    } catch {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
