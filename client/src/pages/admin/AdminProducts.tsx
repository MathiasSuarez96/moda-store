import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Producto, Categoria } from '../../types';
import { api } from '../../lib/api';

const formatPrice = (price: number) =>
  '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(price);

interface ProductForm {
  nombre: string;
  descripcion: string;
  precio: string;
  imagen: string;
  stock: string;
  categoriaId: string;
}

const emptyForm: ProductForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: '',
  stock: '0',
  categoriaId: '',
};

async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('imagen', file);

  const res = await fetch('/api/uploads', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token ?? ''}` },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error al subir imagen');
  }

  const data = await res.json() as { url: string };
  return data.url;
}

export default function AdminProducts() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadData() {
    try {
      const [prods, cats] = await Promise.all([
        api.get<Producto[]>('/productos'),
        api.get<Categoria[]>('/categorias'),
      ]);
      setProductos(prods);
      setCategorias(cats);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(p: Producto) {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: String(p.precio),
      imagen: p.imagen,
      stock: String(p.stock),
      categoriaId: String(p.categoriaId),
    });
    setError('');
    setShowForm(true);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, imagen: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.imagen) {
      setError('Subí una imagen para el producto');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const data = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        imagen: form.imagen,
        stock: Number(form.stock),
        categoriaId: Number(form.categoriaId),
      };
      if (editingId) {
        await api.put(`/productos/${editingId}`, data);
      } else {
        await api.post('/productos', data);
      }
      setShowForm(false);
      setLoading(true);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  const textFields = [
    { label: 'Nombre',        key: 'nombre',      type: 'text',   placeholder: 'Remera Básica...' },
    { label: 'Descripción',   key: 'descripcion', type: 'text',   placeholder: 'Descripción del producto...' },
    { label: 'Precio ($ARS)', key: 'precio',      type: 'number', placeholder: '15000' },
    { label: 'Stock',         key: 'stock',       type: 'number', placeholder: '10' },
  ] as const;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link to="/admin" className="text-[11px] text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">
              ← Admin
            </Link>
            <h1 className="text-2xl font-bold uppercase tracking-wider mt-1">Productos</h1>
          </div>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
          >
            + Nuevo
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xs font-semibold uppercase tracking-widest">
                    {editingId ? 'Editar producto' : 'Nuevo producto'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white transition-colors">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Text fields */}
                  {textFields.map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        required
                        placeholder={placeholder}
                        className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                  ))}

                  {/* Categoría */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
                      Categoría
                    </label>
                    <select
                      value={form.categoriaId}
                      onChange={e => setForm(prev => ({ ...prev, categoriaId: e.target.value }))}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                    >
                      <option value="">Seleccioná una categoría</option>
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image upload */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
                      Imagen del producto
                    </label>

                    {/* Preview */}
                    {form.imagen && (
                      <div className="relative w-full aspect-square bg-zinc-900 mb-3 overflow-hidden">
                        <img
                          src={form.imagen}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm(prev => ({ ...prev, imagen: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 hover:bg-black transition-colors"
                        >
                          Cambiar
                        </button>
                      </div>
                    )}

                    {/* Drop zone / button */}
                    {!form.imagen && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border border-dashed border-zinc-700 hover:border-zinc-500 py-8 flex flex-col items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
                              Subiendo...
                            </span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px] text-zinc-600 uppercase tracking-widest">
                              Seleccionar imagen
                            </span>
                            <span className="text-[10px] text-zinc-700">JPG, PNG, WEBP · máx. 5 MB</span>
                          </>
                        )}
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="flex-1 bg-white text-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear producto'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 border border-zinc-800 text-xs uppercase tracking-widest hover:border-zinc-500 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Product list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <p className="text-zinc-600 text-center py-20 uppercase tracking-widest text-sm">
            No hay productos
          </p>
        ) : (
          <div className="divide-y divide-zinc-950">
            {productos.map(p => (
              <div key={p.id} className="flex items-center gap-4 py-4 group">
                <div className="w-12 h-12 bg-zinc-900 flex-shrink-0 overflow-hidden">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/48x48/111/444?text=?';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.nombre}</p>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-wider">
                    {p.categoria?.nombre} · Stock: {p.stock}
                  </p>
                </div>
                <p className="text-sm text-zinc-400 tabular-nums hidden sm:block">
                  {formatPrice(p.precio)}
                </p>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-[11px] text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-[11px] text-zinc-700 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
