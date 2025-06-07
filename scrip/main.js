//calculadora par emprendimientos
let continuar = true
//esto calcula si esta en el mercosur
    function CalcularConIVA(Producto){
    const Iva = 21;
    const PorcentajeIVA = Iva * Producto / 100;
    return PorcentajeIVA + Producto;
    }

//esto calcula todo lo demas
     function CalcularCompleto(Producto){
     const Iva = 21;
     const PorcentajeIVA = Iva * Producto / 100;
     const aranceles = 10;
     const PorcentajeArancel = aranceles * Producto / 100;

     return PorcentajeIVA + PorcentajeArancel + Producto;
}

while(continuar){

let Valor = parseInt(prompt ("ingrese el valor de su producto"));
const Mercosur = ["argentina", "bolivia", "uruguay", "brasil", "paraguay"];
let pais = prompt("ingrese de que pais proviene su prducto" )

 if (Mercosur.includes(pais)) 
    {
        let PrecioFinal = CalcularConIVA(Valor)
        console.log(`precio total es: ${PrecioFinal}`);
}
 else {

        let PrecioFinal = CalcularCompleto(Valor)
        console.log(`precio total es: ${PrecioFinal}`);

 }

 continuar = confirm("¿Desea calcular otro producto?");
}

