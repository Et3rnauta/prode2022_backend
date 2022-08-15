/**
 * Valida la cantidad de puntos que recibe por la prediccion realizada, al ser fase de Grupos
 * se asume que los Equipos son conocidos y solo se predice el resultado del partido
 * 
 * @param {{ golesEquipo1: Number, golesEquipo2: Number }} prediccion Prediccion realizada por el Usuario
 * @param {{ golesEquipo1: Number, golesEquipo2: Number }} partido Resultado real del Partido
 * 
 * @returns El valor del puntaje que recibio por la prediccion
 */
module.exports = function (prediccion, partido) {
    const puntajesPosibles = [3, 1, 0];

    if(prediccion.golesEquipo1 == partido.golesEquipo1 && prediccion.golesEquipo2 == partido.golesEquipo2) {
        // Si acierta el resultado y los goles realizados
        return puntajesPosibles[0];
    } else if (toResultado(prediccion.golesEquipo1, prediccion.golesEquipo2) == toResultado(partido.golesEquipo1, partido.golesEquipo2)) {
        /**
         * Si el resultado de la prediccion fue igual al resultado del partido 
         * (a pesar de no acertar en cantidad de goles)
         */
        return puntajesPosibles[1];
    }else {
        // Si no acerto ni en cantidad de goles ni en el resultado final
        return puntajesPosibles[2];
    }
}

/**
 * Devuelve 1 si el equipo 1 gana, 2 si gana el equipo 2
 * o 0 si resulta en empate
 */
function toResultado(golesEquipo1, golesEquipo2) {
    if(golesEquipo1 > golesEquipo2) return 1;
    else if (golesEquipo2 > golesEquipo1) return 2;
    else return 0;
}