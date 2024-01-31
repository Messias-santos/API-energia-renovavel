const usina = require("../models/usinaModel");

const getUsinas = async (req, res) => {
        const Usinas = await Usina.find();
        res.json(usinas);
};
const getUsinaById = async (req, res) => {
        const usina = await Usina.findById(req.params.id);
        res.json(usina);
}
const createusina = async (req, res) => {
        const novausina = new Usina({
            nome: req.body.nome,
            endereco: req.body.endereco,
            localizacao: req.body.localizacao,
            tiposDeEnergia: req.body.tiposDeEnergia,
        });
        const usinaSalva = await novausina.save();
        res.send(usinaSalva);
};

const updateUsina= async (req, res) => {
        const usinaAtualizada = await Usina.findByIdAndUpdate(req.params.id, req.body, { new: true });
         return res.json(UsinaAtualizada);
};

const deleteUsina= async (req, res) => {
        const usinaRemovida = await usina.findByIdAndDelete(req.params.id);
        if (!usinaRemovida) {
            return res.status(404).json({ message: 'usina não encontrada' });
        }
        res.json(usinaRemovida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsinas,
    getUsinaById,
    getEstatisticas,
    createUsina,
    updateusina,
    deleteusina,
}