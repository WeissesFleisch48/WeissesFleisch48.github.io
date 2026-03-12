import type {
  CategoriaEjercicio,
  Ejercicio,
  Equipo,
  Jugador,
  SesionEntrenamiento,
  ResultadoEjercicio,
  Usuario,
} from '../entities';

export interface ICategoriaEjercicioRepository {
  findAll(): Promise<CategoriaEjercicio[]>;
  findById(id: string): Promise<CategoriaEjercicio | null>;
  save(categoria: CategoriaEjercicio): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IEjercicioRepository {
  findAll(): Promise<Ejercicio[]>;
  findById(id: string): Promise<Ejercicio | null>;
  findByCategoria(categoriaId: string): Promise<Ejercicio[]>;
  save(ejercicio: Ejercicio): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IEquipoRepository {
  findAll(): Promise<Equipo[]>;
  findById(id: string): Promise<Equipo | null>;
  save(equipo: Equipo): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IJugadorRepository {
  findAll(): Promise<Jugador[]>;
  findById(id: string): Promise<Jugador | null>;
  findByEquipo(equipoId: string): Promise<Jugador[]>;
  save(jugador: Jugador): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ISesionEntrenamientoRepository {
  findAll(): Promise<SesionEntrenamiento[]>;
  findById(id: string): Promise<SesionEntrenamiento | null>;
  findByEquipo(equipoId: string): Promise<SesionEntrenamiento[]>;
  findByFecha(fechaInicio: string, fechaFin: string): Promise<SesionEntrenamiento[]>;
  save(sesion: SesionEntrenamiento): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IResultadoEjercicioRepository {
  findAll(): Promise<ResultadoEjercicio[]>;
  findById(id: string): Promise<ResultadoEjercicio | null>;
  findBySesion(sesionId: string): Promise<ResultadoEjercicio[]>;
  findByJugador(jugadorId: string): Promise<ResultadoEjercicio[]>;
  findByEjercicio(ejercicioId: string): Promise<ResultadoEjercicio[]>;
  save(resultado: ResultadoEjercicio): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IUsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: string): Promise<Usuario | null>;
  findByUsername(username: string): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<void>;
  delete(id: string): Promise<void>;
}
