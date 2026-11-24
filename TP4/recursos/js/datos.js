
let carga;
export async function obtenerProductos() {
    if (!carga) {
        carga = cargarProductos().catch(error => {
            carga = undefined;
            throw error;
        });
    }
    return carga;
}
export async function cargarProductos(fetcher = fetch) {
    const respuesta = await fetcher(new URL('../productos.json', import.meta.url));
    if (!respuesta.ok) throw new Error('Error HTTP ' + respuesta.status);
    const productos = await respuesta.json();
    if (!Array.isArray(productos)) throw new Error('El catálogo debe ser un arreglo');
    const ids = new Set();
    for (const producto of productos) {
        if (!producto || !['id', 'nombre', 'descripcion', 'categoria', 'imagen', 'detalle'].every(
            campo => typeof producto[campo] === 'string' && producto[campo].trim()) ||
            !Number.isFinite(producto.precio) || producto.precio < 0 || ids.has(producto.id)) {
            throw new Error('Producto inválido');
        }
        ids.add(producto.id);
    }
    return productos;
}
