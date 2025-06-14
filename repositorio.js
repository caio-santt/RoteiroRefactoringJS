// repositorio.js
const { readFileSync } = require('fs');

class Repositorio {
  constructor() {
    // carrega todas as peças do JSON uma única vez
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

module.exports = Repositorio;
