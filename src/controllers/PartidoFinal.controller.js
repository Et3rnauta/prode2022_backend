const mongoose = require('mongoose');
const Partido = require('../models/Partido.model');
const Usuario = require('../models/Usuario.model');

module.exports.partidos_list_final = async function () {
    const query = await Partido.find({ esEliminatoria: true })
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    return query;
}

module.exports.partido_update_resultado_final = async function (partidoId, golesEquipo1, golesEquipo2, penalesEquipo1, penalesEquipo2) {
    // Editar resultado de partido
    const query = await partidoController.partidos_put(
        partidoId,
        {
            golesEquipo1,
            golesEquipo2,
            penalesEquipo1,
            penalesEquipo2,
            seRealizo: true
        }
    );
    const esVictoriaEquipo1 = golesEquipo1 > golesEquipo2 || (golesEquipo1 == golesEquipo2 && penalesEquipo1 > penalesEquipo2);

    // Obtener Usuarios
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
            const puntos = (esVictoriaEquipo1 && (usuario.predicciones[prediccionIndex].golesEquipo1 == 1)) ||
                (!esVictoriaEquipo1 && (usuario.predicciones[prediccionIndex].golesEquipo2 == 1)) ?
                2 : 0;

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

    const partidos = await this.partidos_list_final();
    const nextPartido = await partidos.find(p => p.partidoEquipo1 == partidoId || p.partidoEquipo2 == partidoId);
    if (nextPartido.tipoEliminatoria == "Tercero") {
        if (nextPartido.partidoEquipo1 == partidoId)
            await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
                equipo1: !esVictoriaEquipo1 ? query.equipo1 : query.equipo2
            }).exec()
                .catch((error) => {
                    throw {
                        content: error,
                    }
                });
        else await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
            equipo2: !esVictoriaEquipo1 ? query.equipo1 : query.equipo2
        }).exec()
            .catch((error) => {
                throw {
                    content: error,
                }
            });
    } else {
        if (nextPartido.partidoEquipo1 == partidoId)
            await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
                equipo1: esVictoriaEquipo1 ? query.equipo1 : query.equipo2
            }).exec()
                .catch((error) => {
                    throw {
                        content: error,
                    }
                });
        else await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
            equipo2: esVictoriaEquipo1 ? query.equipo1 : query.equipo2
        }).exec()
            .catch((error) => {
                throw {
                    content: error,
                }
            });
    }
}