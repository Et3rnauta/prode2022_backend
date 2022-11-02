const mongoose = require('mongoose');
const Usuario = require('../models/Usuario.model');

module.exports.usuarios_list = async function () {
    const query = await Usuario.find()
        .catch((error) => {
            throw {
                number: 500,
                content: error,
            };
        });

    return query;
}

module.exports.usuarios_get = async function (id) {
    const query = await Usuario.findById(id).exec()
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
            content: "No se encuentra el Usuario",
        }
    }

    return query;
}


/**
 * Id no es necesario, se crea en la funcion
 */
module.exports.usuarios_create_post = async function (data) {
    // TODO ver si sacar _id
    data._id = new mongoose.Types.ObjectId;
    if (!data.nombreJugador) {
        data.nombreJugador = data.nombreCuenta;
    }

    const newUsuario = await Usuario.create(data)
        .catch((error) => {
            return {
                content: error,
            }
        });
    return newUsuario;
}

module.exports.usuarios_put = async function (id, data) {
    data._id = undefined;

    const query = await Usuario.findOneAndUpdate({ _id: id }, data, { new: true }).exec()
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
            content: "No se encuentra al Usuario",
        }
    }

    return query;
}

module.exports.usuarios_delete = async function (_id) {
    const answer = await Usuario.deleteOne({ _id }).exec()
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
            content: "No se encuentra el Usuario",
        }
    }

    return answer;
}

module.exports.usuarios_get_by_name_with_password = async function (nombreCuenta) {
    const query = await Usuario.findOne({ nombreCuenta }).select('+password').exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw {
                    number: 400,
                    content: "Nombre incorrecto",
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
            content: "No se encuentra el Usuario",
        }
    }

    return query;
}

module.exports.usuarios_get_with_password = async function (id) {
    const query = await Usuario.findById(id).select('+password').exec()
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
            content: "No se encuentra el Usuario",
        }
    }

    return query;
}