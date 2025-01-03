export class Clients {
    constructor(
        public id: number,
        public nom: string,
        public prenom: string,
        public email: string,
        public adresse: string,
        public commandes: number[]
    ) {}

    static fromJSON(json: any): Clients {
        return new Clients(json.id, json.nom, json.prenom, json.email, json.adresse, json.commandes || []);
    }
}
