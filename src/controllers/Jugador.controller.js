const mongoose = require('mongoose');
const Jugador = require('../models/Jugador.model');
const usuario_controller = require('./Usuario.controller');

module.exports.jugadores_list = async function () {
    const query = await Jugador.find()
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    return query;
}

module.exports.jugadores_get = async function (id) {
    const query = await Jugador.findById(id).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Id incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (query === null) {
        throw {
            number: 404,
            content: "No se encuentra el Jugador",
        }
    }

    return query;
}

/**
 * Id no es necesario, se crea en la funcion
 */
module.exports.jugadores_create_post = async function (data) {
    data._id = new mongoose.Types.ObjectId;

    const newUsuario = await Jugador.create(data)
        .catch((error) => {
            return {
                content: error,
            }
        });
    return newUsuario;
}

module.exports.jugadores_put = async function (id, data) {
    data._id = undefined;

    const query = await Jugador.findOneAndUpdate({ _id: id }, data, { new: true }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Id incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (query === null) {
        throw {
            number: 404,
            content: "No se encuentra el Jugador",
        }
    }

    return query;
}

module.exports.jugadores_delete = async function (_id) {
    const answer = await Jugador.deleteOne({ _id }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Id incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (answer.deletedCount === 0) {
        throw {
            number: 404,
            content: "No se encuentra el Jugador",
        }
    }

    return answer;
}

module.exports.jugadores_actualizar_mejores = async function (idMejorJugador, idMejorArquero, idMejorGoleador) {
    const queryMejorJugador = await Jugador.findOneAndUpdate({ _id: idMejorJugador }, { esMejorJugador: true }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Id incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (queryMejorJugador === null) {
        throw {
            number: 404,
            content: "No se encuentra el Jugador",
        }
    }

    const queryMejorArquero = await Jugador.findOneAndUpdate({ _id: idMejorArquero }, { esMejorArquero: true }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Id incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (queryMejorArquero === null) {
        throw {
            number: 404,
            content: "No se encuentra el Jugador",
        }
    }

    const queryMejorGoleador = await Jugador.findOneAndUpdate({ _id: idMejorGoleador }, { esMejorGoleador: true }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Id incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (queryMejorGoleador === null) {
        throw {
            number: 404,
            content: "No se encuentra el Jugador",
        }
    }

    const usuarios = await usuario_controller.usuarios_list();
    const puntosPorAcierto = 6;

    for (const usuario of usuarios) {
        let puntosJugadores = 0;

        puntosJugadores += String(usuario.prediccionMejorJugador) == String(idMejorJugador) ? puntosPorAcierto : 0;
        puntosJugadores += String(usuario.prediccionMejorArquero) == String(idMejorArquero) ? puntosPorAcierto : 0;
        puntosJugadores += String(usuario.prediccionMejorGoleador) == String(idMejorGoleador) ? puntosPorAcierto : 0;

        await usuario_controller.usuarios_put(usuario._id, { puntos: usuario.puntos + puntosJugadores });
    }

    return true;
}