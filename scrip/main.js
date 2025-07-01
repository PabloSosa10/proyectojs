//calculadora par emprendimientos
// impuestos y cosas que duelen
const formularioImpuestos = document.getElementById('formularioImpuestos');
const contenedorFormularioImpuestos = document.getElementById('contenedorFormularioImpuestos');
const formularioTipoProducto = document.getElementById('formularioTipoProducto');
const valorProducto = document.getElementById('valorProducto');            
const paisProducto = document.getElementById('paisProducto');             
const calcularValorImpuestos = document.getElementById('calcularValorImpuestos'); 
const importarImpuestosDisplay = document.getElementById('importarImpuestosDisplay'); 
const valorImpuestosOutput = document.getElementById('valorImpuestosOutput');     
const errorImpuestosMensaje = document.getElementById('errorImpuestosMensaje');           

//ganacias y trabajo en negro

const formularioGanancia = document.getElementById('formularioGanancia');      
const contenedorFormularioGanancia = document.getElementById('contenedorFormularioGanancia');
const valorProductoDos = document.getElementById('valorProductoDos');      
const margenGanancia = document.getElementById('margenGanancia');         
const calcularGananciaBoton = document.getElementById('calcularGananciaBoton'); 
const resultadoGanancia = document.getElementById('resultadoGanancia');     
const precioSugerido = document.getElementById('precioSugerido');         
const gananciaEstimada = document.getElementById('gananciaEstimada');     
const errorGananciaMensaje = document.getElementById('errorGananciaMensaje'); 

//historial (no se me ocurrio otro chiste)

const historialContenedor = document.getElementById('historialContenedor'); 
const sinHistorial = document.getElementById('sinHistorial');             
const borrarHistorial = document.getElementById('borrarHistorial');

// aca guardo el historial 

let calculations = [];

const Iva = 21;
const Mercosur = ["argentina", "bolivia", "uruguay", "brasil", "paraguay"];

class Calculo {
    constructor(id, tipo, fechaCreacion) {
        this.id = id; 
        this.tipo = tipo; 
        this.fechaCreacion = fechaCreacion || new Date().toISOString(); 
    }
}

class CalculoImpuestoImportacion extends Calculo {
    constructor(id, valor, pais, tipoProducto, precioConImpuestos, fechaCreacion) { 
        super(id, 'impuestoImportacion', fechaCreacion); 
        this.valor = valor;
        this.pais = pais;
        this.tipoProducto = tipoProducto;
        this.precioConImpuestos = precioConImpuestos;
    }
}

class CalculoMargenGanancia extends Calculo { 
    constructor(id, costo, porcentajeGanancia, precioVentaSugerido, gananciaEstimada, fechaCreacion) {
        super(id, 'margenGanancia', fechaCreacion); 
        this.costo = costo;
        this.porcentajeGanancia = porcentajeGanancia;
        this.precioVentaSugerido = precioVentaSugerido; 
        this.gananciaEstimada = gananciaEstimada;
    }
}
 
function calcularConIVA(valorBase) {
    return valorBase * (1 + Iva / 100);
}

function calcularCompleto(valorBase) {
    const recargoAdicional = 0.50;
    return valorBase * (1 + Iva / 100 + recargoAdicional);
}

function calcularMargenGanancia(costo, porcentajeGanancia) {
    if (porcentajeGanancia < 0) { 
        porcentajeGanancia = 0;
    }
    const precioVenta = costo * (1 + porcentajeGanancia / 100);
    const gananciaEstimada = precioVenta - costo;
    return { precioVenta: precioVenta, gananciaEstimada: gananciaEstimada };
}

function guardarCalculosEnLocalStorage() {
     const calculosParaGuardar = calculations.map(calc => {
        if (calc.type === 'impuestoImportacion') {
            return {
                id: calc.id,
                type: calc.type,
                fechaCreacion: calc.fechaCreacion,
                valor: calc.valor,
                pais: calc.pais,
                tipoProducto: calc.tipoProducto,
                precioConImpuestos: calc.precioConImpuestos
            };
        } else if (calc.type === 'margenGanancia') {
            return {
                id: calc.id,
                type: calc.type,
                fechaCreacion: calc.fechaCreacion,
                costo: calc.costo,
                porcentajeGanancia: calc.porcentajeGanancia,
                precioVentaSugerido: calc.precioVentaSugerido,
                gananciaEstimada: calc.gananciaEstimada
            };
        }
        return calc; 
    });
    localStorage.setItem('historialCalcuPyME', JSON.stringify(calculosParaGuardar));
}

function cargarCalculosDesdeLocalStorage() {
    const dataGuardada = localStorage.getItem('historialCalcuPyME');
    if (dataGuardada) {
        const calculosPlanos = JSON.parse(dataGuardada);
        calculations = calculosPlanos.map(calcData => {
            if (calcData.type === 'impuestoImportacion') {
                return new CalculoImpuestoImportacion(
                    calcData.id,
                    calcData.valor,
                    calcData.pais,
                    calcData.tipoProducto,
                    calcData.precioConImpuestos,
                    calcData.fechaCreacion 
                );
            } else if (calcData.type === 'margenGanancia') {
                return new CalculoMargenGanancia(
                    calcData.id,
                    calcData.costo,
                    calcData.porcentajeGanancia,
                    calcData.precioVentaSugerido,
                    calcData.gananciaEstimada,
                    calcData.fechaCreacion 
                );
            }
            return null; 
        }).filter(Boolean); 

        renderizarHistorial(); 
    }
}

function borrarCalculo(id) {
    calculations = calculations.filter(calc => calc.id !== id);
    guardarCalculosEnLocalStorage();
    renderizarHistorial();
}

function borrarTodoElHistorial() {
    calculations = [];
    localStorage.removeItem('historialCalcuPyME');
    renderizarHistorial();
}
function renderizarHistorial() {
    historialContenedor.innerHTML = ''; 

    if (calculations.length === 0) {
        sinHistorial.style.display = 'block';     
        borrarHistorial.style.display = 'none';    
        return; 
    } else {
        sinHistorial.style.display = 'none';      
        borrarHistorial.style.display = 'block';   
    }

    calculations.forEach(calculo => {
        const columnaCard = document.createElement('div');
        columnaCard.className = 'col'; 

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card h-100 shadow-sm'; 

        let contenidoCuerpoTarjeta = ''; 
        let tituloTarjeta = '';

        if (calculo.type === 'impuestoImportacion') {
            tituloTarjeta = 'Cálculo de Impuestos';
            contenidoCuerpoTarjeta = `
                <p class="card-text"><strong>Valor Producto:</strong> $${calculo.valor.toFixed(2)}</p>
                <p class="card-text"><strong>País Origen:</strong> ${calculo.pais}</p>
                <p class="card-text"><strong>Tipo:</strong> ${calculo.tipoProducto || 'No especificado'}</p>
                <p class="card-text text-success"><strong>Precio Final:</strong> $${calculo.precioConImpuestos.toFixed(2)}</p>
            `;
        } else if (calculo.type === 'margenGanancia') {
            tituloTarjeta = 'Cálculo de Margen';
            contenidoCuerpoTarjeta = `
                <p class="card-text"><strong>Costo:</strong> $${calculo.costo.toFixed(2)}</p>
                <p class="card-text"><strong>Margen:</strong> ${calculo.porcentajeGanancia}%</p>
                <p class="card-text text-primary"><strong>Precio Venta Sugerido:</strong> $${calculo.precioVentaSugerido.toFixed(2)}</p>
                <p class="card-text"><strong>Ganancia Estimada:</strong> $${calculo.gananciaEstimada.toFixed(2)}</p>
            `;
        }
        
        tarjeta.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${tituloTarjeta}</h5>
                ${contenidoCuerpoTarjeta}
                <small class="text-muted d-block mt-2">Guardado el: ${new Date(calculo.fechaCreacion).toLocaleString()}</small>
                <button class="btn btn-sm btn-outline-danger mt-3 boton-borrar-card" data-id="${calculo.id}">Borrar</button>
            </div>
        `;
        columnaCard.appendChild(tarjeta);
        historialContenedor.appendChild(columnaCard);
    });

    document.querySelectorAll('.boton-borrar-card').forEach(boton => {
        boton.addEventListener('click', (evento) => borrarCalculo(parseInt(evento.target.dataset.id)));
    });
}

// de aca para abajo todo fue realizado con bronca

calcularValorImpuestos.addEventListener('click', () => {
    errorImpuestosMensaje.innerHTML = '';   
    importarImpuestosDisplay.style.display = 'none';
    const valor = parseFloat(valorProducto.value);
    const pais = paisProducto.value.toLocaleLowerCase().trim(); 
    const tipoProducto = formularioTipoProducto.value;

    if (isNaN(valor) || valor <= 0) {
        importTaxMessage.innerHTML = '<div class="alert alert-danger">Por favor, ingresa un valor de producto válido y mayor a cero.</div>';
        return; 
    }
    if (pais === '') {
        importTaxMessage.innerHTML = '<div class="alert alert-danger">Por favor, ingresa el país de origen.</div>';
        return;
    }
    if (tipoProducto === '') {
        importTaxMessage.innerHTML = '<div class="alert alert-danger">Por favor, selecciona un tipo de producto.</div>';
        return;
    }

    let precioFinal;
    if (Mercosur.includes(pais)) {
        precioFinal = calcularConIVA(valor); 
    } else {
        precioFinal = calcularCompleto(valor);
    }

    valorImpuestosOutput.textContent = `$${precioFinal.toFixed(2)}`;
    importarImpuestosDisplay.style.display = 'block'; 
    const nuevoCalculo = new CalculoImpuestoImportacion(
        Date.now(), 
        valor,
        pais,
        tipoProducto,
        precioFinal
    );

    calculations.push(nuevoCalculo); 
    guardarCalculosEnLocalStorage(); 
    renderizarHistorial(); 
    valorProducto.value = '';
    paisProducto.value = '';
    formularioTipoProducto.value = '';
});

calcularGananciaBoton.addEventListener('click', () => {
    errorGananciaMensaje.innerHTML = '';
    resultadoGanancia.style.display = 'none';
    const costo = parseFloat(valorProductoDos.value);
    const porcentajeGanancia = parseFloat(margenGanancia.value);

    
    if (isNaN(costo) || costo <= 0) {
        profitMarginMessage.innerHTML = '<div class="alert alert-danger">Por favor, ingresa un costo de producto válido y mayor a cero.</div>';
        return;
    }

    if (isNaN(porcentajeGanancia) || porcentajeGanancia < 0 || porcentajeGanancia > 1000) { 
        profitMarginMessage.innerHTML = '<div class="alert alert-danger">Por favor, ingresa un porcentaje de ganancia válido (entre 0 y 1000).</div>';
        return;
    }
    
    const { precioVenta, gananciaEstimada } = calcularMargenGanancia(costo, porcentajeGanancia); 

    precioSugerido.textContent = `$${precioVenta.toFixed(2)}`;
    gananciaEstimada.textContent = `$${gananciaEstimada.toFixed(2)}`;
    resultadoGanancia.style.display = 'block'; 

    const nuevoCalculo = new CalculoMargenGanancia(
        Date.now(), 
        costo,
        porcentajeGanancia,
        precioVenta,
        gananciaEstimada
    );

    calculations.push(nuevoCalculo); 
    guardarCalculosEnLocalStorage(); 
    renderizarHistorial(); 

    valorProductoDos.value = '';
    margenGanancia.value = '';
});

borrarHistorial.addEventListener('click', borrarTodoElHistorial);