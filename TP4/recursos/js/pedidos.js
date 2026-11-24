
export const telefonoNegocio = '543513090597';
export function crearEnlaceWhatsApp(texto, telefono = telefonoNegocio) {
    if (!/^[1-9][0-9]{7,14}$/.test(telefono)) throw new Error('Teléfono inválido');
    return 'https://wa.me/' + telefono + '?text=' + encodeURIComponent(texto);
}
export function textoPedido(pedido) {
    return ['Pedido ' + pedido.numero,
        ...pedido.articulos.map(item => item.nombre + ' x ' + item.cantidad +
            ' = $' + (item.precio * item.cantidad)),
        'Descuento $' + pedido.descuento,
        'Impuesto de ejemplo $' + pedido.impuesto,
        'Total ARS $' + pedido.total,
        'Solicito confirmar disponibilidad y coordinar la entrega.'].join('\n');
}
export function ofrecerEnvio(contenedor, texto) {
    let enlace = contenedor.querySelector('.enviar-whatsapp');
    if (!enlace) {
        enlace = document.createElement('a');
        enlace.className = 'boton enviar-whatsapp';
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
        contenedor.append(enlace);
    }
    enlace.href = crearEnlaceWhatsApp(texto);
    enlace.textContent = 'Abrir WhatsApp para enviar';
}
