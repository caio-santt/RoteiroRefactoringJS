// index.js (programa principal)
const { readFileSync } = require('fs');
const Repositorio          = require('./repositorio');
const ServicoCalculoFatura = require('./servico');
const gerarFaturaStr       = require('./apresentacao');

// main
const faturaJSON = JSON.parse(readFileSync('./faturas.json'));
const repo        = new Repositorio();
const calc        = new ServicoCalculoFatura(repo);
const faturaStr   = gerarFaturaStr(faturaJSON, calc);

console.log(faturaStr);
