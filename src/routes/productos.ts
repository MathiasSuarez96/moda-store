import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { validate } from "../middlewares/validate";  
import { crearProductoSchema } from "../schema/producto.schema";  

const router = Router();
const prisma = new PrismaClient();

//Obtener todos los productos
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
        res.status(500).json({error: "Error al obtener el producto"});
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

// Crear producto (solo ADMIN)
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(crearProductoSchema),  
  async(req, res) => {
    try {
        const {nombre, descripcion, precio, imagen, stock, categoriaId} = req.body;
        
        const categoriaExist = await prisma.categoria.findUnique({
            where: {id: categoriaId},
        });
        
        if(!categoriaExist) {
            return res.status(404).json({error: "Categoria no encontrada"});
        }
        
        const producto = await prisma.producto.create({
            data: {
                nombre,
                descripcion,
                precio,
                imagen: imagen || "https://via.placeholder.com/400x400?text=Producto",
                stock: stock || 0,
                categoriaId
            }
        });
        
        res.status(201).json(producto);
        
    } catch(error) {
        res.status(500).json({error: "Error al crear producto"});
    }
  }
);

export default router;