const partidoController = require('./Partido.controller');
const prediccionController = require('./Prediccion.controller');
const Usuario = require('../models/Usuario.model');
const validarPrediccionGrupos = require('../utils/puntaje/validarPrediccionGrupos');

module.exports.partido_update_resultado = async function (partidoId, golesEquipo1, golesEquipo2) {
    const query = await partidoController.partidos_put(
        partidoId,
        {
            golesEquipo1,
            golesEquipo2,
            seRealizo: true
        }
    );

    const usuarios = await Usuario.find()
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    for (const usuario of usuarios) {
        const prediccionIndex = usuario.predicciones.findIndex(p => p.partidoId == partidoId);

        if (prediccionIndex != -1) {
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

            await prediccionController.predicciones_put(
                usuario._id,
                usuario.predicciones[prediccionIndex]._id,
                {
                    puntos
                }
            );
        }
    }

    return query;
}