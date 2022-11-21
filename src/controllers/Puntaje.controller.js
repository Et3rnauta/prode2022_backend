const partidoController = require('./Partido.controller');
const prediccionController = require('./Prediccion.controller');
const usuario_controller = require('./Usuario.controller');
const equipo_controller = require('./Equipo.controller');
const Usuario = require('../models/Usuario.model');
const validarPrediccionGrupos = require('../utils/puntaje/validarPrediccionGrupos');

module.exports.partido_update_resultado = async function (partidoId, golesEquipo1, golesEquipo2) {
    // Editar resultado de partido
    const query = await partidoController.partidos_put(
        partidoId,
        {
            golesEquipo1,
            golesEquipo2,
            seRealizo: true
        }
    );

    // Obtener Usuario
    const usuarios = await Usuario.find()
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    for (const usuario of usuarios) {
        // Obtener index prediccion
        const prediccionIndex = usuario.predicciones.findIndex(p => p.partidoId == partidoId);

        if (prediccionIndex != -1) {
            // Obtener puntos correspondientes al resultado
            const puntos = validarPrediccionGrupos(
                {
                    golesEquipo1: usuario.predicciones[prediccionIndex].golesEquipo1,
                    golesEquipo2: usuario.predicciones[prediccionIndex].golesEquipo2
                },
                {
                    golesEquipo1,
                    golesEquipo2
                }
            )

            // Sumar puntos de predicciones
            let userPuntos = 0;
            usuario.predicciones.forEach((p, i) => { if (i != prediccionIndex) userPuntos += p.puntos });

            // Editar prediccion para decir que vale los puntos determinados
            await prediccionController.predicciones_put(
                usuario._id,
                usuario.predicciones[prediccionIndex]._id,
                {
                    puntos
                }
            );
            userPuntos += puntos;

            // Editar total de puntos del usuario
            await usuario_controller.usuarios_put(usuario._id, {
                puntos: userPuntos
            })
        }
    }

    const partido = await partidoController.partidos_get(partidoId);
    await actualizarPuntosEquipo(partido.equipo1);
    await actualizarPuntosEquipo(partido.equipo2);
}

async function actualizarPuntosEquipo(idEquipo) {
    // Agregar puntos si el Equipo esta en fase de Grupos
    const partidos = await partidoController.partidos_list_grupos();

    let puntos = 0;
    for (const partido of partidos) {
        if (partido.golesEquipo1 != undefined && partido.golesEquipo2 != undefined) {
            if (String(partido.equipo1) == String(idEquipo)) {
                if (partido.golesEquipo1 > partido.golesEquipo2) puntos += 3;
                else if (partido.golesEquipo1 == partido.golesEquipo2) puntos += 1;
            } else if (String(partido.equipo2) == String(idEquipo)) {
                if (partido.golesEquipo2 > partido.golesEquipo1) puntos += 3;
                else if (partido.golesEquipo1 == partido.golesEquipo2) puntos += 1;
            }
        }
    }

    await equipo_controller.equipos_put(idEquipo, { puntos });
}