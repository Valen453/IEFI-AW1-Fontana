// Una lectura dañada nunca debe impedir que se abra el sitio.
export function leerJSON(clave, respaldo, almacenamiento) {
    try { return JSON.parse((almacenamiento ?? localStorage).getItem(clave)) ?? respaldo; }
    catch { return respaldo; }
}
export function guardarJSON(clave, valor, almacenamiento = localStorage) {
    almacenamiento.setItem(clave, JSON.stringify(valor));
}
export function leerCarrito() {
    const datos = leerJSON('chiavetta-carrito', []);
    if (!Array.isArray(datos)) return [];
    const articulos = [];
    for (const item of datos) {
        if (!item || typeof item.id !== 'string' || !Number.isInteger(item.cantidad) || item.cantidad < 1) continue;
        const existente = articulos.find((articulo) => articulo.id === item.id);
        if (existente) existente.cantidad = Math.min(99, existente.cantidad + item.cantidad);
        else articulos.push({ id: item.id, cantidad: Math.min(99, item.cantidad) });
    }
    return articulos;
}
export const guardarCarrito = (carrito) => guardarJSON('chiavetta-carrito', carrito);

