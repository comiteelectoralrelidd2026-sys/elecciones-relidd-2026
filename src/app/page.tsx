'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  FileText, 
  Users, 
  Vote, 
  Megaphone, 
  Mail, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Menu, 
  X, 
  Lock,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { 
  DEFAULT_CONFIG, 
  DEFAULT_CALENDAR, 
  DEFAULT_DOCUMENTS, 
  DEFAULT_CANDIDATURAS, 
  DEFAULT_COMUNICADOS 
} from '@/lib/defaultData';
import { SiteConfig, CalendarItem, DocumentItem, CandidaturaItem, ComunicadoItem } from '@/lib/types';

export default function HomePage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [calendar, setCalendar] = useState<CalendarItem[]>(DEFAULT_CALENDAR);
  const [documents, setDocuments] = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [candidaturas, setCandidaturas] = useState<CandidaturaItem[]>(DEFAULT_CANDIDATURAS);
  const [comunicados, setComunicados] = useState<ComunicadoItem[]>(DEFAULT_COMUNICADOS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nacional' | 'departamental'>('nacional');

  // Real-time listener from Firestore
  useEffect(() => {
    try {
      const unsubConfig = onSnapshot(doc(db, 'config', 'general'), (docSnap) => {
        if (docSnap.exists()) {
          setConfig((prev) => ({ ...prev, ...(docSnap.data() as Partial<SiteConfig>) }));
        }
      }, () => {});

      const unsubCalendar = onSnapshot(collection(db, 'calendario'), (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CalendarItem));
          setCalendar(items);
        }
      }, () => {});

      const unsubDocs = onSnapshot(collection(db, 'documentos'), (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DocumentItem));
          setDocuments(items);
        }
      }, () => {});

      const unsubCandidaturas = onSnapshot(collection(db, 'candidaturas'), (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CandidaturaItem));
          setCandidaturas(items);
        }
      }, () => {});

      const unsubComunicados = onSnapshot(collection(db, 'comunicados'), (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ComunicadoItem));
          setComunicados(items);
        }
      }, () => {});

      return () => {
        unsubConfig();
        unsubCalendar();
        unsubDocs();
        unsubCandidaturas();
        unsubComunicados();
      };
    } catch (e) {
      console.log('Using default local configuration');
    }
  }, []);

  // Calculate event status
  const getEventStatus = (ini: string, fin: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (today > fin) return { label: 'Concluido', color: 'bg-gray-100 text-gray-600 border-gray-200' };
    if (today >= ini && today <= fin) return { label: 'En curso', color: 'bg-green-100 text-green-700 border-green-300 font-bold animate-pulse' };
    return { label: 'Próximo', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  };

  // Check if empadronamiento is open
  const isEmpadronamientoOpen = () => {
    if (!config.empadronamiento?.cierre) return true;
    return new Date() < new Date(config.empadronamiento.cierre);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logos */}
            <Link href="#inicio" className="flex items-center gap-3 sm:gap-4 group">
              <img 
                src="/img/logo-relidd.png" 
                alt="Logo RELIDD" 
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <div className="h-10 w-px bg-gray-300" />
              <img 
                src="/img/logo-elecciones.png" 
                alt="Logo Elecciones 2026" 
                className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <a href="#inicio" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                Inicio
              </a>
              <a href="#calendario" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                <Calendar className="w-4 h-4 text-relidd-red" />
                Calendario
              </a>
              <a href="#documentos" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                <FileText className="w-4 h-4 text-relidd-red" />
                Documentos
              </a>
              <a href="#candidaturas" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                <Users className="w-4 h-4 text-relidd-red" />
                Candidaturas
              </a>
              <a href="#votacion" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                <Vote className="w-4 h-4 text-relidd-red" />
                Votación
              </a>
              <a href="#comunicados" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                <Megaphone className="w-4 h-4 text-relidd-red" />
                Comunicados
              </a>
              <a href="#contacto" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-relidd-red hover:bg-red-50 flex items-center gap-1.5 transition">
                <Mail className="w-4 h-4 text-relidd-red" />
                Contacto
              </a>
              <Link 
                href="/acceso" 
                className="ml-3 px-3.5 py-2 bg-relidd-red text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-relidd-redDark transition flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                Comité
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link 
                href="/acceso" 
                className="px-2.5 py-1.5 bg-relidd-red text-white text-xs font-bold rounded-md flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Comité
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-relidd-red border border-relidd-red hover:bg-red-50"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <a 
              href="#inicio" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Inicio
            </a>
            <a 
              href="#calendario" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Calendario Electoral
            </a>
            <a 
              href="#documentos" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Documentos Oficiales
            </a>
            <a 
              href="#candidaturas" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Candidaturas
            </a>
            <a 
              href="#votacion" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Votación
            </a>
            <a 
              href="#comunicados" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Comunicados
            </a>
            <a 
              href="#contacto" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-red-50 hover:text-relidd-red"
            >
              Contacto
            </a>
          </div>
        )}

        {/* Tricolor stripe */}
        <div className="stripe-relidd" />
      </header>

      {/* HERO SECTION */}
      <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] to-[#FBF0E2] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Mascot Tilkayo */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-relidd-yellow to-relidd-red rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl border-4 border-relidd-yellow p-2 shadow-xl overflow-hidden max-w-[280px] sm:max-w-[320px]">
                  <img 
                    src={config.banner?.imagen || "/img/Tilcayo-cartel.jpeg"} 
                    alt="Tilkayo, mascota oficial de RELIDD" 
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                  <div className="mt-2 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Tilkayo · Mascota Oficial
                  </div>
                </div>
              </div>
            </div>

            {/* Central Titles */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-red-100 text-relidd-red font-bold text-xs uppercase tracking-wider">
                Comité Electoral Nacional
              </span>
              
              <h1 className="flex flex-col tracking-tight font-black">
                <span className="text-4xl sm:text-5xl md:text-6xl text-gray-900 leading-none">
                  ELECCIONES
                </span>
                <span className="text-5xl sm:text-6xl md:text-7xl text-relidd-red leading-none mt-1">
                  RELIDD
                </span>
              </h1>

              <p className="text-xl sm:text-2xl font-bold italic text-gray-700">
                “Participa. Decide. Construye.”
              </p>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
                {config.textos?.sobre}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
                {isEmpadronamientoOpen() && config.enlaces?.empadronamiento ? (
                  <a 
                    href={config.enlaces.empadronamiento} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-relidd-red text-white font-bold rounded-xl shadow-lg hover:bg-relidd-redDark hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Completar Empadronamiento</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a 
                    href="#calendario" 
                    className="px-6 py-3.5 bg-relidd-red text-white font-bold rounded-xl shadow-lg hover:bg-relidd-redDark hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Ver Calendario Electoral</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}

                <a 
                  href="#documentos" 
                  className="px-5 py-3.5 bg-white text-relidd-red border-2 border-relidd-red font-bold rounded-xl hover:bg-red-50 transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Convocatoria 2026</span>
                </a>
              </div>
            </div>

            {/* Side Card / Badge */}
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center shadow-sm w-full max-w-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-relidd-red block mb-1">
                  Proceso Democrático
                </span>
                <p className="font-extrabold text-gray-900 text-lg leading-snug">
                  Gestión 2027
                </p>
                <div className="my-3 inline-block bg-relidd-red text-white font-black text-3xl px-6 py-1.5 rounded-xl -rotate-2 shadow-md">
                  2026
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {config.aviso}
                </p>
              </div>

              {/* Status notice */}
              <div className="bg-white rounded-xl p-3.5 border border-amber-200 shadow-sm w-full max-w-xs text-xs text-gray-600 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">Fecha de votación prevista:</span>
                  <p className="text-gray-600 mt-0.5">7 de diciembre de 2026</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK LINKS / SUMMARY CARDS */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <a href="#calendario" className="group p-5 bg-white border border-gray-200 border-b-4 border-b-relidd-red rounded-2xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-relidd-red flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-relidd-red transition text-sm sm:text-base">
                Calendario
              </span>
              <span className="text-xs text-gray-500 mt-0.5">17 Etapas</span>
            </a>

            <a href="#documentos" className="group p-5 bg-white border border-gray-200 border-b-4 border-b-relidd-green rounded-2xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-relidd-green flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-relidd-green transition text-sm sm:text-base">
                Documentos
              </span>
              <span className="text-xs text-gray-500 mt-0.5">PDFs Oficiales</span>
            </a>

            <a href="#candidaturas" className="group p-5 bg-white border border-gray-200 border-b-4 border-b-relidd-yellow rounded-2xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-relidd-yellowDark flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-relidd-yellowDark transition text-sm sm:text-base">
                Candidaturas
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Planchas y Listas</span>
            </a>

            <a href="#votacion" className="group p-5 bg-white border border-gray-200 border-b-4 border-b-relidd-purple rounded-2xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-relidd-purple flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Vote className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-relidd-purple transition text-sm sm:text-base">
                Votación
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Sistema Digital</span>
            </a>

            <a href="#comunicados" className="group p-5 bg-white border border-gray-200 border-b-4 border-b-blue-600 rounded-2xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center col-span-2 sm:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Megaphone className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-blue-600 transition text-sm sm:text-base">
                Comunicados
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Resoluciones y Actas</span>
            </a>

          </div>
        </div>
      </section>

      {/* INFORMATIONAL CARDS */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#FDF2E3] border border-[#F3E1C8] rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-relidd-red rounded-full"></span>
                Sobre el Proceso Electoral
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {config.textos?.sobre}
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {config.textos?.sobreMas}
              </p>
            </div>

            <div className="bg-[#E8F3EA] border border-[#D0E7D4] rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-relidd-green rounded-full"></span>
                Convocatoria N.º 001/2026
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Aprobada por el Comité Electoral Nacional conforme a las facultades conferidas por el Estatuto Orgánico. Todos los documentos, fechas y reglamentos son de carácter vinculante para los miembros de la red.
              </p>
              <div className="pt-2">
                <a 
                  href="/docs/convocatoria-electoral-2026.pdf" 
                  download 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-relidd-green text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Convocatoria Oficial (PDF)</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CALENDARIO ELECTORAL */}
      <section id="calendario" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-relidd-red uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">
              Cronograma Oficial
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Calendario Electoral 2026
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Conforme a la Convocatoria N.º 001/2026. Las etapas son secuenciales y de estricto cumplimiento.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {calendar.map((item, index) => {
              const status = getEventStatus(item.ini, item.fin);
              return (
                <div 
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-relidd-red text-base sm:text-lg">
                        {item.f}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.t}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.d}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOCUMENTOS OFICIALES */}
      <section id="documentos" className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-relidd-green uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full">
              Transparencia Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Documentos Oficiales
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Descarga la normativa, estatutos, reglamentos y actas del proceso electoral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {documents.map((doc, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-red-50 text-relidd-red rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    {doc.estado && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                        {doc.estado}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-gray-900 text-lg">
                    {doc.t}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {doc.d}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  {doc.archivo && doc.archivo !== '#calendario' ? (
                    <a 
                      href={doc.archivo} 
                      download 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-relidd-red text-white font-bold text-sm rounded-xl hover:bg-relidd-redDark transition shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </a>
                  ) : doc.archivo === '#calendario' ? (
                    <a 
                      href="#calendario" 
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition"
                    >
                      Ver en Calendario
                    </a>
                  ) : (
                    <span className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-gray-50 text-gray-400 font-medium text-xs rounded-xl border border-gray-200 italic">
                      Publicación Próximamente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CANDIDATURAS */}
      <section id="candidaturas" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-relidd-yellowDark uppercase tracking-wider bg-yellow-50 px-3 py-1 rounded-full">
              Postulaciones
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Candidaturas Habilitadas
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Conoce a los postulantes y sus propuestas de trabajo para la gestión 2027.
            </p>
          </div>

          {candidaturas.length === 0 ? (
            <div className="bg-[#FFFDF8] border-2 border-dashed border-amber-300 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900">
                Aún no hay candidaturas publicadas
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Conforme al calendario oficial, la publicación de candidaturas habilitadas e inhabilitadas está programada para el <strong>20 de noviembre de 2026</strong> tras el periodo de inscripción y verificación.
              </p>
              <div className="pt-2">
                <a 
                  href="#calendario" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-relidd-red hover:underline"
                >
                  Consultar cronograma de postulaciones <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {candidaturas.map((cand, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    {cand.foto && (
                      <img src={cand.foto} alt={cand.nombre} className="w-full h-48 object-cover rounded-xl mb-3" />
                    )}
                    <span className="text-xs font-bold bg-red-100 text-relidd-red px-2.5 py-1 rounded-full uppercase">
                      {cand.tipo}
                    </span>
                    <h3 className="font-black text-xl text-gray-900">{cand.nombre}</h3>
                    <p className="text-sm text-gray-600">{cand.cargo} · {cand.departamento}</p>
                    {cand.propuesta && (
                      <p className="text-xs text-gray-500 italic mt-2">“{cand.propuesta}”</p>
                    )}
                  </div>
                  {cand.plan && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a href={cand.plan} target="_blank" rel="noreferrer" className="text-xs font-bold text-relidd-red flex items-center gap-1 hover:underline">
                        <FileText className="w-3.5 h-3.5" /> Ver Plan de Trabajo
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VOTACION */}
      <section id="votacion" className="py-16 bg-gradient-to-br from-red-50 to-amber-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 bg-relidd-red text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Vote className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            Jornada de Votación Electrónica
          </h2>
          
          <p className="text-gray-700 font-medium text-base sm:text-lg max-w-2xl mx-auto">
            {config.textos?.votacionFecha}
          </p>

          <div className="pt-2">
            {config.enlaces?.votacion ? (
              <a 
                href={config.enlaces.votacion} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-relidd-red text-white font-extrabold text-lg rounded-2xl shadow-xl hover:bg-relidd-redDark hover:scale-105 transition"
              >
                <span>Acceder a la Boleta de Votación</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <button 
                disabled 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-300 text-gray-600 font-bold text-base rounded-2xl cursor-not-allowed shadow-none"
              >
                <span>Acceso a votación disponible el 7 de diciembre</span>
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            El enlace oficial de la plataforma de votación será activado directamente por el Comité Electoral en cumplimiento estricto del silencio electoral.
          </p>
        </div>
      </section>

      {/* COMUNICADOS */}
      <section id="comunicados" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              Últimas Noticias
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Comunicados Oficiales
            </h2>
          </div>

          {comunicados.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center max-w-xl mx-auto text-sm text-gray-600">
              <Megaphone className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              Los comunicados, resoluciones de impugnación y actas generales se publicarán en esta sección durante el transcurso del proceso.
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {comunicados.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-gray-500">{item.fecha}</span>
                  <h3 className="font-bold text-lg text-gray-900">{item.titulo}</h3>
                  <p className="text-sm text-gray-600">{item.resumen}</p>
                  {item.archivo && (
                    <a href={item.archivo} download className="inline-flex items-center gap-1.5 text-xs font-bold text-relidd-red hover:underline pt-2">
                      <Download className="w-3.5 h-3.5" /> Descargar documento adjunto
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACTO & FOOTER */}
      <footer id="contacto" className="bg-[#1C1C1C] text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-800">
            
            {/* Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/img/logo-relidd.png" alt="RELIDD" className="h-10 w-auto bg-white p-1 rounded-md" />
                <span className="font-black text-lg tracking-wide text-white">RELIDD 2026</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                Red de Líderes para el Desarrollo y la Democracia. Elecciones Nacionales y Departamentales 2026 para la Gestión 2027.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider text-relidd-yellow">
                Contacto Oficial
              </h4>
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-relidd-red" />
                <a href={`mailto:${config.correo}`} className="hover:underline">
                  {config.correo}
                </a>
              </p>
              <div className="flex items-center gap-3 pt-2">
                {config.enlaces?.facebook && (
                  <a href={config.enlaces.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-relidd-red transition">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {config.enlaces?.instagram && (
                  <a href={config.enlaces.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-relidd-red transition">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {config.enlaces?.youtube && (
                  <a href={config.enlaces.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-relidd-red transition">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Committee Portal */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider text-relidd-yellow">
                Comité Electoral
              </h4>
              <p className="text-gray-400 text-xs">
                Portal de administración exclusivo para los 3 vocales electorales en La Paz, Cochabamba y Santa Cruz.
              </p>
              <Link 
                href="/acceso" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-relidd-red text-white text-xs font-bold rounded-lg transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ingreso al Panel de Control</span>
              </Link>
            </div>

          </div>

          <div className="pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Comité Electoral RELIDD. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              Desarrollado para el proceso democrático con tecnología $0 Cero Costo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
