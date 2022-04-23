const mongoose = require('mongoose');
const Partido = require('../models/Partido.model');
const Usuario = require('../models/Usuario.model');

// module.exports.predicciones_list se obtienen las predicciones a partir de get single user

/**
 * Id no es necesario, se crea en la funcion
 */
module.exports.predicciones_create_post = async function (usuarioId, data) {
    if (data.idPartido === undefined) {
        throw {
            number: 400,
            content: "Se requiere un id de Partido",
        }
    }

    const usuario = await Usuario.findById(usuarioId).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                //* If id is wrong, return nothing
                throw {
                    number: 400,
                    content: "El id de Usuario es incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (usuario === null) {
        throw {
            number: 404,
            content: "No se encuentra el Usuario",
        }
    }

    const partido = await Partido.findById(data.idPartido).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                //* If id is wrong, return nothing
                throw {
                    number: 400,
                    content: "El id del Partido es incorrecto",
                }
            } else {
                throw {
                    content: error,
                }
            }
        });

    if (partido === null) {
        throw {
            number: 404,
            content: "No se encuentra el Partido",
        }
    }

    //* Se fija si ya hay prediccion para el partido
    if (usuario.predicciones.some(p => String(p.idPartido) === String(data.idPartido))) {
        throw {
            number: 409,
            content: "El Partido ya tiene una Prediccion asignada",
        }
    }

    data._id = new mongoose.Types.ObjectId;

    usuario.predicciones.push(data);
    await usuario.save();

    return data;
}

module.exports.predicciones_delete = async function (usuarioId, prediccionId) {
    const usuario = await Usuario.findById(id).exec()
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

    if (usuario === null) {
        throw {
            number: 404,
            content: "No se encuentra el Usuario",
        }
    } else {
        const indexElemUsuario = usuario.predicciones.findIndex(p => String(p._id) === String(prediccionId));

        if (indexElemUsuario === -1) {
            throw {
                number: 404,
                content: "No se encuentra la Prediccion",
            }
        } else {
            usuario.predicciones.splice(indexElemUsuario, 1)[0];
            await usuario.save();
            return { acknowledged: true, deletedCount: 1 };
        }
    }
}