// Repositorio genérico en LocalStorage
export function cargarDesdeStorage<T>(clave: string): T[] {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function guardarEnStorage<T>(clave: string, datos: T[]): void {
  localStorage.setItem(clave, JSON.stringify(datos));
}
