import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { crearOrdenSchema, CrearOrden } from "../schema/orden.schema";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();
const prisma = new PrismaClient();

//Crear orden de compra
router.post("/", authMiddleware, validate(crearOrdenSchema), async (req, res) => {
    try {
        // 1. Sacar datos: items del body, usuarioId del token
        const { items } = req.body as CrearOrden;
        const usuarioId = req.user!.id;

        // 2. Verificar que los productos existan en la BD
        const productosExist = await prisma.producto.findMany({
            where: { id: { in: items.map(item => item.productoId) } }
        });

        if (productosExist.length !== items.length) {
            return res.status(404).json({ error: "Uno o más productos no encontrados" });
        }

        // 3. Cruzar items del usuario con precios reales de la BD
        const itemsConPrecio = items.map(item => {
            const producto = productosExist.find(p => p.id === item.productoId);
            return {
                productoId: item.productoId,
                talle: item.talle,
                cantidad: item.cantidad,
                precio: producto!.precio * item.cantidad
            };
        });

        // 4. Calcular el total sumando todos los items
        const total = itemsConPrecio.reduce((sum, item) => sum + item.precio, 0);

        // 5. Crear la orden con sus items en una sola operación
        const orden = await prisma.orden.create({
            data: {
                usuarioId,
                total,
                items: {
                    create: itemsConPrecio
                }
            }
        });

        res.status(201).json(orden);

    } catch (error) {
        res.status(500).json({ error: "Error al crear la orden" });
    }
});

//Conseguir tus ordenes vs verlas todas admin

router.get("/", authMiddleware, async (req, res) => {
    try {
        let ordenes

        if (req.user!.rol === "ADMIN") {
            ordenes = await prisma.orden.findMany()
        } else {
            ordenes = await prisma.orden.findMany({ where: { usuarioId: req.user!.id } })
        }
        
        res.json(ordenes)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener órdenes" })
    }
});

//Actualizar estado de ordenes

router.put("/:id" , isAdmin , async (req ,res) => {
    try {
        const {id} = req.params;
        const { estado } = req.body;

        const estadoActualizado = await prisma.orden.update({
            where: {id: Number(id) },
            data : {estado},
        });
        res.json(estadoActualizado);

    } catch (error) {
        res.status(500).json({error: "Error al actualizar el estado de la orden"});
    }
 
});

//Eliminar una orden
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const ordenExiste = await prisma.orden.findUnique({
            where: { id: Number(id) },
        });
        
        if (!ordenExiste) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        
        await prisma.orden.delete({
            where: { id: Number(id) },
        });
        
        res.json({ message: "Orden eliminada correctamente" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar la orden" });
    }
});

export default router;