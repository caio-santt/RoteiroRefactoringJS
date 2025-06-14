const { readFileSync } = require('fs');
const { formatarMoeda } = require('./util');
const RepositorioPecas   = require('./repositorioPecas');
const ServicoCalculoFatura = require('./servicoCalculoFatura');

// --- Funções de apresentação (texto e HTML) ---

function gerarFaturaStr(fatura, calc) {
  let totalFatura = 0;
  let creditos    = 0;
  let faturaStr   = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    const total = calc.calcularTotalApresentacao(apre);
    const nome  = calc.repo.getPeca(apre).nome;
    const cred  = calc.calcularCredito(apre);

    totalFatura += total;
    creditos    += cred;
    faturaStr   += `  ${nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditos}\n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
  let html = "<html>\n";
  html += `  <p> Fatura ${fatura.cliente} </p>\n`;
  html += "  <ul>\n";
  for (let apre of fatura.apresentacoes) {
    const total = calc.calcularTotalApresentacao(apre);
    const nome  = calc.repo.getPeca(apre).nome;
    html += `    <li> ${nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
  }
  html += "  </ul>\n";
  html += `  <p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))} </p>\n`;
  html += `  <p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} </p>\n`;
  html += "</html>";
  return html;
}

// --- Setup dos dados e das classes ---

const fatura = JSON.parse(readFileSync('./faturas.json'));
const pecas   = JSON.parse(readFileSync('./pecas.json'));

const repo = new RepositorioPecas(pecas);
const calc = new ServicoCalculoFatura(repo);

// --- Impressão das saídas ---

console.log(gerarFaturaStr(fatura, calc));
console.log(gerarFaturaHTML(fatura, calc));
