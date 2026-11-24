import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calcularTotales, filtrarProductos } from '../recursos/js/catalogo.js';
import { cargarProductos } from '../recursos/js/datos.js';
import { crearEnlaceWhatsApp, textoPedido } from '../recursos/js/pedidos.js';
const productos = JSON.parse(await readFile(new URL('../recursos/productos.json', import.meta.url)));
test('totales sin promoción', () => assert.deepEqual(calcularTotales(1000), {subtotal:1000, descuento:0, impuesto:85,total:1085}));
test('totales con promoción', () => assert.deepEqual(calcularTotales(1000,true), {subtotal:1000,descuento:100,impuesto:77,total:977}));
test('carrito vacío', () => assert.equal(calcularTotales(0).total, 0));
test('subtotal inválido', () => {for(const n of [-1, NaN, Infinity]) assert.throws(()=>calcularTotales(n));});
test('búsqueda ignora mayúsculas y espacios', () => assert.equal(filtrarProductos(productos,' CERA ')[0].id,'cera-carnauba'));
test('categoría y texto se combinan', () => assert.equal(filtrarProductos(productos,'cera','cuidado-interior').length,0));
test('consulta vacía conserva todos sin mutarlos', () => { const copia=JSON.stringify(productos); assert.equal(filtrarProductos(productos).length,4); assert.equal(JSON.stringify(productos),copia); });
test('carga JSON y filtrado integrados', async()=> {
 const lista=await cargarProductos(async()=>({ok:true,json:async()=>productos}));
 assert.equal(filtrarProductos(lista,'','cuidado-interior')[0].id,'kit-interior');
});
test('HTTP fallido se comunica',async()=>assert.rejects(cargarProductos(async()=>({ok:false,status:404})),/404/));
test('JSON inválido se comunica',async()=>assert.rejects(cargarProductos(async()=>({ok:true,json:async()=>{throw new Error('JSON inválido');}})),/JSON/));
test('datos con estructura incorrecta',async()=>assert.rejects(cargarProductos(async()=>({ok:true,json:async()=>[{}]})),/inválido/));
test('WhatsApp conserva caracteres especiales',()=> {
 const mensaje='Pedido & consulta ñ\n$45000';
 assert.equal(new URL(crearEnlaceWhatsApp(mensaje)).searchParams.get('text'),mensaje);
 assert.throws(()=>crearEnlaceWhatsApp(mensaje,'abc'));
});
test('pedido contiene cantidades e importe',()=> {
 const texto=textoPedido({numero:'CD-1',articulos:[{nombre:'Cera',precio:45000,cantidad:2}],descuento:0,impuesto:7650,total:97650});
 assert.match(texto,/Cera x 2 = \$90000/); assert.match(texto,/97650/);
});
