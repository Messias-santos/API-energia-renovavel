const mongoose = require("mongoose");

const usinaSchema = new mongoose.Schema({
    nome: String,
    endereco: String,
    localizacao: String,
    tiposDeEnergia: String,
});

const Usina = mongoose.model('Estacao', usinaSchema);

module.exports = Usina;