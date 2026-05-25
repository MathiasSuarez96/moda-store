import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { Producto, Orden } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Producto[]>('/productos'),
      api.get<Orden[]>('/ordenes'),
    ]).then(([prods, ords]) => {
      setProductCount(prods.length);
      setOrderCount(ords.length);
    });
  }, []);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1">Admin panel</p>
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">Dashboard</h1>
        <p className="text-zinc-600 text-sm mb-10">Bienvenido, {user?.nombre}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            to="/admin/productos"
            className="bg-zinc-950 border border-zinc-900 p-8 hover:border-zinc-700 transition-colors group"
          >
            <p className="text-5xl font-bold tabular-nums mb-3">
              {productCount ?? '—'}
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Productos</p>
            <p className="text-xs text-zinc-700 mt-1 group-hover:text-zinc-500 transition-colors">
              Gestionar →
            </p>
          </Link>
          <Link
            to="/admin/ordenes"
            className="bg-zinc-950 border border-zinc-900 p-8 hover:border-zinc-700 transition-colors group"
          >
            <p className="text-5xl font-bold tabular-nums mb-3">
              {orderCount ?? '—'}
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Órdenes</p>
            <p className="text-xs text-zinc-700 mt-1 group-hover:text-zinc-500 transition-colors">
              Ver todas →
            </p>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/productos"
            className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
          >
            + Nuevo producto
          </Link>
          <Link
            to="/admin/ordenes"
            className="px-6 py-3 border border-zinc-800 text-xs uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-colors"
          >
            Ver órdenes
          </Link>
        </div>
      </div>
    </div>
  );
}
