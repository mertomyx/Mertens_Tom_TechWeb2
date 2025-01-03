import { Clients } from "../models/Clients";
import { Ventes } from "../models/Vente";

export class DataManager {
    constructor(clientsPath = "/data/clients.json", ventesPath = "/data/ventes.json") {
        this.clients = [];
        this.ventes = [];
        this.clientsPath = clientsPath;
        this.ventesPath = ventesPath;
    }

    // Charger les clients depuis le fichier JSON
    async loadClients() {
        try {
            const response = await fetch(this.clientsPath);
            if (!response.ok) throw new Error("Erreur lors du chargement des clients.");
            const data = await response.json();
            this.clients = data.map(item => Clients.fromJSON(item));
        } catch (error) {
            console.error("Erreur de chargement des clients :", error);
        }
    }

    // Charger les ventes depuis le fichier JSON
    async loadVentes() {
        try {
            const response = await fetch(this.ventesPath);
            if (!response.ok) throw new Error("Erreur lors du chargement des ventes.");
            const data = await response.json();
            this.ventes = data.map(item => Ventes.fromJSON(item));
        } catch (error) {
            console.error("Erreur de chargement des ventes :", error);
        }
    }

    // Récupérer les clients
    getClients() {
        return this.clients;
    }

    // Récupérer les ventes
    getVentes() {
        return this.ventes;
    }

    // Sauvegarder les clients dans le fichier JSON
    async saveClients() {
        try {
            const response = await fetch(this.clientsPath, {
                method: "POST", // Utiliser POST pour simuler la sauvegarde
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.clients),
            });
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde des clients.");
        } catch (error) {
            console.error("Erreur de sauvegarde des clients :", error);
        }
    }

    // Sauvegarder les ventes dans le fichier JSON
    async saveVentes() {
        try {
            const response = await fetch(this.ventesPath, {
                method: "POST", // Utiliser POST pour simuler la sauvegarde
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.ventes),
            });
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde des ventes.");
        } catch (error) {
            console.error("Erreur de sauvegarde des ventes :", error);
        }
    }
}