import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link to="/" className="text-white font-bold text-lg tracking-[0.18em] uppercase">
          MODA-STORE
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
            Inicio
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-5">
          <Link to="/carrito" className="relative text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{user.nombre}</span>
                <button onClick={handleLogout}
                  className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                  Login
                </Link>
                <Link to="/register"
                  className="text-xs bg-white text-black px-4 py-2 font-semibold hover:bg-zinc-200 transition-colors uppercase tracking-widest">
                  Registro
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-zinc-900 px-4 py-5 flex flex-col gap-5">
          <Link to="/" onClick={() => setOpen(false)}
            className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
            Inicio
          </Link>
          <Link to="/carrito" onClick={() => setOpen(false)}
            className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
            Carrito {count > 0 && `(${count})`}
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)}
              className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span className="text-xs text-zinc-600 uppercase tracking-wider">{user.nombre}</span>
              <button onClick={handleLogout}
                className="text-left text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
                Registro
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
