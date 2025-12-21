import {z} from "zod";

//Schema para validar id params
export const categoriaIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});

//Schema para crear categoria
export const crearCategoriaSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50)
});

//Tipos inferidos de los Schemas
export type CategoriaId = z.infer<typeof categoriaIdSchema>;
export type CrearCategoria = z.infer<typeof crearCategoriaSchema>;