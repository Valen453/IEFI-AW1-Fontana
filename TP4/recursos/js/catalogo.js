export function calcularTotales(subtotal, promocion = false) {
    if (!Number.isFinite(subtotal) || subtotal < 0) throw new Error("Subtotal inválido");
    const descuento = promocion ? Math.round(subtotal * 0.1) : 0;
    // Tasa heredada del TP, solo para la simulación; no representa impuestos reales.
    const impuesto = Math.round((subtotal - descuento) * 0.085);
    return { subtotal, descuento, impuesto, total: subtotal - descuento + impuesto };
}

export function filtrarProductos(productos, texto = "", categoria = "todas") {
    const consulta = texto.trim().toLowerCase();
    return productos.filter((producto) =>
        (producto.nombre.toLowerCase().includes(consulta) ||
         producto.descripcion.toLowerCase().includes(consulta)) &&
        (categoria === "todas" || producto.categoria === categoria));
}
