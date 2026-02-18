import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { crearOrdenSchema, CrearOrden } from "../schema/orden.schema";

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

export default router;