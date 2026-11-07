export interface CalendarItem {
  id?: string;
  f: string;
  ini: string;
  fin: string;
  t: string;
  d: string;
}

export interface DocumentItem {
  id?: string;
  t: string;
  d: string;
  archivo: string | null;
  estado?: string;
}

export interface CandidaturaItem {
  id?: string;
  tipo: 'Plancha nacional' | 'Coordinación Departamental';
  nombre: string;
  cargo: string;
  departamento: string;
  foto?: string;
  propuesta?: string;
  plan?: string;
}

export interface ComunicadoItem {
  id?: string;
  fecha: string;
  titulo: string;
  resumen: string;
  archivo?: string | null;
}

export interface SiteConfig {
  correo: string;
  enlaces: {
    empadronamiento: string;
    votacion: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  aviso: string;
  empadronamiento: {
    cierre: string;
    mensajeCerrado: string;
  };
  banner: {
    imagen: string;
    transparente: boolean;
  };
  textos: {
    sobre: string;
    sobreMas: string;
    votacionFecha: string;
  };
}
