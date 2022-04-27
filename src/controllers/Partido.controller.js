const mongoose = require('mongoose');
const Equipo = require('../models/Equipo.model');
const Partido = require('../models/Partido.model');
const Usuario = require('../models/Usuario.model');

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

    let getEquipo = async (idEquipo, numEquipo) => {
        const query = await Equipo.findById(idEquipo).exec()
            .catch((error) => {
                if (error.name === "CastError") {
                    //* If id is wrong, return nothing
                    throw {
                        number: 400,
                        content: `Id incorrecto para el Equipo ${numEquipo}`,
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
                content: `No se encuentra el Equipo ${numEquipo}`,
            }
        }

        return query;
    }

    if (data.equipo1 != undefined) await getEquipo(data.equipo1, "1");
    if (data.equipo2 != undefined) await getEquipo(data.equipo2, "2");

    const newUsuario = await Partido.create(data)
        .catch((error) => {
            return {
                content: error,
            }
        });
    return newUsuario;
}

module.exports.partidos_delete = async function (_id) {
    const answer = await Partido.deleteOne({ _id }).exec()
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
            content: "No se encuentra el Partido",
        }
    } else {
        const usuarios = await Usuario.find()
            .catch((error) => {
                throw {
                    number: 500,
                    content: error,
                };
            });
    
        usuarios.forEach(usuario => {
            usuario.predicciones = usuario.predicciones.filter(prediccion =>
                prediccion.idPartido !== _id);
        });        
    }
    return answer;
}