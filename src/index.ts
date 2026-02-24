import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productosRoutes from "./routes/productos";
import categoriasRoutes from "./routes/categorias";
import authRouter from "./routes/auth.routes";
import ordenRouter from "./routes/orden";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API ecommerce funcionando!" });
});

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/auth" , authRouter);
app.use("/api/ordenes" , ordenRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});