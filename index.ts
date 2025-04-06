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
        this.trucks = trucks;
    }
}

class Solution {
    bestSolution: number = Infinity;
    baseGraph = new City(30, 30, "Deposito");
    graph: City[] = [
        new City(5, 10, "1"), new City(15, 25, "2"), new City(30, 5, "3"),
        new City(40, 20, "4"), new City(20, 40, "5"), new City(35, 35, "6"),
        new City(10, 30, "7"), new City(50, 45, "8"), new City(45, 10, "9"),
        new City(60, 30, "10"), new City(25, 15, "11"), new City(55, 20, "12"),
        new City(70, 10, "13"), new City(80, 25, "14"), new City(65, 40, "15"),
        new City(90, 30, "16"), new City(75, 50, "17"), new City(85, 15, "18"),
        new City(95, 35, "19"), new City(40, 50, "20"), new City(10, 5, "21"),
        new City(20, 25, "22"), new City(35, 10, "23"), new City(50, 15, "24"),
        new City(60, 5, "25"), new City(70, 20, "26"), new City(30, 50, "27"),
        new City(45, 25, "28"), new City(55, 35, "29"), new City(65, 15, "30")
    ];

    numTrucks: number = 3;
    citiesToVisit: number = 15;
    maxCitiesPerTruck: number = 5;
    maxAttempts: number = 1000;
    bestPath: SolutionTable | null = null;
    population: SolutionTable[] = [];

    constructor() {
        for (let i = 0; i < 10; i++) {
            const shuffled = this._shuffle(this.graph);
            const trucks = this._splitCitiesAmongTrucks(shuffled);
            this.population.push(new SolutionTable(trucks));
        }
    }

    execute() {
        for (let i = 0; i < this.maxAttempts; i++) {
            const [father, mother] = this.fitness();
            this.crossover(father, mother);
            this.mutate();
        }
        
        if (this.bestSolution) {
            for(const x of this.bestPath!.trucks) {
                console.log(`Caminhão ${x.name} had best path`);
                console.log(x.city);
            }
            console.log(this.bestSolution);
        }
    }

    fitness(): [SolutionTable, SolutionTable] {
        const scored = this.population.map((solution, index) => {
            let pathSum = 0;
            const visited = new Set<string>();

            for (const truck of solution.trucks) {
                for (let i = 0; i < truck.city.length - 1; i++) {
                    const from = truck.city[i];
                    const to = truck.city[i + 1];
                    if (from.name !== "X") visited.add(from.name);
                    pathSum += this._calcEuclidianDist(from.x, from.y, to.x, to.y);
                }
            }

            if (visited.size !== this.citiesToVisit) pathSum = Infinity;
            if (pathSum < this.bestSolution) {
                this.bestSolution = pathSum;
                this.bestPath = solution;
            }

            return { index, score: pathSum };
        });

        scored.sort((a, b) => a.score - b.score);
        return [this.population[scored[0].index], this.population[scored[1].index]];
    }

    crossover(father: SolutionTable, mother: SolutionTable) {
        const getAllCities = (trucks: Truck[]) =>
            trucks.flatMap(t => t.city.slice(1, -1));

        const shuffled = this._shuffle(getAllCities(father.trucks).concat(getAllCities(mother.trucks)));
        const trucks = this._splitCitiesAmongTrucks(shuffled);
        const child1 = new SolutionTable(trucks);

        const shuffled2 = this._shuffle(shuffled);
        const child2 = new SolutionTable(this._splitCitiesAmongTrucks(shuffled2));

        this.population = [father, mother, child1, child2];
    }

    mutate() {
        for (const solution of this.population) {
            for (const truck of solution.trucks) {
                const i = Math.floor(Math.random() * (truck.city.length - 2)) + 1;
                const j = Math.floor(Math.random() * (truck.city.length - 2)) + 1;
                if (i !== j) [truck.city[i], truck.city[j]] = [truck.city[j], truck.city[i]];
            }
        }
    }

    _splitCitiesAmongTrucks(cities: City[]): Truck[] {
        const trucks: Truck[] = [];
        const chunkSize = this.maxCitiesPerTruck;

        for (let i = 0; i < this.numTrucks; i++) {
            const truckCities = cities.slice(i * chunkSize, (i + 1) * chunkSize);
            trucks.push(new Truck([this.baseGraph, ...truckCities, this.baseGraph], `Truck${i + 1}`));
        }

        return trucks;
    }

    _calcEuclidianDist(fromX: number, fromY: number, toX: number, toY: number): number {
        return Math.sqrt(((toX - fromX) ** 2) + ((toY - fromY) ** 2));
    }

    _shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

const solver = new Solution();
solver.execute();

export default Solution;
