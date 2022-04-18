const mongoose = require("mongoose");

const prediccionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    usuarioId: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
})

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
    predicciones: {
        type: [prediccionSchema],
        default: []
    },
});
// TODO ver como modificar fecha en mongoose

const Partido = mongoose.model("Partido", PartidoSchema);

module.exports = Partido;
