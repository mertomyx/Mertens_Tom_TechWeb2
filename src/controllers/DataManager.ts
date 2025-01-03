import { Clients } from "../models/Clients";
import { Ventes } from "../models/Vente";

export class DataManager {
    clients: Clients[] = [];
    ventes: Ventes[] = [];
    private clientsPath: string;
    private ventesPath: string;

    // Le constructeur accepte les chemins des fichiers en arguments
    constructor(clientsPath: string = "/data/clients.json", ventesPath: string = "/data/ventes.json") {
        this.clientsPath = clientsPath;
        this.ventesPath = ventesPath;
    }

    async loadClients(): Promise<void> {
        const response = await fetch(this.clientsPath);
        const data = await response.json();
        this.clients = data.map((item: any) => Clients.fromJSON(item));
    }

    async loadVentes(): Promise<void> {
        const response = await fetch(this.ventesPath);
        const data = await response.json();
        this.ventes = data.map((item: any) => Ventes.fromJSON(item));
    }

    getClients(): Clients[] {
        return this.clients;
    }

    getVentes(): Ventes[] {
        return this.ventes;
    }
}