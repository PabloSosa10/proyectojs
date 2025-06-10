//calculadora par emprendimientos
let continuar = true
let si = true
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
//calcular el envio, si es nacional y mayor a 10K es gratis sino se suma el 30%
    function CalcularEnvio(Producto){
         const Envio = 30;
        const CosteEnvio = Envio * Producto / 100;
        return CosteEnvio;
    }

while(continuar){

let Valor = parseInt(prompt ("ingrese el valor de su producto"));
const Mercosur = ["argentina", "bolivia", "uruguay", "brasil", "paraguay"];
let pais = prompt("ingrese de que pais proviene su prducto").toLocaleLowerCase();
let PrecioParcial;

 if (Mercosur.includes(pais)) 
    {
        PrecioParcial = CalcularConIVA(Valor)
        console.log(`precio total es: $ ${PrecioParcial}`);
}
 else {

        PrecioParcial = CalcularCompleto(Valor)
        console.log(`precio total es: $ ${PrecioParcial}`);

 }

  let deseacCalcularEnvio = confirm("¿Desea calcular el envio?")

        if (deseacCalcularEnvio){
        let DestinoEnvio = prompt("ingrese a donde quiere enviarlo").toLocaleLowerCase();
            
            if (DestinoEnvio === Mercosur[0] && Valor >= 10000){
                    alert ("su envio es GRATIS!!! ");
            }
            else{
                let CosteEnvio = CalcularEnvio(PrecioParcial)
                let precioTotalConEnvio = PrecioParcial + CosteEnvio;
                console.log(`El costo del envío es de: $${CosteEnvio}`);
                console.log(`Su total final (producto + envío) es: $${precioTotalConEnvio}`)
            }
        }
    else{
        console.log(`El precio final del producto (sin envío) es: $${PrecioParcial}`);
       
        }
    continuar = confirm("¿Desea calcular otro producto?")
}

alert ("Gracias por usar la calculadora para emprendimientos.");

//mejorar las funciones cuando aprenda objetos