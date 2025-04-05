
//  1. População
//  2. Fitness
//  3. Crossover
//  4. Mutação
//  5. Verificar e repete

class City {
    x: number;
    y: number;
    name: string;

    constructor(x: number, y: number, name: string) {
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

class Truck {
    name: string;
    path: City[];
    citesAlreadyVisited = new Set<string>();
    repeatedCities: number[] = [];
    constructor(path: City[], name: string) {
        this.path = path;
        this.name = name;
        for(let i = 0; i < path.length; i++) {
            if (this.citesAlreadyVisited.has(path[i].name)) {
                this.repeatedCities.push(i);
            } else {
                this.citesAlreadyVisited.add(path[i].name);
            }
        }
    }
}

class SolutionTable {
    trucks: Truck[];
    constructor(trucks: Truck[]) {
        this.trucks = trucks
    }
}



const prettyPrinter = () => {
    return (solutionClass: Solution, propertyKey: string, descriptor: PropertyDescriptor) => {
        console.log(solutionClass.population);
    }
}


class Solution {
    graph: City[]  = [
        new City(8, 8, "X"),
        new City(2, 3, "A"),
        new City(5, 7, "B"),
        new City(8, 4, "C"),
        new City(3, 9, "D"),
        new City(1, 5, "E"),
        new City(6, 6, "F"),
        new City(8, 8, "X"),
    ]

    maxAttempts: number = Infinity;
    population: SolutionTable[] = [
        new SolutionTable([new Truck([...this.graph], "TruckA"), new Truck([...this.graph], "TruckB")]),
        new SolutionTable([new Truck([...this.graph], "TruckA"), new Truck([...this.graph], "TruckB")]),
    ];


    execute() {
        for(let i = 0; i < this.maxAttempts; i++) {
            const [father, mother] = this.fitness();
            this.crossover(father, mother);
        }
    }
    
    @prettyPrinter()
    fitness() {
        let firstBest = Infinity;
        let secondBest = Infinity;
        for(let i = 0; i < this.population.length; i++) {
            let matchs = 0; 
            for(const truck of this.population[i].trucks) {
                matchs += truck.repeatedCities.length;
            }
            
            if (matchs < firstBest) {
                firstBest = i;
            
            } else if(matchs < secondBest) {
                secondBest = i;
            }
        }
        return [this.population[firstBest], this.population[secondBest]];
    }
    
    
    
    @prettyPrinter()
    crossover(father: SolutionTable, mother: SolutionTable) {
        
    }
    
    @prettyPrinter()
    mutate() {}
    
    
    calcEuclitianDist(fromX: number, fromY: number, toX: number, toY: number) {
        return Math.sqrt(
            ((toX - fromX) ** 2) 
          + ((toY - fromY) ** 2)
        )
    }
    
    @prettyPrinter()
    verifySolution() {}

    // EDIT1: Maybe I dont need it!
    // We need to do this because a truck can have the same path as another, ex:
    // TRUCK A: X A B C X
    // TRUCK B: X A B C X
    // This way we're going to flip only the positions where it has the same value for optimazition.
    // _compareTrucks(trucks: Truck[]){
    //     for(const truck of trucks) {

    //     }
    // }

    _getCitiesNotPassed(citiesPassed: City[]) {
        return this.graph.filter(city => !citiesPassed.includes(city));
    }

}

const x = new Solution();
x.execute();

export default Solution;