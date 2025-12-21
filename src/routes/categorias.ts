import {Router} from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "../middlewares/validate";
import { crearCategoriaSchema } from "../schema/categoria.schema";

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

export default router;