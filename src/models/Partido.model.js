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
    partidoEquipo1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partido',
    },
    partidoEquipo2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partido',
    },
});
// TODO ver como modificar fecha en mongoose

const Partido = mongoose.model("Partido", PartidoSchema);

module.exports = Partido;
