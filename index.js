const { readFileSync } = require('fs');

// === Função movida para o topo ===
function calcularTotalApresentacao(apre, pecas) {
    const peca = pecas[apre.id];
    let total = 0;
    switch (peca.tipo) {
        case "tragedia":
            total = 40000;
            if (apre.audiencia > 30)
                total += 1000 * (apre.audiencia - 30);
            break;
        case "comedia":
            total = 30000;
            if (apre.audiencia > 20)
                total += 10000 + 500 * (apre.audiencia - 20);
            total += 300 * apre.audiencia;
            break;
        default:
            throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
}

function gerarFaturaStr(fatura, pecas) {
    let totalFatura = 0;
    let creditos    = 0;
    let faturaStr   = `Fatura ${fatura.cliente}\n`;

    // query para obter dados da peça
    function getPeca(apre) { return pecas[apre.id]; }

    // calcula créditos de uma apresentação
    function calcularCredito(apre) {
        return Math.max(apre.audiencia - 30, 0)
             + (getPeca(apre).tipo === "comedia"
                 ? Math.floor(apre.audiencia / 5)
                 : 0);
    }

    // formata valores em reais
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        }).format(valor / 100);
    }

    // monta a linha da fatura para cada apresentação
    function montarLinhaFatura(apre, total) {
        const nomePeca = getPeca(apre).nome;
        const audiencia = apre.audiencia;
        return `  ${nomePeca}: ${formatarMoeda(total)} (${audiencia} assentos)\n`;
    }

    // monta as linhas de total geral e créditos
    function montarResumo(totalFatura, creditos) {
        return `Valor total: ${formatarMoeda(totalFatura)}\n` +
               `Créditos acumulados: ${creditos}\n`;
    }

    for (let apre of fatura.apresentacoes) {
        const total = calcularTotalApresentacao(apre, pecas);

        creditos    += calcularCredito(apre);
        totalFatura += total;
        faturaStr   += montarLinhaFatura(apre, total);
    }

    faturaStr += montarResumo(totalFatura, creditos);
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas    = JSON.parse(readFileSync('./pecas.json'));
console.log(gerarFaturaStr(faturas, pecas));
