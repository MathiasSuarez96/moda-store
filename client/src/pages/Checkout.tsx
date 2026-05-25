import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { api } from '../lib/api';

const formatPrice = (price: number) =>
  '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(price);

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleCheckout() {
    setLoading(true);
    setError('');
    try {
      await api.post('/ordenes', {
        items: items.map(i => ({
          productoId: i.producto.id,
          talle: i.talle,
          cantidad: i.cantidad,
        })),
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">✓</p>
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2">¡Pedido confirmado!</h2>
          <p className="text-zinc-500 text-sm">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-zinc-600 text-sm mb-4">No hay productos en el carrito</p>
          <Link to="/" className="text-xs text-white underline uppercase tracking-widest">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-12">
        <Link to="/carrito" className="inline-block text-[11px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest mb-8 transition-colors">
          ← Carrito
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-8">Confirmar pedido</h1>

        <div className="bg-zinc-950 border border-zinc-900 p-6 mb-6">
          <h2 className="text-[11px] uppercase tracking-widest text-zinc-500 mb-5">Resumen</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={`${item.producto.id}-${item.talle}`}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-zinc-300 min-w-0">
                  <span className="truncate block">{item.producto.nombre}</span>
                  <span className="text-[11px] text-zinc-600">
                    T: {item.talle} × {item.cantidad}
                  </span>
                </span>
                <span className="text-zinc-300 tabular-nums whitespace-nowrap">
                  {formatPrice(item.producto.precio * item.cantidad)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-900 mt-5 pt-5 flex justify-between">
            <span className="text-xs font-medium uppercase tracking-widest">Total</span>
            <span className="font-bold text-lg tabular-nums">{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-white text-black py-4 text-xs font-semibold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Confirmar y pagar'}
        </button>
        <p className="text-[11px] text-zinc-700 text-center mt-3 uppercase tracking-wider">
          La orden se creará con estado pendiente
        </p>
      </div>
    </div>
  );
}
