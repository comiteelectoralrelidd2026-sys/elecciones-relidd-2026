'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

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
      console.log('Usando datos locales predeterminados');
    }
  }, []);

  // Sorted calendar strictly in ascending chronological order
  const sortedCalendar = useMemo(() => {
    return [...calendar].sort((a, b) => (a.ini || '').localeCompare(b.ini || ''));
  }, [calendar]);

  // Check if empadronamiento is closed
  const isCerrado = useMemo(() => {
    const cierre = config.empadronamiento?.cierre;
    if (!cierre) return false;
    return new Date() > new Date(cierre);
  }, [config.empadronamiento?.cierre]);

  // Today in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const navItems = [
    { href: '#inicio', id: 'inicio', label: 'Inicio', icon: 'home' },
    { href: '#calendario', id: 'calendario', label: 'Calendario', icon: 'cal' },
    { href: '#documentos', id: 'documentos', label: 'Documentos', icon: 'doc' },
    { href: '#candidaturas', id: 'candidaturas', label: 'Candidaturas', icon: 'users' },
    { href: '#votacion', id: 'votacion', label: 'Votación', icon: 'vote' },
    { href: '#comunicados', id: 'comunicados', label: 'Comunicados', icon: 'mega' },
    { href: '#contacto', id: 'contacto', label: 'Contacto', icon: 'mail' },
  ];

  return (
    <>
      {/* SVG Icon Sprite */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="i-home" viewBox="0 0 24 24"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z" fill="currentColor"/></symbol>
        <symbol id="i-cal" viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 9h14v11H5zm2 2v2h3v-2zm5 0v2h3v-2zm-5 4v2h3v-2zm5 0v2h3v-2z" fill="currentColor"/></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm7 1.5L18.5 9H13zM8 13h8v2H8zm0 4h8v2H8z" fill="currentColor"/></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 13c-3 0-7 1.5-7 4.5V20h14v-2.5C16 14.500 12 13 9 13zm7.500.2c2.700.5 5.500 1.800 5.500 4.300V20h-4v-2.500c0-1.700-.6-3.200-1.500-4.300z" fill="currentColor"/></symbol>
        <symbol id="i-vote" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1 2v14h12V5zm2.500 8.500 2 2 5-5-1.400-1.400-3.600 3.600-.6-.6z" fill="currentColor"/></symbol>
        <symbol id="i-mega" viewBox="0 0 24 24"><path d="M3 10v4a1 1 0 0 0 1 1h2l1 5h2.500l-1-5H10l9 4V5l-9 4H4a1 1 0 0 0-1 1zm17 .5v3a2 2 0 0 0 0-3z" fill="currentColor"/></symbol>
        <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.500 6.500a1.200 1.200 0 1 0 0 2.400 1.200 1.200 0 0 0 0-2.400zm4.500 0a1.200 1.200 0 1 0 0 2.400 1.200 1.200 0 0 0 0-2.400zm4.500 0a1.200 1.200 0 1 0 0 2.400 1.200 1.200 0 0 0 0-2.400z" fill="currentColor"/></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.500 2L12 12.500 19.500 7zM4 9v8h16V9l-8 5.500z" fill="currentColor"/></symbol>
        <symbol id="i-dl" viewBox="0 0 24 24"><path d="M11 3h2v9l3.500-3.500 1.400 1.400L12 15.800 6.100 9.900l1.400-1.400L11 12zM5 18h14v2H5z" fill="currentColor"/></symbol>
        <symbol id="i-eye" viewBox="0 0 24 24"><path d="M12 5c5 0 9 4.500 10 7-1 2.500-5 7-10 7S3 14.500 2 12c1-2.500 5-7 10-7zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="currentColor"/></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 11h13l-5-5 1.400-1.400L21 12l-7.600 7.400L12 18l5-5H4z" fill="currentColor"/></symbol>
        <symbol id="i-fb" viewBox="0 0 24 24"><path d="M13.500 22v-8.200h2.800l.5-3.300h-3.300V8.400c0-.9.400-1.700 1.800-1.700h1.600V3.900S15.600 3.700 14.400 3.700c-2.600 0-4.200 1.600-4.200 4.400v2.400H7.400v3.300h2.800V22z" fill="currentColor"/></symbol>
        <symbol id="i-ig" viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.500a4.500 4.500 0 1 1 0 9 4.500 4.500 0 0 1 0-9zm0 2a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5zm5.200-3.200a1.100 1.100 0 1 1 0 2.200 1.100 1.100 0 0 1 0-2.200z" fill="currentColor"/></symbol>
        <symbol id="i-yt" viewBox="0 0 24 24"><path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" fill="currentColor"/></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/></symbol>
      </svg>

      <a className="skip" href="#contenido">Saltar al contenido</a>

      {/* HEADER */}
      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="#inicio" aria-label="RELIDD, Elecciones 2026">
            <img className="logo-r" src="/img/logo-relidd.png" alt="RELIDD" />
            <span className="sep" aria-hidden="true"></span>
            <img className="logo-e" src="/img/logo-elecciones.png" alt="Elecciones Nacionales y Departamentales RELIDD 2026" />
          </a>
          <button 
            className="burger" 
            aria-label="Abrir menú" 
            aria-expanded={mobileMenuOpen} 
            aria-controls="menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav id="menu" aria-label="Principal" className={mobileMenuOpen ? 'open' : ''}>
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={item.href} 
                className={activeSection === item.id ? 'on' : ''}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <svg><use href={`#i-${item.icon}`}/></svg>
                {item.label}
              </a>
            ))}
            <Link 
              href="/acceso/" 
              className="text-relidd-red flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
              title="Acceso exclusivo Comité Electoral"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-relidd-red"><use href="#i-lock"/></svg>
              <span>Comité</span>
            </Link>
          </nav>
        </div>
        <div className="stripe" aria-hidden="true"></div>
      </header>

      <main id="contenido">
        {/* HERO SECTION */}
        <section id="inicio" className="hero">
          <div className="hero-inner wrap">
            <figure className={`mascota ${config.banner?.transparente ? 'libre' : ''}`}>
              <img 
                id="banner-img" 
                src={config.banner?.imagen || "/img/Tilcayo-cartel.jpeg"} 
                alt="Tilkayo, mascota de RELIDD" 
                width="400" 
                height="590" 
              />
            </figure>
            <div className="hero-text">
              <h1>
                <span className="k">ELECCIONES</span>
                <span className="r">RELIDD 2026</span>
              </h1>
              <p className="lema">Participa. Decide. Construye.</p>
              <svg className="swoosh" viewBox="0 0 400 30" aria-hidden="true">
                <path d="M5 22C90 4 200 4 300 14" stroke="#A40029" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M40 24C130 10 230 10 340 18" stroke="#F2C500" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M90 27C170 16 250 16 360 22" stroke="#14833B" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <aside className="hero-side">
              <p className="mensaje">
                {isCerrado 
                  ? (config.empadronamiento?.mensajeCerrado || "El período de empadronamiento ha concluido. Consulta el calendario electoral para conocer las siguientes etapas.") 
                  : "¡Empadrónate y sé parte del proceso democrático!"}
              </p>
              <span className="anio">2026</span>
              {isCerrado ? (
                <a className="btn btn-red" id="btn-emp" href="#calendario">
                  Ver el calendario electoral <svg><use href="#i-arrow"/></svg>
                </a>
              ) : config.enlaces?.empadronamiento ? (
                <a 
                  className="btn btn-red" 
                  id="btn-emp" 
                  href={config.enlaces.empadronamiento} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ir al empadronamiento <svg><use href="#i-arrow"/></svg>
                </a>
              ) : (
                <a className="btn btn-red" id="btn-emp" href="#calendario">
                  Ir al empadronamiento <svg><use href="#i-arrow"/></svg>
                </a>
              )}
              {!isCerrado && config.aviso && (
                <p className="aviso" id="aviso">{config.aviso}</p>
              )}
            </aside>
          </div>
        </section>

        {/* ACCESOS RÁPIDOS */}
        <section className="wrap cards" aria-label="Accesos rápidos">
          <a className="card c-red" href="#documentos">
            <svg><use href="#i-mega"/></svg>
            <span>Convocatoria<br/>y Reglamento</span>
          </a>
          <a className="card c-green" href="#calendario">
            <svg><use href="#i-cal"/></svg>
            <span>Calendario<br/>Electoral</span>
          </a>
          <a className="card c-yellow" href="#candidaturas">
            <svg><use href="#i-users"/></svg>
            <span>Candidaturas<br/>y Propuestas</span>
          </a>
          <a className="card c-purple" href="#votacion">
            <svg><use href="#i-vote"/></svg>
            <span>Acceso a la<br/>Votación</span>
          </a>
          <a className="card c-green" href="#comunicados">
            <svg><use href="#i-chat"/></svg>
            <span>Comunicados<br/>y Resultados</span>
          </a>
        </section>

        {/* INFO PANELS */}
        <section className="wrap info">
          <article className="panel p-sobre" id="proceso">
            <h2 className="t t-red">Sobre el proceso electoral</h2>
            <p id="txt-sobre">
              {config.textos?.sobre || "Las Elecciones RELIDD 2026 constituyen un espacio de participación democrática para la elección de la representación nacional y las coordinaciones departamentales de la organización, conforme al Estatuto y al Reglamento Electoral vigente."}
            </p>
            {showMoreAbout && (
              <div id="mas" className="mas">
                <p id="txt-sobremas">
                  {config.textos?.sobreMas || "Se elegirá una plancha nacional (Presidencia, Vicepresidencia, Secretaría General y Tesorería) y las Coordinaciones Departamentales, de forma simultánea y mediante votación electrónica, según la Convocatoria N.º 001/2026."}
                </p>
              </div>
            )}
            <button 
              className="btn btn-red" 
              id="btn-mas" 
              aria-expanded={showMoreAbout} 
              aria-controls="mas"
              onClick={() => setShowMoreAbout(!showMoreAbout)}
            >
              {showMoreAbout ? 'Ver menos ' : 'Conoce más '}
              <svg><use href="#i-arrow"/></svg>
            </button>
          </article>

          <article className="panel p-docs">
            <h2 className="t t-green">Documentos importantes</h2>
            <ul className="mini" id="docs-mini">
              {documents.slice(0, 3).map((d, idx) => (
                <li key={idx}>
                  <a 
                    href={d.archivo || '#documentos'} 
                    target={d.archivo && d.archivo.startsWith('http') ? '_blank' : undefined} 
                    rel="noopener"
                  >
                    <svg><use href="#i-doc"/></svg>
                    <span>{d.t}</span>
                    <svg><use href="#i-dl"/></svg>
                  </a>
                </li>
              ))}
            </ul>
            <a className="btn btn-red" href="#documentos">
              Ver todos los documentos <svg><use href="#i-arrow"/></svg>
            </a>
            <p className="frase" aria-hidden="true">Construyamos juntas y juntos una RELIDD más fuerte</p>
          </article>
        </section>

        {/* CALENDARIO ELECTORAL */}
        <section id="calendario" className="wrap sec">
          <h2 className="st"><i className="bar g"></i>Calendario electoral</h2>
          <p className="lead">
            Fechas previstas según la Convocatoria N.º 001/2026. Cualquier modificación se publicará oficialmente en <a href="#comunicados">Comunicados</a>.
          </p>
          <ol className="timeline" id="timeline">
            {sortedCalendar.map((item, idx) => {
              let est = '';
              let tag = '';
              if (todayStr > item.fin) {
                est = 'past';
                tag = 'Realizado';
              } else if (todayStr >= item.ini) {
                est = 'now';
                tag = 'En curso';
              }

              return (
                <li key={item.id || idx} className={`ev ${est}`}>
                  <div className="fe">{item.f}</div>
                  <div className="bd">
                    <h3>
                      {item.t}
                      {tag && <em className="tag-est">{tag}</em>}
                    </h3>
                    <p>{item.d}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* DOCUMENTOS */}
        <section id="documentos" className="wrap sec">
          <h2 className="st"><i className="bar r"></i>Documentos</h2>
          <p className="lead">Biblioteca de documentos oficiales del proceso electoral.</p>
          <div className="docs" id="docs">
            {documents.map((docItem, idx) => {
              const isPdf = docItem.archivo && docItem.archivo.includes('.pdf');
              return (
                <article key={docItem.id || idx} className="doc">
                  <svg><use href="#i-doc"/></svg>
                  <div>
                    <h3>
                      {docItem.t}
                      {docItem.estado && <em className="tag ml-2 px-2 py-0.5 rounded text-xs">{docItem.estado}</em>}
                    </h3>
                    <p>{docItem.d}</p>
                    <div className="acts">
                      {!docItem.archivo ? (
                        <span className="pronto">Próximamente</span>
                      ) : isPdf ? (
                        <>
                          <a className="btn btn-sm" href={docItem.archivo} target="_blank" rel="noopener">
                            <svg><use href="#i-eye"/></svg> Ver
                          </a>
                          <a className="btn btn-sm btn-line" href={docItem.archivo} download>
                            <svg><use href="#i-dl"/></svg> Descargar
                          </a>
                        </>
                      ) : (
                        <a className="btn btn-sm" href={docItem.archivo} target={docItem.archivo.startsWith('http') ? '_blank' : undefined} rel="noopener">
                          <svg><use href="#i-eye"/></svg> Ver
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CANDIDATURAS */}
        <section id="candidaturas" className="wrap sec">
          <h2 className="st"><i className="bar y"></i>Candidaturas y propuestas</h2>
          <div id="cands">
            {candidaturas.length > 0 ? (
              <div className="grid-c">
                {candidaturas.map((cand, idx) => (
                  <article key={cand.id || idx} className="cand">
                    {cand.foto ? (
                      <img src={cand.foto} alt={`Foto de ${cand.nombre}`} loading="lazy" />
                    ) : (
                      <div className="noimg">
                        <svg><use href="#i-users"/></svg>
                      </div>
                    )}
                    <div>
                      <small>{cand.tipo || ""}</small>
                      <h3>{cand.nombre}</h3>
                      <p className="cg">
                        {cand.cargo || ""}{cand.departamento ? ` · ${cand.departamento}` : ""}
                      </p>
                      <p>{cand.propuesta || ""}</p>
                      {cand.plan && (
                        <a className="btn btn-sm mt-2" target="_blank" rel="noopener" href={cand.plan}>
                          Plan de trabajo
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="vacio">
                <svg><use href="#i-users"/></svg>
                <div>
                  <h3>Aún no hay candidaturas publicadas</h3>
                  <p>La publicación de candidaturas habilitadas e inhabilitadas está prevista para el 20 de noviembre. Aquí se mostrarán fotografías, nombres, cargos y propuestas.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* VOTACIÓN */}
        <section id="votacion" className="wrap sec">
          <h2 className="st"><i className="bar p"></i>Votación</h2>
          <div className="vota">
            <div className="vota-txt">
              <h3>¿Cómo se accede a la votación?</h3>
              <ul className="check">
                <li>La votación es <b>electrónica</b>, personal, secreta e intransferible.</li>
                <li>Pueden votar los miembros que figuren en el <b>Padrón Electoral Definitivo</b>.</li>
                <li>Cada persona habilitada emite un voto para la elección nacional y otro para la de su departamento.</li>
                <li id="txt-vfecha">
                  {config.textos?.votacionFecha || "Fecha y hora previstas: lunes 7 de diciembre de 2026, de 10:00 a 16:00 (hora de Bolivia)."}
                </li>
                <li>El enlace, las credenciales y las instrucciones se comunicarán únicamente por los canales oficiales de RELIDD.</li>
              </ul>
              {config.enlaces?.votacion ? (
                <a 
                  className="btn btn-big" 
                  id="btn-voto" 
                  href={config.enlaces.votacion} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ir a la plataforma de votación
                </a>
              ) : (
                <a className="btn btn-big" id="btn-voto" href="#votacion" aria-disabled="true">
                  Acceso a votación próximamente
                </a>
              )}
              <p className="nota mt-3 text-sm text-gray-500">
                Este portal no recibe ni almacena votos: la votación se realizará en la plataforma oficial que apruebe el Comité Electoral.
              </p>
            </div>
            <figure className="mascota chica">
              <img 
                src="/img/Tilcayo-celebrando.jpeg" 
                alt="Tilkayo celebrando con un cartel en alto" 
                width="300" 
                height="440" 
                loading="lazy" 
              />
            </figure>
          </div>
        </section>

        {/* COMUNICADOS */}
        <section id="comunicados" className="wrap sec">
          <h2 className="st"><i className="bar g"></i>Comunicados y resultados</h2>
          <div id="coms">
            {comunicados.length > 0 ? (
              <div className="docs">
                {comunicados.map((c, idx) => (
                  <article key={c.id || idx} className="doc">
                    <svg><use href="#i-mega"/></svg>
                    <div>
                      <small className="text-xs text-gray-500">{c.fecha || ""}</small>
                      <h3>{c.titulo}</h3>
                      <p>{c.resumen || ""}</p>
                      {c.archivo && (
                        <div className="acts">
                          <a className="btn btn-sm" target="_blank" rel="noopener" href={c.archivo}>
                            Ver documento
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="vacio">
                <svg><use href="#i-chat"/></svg>
                <div>
                  <h3>Sin comunicados por el momento</h3>
                  <p>Aquí se publicarán los comunicados oficiales, resoluciones, actas y resultados del proceso.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="wrap sec">
          <h2 className="st"><i className="bar r"></i>Contacto</h2>
          <div className="contact">
            <a className="mailcard" id="mail" href={`mailto:${config.correo || 'elecciones@relidd.org'}`}>
              <svg><use href="#i-mail"/></svg>
              <span>
                <small>Correo institucional</small>
                {config.correo || 'elecciones@relidd.org'}
              </span>
            </a>
            <div>
              <p className="lead">Comité Electoral Nacional – RELIDD 2026. Canal oficial de atención y consultas para todos los miembros y candidaturas del proceso electoral.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="stripe" aria-hidden="true"></div>
        <div className="wrap fgrid">
          <div className="fbrand">
            <span className="chip"><img src="/img/logo-elecciones.png" alt="Elecciones RELIDD 2026" style={{ height: '56px', width: 'auto' }} /></span>
          </div>
          <p className="fcom">
            Comité Electoral Nacional – RELIDD 2026<br/>
            <small>Participa. Decide. Construye.</small>
          </p>
          <a className="fmail" href={`mailto:${config.correo || 'elecciones@relidd.org'}`}>
            <svg><use href="#i-mail"/></svg>
            {config.correo || 'elecciones@relidd.org'}
          </a>
          <div className="w-full text-xs text-center border-t border-red-900/40 pt-4 flex justify-between items-center opacity-80">
            <span>© 2026 RELIDD - Todos los derechos reservados.</span>
            <Link href="/acceso/" className="hover:underline flex items-center gap-1 text-yellow-200">
              <svg className="w-3.5 h-3.5"><use href="#i-lock"/></svg> Panel de Control del Comité
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
