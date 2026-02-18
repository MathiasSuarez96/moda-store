import {z} from "zod";


//Schema para validar ordenes id

export const ordenIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});


//Schema para crear ordenes

export const crearOrdenSchema = z.object({
    items: z.array(
        z.object({
            productoId: z.number().int().positive("Producto inválido"),
            talle: z.string().min(1, "El talle es obligatorio"),
            cantidad: z.number().int().positive("La cantidad debe ser mayor a 0")
        })
    ).min(1, "Debe tener al menos un item")
});


export type CrearOrden = z.infer<typeof crearOrdenSchema>;