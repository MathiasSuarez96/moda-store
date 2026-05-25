import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Orden } from '../../types';
import { api } from '../../lib/api';

const formatPrice = (price: number) =>
  '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(price);

const ESTADOS = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'] as const;

const estadoColor: Record<string, string> = {
  PENDIENTE:  'text-yellow-400',
  PAGADO:     'text-green-400',
  ENVIADO:    'text-blue-400',
  ENTREGADO:  'text-emerald-400',
  CANCELADO:  'text-red-400',
};

export default function AdminOrders() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Orden[]>('/ordenes')
      .then(setOrdenes)
      .finally(() => setLoading(false));
  }, []);

  async function handleEstado(id: number, estado: string) {
    try {
      const updated = await api.put<Orden>(`/ordenes/${id}`, { estado });
      setOrdenes(prev => prev.map(o => o.id === id ? { ...o, estado: updated.estado } : o));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar');
    }
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/admin" className="text-[11px] text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">
            ← Admin
          </Link>
          <h1 className="text-2xl font-bold uppercase tracking-wider mt-1">Órdenes</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ordenes.length === 0 ? (
          <p className="text-zinc-600 text-center py-20 uppercase tracking-widest text-sm">
            Sin órdenes aún
          </p>
        ) : (
          <div className="divide-y divide-zinc-950">
            {ordenes.map(o => (
              <div key={o.id} className="py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-zinc-700 font-mono">#{String(o.id).padStart(4, '0')}</span>
                    <span className={`text-[11px] uppercase tracking-widest font-medium ${estadoColor[o.estado]}`}>
                      {o.estado}
                    </span>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{formatPrice(o.total)}</p>
                  <p className="text-[11px] text-zinc-700 mt-0.5 uppercase tracking-wider">
                    {new Date(o.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <select
                  value={o.estado}
                  onChange={e => handleEstado(o.id, e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 px-3 py-2 focus:outline-none focus:border-zinc-600 transition-colors"
                >
                  {ESTADOS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
