'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  DEFAULT_CONFIG, 
  DEFAULT_CALENDAR, 
  DEFAULT_DOCUMENTS, 
  DEFAULT_CANDIDATURAS, 
  DEFAULT_COMUNICADOS 
} from '@/lib/defaultData';
import { SiteConfig, CalendarItem, DocumentItem, CandidaturaItem, ComunicadoItem } from '@/lib/types';
import { uploadToCloudinaryClient } from '@/lib/cloudinary';
import { 
  Settings, 
  Calendar, 
  FileText, 
  Users, 
  Megaphone, 
  LogOut, 
  ExternalLink, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'general' | 'calendario' | 'documentos' | 'candidaturas' | 'comunicados'>('general');

  // State data
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [calendar, setCalendar] = useState<CalendarItem[]>(DEFAULT_CALENDAR);
  const [documents, setDocuments] = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [candidaturas, setCandidaturas] = useState<CandidaturaItem[]>(DEFAULT_CANDIDATURAS);
  const [comunicados, setComunicados] = useState<ComunicadoItem[]>(DEFAULT_COMUNICADOS);

  // Upload states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Auth protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/acceso');
      } else {
        setUser(currentUser);
        await loadData();
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // Load data from Firestore (or seed with defaults if empty)
  const loadData = async () => {
    try {
      // Config
      const configRef = doc(db, 'config', 'general');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        setConfig(configSnap.data() as SiteConfig);
      } else {
        await setDoc(configRef, DEFAULT_CONFIG);
        setConfig(DEFAULT_CONFIG);
      }

      // Calendario
      const calSnap = await getDocs(collection(db, 'calendario'));
      if (!calSnap.empty) {
        const items = calSnap.docs.map(d => ({ id: d.id, ...d.data() } as CalendarItem));
        setCalendar(items);
      } else {
        // Seed initial calendar
        for (const item of DEFAULT_CALENDAR) {
          await addDoc(collection(db, 'calendario'), item);
        }
        setCalendar(DEFAULT_CALENDAR);
      }

      // Documentos
      const docsSnap = await getDocs(collection(db, 'documentos'));
      if (!docsSnap.empty) {
        const items = docsSnap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentItem));
        setDocuments(items);
      } else {
        for (const item of DEFAULT_DOCUMENTS) {
          await addDoc(collection(db, 'documentos'), item);
        }
        setDocuments(DEFAULT_DOCUMENTS);
      }

      // Candidaturas
      const candSnap = await getDocs(collection(db, 'candidaturas'));
      if (!candSnap.empty) {
        setCandidaturas(candSnap.docs.map(d => ({ id: d.id, ...d.data() } as CandidaturaItem)));
      }

      // Comunicados
      const comSnap = await getDocs(collection(db, 'comunicados'));
      if (!comSnap.empty) {
        setComunicados(comSnap.docs.map(d => ({ id: d.id, ...d.data() } as ComunicadoItem)));
      }
    } catch (err: any) {
      console.error('Error cargando datos de Firestore:', err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/acceso');
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Save General Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'general'), config);
      showNotification('¡Configuración general guardada exitosamente!');
    } catch (err: any) {
      setErrorMsg('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upload file helper
  const uploadToCloudinary = async (file: File, folder: string) => {
    return await uploadToCloudinaryClient(file, folder);
  };

  // Add Calendar Item
  const handleAddCalendar = async () => {
    const newItem: CalendarItem = {
      f: 'Nueva fecha',
      ini: new Date().toISOString().split('T')[0],
      fin: new Date().toISOString().split('T')[0],
      t: 'Nueva actividad electoral',
      d: 'Descripción de la actividad'
    };
    const ref = await addDoc(collection(db, 'calendario'), newItem);
    setCalendar([...calendar, { id: ref.id, ...newItem }]);
    showNotification('Etapa de calendario agregada');
  };

  // Delete Calendar Item
  const handleDeleteCalendar = async (id?: string, index?: number) => {
    if (!confirm('¿Seguro de eliminar esta fecha del calendario?')) return;
    if (id) {
      await deleteDoc(doc(db, 'calendario', id));
    }
    setCalendar(calendar.filter((_, i) => i !== index));
    showNotification('Fecha eliminada');
  };

  // Add Document
  const handleAddDocument = async () => {
    const newDoc: DocumentItem = {
      t: 'Nuevo Documento Oficial',
      d: 'Descripción del documento',
      archivo: null,
      estado: 'Oficial'
    };
    const ref = await addDoc(collection(db, 'documentos'), newDoc);
    setDocuments([...documents, { id: ref.id, ...newDoc }]);
    showNotification('Documento agregado a la lista');
  };

  // Delete Document
  const handleDeleteDocument = async (id?: string, index?: number) => {
    if (!confirm('¿Seguro de eliminar este documento?')) return;
    if (id) {
      await deleteDoc(doc(db, 'documentos', id));
    }
    setDocuments(documents.filter((_, i) => i !== index));
    showNotification('Documento eliminado');
  };

  // Add Candidatura
  const handleAddCandidatura = async () => {
    const newCand: CandidaturaItem = {
      tipo: 'Plancha nacional',
      nombre: 'Nombre del Candidato o Plancha',
      cargo: 'Presidencia',
      departamento: 'Nacional',
      propuesta: ''
    };
    const ref = await addDoc(collection(db, 'candidaturas'), newCand);
    setCandidaturas([...candidaturas, { id: ref.id, ...newCand }]);
    showNotification('Candidatura creada');
  };

  // Delete Candidatura
  const handleDeleteCandidatura = async (id?: string, index?: number) => {
    if (!confirm('¿Eliminar esta postulación?')) return;
    if (id) {
      await deleteDoc(doc(db, 'candidaturas', id));
    }
    setCandidaturas(candidaturas.filter((_, i) => i !== index));
    showNotification('Candidatura eliminada');
  };

  // Add Comunicado
  const handleAddComunicado = async () => {
    const newCom: ComunicadoItem = {
      fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }),
      titulo: 'Nuevo Comunicado Oficial',
      resumen: 'Resumen o cuerpo del comunicado emitido por el Comité Electoral.'
    };
    const ref = await addDoc(collection(db, 'comunicados'), newCom);
    setComunicados([...comunicados, { id: ref.id, ...newCom }]);
    showNotification('Comunicado emitido');
  };

  // Delete Comunicado
  const handleDeleteComunicado = async (id?: string, index?: number) => {
    if (!confirm('¿Eliminar comunicado?')) return;
    if (id) {
      await deleteDoc(doc(db, 'comunicados', id));
    }
    setComunicados(comunicados.filter((_, i) => i !== index));
    showNotification('Comunicado eliminado');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-relidd-red animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-700">Cargando panel del Comité Electoral...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* TOPBAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/img/logo-relidd.png" alt="RELIDD" className="h-8 w-auto" />
            <span className="font-black text-gray-900 text-sm sm:text-base">
              Comité Electoral · Panel de Control
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" /> Nube Sincronizada
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-600">
              Sesión: <strong>{user?.email}</strong>
            </span>
            <Link 
              href="/" 
              target="_blank" 
              className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-relidd-red border border-gray-300 rounded-lg flex items-center gap-1.5 transition"
            >
              <span>Ver Sitio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
        <div className="stripe-relidd" />
      </header>

      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 bg-green-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'general'
                ? 'bg-relidd-red text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configuración y Votación</span>
          </button>

          <button
            onClick={() => setActiveTab('calendario')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'calendario'
                ? 'bg-relidd-red text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendario Electoral ({calendar.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'documentos'
                ? 'bg-relidd-red text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documentos PDF ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('candidaturas')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'candidaturas'
                ? 'bg-relidd-red text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidaturas ({candidaturas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('comunicados')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'comunicados'
                ? 'bg-relidd-red text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Comunicados ({comunicados.length})</span>
          </button>
        </div>

        {/* TAB 1: CONFIGURACION GENERAL */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-relidd-red" />
                Enlaces de Acción y Fechas Clave
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Empadronamiento */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Enlace de Empadronamiento (Google Forms)
                  </label>
                  <input
                    type="url"
                    value={config.enlaces.empadronamiento}
                    onChange={(e) => setConfig({
                      ...config,
                      enlaces: { ...config.enlaces, empadronamiento: e.target.value }
                    })}
                    placeholder="https://forms.gle/..."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red outline-none"
                  />
                  <p className="text-xs text-gray-500">
                    Mientras esté vigente, se mostrará el botón en la portada principal.
                  </p>
                </div>

                {/* Fecha de Cierre Empadronamiento */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Fecha de Cierre de Empadronamiento (ISO)
                  </label>
                  <input
                    type="text"
                    value={config.empadronamiento.cierre}
                    onChange={(e) => setConfig({
                      ...config,
                      empadronamiento: { ...config.empadronamiento, cierre: e.target.value }
                    })}
                    placeholder="2026-11-06T23:59:00-04:00"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red outline-none"
                  />
                  <p className="text-xs text-gray-500">
                    Al pasar esta fecha, el botón cambia automáticamente a "Ver Calendario".
                  </p>
                </div>

                {/* Enlace de Votación */}
                <div className="space-y-2 md:col-span-2 bg-red-50 p-4 rounded-2xl border border-red-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-relidd-red flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Enlace Oficial de la Boleta de Votación Electrónica
                  </label>
                  <input
                    type="text"
                    value={config.enlaces.votacion}
                    onChange={(e) => setConfig({
                      ...config,
                      enlaces: { ...config.enlaces, votacion: e.target.value }
                    })}
                    placeholder="Dejar vacío hasta el 7 de diciembre (o pegar URL aprobada)"
                    className="w-full px-3.5 py-2.5 bg-white border border-red-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red outline-none"
                  />
                  <p className="text-xs text-gray-600">
                    Si este campo está <strong>vacío</strong>, la web pública mostrará el botón deshabilitado con aviso de jornada futura. Cuando el Comité pegue aquí la URL y guarde, ¡se activará al instante para todo el país!
                  </p>
                </div>

                {/* Correo Oficial */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Correo Oficial de Contacto
                  </label>
                  <input
                    type="email"
                    value={config.correo}
                    onChange={(e) => setConfig({ ...config, correo: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red outline-none"
                  />
                </div>

                {/* Aviso en la portada */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Texto de Aviso Destacado (Badge 2026)
                  </label>
                  <input
                    type="text"
                    value={config.aviso}
                    onChange={(e) => setConfig({ ...config, aviso: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-relidd-red outline-none"
                  />
                </div>
              </div>

              {/* Textos descriptivos */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm">Textos Institucionales</h4>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Descripción del Proceso (Párrafo 1)
                  </label>
                  <textarea
                    rows={2}
                    value={config.textos.sobre}
                    onChange={(e) => setConfig({
                      ...config,
                      textos: { ...config.textos, sobre: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Cargos a Elegir (Párrafo 2)
                  </label>
                  <textarea
                    rows={2}
                    value={config.textos.sobreMas}
                    onChange={(e) => setConfig({
                      ...config,
                      textos: { ...config.textos, sobreMas: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Facebook</label>
                  <input
                    type="text"
                    value={config.enlaces.facebook}
                    onChange={(e) => setConfig({
                      ...config,
                      enlaces: { ...config.enlaces, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={config.enlaces.instagram}
                    onChange={(e) => setConfig({
                      ...config,
                      enlaces: { ...config.enlaces, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">YouTube</label>
                  <input
                    type="text"
                    value={config.enlaces.youtube}
                    onChange={(e) => setConfig({
                      ...config,
                      enlaces: { ...config.enlaces, youtube: e.target.value }
                    })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-relidd-red text-white font-bold rounded-xl shadow-md hover:bg-relidd-redDark transition flex items-center gap-2 disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Guardando...' : 'Guardar Cambios de Configuración'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: CALENDARIO */}
        {activeTab === 'calendario' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200">
              <div>
                <h3 className="text-lg font-black text-gray-900">Etapas del Calendario Electoral</h3>
                <p className="text-xs text-gray-600">Edita fechas, textos o agrega nuevas actividades.</p>
              </div>
              <button
                onClick={handleAddCalendar}
                className="px-4 py-2 bg-relidd-green text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Etapa
              </button>
            </div>

            <div className="space-y-4">
              {calendar.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Etiqueta visual (Ej: 2 – 6 nov)</label>
                      <input
                        type="text"
                        value={item.f}
                        onChange={(e) => {
                          const updated = [...calendar];
                          updated[idx].f = e.target.value;
                          setCalendar(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Fecha Inicio (AAAA-MM-DD)</label>
                      <input
                        type="date"
                        value={item.ini}
                        onChange={(e) => {
                          const updated = [...calendar];
                          updated[idx].ini = e.target.value;
                          setCalendar(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Fecha Fin (AAAA-MM-DD)</label>
                      <input
                        type="date"
                        value={item.fin}
                        onChange={(e) => {
                          const updated = [...calendar];
                          updated[idx].fin = e.target.value;
                          setCalendar(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      <button
                        onClick={() => handleDeleteCalendar(item.id, idx)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Título de la actividad</label>
                      <input
                        type="text"
                        value={item.t}
                        onChange={(e) => {
                          const updated = [...calendar];
                          updated[idx].t = e.target.value;
                          setCalendar(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Descripción / Detalles</label>
                      <input
                        type="text"
                        value={item.d}
                        onChange={(e) => {
                          const updated = [...calendar];
                          updated[idx].d = e.target.value;
                          setCalendar(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={async () => {
                        if (item.id) {
                          await updateDoc(doc(db, 'calendario', item.id), { ...item });
                          showNotification('Etapa guardada');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-black"
                    >
                      <Save className="w-3.5 h-3.5" /> Guardar esta fecha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTOS OFICIALES */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200">
              <div>
                <h3 className="text-lg font-black text-gray-900">Documentos Oficiales en PDF</h3>
                <p className="text-xs text-gray-600">Sube reglamentos, convocatorias y resoluciones directamente a la nube.</p>
              </div>
              <button
                onClick={handleAddDocument}
                className="px-4 py-2 bg-relidd-green text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Documento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((docItem, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-gray-500">Título del Documento</label>
                    <input
                      type="text"
                      value={docItem.t}
                      onChange={(e) => {
                        const updated = [...documents];
                        updated[idx].t = e.target.value;
                        setDocuments(updated);
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-gray-500">Descripción</label>
                    <input
                      type="text"
                      value={docItem.d}
                      onChange={(e) => {
                        const updated = [...documents];
                        updated[idx].d = e.target.value;
                        setDocuments(updated);
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-gray-500">Archivo PDF en la nube</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={docItem.archivo || ''}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[idx].archivo = e.target.value;
                          setDocuments(updated);
                        }}
                        placeholder="Ruta local o URL en la nube"
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                      <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 flex-shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir</span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                showNotification('Subiendo PDF a Cloudinary...');
                                const url = await uploadToCloudinary(file, 'elecciones-relidd/docs');
                                const updated = [...documents];
                                updated[idx].archivo = url;
                                setDocuments(updated);
                                showNotification('PDF subido y vinculado');
                              } catch (err: any) {
                                setErrorMsg('Error al subir: ' + err.message);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteDocument(docItem.id, idx)}
                      className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                    <button
                      onClick={async () => {
                        if (docItem.id) {
                          await updateDoc(doc(db, 'documentos', docItem.id), { ...docItem });
                          showNotification('Documento guardado');
                        }
                      }}
                      className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CANDIDATURAS */}
        {activeTab === 'candidaturas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200">
              <div>
                <h3 className="text-lg font-black text-gray-900">Gestión de Candidaturas y Planchas</h3>
                <p className="text-xs text-gray-600">Publica candidatos habilitados con su fotografía y plan de trabajo.</p>
              </div>
              <button
                onClick={handleAddCandidatura}
                className="px-4 py-2 bg-relidd-yellowDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-yellow-700 transition"
              >
                <Plus className="w-4 h-4" /> Nueva Candidatura
              </button>
            </div>

            {candidaturas.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-sm text-gray-500">
                No hay candidaturas registradas en el sistema. Puedes crearlas pulsando el botón superior.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidaturas.map((cand, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500">Tipo</label>
                        <select
                          value={cand.tipo}
                          onChange={(e) => {
                            const updated = [...candidaturas];
                            updated[idx].tipo = e.target.value as any;
                            setCandidaturas(updated);
                          }}
                          className="w-full px-3 py-2 border rounded-lg text-xs"
                        >
                          <option value="Plancha nacional">Plancha nacional</option>
                          <option value="Coordinación Departamental">Coordinación Departamental</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500">Departamento / Ámbito</label>
                        <input
                          type="text"
                          value={cand.departamento}
                          onChange={(e) => {
                            const updated = [...candidaturas];
                            updated[idx].departamento = e.target.value;
                            setCandidaturas(updated);
                          }}
                          className="w-full px-3 py-2 border rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Nombre del Candidato o Plancha</label>
                      <input
                        type="text"
                        value={cand.nombre}
                        onChange={(e) => {
                          const updated = [...candidaturas];
                          updated[idx].nombre = e.target.value;
                          setCandidaturas(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Cargo Postulado</label>
                      <input
                        type="text"
                        value={cand.cargo}
                        onChange={(e) => {
                          const updated = [...candidaturas];
                          updated[idx].cargo = e.target.value;
                          setCandidaturas(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>

                    {/* Foto upload */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Foto del Candidato</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cand.foto || ''}
                          onChange={(e) => {
                            const updated = [...candidaturas];
                            updated[idx].foto = e.target.value;
                            setCandidaturas(updated);
                          }}
                          placeholder="URL de la imagen"
                          className="w-full px-3 py-1.5 border rounded-lg text-xs"
                        />
                        <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 flex-shrink-0">
                          <Upload className="w-3 h-3" />
                          <span>Subir</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  showNotification('Subiendo foto...');
                                  const url = await uploadToCloudinary(file, 'elecciones-relidd/candidaturas');
                                  const updated = [...candidaturas];
                                  updated[idx].foto = url;
                                  setCandidaturas(updated);
                                  showNotification('Foto subida exitosamente');
                                } catch (err: any) {
                                  setErrorMsg('Error: ' + err.message);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleDeleteCandidatura(cand.id, idx)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                      <button
                        onClick={async () => {
                          if (cand.id) {
                            await updateDoc(doc(db, 'candidaturas', cand.id), { ...cand });
                            showNotification('Candidatura guardada');
                          }
                        }}
                        className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: COMUNICADOS */}
        {activeTab === 'comunicados' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200">
              <div>
                <h3 className="text-lg font-black text-gray-900">Comunicados y Resoluciones Electorales</h3>
                <p className="text-xs text-gray-600">Emite avisos oficiales de última hora, resoluciones y resultados.</p>
              </div>
              <button
                onClick={handleAddComunicado}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" /> Emitir Comunicado
              </button>
            </div>

            <div className="space-y-4">
              {comunicados.map((com, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500">Fecha de Emisión</label>
                      <input
                        type="text"
                        value={com.fecha}
                        onChange={(e) => {
                          const updated = [...comunicados];
                          updated[idx].fecha = e.target.value;
                          setComunicados(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-gray-500">Título del Comunicado</label>
                      <input
                        type="text"
                        value={com.titulo}
                        onChange={(e) => {
                          const updated = [...comunicados];
                          updated[idx].titulo = e.target.value;
                          setComunicados(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500">Cuerpo / Resumen del Comunicado</label>
                    <textarea
                      rows={2}
                      value={com.resumen}
                      onChange={(e) => {
                        const updated = [...comunicados];
                        updated[idx].resumen = e.target.value;
                        setComunicados(updated);
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteComunicado(com.id, idx)}
                      className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                    <button
                      onClick={async () => {
                        if (com.id) {
                          await updateDoc(doc(db, 'comunicados', com.id), { ...com });
                          showNotification('Comunicado guardado');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black"
                    >
                      Guardar y Publicar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
