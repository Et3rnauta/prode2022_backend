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
    const partidos = await this.partidos_list_final();

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
            const puntos = acertoResultado(partidoId, partidos, esVictoriaEquipo1, usuario, prediccionIndex) ? 2 : 0;

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

    if (partidos.find(p => p._id == partidoId).tipoEliminatoria != "Final" || partidos.find(p => p._id == partidoId).tipoEliminatoria != "Tercero") {
        // Actualizar con el ganador (o el perdedor) el siguiente partido
        const nextPartido = partidos.find(p => p.partidoEquipo1 == partidoId || p.partidoEquipo2 == partidoId);
        if (nextPartido.tipoEliminatoria == "Tercero") {
            // Si es Tercero, con perdedor
            if (nextPartido.partidoEquipo1 == partidoId) {
                await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
                    equipo1: !esVictoriaEquipo1 ? query.equipo1 : query.equipo2
                }).exec()
                    .catch((error) => {
                        throw {
                            content: error,
                        }
                    });
            } else {
                await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
                    equipo2: !esVictoriaEquipo1 ? query.equipo1 : query.equipo2
                }).exec()
                    .catch((error) => {
                        throw {
                            content: error,
                        }
                    });
            }
        } else {
            // Sino, con ganador
            if (nextPartido.partidoEquipo1 == partidoId) {
                await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
                    equipo1: esVictoriaEquipo1 ? query.equipo1 : query.equipo2
                }).exec()
                    .catch((error) => {
                        throw {
                            content: error,
                        }
                    });
            } else {
                await Partido.findOneAndUpdate({ _id: nextPartido._id }, {
                    equipo2: esVictoriaEquipo1 ? query.equipo1 : query.equipo2
                }).exec()
                    .catch((error) => {
                        throw {
                            content: error,
                        }
                    });
            }
        }
    }
}

function acertoResultado(partidoId, partidos, esVictoriaEquipo1, usuario, prediccionIndex) {
    let res = false;
    const elPartido = partidos.find(p => p._id == partidoId);

    let partidoAnterior, prediccionAnterior, esEquipo1;

    if (esVictoriaEquipo1) {
        if (usuario.predicciones[prediccionIndex].golesEquipo1 == 1) {
            // Si el usuario predijo que era victoria de equipo 1
            switch (elPartido.tipoEliminatoria) {
                case "Octavos":
                    res = true;
                    break;
                case "Cuartos":
                    // Busco el partido de donde vino el equipo 1
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Octavos" &&
                        (p.equipo1 == elPartido.equipo1 || p.equipo1 == elPartido.equipo2));

                    // Valido si en el partido anterior, el equipo 1 era tambien equipo 1
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;

                    // Obtengo la prediccion del usuario para ese partido
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    // Si tenia prediccion y era correcta
                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 1) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 1));
                    break;
                case "Semifinales":
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Cuartos" &&
                        (p.equipo1 == elPartido.equipo1 || p.equipo1 == elPartido.equipo2));
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 1) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 1));
                    break;
                case "Final":
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Semifinales" &&
                        (p.equipo1 == elPartido.equipo1 || p.equipo1 == elPartido.equipo2));
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 1) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 1));
                    break;
                case "Tercero":
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Semifinales" &&
                        (p.equipo1 == elPartido.equipo1 || p.equipo1 == elPartido.equipo2));
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    // Si tenia prediccion y era que iba a perder
                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 0) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 0));
                    break;
            }
        }
    } else {
        if (usuario.predicciones[prediccionIndex].golesEquipo2 == 1) {
            // Si el usuario predijo que era victoria de equipo 1
            switch (elPartido.tipoEliminatoria) {
                case "Octavos":
                    res = true;
                    break;
                case "Cuartos":
                    // Busco el partido de donde vino el equipo 1
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Octavos" &&
                        (p.equipo2 == elPartido.equipo1 || p.equipo2 == elPartido.equipo2));

                    // Valido si en el partido anterior, el equipo 1 era tambien equipo 1
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;

                    // Obtengo la prediccion del usuario para ese partido
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    // Si tenia prediccion y era correcta
                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 1) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 1));
                    break;
                case "Semifinales":
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Cuartos" &&
                        (p.equipo2 == elPartido.equipo1 || p.equipo2 == elPartido.equipo2));
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 1) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 1));
                    break;
                case "Final":
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Semifinales" &&
                        (p.equipo2 == elPartido.equipo1 || p.equipo2 == elPartido.equipo2));
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 1) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 1));
                    break;
                case "Tercero":
                    partidoAnterior = partidos.find(p =>
                        p.tipoEliminatoria == "Semifinales" &&
                        (p.equipo2 == elPartido.equipo1 || p.equipo2 == elPartido.equipo2));
                    esEquipo1 = partidoAnterior.equipo1 == elPartido.equipo1;
                    prediccionAnterior = usuario.predicciones.find(r => r.partidoId == partidoAnterior._id);

                    // Si tenia prediccion y era que iba a perder
                    res = prediccionAnterior != undefined &&
                        ((esEquipo1 && prediccionAnterior.golesEquipo1 == 0) ||
                            (!esEquipo1 && prediccionAnterior.golesEquipo2 == 0));
                    break;
            }
        }
    }

    return res;
}