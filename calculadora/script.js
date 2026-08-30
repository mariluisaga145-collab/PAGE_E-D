// ==========================================
// MAPA DE DIGITOS
// ==========================================

const DIGITOS = [
    "0", "1", "2", "3", "4", "5", "6", "7",
    "8", "9", "A", "B", "C", "D", "E", "F"
];


// ==========================================
// OBTENER EL VALOR DE UN DIGITO
// ==========================================

function obtenerValorDigito(digito) {

    digito = digito.toUpperCase();

    for (let posicion = 0; posicion < DIGITOS.length; posicion++) {

        if (DIGITOS[posicion] === digito) {
            return posicion;
        }

    }

    return -1;
}


// ==========================================
// COMPROBAR SI EL NUMERO PERTENECE A LA BASE
// ==========================================

function numeroValido(numero, base) {

    numero = numero.toUpperCase();

    if (numero.length === 0) {
        return false;
    }

    for (let posicion = 0; posicion < numero.length; posicion++) {

        const valor = obtenerValorDigito(numero[posicion]);

        if (valor < 0 || valor >= base) {
            return false;
        }

    }

    return true;
}


// ==========================================
// CUALQUIER BASE -> DECIMAL
// MULTIPLICACION POSICIONAL
// ==========================================

function convertirADecimal(numero, base) {

    numero = numero.toUpperCase();

    let total = 0n;
    const baseNumero = BigInt(base);

    for (let posicion = 0; posicion < numero.length; posicion++) {

        const valor = BigInt(
            obtenerValorDigito(numero[posicion])
        );

        total = (total * baseNumero) + valor;
    }

    return total;
}


// ==========================================
// DECIMAL -> CUALQUIER BASE
// DIVISIONES SUCESIVAS
// ==========================================

function convertirDesdeDecimal(numero, base) {

    numero = BigInt(numero);
    base = BigInt(base);

    if (numero === 0n) {
        return "0";
    }

    let valorActual = numero;
    let residuos = [];

    while (valorActual > 0n) {

        const residuo = valorActual % base;

        residuos.push(
            DIGITOS[Number(residuo)]
        );

        valorActual = valorActual / base;
    }

    let resultado = "";

    for (let i = residuos.length - 1; i >= 0; i--) {
        resultado += residuos[i];
    }

    return resultado;
}


// ==========================================
// GENERAR LAS CUATRO REPRESENTACIONES
// ==========================================

function generarConversiones(valorDecimal) {

    return {
        binario: convertirDesdeDecimal(valorDecimal, 2),
        octal: convertirDesdeDecimal(valorDecimal, 8),
        decimal: valorDecimal.toString(),
        hexadecimal: convertirDesdeDecimal(valorDecimal, 16)
    };
}

// ==========================================
// MAXIMO VALOR SEGUN LA ARQUITECTURA
// ==========================================

function calcularMaximo(bits) {

    return (2n ** BigInt(bits)) - 1n;
}


// ==========================================
// COMPROBAR OVERFLOW
// ==========================================

function comprobarOverflow(valor, bits) {

    const maximo = calcularMaximo(bits);

    return valor > maximo;
}


// ==========================================
// COMPLETAR EL BINARIO CON CEROS
// ==========================================

function completarRegistro(binario, bits) {

    while (binario.length < bits) {

        binario = "0" + binario;

    }

    return binario;
}


// ==========================================
// BOTON PROCESAR
// ==========================================

const botonProcesar =
    document.getElementById("procesarNumero");

botonProcesar.addEventListener("click", function () {

    const entrada =
        document.getElementById("entradaNumero").value.trim();

    const baseSeleccionada =
        Number(
            document.getElementById("sistemaNumerico").value
        );

    const bitsSeleccionados =
    Number(
        document.getElementById("arquitectura").value
    );

    const estado =
        document.getElementById("estado");


    // ------------------------------
    // CAMPO VACIO
    // ------------------------------

    if (entrada === "") {

        estado.textContent =
            "Ingresa un valor para comenzar.";

        return;
    }


    // ------------------------------
    // VALIDAR NUMERO
    // ------------------------------

    if (!numeroValido(entrada, baseSeleccionada)) {

        estado.textContent =
            "El valor no pertenece al sistema numérico seleccionado.";

        return;
    }


    // ------------------------------
    // CONVERTIR A DECIMAL
    // ------------------------------

    const valorDecimal =
        convertirADecimal(
            entrada,
            baseSeleccionada
        );

    // ------------------------------
// COMPROBAR LIMITE DE REGISTRO
// ------------------------------

if (comprobarOverflow(valorDecimal, bitsSeleccionados)) {

    const maximo =
        calcularMaximo(bitsSeleccionados);

    estado.textContent =
        "Overflow: el valor supera la capacidad del registro de " +
        bitsSeleccionados +
        " bits. Máximo permitido: " +
        maximo.toString();

    // Limpiar resultados

    document.getElementById("salidaBinaria").value = "";
    document.getElementById("salidaOctal").value = "";
    document.getElementById("salidaDecimal").value = "";
    document.getElementById("salidaHexadecimal").value = "";

    return;
}

    // ------------------------------
    // GENERAR RESULTADOS
    // ------------------------------

    const resultados =
        generarConversiones(valorDecimal);

    const binarioCompleto =
    completarRegistro(
        resultados.binario,
        bitsSeleccionados
    );

    // ------------------------------
    // MOSTRAR RESULTADOS
    // ------------------------------

    document.getElementById("salidaBinaria").value =
    binarioCompleto;

    document.getElementById("salidaOctal").value =
        resultados.octal;

    document.getElementById("salidaDecimal").value =
        resultados.decimal;

    document.getElementById("salidaHexadecimal").value =
        resultados.hexadecimal;


    // ------------------------------
    // MENSAJE
    // ------------------------------

    estado.textContent =
        "Valor procesado correctamente.";
});

// ==========================================
// VALIDAR REGISTRO BINARIO
// ==========================================

function validarBinario(binario) {

    if (binario.length === 0) {
        return false;
    }

    for (let i = 0; i < binario.length; i++) {

        if (binario[i] !== "0" && binario[i] !== "1") {
            return false;
        }
    }

    return true;
}


// ==========================================
// IGUALAR LONGITUD DE LOS REGISTROS
// ==========================================

function ajustarRegistros(a, b) {

    while (a.length < b.length) {
        a = "0" + a;
    }

    while (b.length < a.length) {
        b = "0" + b;
    }

    return {
        a: a,
        b: b
    };
}


// ==========================================
// OPERACION AND
// ==========================================

function realizarAND(a, b) {

    let resultado = "";

    for (let i = 0; i < a.length; i++) {

        if (a[i] === "1" && b[i] === "1") {
            resultado += "1";
        } else {
            resultado += "0";
        }
    }

    return resultado;
}


// ==========================================
// OPERACION OR
// ==========================================

function realizarOR(a, b) {

    let resultado = "";

    for (let i = 0; i < a.length; i++) {

        if (a[i] === "1" || b[i] === "1") {
            resultado += "1";
        } else {
            resultado += "0";
        }
    }

    return resultado;
}


// ==========================================
// OPERACION XOR
// ==========================================

function realizarXOR(a, b) {

    let resultado = "";

    for (let i = 0; i < a.length; i++) {

        if (a[i] !== b[i]) {
            resultado += "1";
        } else {
            resultado += "0";
        }
    }

    return resultado;
}


// ==========================================
// BOTON EJECUTAR ALU
// ==========================================

const botonALU =
    document.getElementById("ejecutarALU");

botonALU.addEventListener("click", function () {

    const registroA =
        document.getElementById("registroA").value.trim();

    const registroB =
        document.getElementById("registroB").value.trim();


    // ------------------------------
    // VALIDAR CAMPOS
    // ------------------------------

    if (registroA === "" || registroB === "") {

        alert("Debes ingresar los dos registros binarios.");

        return;
    }


    // ------------------------------
    // VALIDAR BINARIOS
    // ------------------------------

    if (!validarBinario(registroA) ||
        !validarBinario(registroB)) {

        alert(
            "Los registros solo pueden contener 0 y 1."
        );

        return;
    }


    // ------------------------------
    // IGUALAR LONGITUD
    // ------------------------------

    const registros =
        ajustarRegistros(registroA, registroB);

    const a = registros.a;
    const b = registros.b;


    // ------------------------------
    // REALIZAR OPERACIONES
    // ------------------------------

    const resultadoAND =
        realizarAND(a, b);

    const resultadoOR =
        realizarOR(a, b);

    const resultadoXOR =
        realizarXOR(a, b);


    // ------------------------------
    // MOSTRAR RESULTADOS
    // ------------------------------

    document.getElementById("salidaAND").value =
        resultadoAND;

    document.getElementById("salidaOR").value =
        resultadoOR;

    document.getElementById("salidaXOR").value =
        resultadoXOR;

});