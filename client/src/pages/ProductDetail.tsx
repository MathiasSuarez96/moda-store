import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Producto } from '../types';
import { api } from '../lib/api';
import { useCart } from '../contexts/CartContext';

const formatPrice = (price: number) =>
  '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(price);

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [talle, setTalle] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get<Producto>(`/productos/${id}`)
      .then(setProducto)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    if (!producto || !talle) return;
    addItem(producto, talle);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!producto) return null;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <Link to="/" className="inline-block text-[11px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest mb-8 transition-colors">
          ← Volver
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20">
          {/* Image */}
          <div className="aspect-square bg-zinc-900 overflow-hidden">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/600x600?text=Sin+imagen';
              }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              {producto.categoria?.nombre}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4 leading-tight">
              {producto.nombre}
            </h1>
            <p className="text-2xl font-semibold mb-6 tabular-nums">
              {formatPrice(producto.precio)}
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              {producto.descripcion}
            </p>

            {producto.talles && producto.talles.length > 0 && (
              <div className="mb-7">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">
                  Talle{' '}
                  {talle && <span className="text-white">— {talle}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {producto.talles.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTalle(t.nombre)}
                      disabled={t.stock === 0}
                      className={`min-w-[46px] h-11 px-3 text-sm border transition-all ${
                        t.stock === 0
                          ? 'border-zinc-900 text-zinc-800 cursor-not-allowed line-through'
                          : talle === t.nombre
                          ? 'border-white bg-white text-black font-medium'
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      {t.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={!talle || producto.stock === 0}
              className={`w-full py-4 text-xs uppercase tracking-widest font-semibold transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : talle && producto.stock > 0
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed'
              }`}
            >
              {added
                ? '✓ Agregado al carrito'
                : producto.stock === 0
                ? 'Sin stock'
                : 'Agregar al carrito'}
            </button>

            <p className="mt-5 text-[11px] text-zinc-700 uppercase tracking-widest">
              Stock: {producto.stock} unidades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
