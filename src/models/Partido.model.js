const mongoose = require("mongoose");

const PartidoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    equipo1: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' },
    equipo2: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' },
    golesEquipo1: {
        type: Number,
    },
    golesEquipo2: {
        type: Number,
    },
    penalesEquipo1: {
        type: Number,
    },
    penalesEquipo2: {
        type: Number,
    },
    grupo: {
        type: String,
        trim: true,
    },
    fecha: {
        type: Date,
    },
    seRealizo: {
        type: Boolean,
        default: false,
    },
    esEliminatoria: {
        type: Boolean,
        default: false,
    },
    tipoEliminatoria: {
        type: String,
        default: null,
    },
    partidoEquipo1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partido',
    },
    partidoEquipo2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partido',
    },
});

const Partido = mongoose.model("Partido", PartidoSchema);

module.exports = Partido;
