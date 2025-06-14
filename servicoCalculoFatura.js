// servicoCalculoFatura.js

class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }

  calcularTotalApresentacao(apre) {
    const peca = this.repo.getPeca(apre);
    let total = 0;
    switch (peca.tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
  }

  calcularCredito(apre) {
    const base = Math.max(apre.audiencia - 30, 0);
    const extra = this.repo.getPeca(apre).tipo === "comedia"
      ? Math.floor(apre.audiencia / 5)
      : 0;
    return base + extra;
  }

  calcularTotalFatura(apresentacoes) {
    return apresentacoes
      .map(a => this.calcularTotalApresentacao(a))
      .reduce((soma, v) => soma + v, 0);
  }

  calcularTotalCreditos(apresentacoes) {
    return apresentacoes
      .map(a => this.calcularCredito(a))
      .reduce((soma, v) => soma + v, 0);
  }
}

module.exports = ServicoCalculoFatura;
