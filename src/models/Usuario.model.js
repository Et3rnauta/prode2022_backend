const mongoose = require("mongoose");

const prediccionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    golesEquipo1: {
        type: Number,
        required: true
    },
    golesEquipo2: {
        type: Number,
        required: true
    },
    puntos: {
        type: Number,
        default: 0,
    },
    partidoId: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Partido' },
})

const UsuarioSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombreCuenta: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    nombreJugador: {
        type: String,
        trim: true,
    },
    puntos: {
        type: Number,
        default: 0,
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    },
    imagenSrc: {
        type: String,
        trim: true,
    },
    predicciones: [prediccionSchema],
}, {
    timestamps: true
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

module.exports = Usuario;
