import { Link } from 'react-router-dom';
import type { Producto } from '../types';

const formatPrice = (price: number) =>
  '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(price);

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Link to={`/producto/${producto.id}`} className="group block">
      <div className="aspect-square bg-zinc-900 overflow-hidden">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/400x400?text=Producto';
          }}
        />
      </div>
      <div className="mt-3 space-y-0.5">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
          {producto.categoria?.nombre}
        </p>
        <h3 className="text-sm font-medium group-hover:text-zinc-300 transition-colors line-clamp-1">
          {producto.nombre}
        </h3>
        <p className="text-sm font-semibold">{formatPrice(producto.precio)}</p>
      </div>
    </Link>
  );
}
