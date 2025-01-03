export class Ventes {
    constructor(
        public id: number,
        public modele: string,
        public prix: number,
        public date: string,
        public clientId: number | null
    ) {}

    static fromJSON(json: any): Ventes {
        return new Ventes(json.id, json.modele, json.prix, json.date, json.clientId || null);
    }
}