import {z} from "zod";

//Schema para validar id params (GET /productos/:id)
export const productoIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});

//Schema para validar categoria de params (GET /categoria/:categoriaId)
export const categoriaIdSchema = z.object({
    categoriaId: z.string().regex(/^\d+$/, "El ID de categoría debe ser un número válido")
});

//Schema para crear un producto (lo usamos con el post)
export const crearProductoSchema = z.object({
    nombre: z.string().min(2 , "El nombre debe tener al menos 2 caracteres").max(100),
    descripcion: z.string().min(10 , "La descripcion debe tener al menos 10 caracteres").max(500),
    precio: z.number().positive("El precio debe ser mayor a 0"),
    categoriaId: z.number().int().positive("Categoria invalida"),
    imagenes: z.array(z.string().url("URL de imagen inválida")).optional(),
    talles: z.array(z.number().int().positive()).optional()
});

// Tipos inferidos de los schemas 
export type ProductoId = z.infer<typeof productoIdSchema>;
export type CategoriaId = z.infer<typeof categoriaIdSchema>;
export type CrearProducto = z.infer<typeof crearProductoSchema>;