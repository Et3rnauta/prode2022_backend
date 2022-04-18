const mongoose = require('mongoose');
const Partido = require('../models/Partido.model');
const Usuario = require('../models/Usuario.model');
const { equipos_get } = require('./Equipo.controller');

module.exports.partidos_list = async function () {
    const query = await Partido.find()
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    return query;
}

module.exports.partidos_list_grupos = async function () {
    const query = await Partido.find({ grupo: { $exists: true } })
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    return query;
}

module.exports.partidos_get = async function (id) {
    const query = await Partido.findById(id).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                //* If id is wrong, return nothing
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
            content: "No se encuentra el Partido",
        }
    }

    return query;
}

module.exports.partidos_create_post = async function (data) {
    data._id = new mongoose.Types.ObjectId;

    if (data.equipo1 != undefined) {
        await equipos_get(data.equipo1).catch(e => {
            if (e.number === 400) {
                throw {
                    number: 400,
                    content: "Id para equipo1 incorrecto",
                }
            } else throw e;
        })
    }

    if (data.equipo2 != undefined) {
        await equipos_get(data.equipo2).catch(e => {
            if (e.number === 400) {
                throw {
                    number: 400,
                    content: "Id para equipo2 incorrecto",
                }
            } else throw e;
        })
    }

    const newUsuario = await Partido.create(data)
        .catch((error) => {
            return {
                content: error,
            }
        });
    return newUsuario;
}

module.exports.partidos_delete = async function (_id) {
    const partido = await this.partidos_get(_id);

    // TODO ver si conviene borrar o dejar las predicciones
    await partido.predicciones.forEach(async function (p) {
        const usuario = await Usuario.findById(p.usuarioId).exec();
        if (usuario) {
            usuario.predicciones.splice(
                usuario.predicciones.findIndex(up =>
                    String(up._id) === String(p.prediccionId)),
                1
            );
            await usuario.save();
        }
    });

    const answer = await Partido.deleteOne({ _id }).exec()
    return answer;
}