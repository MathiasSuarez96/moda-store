export interface Talle {
  id: number;
  nombre: string;
  stock: number;
  productoId: number;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categoriaId: number;
  categoria: Categoria;
  talles: Talle[];
  createdAt: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'ADMIN';
}

export interface OrdenItem {
  id: number;
  cantidad: number;
  precio: number;
  talle: string;
  productoId: number;
  producto?: Producto;
  ordenId: number;
}

export interface Orden {
  id: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  usuarioId: number;
  items: OrdenItem[];
  createdAt: string;
}

export interface CartItem {
  producto: Producto;
  talle: string;
  cantidad: number;
}
