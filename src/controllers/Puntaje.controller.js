const partidoController = require('./Partido.controller');
const prediccionController = require('./Prediccion.controller');
const usuario_controller = require('./Usuario.controller');
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

            let userPuntos = 0;
            usuario.predicciones.forEach((p, i) => { if (i != prediccionIndex) userPuntos += p.puntos });
            
            await prediccionController.predicciones_put(
                usuario._id,
                usuario.predicciones[prediccionIndex]._id,
                {
                    puntos
                }
            );
            userPuntos += puntos;

            await usuario_controller.usuarios_put(usuario._id, {
                puntos: userPuntos
            })
        }
    }

    return query;
}