const mongoose = require('mongoose');
const Equipo = require('../models/Equipo.model');

module.exports.equipos_list = async function () {
    const query = await Equipo.find()
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    return query;
}

module.exports.equipos_get = async function (id) {
    const query = await Equipo.findById(id).exec()
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
            content: "No se encuentra el Equipo",
        }
    }

    return query;
}

/**
 * Id no es necesario, se crea en la funcion
 */
module.exports.equipos_create_post = async function (data) {
    if (data.nombre === undefined) throw {
        number: 400,
        content: "Se requiere un Nombre de Equipo",
    }

    data._id = new mongoose.Types.ObjectId;

    const newUsuario = await Equipo.create(data)
        .catch((error) => {
            return {
                content: error,
            }
        });
    return newUsuario;
}

module.exports.equipos_put = async function (id, data) {
    data._id = undefined;

    const query = await Equipo.findOneAndUpdate({ _id: id }, data, { new: true }).exec()
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
            content: "No se encuentra el Equipo",
        }
    }

    return query;
}

module.exports.equipos_delete = async function (_id) {
    const answer = await Equipo.deleteOne({ _id }).exec()
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

    if (answer.deletedCount === 0) {
        throw {
            number: 404,
            content: "No se encuentra el Equipo",
        }
    }

    return answer;
}