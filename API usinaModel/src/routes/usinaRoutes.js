const express = require("express");
const usina = require("../models/usinaModel");
const app = express();
app.use(express.json());

const router = express.Router();

app.get('/energia/usina', async (req, res) => {
    const usinas = await usina.find();
    res.send(usinas);
});

app.get('/energia/usinas/:id', async (req, res) => {
    const usinas = await usina.find(req.params.id);
    return res.send(usina);
});

app.get('/energia/usina', async (req, res) => {
    const { inicio, fim } = req.query;
    const estatisticas = await usina.collection.aggregate([
        {
            $lookup: {
                from: 'relatorios',
                localField: '_id',
                foreignField: 'usinaId',
                as: 'relatorios',
            },
        },
        { $unwind: '$relatorios' },
        {
            $match: {
                'relatorios.data': { $gte: new Date(inicio), $lte: new Date(fim) },
            },
        },
        {
            $group: {
                _id: null,
                totaldeenergiagerada: { $sum: '$relatorios.quantidade' },
                totaldeenergiagerada: { $sum: '$relatorios.energiarenovavel' },
            },
        },
    ]);
    res.send(estatisticas[0] || { totaldeenergiagerada: 0, reducaodegastos: 0 });
});


app.post("/energia/usina", async (req, res) => {
    const novausina = new Usina({
        nome: req.body.nome,
        endereco: req.body.endereco,
        localizacao: req.body.localizacao,
        tiposDeEnergia: req.body.tiposDeEnergia,
    });
        const usinaSalva = await novaUsina.save();
        res.status(201).json(usinaSalva);
});
app.put('/energia/usinas/:id', async (req, res) => {
    const usinaAtualizada = await usina.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(usinaAtualizada);
});

app.delete('/energia/usinas/:id', async (req, res) => {
    const usina = await usinas.findByIdAndDelete(req.params.id);
        return res.send(usina);
});


module.exports = router;