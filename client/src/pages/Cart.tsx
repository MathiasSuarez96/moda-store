import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const formatPrice = (price: number) =>
  '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(price);

export default function Cart() {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-zinc-600 text-sm uppercase tracking-widest mb-6">
          Tu carrito está vacío
        </p>
        <Link to="/" className="text-xs text-white underline underline-offset-4 uppercase tracking-widest hover:text-zinc-300 transition-colors">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">Carrito</h1>
        <p className="text-zinc-600 text-xs uppercase tracking-widest mb-10">
          {count} {count === 1 ? 'producto' : 'productos'}
        </p>

        <div className="divide-y divide-zinc-950">
          {items.map(item => (
            <div
              key={`${item.producto.id}-${item.talle}`}
              className="flex gap-5 py-6"
            >
              <Link to={`/producto/${item.producto.id}`} className="w-20 h-20 bg-zinc-900 flex-shrink-0 overflow-hidden">
                <img
                  src={item.producto.imagen}
                  alt={item.producto.nombre}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/80x80?text=?';
                  }}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{item.producto.nombre}</h3>
                <p className="text-[11px] text-zinc-600 mt-0.5 uppercase tracking-wider">
                  Talle: {item.talle}
                </p>
                <p className="text-sm font-semibold mt-2 tabular-nums">
                  {formatPrice(item.producto.precio * item.cantidad)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between gap-3">
                <button
                  onClick={() => removeItem(item.producto.id, item.talle)}
                  className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors"
                >
                  Quitar
                </button>
                <div className="flex items-center border border-zinc-900">
                  <button
                    onClick={() => updateQuantity(item.producto.id, item.talle, item.cantidad - 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="text-sm w-6 text-center tabular-nums">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.producto.id, item.talle, item.cantidad + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-900">
          <div className="flex justify-between items-baseline mb-8">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Total</span>
            <span className="text-3xl font-bold tabular-nums">{formatPrice(total)}</span>
          </div>
          <button
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
            className="w-full bg-white text-black py-4 text-xs font-semibold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            {user ? 'Confirmar pedido' : 'Iniciar sesión para comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}
