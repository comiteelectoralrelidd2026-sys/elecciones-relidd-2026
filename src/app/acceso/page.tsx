'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/admin');
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No existe un usuario con este correo electrónico.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intenta nuevamente en unos minutos.');
      } else {
        setError('Error al iniciar sesión: ' + (err.message || 'Verifica tus datos.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF8] to-[#FBF0E2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-relidd-red mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Volver al portal público
        </Link>
        
        <div className="flex justify-center items-center gap-3 mb-4">
          <img src="/img/logo-relidd.png" alt="RELIDD" className="h-12 w-auto" />
          <div className="h-8 w-px bg-gray-300" />
          <img src="/img/logo-elecciones.png" alt="Elecciones 2026" className="h-11 w-auto" />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Panel del Comité Electoral
        </h2>
        <p className="mt-1 text-xs text-gray-600 max-w-sm mx-auto">
          Acceso exclusivo para los miembros del Comité Electoral en sus respectivas sedes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@relidd.org"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red focus:border-relidd-red outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red focus:border-relidd-red outline-none transition"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-relidd-red hover:bg-relidd-redDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-relidd-red transition disabled:bg-gray-400"
              >
                {loading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Cualquier cambio guardado en este panel se reflejará de inmediato en la página pública sin necesidad de compilar ni subir archivos manualmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
