// apresentacao.js
const { formatarMoeda } = require('./util');

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

module.exports = gerarFaturaStr;
