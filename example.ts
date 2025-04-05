
// Geralmente os algoritmos genéticos segue esse padrão:
// 1. Population
// 2. Fitness
// 3. Crossover
// 4. Mutation
// 5. Verify


class Solucao {
    modelo = '11100011100101101101';
    maximoTentativas = Infinity;
    maxPopulation = 4;
    populacao = ['00000000000000000000','00000000000000000000', '00000000000000000000', '00000000000000000000'];

    execute() {
        for(let i = 0; i < this.maximoTentativas; i++) {
            const [father, mother] = this.fitness(this.populacao);
            
            this.crossOver(father, mother);
            this.mutacao();
            if(this.verificarPopulacao()) {
                console.log(`Generation: `, i);
                console.log(`Population:`, this.populacao)                
                
                return;
            }
        }

    }

    // Fitness metodo: CLASSIFICAÇÃO
    fitness(populacao: string[]) {
        let firstBest = 0;
        let secondBest = 0;
        for(let i = 0; i < populacao.length; i++) {
            let matchs = 0;
            for(let j = 0; j < populacao[0].length; j++) {
                if(this.modelo[j] === populacao[i][j]) {
                    matchs++;
                }
            }
            if (matchs > firstBest) {
                firstBest = i;
            } else if(matchs > secondBest) {
                secondBest = i;
            }
        }
        return [populacao[firstBest], populacao[secondBest]];
    }

    // Utilizando metodo: CRUZAMENTO EM UM PONTO
    crossOver(father: string, mother: string) {
        const newPopulation: string[] = [];
        const fFirsHalf = father.substring(0, (father.length ) / 2);
        const fSecondHalf = father.substring((mother.length) / 2, mother.length);
        const mFirsHalf = mother.substring(0, (mother.length ) / 2);
        const mSecondHalf = mother.substring((mother.length) / 2, mother.length);

        newPopulation.push(fFirsHalf + mSecondHalf);
        newPopulation.push(fSecondHalf + mFirsHalf);

        this.populacao = [father, mother, ...newPopulation];
    }

    // Utilizando metodo: FLIP
    mutacao() {
        for(let i = 0; i < this.populacao.length; i++) {
            const cromossomo = this.populacao[i].split('');
            const index = Math.floor(Math.random() * 20)
            const gene = cromossomo[4];

            if(gene === '1')
                cromossomo[index] = '0';
            
            if(gene === '0')
                cromossomo[index] = '1';

            this.populacao[i] = cromossomo.join('');
        }
    }

    verificarPopulacao() {
        for(const x of this.populacao) {
            if(x === this.modelo) {
                return true;
            }
        }
    }

}


const x = new Solucao();

x.execute();

export default Solucao;