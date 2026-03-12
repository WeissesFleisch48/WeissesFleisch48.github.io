// Contenedor de Inyección de Dependencias
// Instancia cada repositorio concreto y los inyecta en los casos de uso

import { LocalStorageCategoriaEjercicioRepository } from './repositories/LocalStorageCategoriaRepository';
import { LocalStorageEjercicioRepository } from './repositories/LocalStorageEjercicioRepository';
import { LocalStorageEquipoRepository } from './repositories/LocalStorageEquipoRepository';
import { LocalStorageJugadorRepository } from './repositories/LocalStorageJugadorRepository';
import { LocalStorageSesionRepository } from './repositories/LocalStorageSesionRepository';
import { LocalStorageResultadoRepository } from './repositories/LocalStorageResultadoRepository';
import { LocalStorageUsuarioRepository } from './repositories/LocalStorageUsuarioRepository';

import { CategoriaEjercicioUseCases } from '../core/application/use-cases/CategoriaEjercicioUseCases';
import { EjercicioUseCases } from '../core/application/use-cases/EjercicioUseCases';
import { EquipoUseCases } from '../core/application/use-cases/EquipoUseCases';
import { JugadorUseCases } from '../core/application/use-cases/JugadorUseCases';
import { SesionEntrenamientoUseCases } from '../core/application/use-cases/SesionEntrenamientoUseCases';
import { ResultadoEjercicioUseCases } from '../core/application/use-cases/ResultadoEjercicioUseCases';
import { RankingUseCases } from '../core/application/use-cases/RankingUseCases';
import { AuthUseCases } from '../core/application/use-cases/AuthUseCases';
import { UsuarioUseCases } from '../core/application/use-cases/UsuarioUseCases';

// Instancias de repositorios
const categoriaRepo = new LocalStorageCategoriaEjercicioRepository();
const ejercicioRepo = new LocalStorageEjercicioRepository();
const equipoRepo = new LocalStorageEquipoRepository();
const jugadorRepo = new LocalStorageJugadorRepository();
const sesionRepo = new LocalStorageSesionRepository();
const resultadoRepo = new LocalStorageResultadoRepository();
const usuarioRepo = new LocalStorageUsuarioRepository();

// Instancias de casos de uso (singleton por módulo)
export const categoriaUseCases = new CategoriaEjercicioUseCases(categoriaRepo);
export const ejercicioUseCases = new EjercicioUseCases(ejercicioRepo);
export const equipoUseCases = new EquipoUseCases(equipoRepo);
export const jugadorUseCases = new JugadorUseCases(jugadorRepo);
export const sesionUseCases = new SesionEntrenamientoUseCases(sesionRepo);
export const resultadoUseCases = new ResultadoEjercicioUseCases(resultadoRepo);
export const authUseCases = new AuthUseCases(usuarioRepo);
export const usuarioUseCases = new UsuarioUseCases(usuarioRepo);

export const rankingUseCases = new RankingUseCases(
  categoriaRepo,
  ejercicioRepo,
  equipoRepo,
  jugadorRepo,
  resultadoRepo
);
