// ========================
// ENTIDADES DEL DOMINIO
// ========================

export interface CategoriaEjercicio {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  creadoEn: string;
}

export interface Metrica {
  id: string;
  nombre: string;
  unidad: string;
  mayorEsMejor: boolean; // true = mayor valor es mejor rendimiento
}

export interface Ejercicio {
  id: string;
  nombre: string;
  categoriaId: string;
  descripcion: string;
  metricas: Metrica[];
  creadoEn: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  creadoEn: string;
}

export interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  equipoId: string;
  posicion: string;
  numero: number | null;
  altura: number | null;   // cm
  peso: number | null;     // kg
  edad: number | null;
  fechaNacimiento: string;
  creadoEn: string;
}

export interface EntrenamientoEjercicio {
  ejercicioId: string;
  notas: string;
}

export interface SesionEntrenamiento {
  id: string;
  fecha: string; // ISO date string YYYY-MM-DD
  equipoId: string;
  ejercicios: EntrenamientoEjercicio[];
  notas: string;
  creadoEn: string;
}

export interface ValorMetrica {
  metricaId: string;
  valor: number;
}

export interface ResultadoEjercicio {
  id: string;
  sesionId: string;
  ejercicioId: string;
  jugadorId: string;
  valores: ValorMetrica[];
  creadoEn: string;
}

// ========================
// TIPOS DE RANKING
// ========================

export interface PuntuacionJugador {
  jugador: Jugador;
  promedio: number;
  totalRegistros: number;
}

export interface RankingEquipo {
  equipo: Equipo;
  promedio: number;
  totalJugadores: number;
  totalRegistros: number;
}

export interface RankingCategoria {
  categoria: CategoriaEjercicio;
  promedio: number;
  totalRegistros: number;
}

// ========================
// USUARIOS Y LOGIN
// ========================

export type RolUsuario = 'admin' | 'usuario';

export interface Usuario {
  id: string;
  username: string;
  password?: string;
  rol: RolUsuario;
  nombre: string;
  creadoEn: string;
}
