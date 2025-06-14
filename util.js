// util.js
// Função para formatar valores em reais (BRL)
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

module.exports = { formatarMoeda };
