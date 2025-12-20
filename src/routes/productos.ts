import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//Obtener todos los productos
router.get("/", async (req , res) => {
    try {
         const productos = await prisma.producto.findMany({
            include: {
                categoria: true,
                talles: true,
            },
         });
         res.json(productos);
    } catch (error) {
         res.status(500).json({error: "Error al obtener productos"});
    }
});

//Obtener productos por id
router.get("/:id" , async (req , res) => {
    try {
        const {id} = req.params;
        const producto = await prisma.producto.findUnique({
            where: {id: Number(id)},
            include: {
                categoria: true,
                talles: true,
            },
        });
        if(!producto) {
            return res.status(404).json({error: "Producto no encontrado"});
        }
        res.json(producto);
    } catch(error) {
        res.status(500).json({error: "Erorr al obtener el producto"});
    }
});

//Productos por categoria
router.get("/categoria/:categoriaId", async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const productos = await prisma.producto.findMany({
      where: { categoriaId: Number(categoriaId) },
      include: {
        categoria: true,
        talles: true,
      },
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;