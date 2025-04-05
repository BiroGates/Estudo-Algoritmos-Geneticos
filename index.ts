
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
    city: City[];
    
    constructor(path: City[], name: string) {
        this.city = path;
        this.name = name;
        
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
    bestSolution: number = Infinity;
    baseGraph = new City(8, 8, "X")
    graph: City[]  = [
        // new City(8, 8, "X"),
        new City(2, 3, "A"),
        new City(5, 7, "B"),
        new City(8, 4, "C"),
        new City(3, 9, "D"),
    ]

    maxAttempts: number = 10000;
    bestPath: any;
    population: SolutionTable[] = [
        new SolutionTable([new Truck([this.baseGraph, ...this.graph, this.baseGraph], "TruckA")]),
        new SolutionTable([new Truck([this.baseGraph, ...this.graph, this.baseGraph], "TruckB")]),
        new SolutionTable([new Truck([this.baseGraph, ...this.graph, this.baseGraph], "TruckC")]),
        new SolutionTable([new Truck([this.baseGraph, ...this.graph, this.baseGraph], "TruckD")]),
    ];


    execute() {
        for(let i = 0; i < this.maxAttempts; i++) {
            const [father, mother] = this.fitness();
            this.crossover(father, mother);
            this.mutate();
            
        }
        console.log('Best solution: ', this.bestSolution);
        console.log('Best path: ', this.bestPath);
    }
    
    @prettyPrinter()
    fitness() {
        let firstBest = 0;
        let secondBest = 0;
        let set = new Set();
        for(let i = 0; i < this.population.length; i++) {
            for(let j = 0; j < this.population[i].trucks.length; j++) {
                let pathSum = 0;
                for (let k = 0; k < this.population[i].trucks[j].city.length; k++) {
                    if (k === this.population[i].trucks[j].city.length - 1) {
                        break;
                    }
                    const truck = this.population[i].trucks[j];
                    const currentCity = truck.city[k];
                    const newCity = truck.city[k + 1];

                    const [fromX, fromY] = [currentCity.x, currentCity.y];
                    const [toX, toY] = [newCity.x, newCity.y];

                    set.add(truck.city[k].name);
                    pathSum += this._calcEuclitianDist(fromX, fromY, toX, toY);
                }

                
                if (pathSum < this.bestSolution) {
                    this.bestSolution = pathSum;
                    this.bestPath = this.population[i].trucks[j];
                }

                if (pathSum > firstBest) {
                    firstBest = i; 
                }else {
                    secondBest = i;
                }
                set.clear();
            }            
        }

        const father = this.population[firstBest];
        const mother = this.population[secondBest];
        return [father, mother];
    }
    
    
    @prettyPrinter()
    crossover(father: SolutionTable, mother: SolutionTable) {
        const fatherTruck = father.trucks[0];
        const motherTruck = mother.trucks[0];

        const firstIndex = 1;
        const lastIndex = fatherTruck.city.length - 1;
        const midPoint = Math.ceil((firstIndex + lastIndex) / 2);

        const fatherKPoints = [];
        const motherKPoints = [];
        for(let i = 1; i < father.trucks.length - 1; i++) {
            if (i % 2 === 0) {
                fatherKPoints.push(i);
            } else {
                motherKPoints.push(i);
            }
        }

        const fatherFirtHalf = fatherTruck.city.slice(firstIndex, midPoint);
        const fatherSecondHalf = fatherTruck.city.slice(midPoint, lastIndex);

        const motherFirstHalf = motherTruck.city.slice(firstIndex, midPoint);
        const motherSecondHalf = motherTruck.city.slice(midPoint, lastIndex);


        this.population = [
            father,
            mother,
            new SolutionTable([new Truck([this.baseGraph, ...fatherFirtHalf, ...motherSecondHalf, this.baseGraph], "TruckC")]),
            new SolutionTable([new Truck([this.baseGraph, ...fatherSecondHalf, ...motherFirstHalf, this.baseGraph], "TruckB")])
        ];
    }
    
    @prettyPrinter()
    mutate() {
        
        for(let i = 0; i < this.population.length; i++) {
            const solution = this.population[i];
            for(let j = 0; j < solution.trucks.length; j++) {
                const truck = solution.trucks[j];
                
                const randomCityIndex = Math.floor(Math.random() * this.graph.length);
                const choosenCity = this.graph[randomCityIndex];

                const randomTruckCityindex = Math.floor(Math.random() * (truck.city.length - 2) + 1);
                const temp = truck.city[randomTruckCityindex];
                truck.city[randomTruckCityindex] = new City(choosenCity.x, choosenCity.y, choosenCity.name);

                const swapIndex = this._findDuplicatesCitiesIndexes(truck, randomTruckCityindex);
                if(swapIndex !== -1) {
                    truck.city[swapIndex] = temp;
                }
            }
        }
    }
    
    
    
    _calcEuclitianDist(fromX: number, fromY: number, toX: number, toY: number) {
        return Math.sqrt(
            ((toX - fromX) ** 2) + ((toY - fromY) ** 2)
        )
    }

    // Need to change this later on;
    _findDuplicatesCitiesIndexes(truck: Truck, randomTruckCityindex: number) {
        const key = truck.city[randomTruckCityindex].name;
        const index = truck.city.findIndex((x, index) => {
            return x.name === key && index !== randomTruckCityindex;
        })
        
        return index;
    }

    _shuffle<T>(array: T[]): T[] {
        const arrayEmbaralhado = [...array];
        for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
        }
        return arrayEmbaralhado;
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