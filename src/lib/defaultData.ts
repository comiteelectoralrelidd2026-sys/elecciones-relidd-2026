import { SiteConfig, CalendarItem, DocumentItem, CandidaturaItem, ComunicadoItem } from './types';

export const DEFAULT_CONFIG: SiteConfig = {
  correo: "elecciones@relidd.org",
  enlaces: {
    empadronamiento: "https://forms.gle/Pbz7cqGfAR4AH59g7",
    inscripcion: "https://forms.gle/REhinASGyFHCvdxB8",
    votacion: "",
    facebook: "",
    instagram: "",
    youtube: ""
  },
  aviso: "Empadronamiento: cierra el viernes 6 de noviembre a las 23:59 (hora de Bolivia).",
  empadronamiento: {
    cierre: "2026-11-06T23:59:00-04:00",
    mensajeCerrado: "El período de empadronamiento ha concluido. Consulta el calendario electoral para conocer las siguientes etapas."
  },
  banner: {
    imagen: "/img/Tilcayo-cartel.jpeg",
    transparente: false
  },
  textos: {
    sobre: "Las Elecciones RELIDD 2026 constituyen un espacio de participación democrática para la elección de la representación nacional y las coordinaciones departamentales de la organización, conforme al Estatuto y al Reglamento Electoral vigente.",
    sobreMas: "Se elegirá una plancha nacional (Presidencia, Vicepresidencia, Secretaría General y Tesorería) y las Coordinaciones Departamentales, de forma simultánea y mediante votación electrónica, según la Convocatoria N.º 001/2026.",
    votacionFecha: "Fecha y hora previstas: lunes 7 de diciembre de 2026, de 10:00 a 16:00 (hora de Bolivia)."
  }
};

export const DEFAULT_CALENDAR: CalendarItem[] = [
  { f: "2 – 6 nov", ini: "2026-11-02", fin: "2026-11-06", t: "Empadronamiento electoral", d: "Registro individual mediante el formulario oficial. Cierre el 6 de noviembre a las 23:59." },
  { f: "7 – 9 nov", ini: "2026-11-07", fin: "2026-11-09", t: "Verificación, observaciones y corrección del padrón", d: "Publicación del padrón preliminar y atención de observaciones." },
  { f: "9 nov", ini: "2026-11-09", fin: "2026-11-09", t: "Publicación del Padrón Electoral Definitivo", d: "Nómina válida para postular y ejercer el voto." },
  { f: "10 – 16 nov", ini: "2026-11-10", fin: "2026-11-16", t: "Inscripción de planchas y candidaturas departamentales", d: "Presentación de postulaciones con la documentación exigida. Plazo de 7 días calendario." },
  { f: "17 – 19 nov", ini: "2026-11-17", fin: "2026-11-19", t: "Revisión y verificación de candidaturas", d: "Subsanación de errores formales hasta 48 horas desde la notificación." },
  { f: "20 nov", ini: "2026-11-20", fin: "2026-11-20", t: "Publicación de candidaturas habilitadas e inhabilitadas", d: "Resoluciones fundamentadas de habilitación e inhabilitación." },
  { f: "21 nov – 5 dic", ini: "2026-11-21", fin: "2026-12-05", t: "Campaña electoral", d: "15 días calendario, con acceso equitativo a los canales oficiales." },
  { f: "24 nov", ini: "2026-11-24", fin: "2026-11-24", t: "Publicación de las reglas del debate nacional", d: "Con anticipación mínima de 5 días." },
  { f: "24 nov – 4 dic", ini: "2026-11-24", fin: "2026-12-04", t: "Acreditación de delegados y observadores", d: "Delegados de candidaturas habilitadas, observadores e Instituciones Moderadoras." },
  { f: "29 nov", ini: "2026-11-29", fin: "2026-11-29", t: "Debate nacional y presentaciones departamentales", d: "Transmisión en vivo, con igualdad de condiciones." },
  { f: "Hasta 3 dic", ini: "2026-11-24", fin: "2026-12-03", t: "Aprobación del Instrumento Oficial de Votación", d: "Mediante resolución expresa del Comité Electoral." },
  { f: "6 dic 10:00 – 7 dic 10:00", ini: "2026-12-06", fin: "2026-12-06", t: "Silencio electoral", d: "24 horas sin campaña ni propaganda." },
  { f: "7 dic · 10:00 – 16:00", ini: "2026-12-07", fin: "2026-12-07", t: "Jornada de votación electrónica", d: "Seis horas continuas, hora de Bolivia." },
  { f: "7 dic", ini: "2026-12-07", fin: "2026-12-07", t: "Escrutinio y publicación del Acta General", d: "Publicación oficial inmediata, con fecha y hora." },
  { f: "7 – 9 dic", ini: "2026-12-07", fin: "2026-12-09", t: "Impugnaciones de resultados", d: "48 horas desde la publicación del Acta." },
  { f: "Hasta 14 dic", ini: "2026-12-09", fin: "2026-12-14", t: "Resolución de impugnaciones", d: "Máximo 5 días calendario por impugnación." },
  { f: "14 dic", ini: "2026-12-14", fin: "2026-12-14", t: "Proclamación oficial de autoridades electas", d: "Condicionada a la conclusión de impugnaciones." }
];

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  { t: "Padrón Electoral Oficial RELIDD", d: "Padrón definitivo publicado el 9 de noviembre de 2026. Verifica con tu carnet de identidad.", archivo: "/docs/padron-electoral-definitivo.pdf", estado: "Oficial" },
  { t: "Convocatoria Electoral 2026", d: "Convocatoria N.º 001/2026 · Gestión 2027", archivo: "/docs/convocatoria-electoral-2026.pdf" },
  { t: "Reglamento Electoral", d: "Texto en revisión (Proyecto)", archivo: "/docs/proyecto-reglamento-electoral.pdf", estado: "Proyecto" },
  { t: "Cronograma Electoral", d: "Disponible en esta página, sección Calendario", archivo: "#calendario" },
  { t: "Estatuto Orgánico de RELIDD", d: "Aprobado por la Asamblea General el 3 de mayo de 2026", archivo: "/docs/estatuto-organico-relidd.pdf" },
  { t: "Resoluciones y actas", d: "Se publicarán aquí", archivo: null }
];

export const DEFAULT_CANDIDATURAS: CandidaturaItem[] = [];
export const DEFAULT_COMUNICADOS: ComunicadoItem[] = [];
