const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.json());

mongoose.connect('mongodb+srv://<user>:<senha>.713x21z.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
});

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const usinaSchema = new Schema({
    nome: String,
    endereco: String,
    localizacao: String,
    tiposDeEnergia: String,
});

const usina = mongoose.model('usina', usinaSchema);

app.get('/energia/usina', async (req, res) => {
    const usinas = await usina.find();
    res.send(usinas);
});

app.get('/energia/usina/:id', async (req, res) => {
    const usina = await usina.find(req.params.id);
    return res.send(usina);
});

app.get('/energia/estatisticas', async (req, res) => {
    const { inicio, fim } = req.query;
    const estatisticas = await usina.collection.aggregate([
        {
            $lookup: {
                from: 'relatorios',
                localField: '_id',
                foreignField: 'estacaoId',
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
                totalenergiarenovavel: { $sum: '$relatorios.quantidade' },
                energiarenovavel: { $sum: '$relatorios.energiarenovavel' },
            },
        },
    ]);
    res.send(estatisticas[0] || { totalDeEnergia: 0, energiarenovavel: 0 });
});


app.post("/energia/usinas", async (req, res) => {
    const novaUsina = new usina({
        nome: req.body.nome,
        endereco: req.body.endereco,
        localizacao: req.body.localizacao,
        tiposDeEnergia: req.body.tiposDeEnergia,
    });
        const usinaSalva = await novausina.save();
        res.status(201).json(usinaSalva);
});
app.put('/energia/usinas/:id', async (req, res) => {
    const usinaAtualizada = await usina.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(usinaAtualizada);
});

app.delete('/energia/usina/:id', async (req, res) => {
    const usinas = await Usina.findByIdAndDelete(req.params.id);
        return res.send(usinas);
});

app.listen(port, () => {
    console.log('App running');
});