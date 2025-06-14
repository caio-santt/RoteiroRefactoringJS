// repositorioPecas.js
class RepositorioPecas {
  constructor(pecas) {
    this.pecas = pecas;
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

module.exports = RepositorioPecas;
