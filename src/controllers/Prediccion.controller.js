const mongoose = require('mongoose');
const { partidos_get } = require('./Partido.controller');
const { usuarios_get } = require('./Usuario.controller');

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

    const usuario = await usuarios_get(usuarioId);
    const partido = await partidos_get(data.idPartido);

    //* Se fija si ya hay prediccion para el partido
    if (usuario.predicciones.some(p => String(p.idPartido) === String(data.idPartido))) {
        throw {
            number: 409,
            content: "El Partido ya tiene una Prediccion asignada",
        }
    }

    data._id = new mongoose.Types.ObjectId;

    //* Agregar a usuario
    usuario.predicciones.push(data);

    //* Agregar a partido
    partido.predicciones.push({
        _id: data._id,
        usuarioId: usuario._id
    });

    await usuario.save();
    await partido.save();

    return data;
}

module.exports.predicciones_delete = async function (usuarioId, prediccionId) {
    const usuario = await usuarios_get(usuarioId).catch(e => { throw e; });
    const indexElemUsuario = usuario.predicciones.findIndex(p => String(p._id) === String(prediccionId));
    if (indexElemUsuario === -1) {
        throw {
            number: 404,
            content: "No se encuentra la Prediccion",
        }
    } else {
        const prediccion = usuario.predicciones.splice(indexElemUsuario, 1)[0];
        return await partidos_get(prediccion.idPartido)
            .then(async (partido) => {
                const indexElemPartido = partido.predicciones.findIndex(p => String(p._id) === String(prediccionId));
                partido.predicciones.splice(indexElemPartido, 1)

                await usuario.save();
                await partido.save();
                return { acknowledged: true, deletedCount: 1 };
            })
            .catch(async (e) => {
                if (e.number = 404) {
                    await usuario.save();
                    return { acknowledged: true, deletedCount: 1 };
                } else throw e;
            });
    }
}