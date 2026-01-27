import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpiar datos existentes (en orden por las relaciones)
  await prisma.ordenItem.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.talle.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("🧹 Base de datos limpiada");

  // Crear categorías
  const categorias = await Promise.all([
    prisma.categoria.create({ data: { nombre: "Remeras" } }),
    prisma.categoria.create({ data: { nombre: "Pantalones" } }),
    prisma.categoria.create({ data: { nombre: "Buzos" } }),
    prisma.categoria.create({ data: { nombre: "Zapatillas" } }),
  ]);

  console.log("📁 Categorías creadas:", categorias.length);

  // Crear productos con talles
  const productos = await Promise.all([
    // Remeras
    prisma.producto.create({
      data: {
        nombre: "Remera Básica Negra",
        descripcion: "Remera de algodón 100%, corte regular",
        precio: 15000,
        imagen: "https://via.placeholder.com/400x400?text=Remera+Negra",
        stock: 50,
        categoriaId: categorias[0].id,
        talles: {
          create: [
            { nombre: "S", stock: 10 },
            { nombre: "M", stock: 20 },
            { nombre: "L", stock: 15 },
            { nombre: "XL", stock: 5 },
          ],
        },
      },
    }),
    prisma.producto.create({
      data: {
        nombre: "Remera Estampada Urban",
        descripcion: "Remera con estampado urbano, algodón premium",
        precio: 22000,
        imagen: "https://via.placeholder.com/400x400?text=Remera+Urban",
        stock: 35,
        categoriaId: categorias[0].id,
        talles: {
          create: [
            { nombre: "S", stock: 8 },
            { nombre: "M", stock: 12 },
            { nombre: "L", stock: 10 },
            { nombre: "XL", stock: 5 },
          ],
        },
      },
    }),
    // Pantalones
    prisma.producto.create({
      data: {
        nombre: "Jean Slim Fit Azul",
        descripcion: "Jean elastizado, corte slim fit",
        precio: 45000,
        imagen: "https://via.placeholder.com/400x400?text=Jean+Azul",
        stock: 30,
        categoriaId: categorias[1].id,
        talles: {
          create: [
            { nombre: "38", stock: 5 },
            { nombre: "40", stock: 10 },
            { nombre: "42", stock: 10 },
            { nombre: "44", stock: 5 },
          ],
        },
      },
    }),
    prisma.producto.create({
      data: {
        nombre: "Jogger Negro",
        descripcion: "Pantalón jogger de frisa, ideal para el día a día",
        precio: 32000,
        imagen: "https://via.placeholder.com/400x400?text=Jogger+Negro",
        stock: 40,
        categoriaId: categorias[1].id,
        talles: {
          create: [
            { nombre: "S", stock: 10 },
            { nombre: "M", stock: 15 },
            { nombre: "L", stock: 10 },
            { nombre: "XL", stock: 5 },
          ],
        },
      },
    }),
    // Buzos
    prisma.producto.create({
      data: {
        nombre: "Buzo Oversize Gris",
        descripcion: "Buzo de frisa oversize, capucha y bolsillo canguro",
        precio: 38000,
        imagen: "https://via.placeholder.com/400x400?text=Buzo+Gris",
        stock: 25,
        categoriaId: categorias[2].id,
        talles: {
          create: [
            { nombre: "M", stock: 8 },
            { nombre: "L", stock: 10 },
            { nombre: "XL", stock: 7 },
          ],
        },
      },
    }),
    // Zapatillas
    prisma.producto.create({
      data: {
        nombre: "Zapatillas Urban Blancas",
        descripcion: "Zapatillas urbanas, suela de goma, muy cómodas",
        precio: 65000,
        imagen: "https://via.placeholder.com/400x400?text=Zapatillas+Blancas",
        stock: 20,
        categoriaId: categorias[3].id,
        talles: {
          create: [
            { nombre: "40", stock: 4 },
            { nombre: "41", stock: 5 },
            { nombre: "42", stock: 6 },
            { nombre: "43", stock: 3 },
            { nombre: "44", stock: 2 },
          ],
        },
      },
    }),
  ]);

  console.log("👕 Productos creados:", productos.length);

  // Encriptar contraseñas ANTES de crear usuarios
  const adminPassword = await bcrypt.hash("123456", 10);
  const clientePassword = await bcrypt.hash("123456", 10);

  // Crear usuarios con contraseñas encriptadas
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        email: "admin@ecommerce.com",
        password: adminPassword,
        nombre: "Admin",
        rol: "ADMIN",
      },
    }),
    prisma.usuario.create({
      data: {
        email: "cliente@gmail.com",
        password: clientePassword,
        nombre: "Juan Pérez",
        rol: "CLIENTE",
      },
    }),
  ]);

  console.log("👤 Usuarios creados:", usuarios.length);

  // Crear una orden de ejemplo
  const orden = await prisma.orden.create({
    data: {
      estado: "PAGADO",
      total: 60000,
      usuarioId: usuarios[1].id,
      items: {
        create: [
          {
            cantidad: 2,
            precio: 15000,
            talle: "M",
            productoId: productos[0].id,
          },
          {
            cantidad: 1,
            precio: 32000,
            talle: "L",
            productoId: productos[3].id,
          },
        ],
      },
    },
  });

  console.log("🛒 Orden de ejemplo creada:", orden.id);
  console.log("✅ Seed completado!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });