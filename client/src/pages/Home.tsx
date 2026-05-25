import { useState, useEffect } from 'react';
import type { Producto, Categoria } from '../types';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Producto[]>('/productos'),
      api.get<Categoria[]>('/categorias'),
    ])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = categoriaId
    ? productos.filter(p => p.categoriaId === categoriaId)
    : productos;

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-zinc-950 h-64 md:h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black opacity-80" />
        <div className="relative px-6 md:px-14 pb-10 md:pb-16">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-3">
            Temporada 2025
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none">
            Nueva<br />Colección
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
          <button
            onClick={() => setCategoriaId(null)}
            className={`px-5 py-2 text-[11px] uppercase tracking-widest whitespace-nowrap transition-colors border ${
              categoriaId === null
                ? 'bg-white text-black border-white'
                : 'text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'
            }`}
          >
            Todo
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaId(cat.id)}
              className={`px-5 py-2 text-[11px] uppercase tracking-widest whitespace-nowrap transition-colors border ${
                categoriaId === cat.id
                  ? 'bg-white text-black border-white'
                  : 'text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-zinc-900" />
                <div className="mt-3 space-y-2">
                  <div className="h-2.5 bg-zinc-900 w-1/3 rounded" />
                  <div className="h-3.5 bg-zinc-900 w-2/3 rounded" />
                  <div className="h-3.5 bg-zinc-900 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-zinc-600 text-center py-20 uppercase tracking-widest text-sm">
            Sin productos en esta categoría
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
