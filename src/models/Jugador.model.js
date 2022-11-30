const mongoose = require("mongoose");

const JugadorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    posicion: {
        type: String,
        trim: true,
    },
    numero: {
        type: Number,
        default: 0,
    },
    linkfoto: {
        type: String,
        trim: true,
    },
    esMejorJugador: {
        type: Boolean,
        default: false,
    },
    esMejorArquero: {
        type: Boolean,
        default: false,
    },
    esMejorGoleador: {
        type: Boolean,
        default: false,
    },
    equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' },
});

const Jugador = mongoose.model("Jugador", JugadorSchema);

module.exports = Jugador;