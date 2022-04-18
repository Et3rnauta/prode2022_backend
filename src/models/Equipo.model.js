const mongoose = require("mongoose");

const EquipoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    puntos: {
        type: Number,
        default: 0,
    },
    grupo: {
        type: String,
        trim: true,
    },
});

const Equipo = mongoose.model("Equipo", EquipoSchema);

module.exports = Equipo;