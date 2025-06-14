const { readFileSync } = require('fs');
const { formatarMoeda } = require('./util');

// === Lógica de cálculo extraída para o módulo ===

function getPeca(apre, pecas) {
  return pecas[apre.id];
}

function calcularTotalApresentacao(apre, pecas) {
  const peca = getPeca(apre, pecas);
  let total = 0;
  switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) total += 1000 * (apre.audiencia - 30);
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) total += 10000 + 500 * (apre.audiencia - 20);
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${peca.tipo}`);
  }
  return total;
}

function calcularCredito(apre, pecas) {
  const base = Math.max(apre.audiencia - 30, 0);
  const extra = getPeca(apre, pecas).tipo === "comedia"
    ? Math.floor(apre.audiencia / 5)
    : 0;
  return base + extra;
}

// === Saída em texto puro (já implementada nos commits anteriores) ===

function gerarFaturaStr(fatura, pecas) {
  let totalFatura = 0;
  let creditos    = 0;
  let faturaStr   = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    const total = calcularTotalApresentacao(apre, pecas);
    creditos   += calcularCredito(apre, pecas);
    totalFatura+= total;
    faturaStr  += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditos}\n`;
  return faturaStr;
}

// === Novo: saída em HTML ===

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

// === Criação do “calc” com a API de serviço de cálculo ===

const fatura = JSON.parse(readFileSync('./faturas.json'));
const pecas   = JSON.parse(readFileSync('./pecas.json'));

const calc = {
  repo: {
    getPeca: (apre) => getPeca(apre, pecas)
  },
  calcularTotalApresentacao: (apre) => calcularTotalApresentacao(apre, pecas),
  calcularTotalFatura: (apresentacoes) =>
    apresentacoes
      .map(a => calcularTotalApresentacao(a, pecas))
      .reduce((a, b) => a + b, 0),
  calcularTotalCreditos: (apresentacoes) =>
    apresentacoes
      .map(a => calcularCredito(a, pecas))
      .reduce((a, b) => a + b, 0)
};

// === Impressão das duas faturas ===

console.log(gerarFaturaStr(fatura, pecas));
console.log(gerarFaturaHTML(fatura, calc));
