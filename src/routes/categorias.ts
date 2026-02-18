import {Router} from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "../middlewares/validate";
import { crearCategoriaSchema } from "../schema/categoria.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();
const prisma = new PrismaClient();

//Obtener todas las categorias
router.get("/" , async( req , res ) => {
    try {
        const categorias = await prisma.categoria.findMany();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
});

//Obtener categoria por id
router.get("/:id" , async (req , res) => {
    try {
        const {id} = req.params;
        const categoria = await prisma.categoria.findUnique({
        where: {id: Number(id)}
        });
        if (!categoria) {
            return res.status(404).json({error: "Categoria no encontrada"});
        }
        res.json(categoria);
    } catch (error) {
        res.status(500).json({error: "Error al encontrar categoria"});
    }
});

//Para crear categoria
router.post("/" , validate(crearCategoriaSchema), async(req , res) => {
     try {
        const {nombre} = req.body;
        const categoria  = await prisma.categoria.create({
           data: {nombre} 
        });
        res.status(201).json(categoria);
     } catch(error) {
        res.status(500).json({error: "Error al crear categoria"});
     }
});

//Actualizar categoria
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Buscar si existe
        const categoriaExiste = await prisma.categoria.findUnique({
            where: { id: Number(id) }
        });

        if (!categoriaExiste) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        const categoriaActualizada = await prisma.categoria.update({
    where: { id: Number(id) },
    data: { nombre }
});
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar categoría" });
    }
});

//Eliminar categoria
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const categoriaExiste = await prisma.categoria.findUnique({
            where: { id: Number(id) },
        });
        
        if (!categoriaExiste) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        // Primero eliminar los productos asociados
        await prisma.producto.deleteMany({
            where: { categoriaId: Number(id) },
        });

        // Después eliminar la categoría
        await prisma.categoria.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar categoría" });
    }
});

export default router;