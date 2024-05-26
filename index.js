const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const readEmpresas = () => {
    if (fs.existsSync('empresas.json')) {
        const data = fs.readFileSync('empresas.json');
        return JSON.parse(data);
    }
    return [];
};

const writeEmpresas = (empresas) => {
    fs.writeFileSync('empresas.json', JSON.stringify(empresas, null, 2));
};

app.get('/empresas', (req, res) => {
    const empresas = readEmpresas();
    res.json(empresas);
});

app.post('/cadastrar', (req, res) => {
    const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;

    const errors = [];
    if (!cnpj) errors.push('CNPJ é obrigatório.');
    if (!razaoSocial) errors.push('Razão Social é obrigatória.');
    if (!nomeFantasia) errors.push('Nome Fantasia é obrigatório.');
    if (!endereco) errors.push('Endereço é obrigatório.');
    if (!cidade) errors.push('Cidade é obrigatória.');
    if (!uf) errors.push('UF é obrigatório.');
    if (!cep) errors.push('CEP é obrigatório.');
    if (!email) errors.push('Email é obrigatório.');
    if (!telefone) errors.push('Telefone é obrigatório.');

    if (errors.length > 0) {
        res.json({ errors });
    } else {
        const empresas = readEmpresas();
        empresas.push({ cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone });
        writeEmpresas(empresas);

        res.json({ empresas });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
