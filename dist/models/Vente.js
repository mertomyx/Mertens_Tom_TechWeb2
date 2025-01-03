var Ventes = /** @class */ (function () {
    function Ventes(id, modele, prix, date, clientId) {
        this.id = id;
        this.modele = modele;
        this.prix = prix;
        this.date = date;
        this.clientId = clientId;
    }
    Ventes.fromJSON = function (json) {
        return new Ventes(json.id, json.modele, json.prix, json.date, json.clientId || null);
    };
    return Ventes;
}());

// Fonction pour charger et afficher les ventes
export async function loadVentes() {
    try {
        // Charger les données des ventes
        const ventesResponse = await fetch('./Vente.json');
        if (!ventesResponse.ok) throw new Error('Erreur lors du chargement des ventes.');
        const ventesData = await ventesResponse.json();

        // Charger les données des clients
        const clientsResponse = await fetch('./Clients.json');
        if (!clientsResponse.ok) throw new Error('Erreur lors du chargement des clients.');
        const clientsData = await clientsResponse.json();

        // Convertir les clients en un objet pour un accès rapide par ID
        const clientsMap = {};
        clientsData.forEach(client => {
            clientsMap[client.id] = `${client.prenom} ${client.nom}`;
        });

        // Convertir les données JSON en objets Ventes
        const ventes = ventesData.map(venteData => Ventes.fromJSON(venteData));

        // Insérer les ventes dans le DOM
        const main = document.querySelector('main#Vente');
        ventes.forEach(vente => {
            const venteDiv = document.createElement('div');
            venteDiv.classList.add('vente');
            const clientName = vente.clientId ? clientsMap[vente.clientId] || 'Inconnu' : 'Non attribué';
            venteDiv.innerHTML = `
                <h2>${vente.modele}</h2>
                <p>Prix : ${vente.prix} €</p>
                <p>Date : ${vente.date}</p>
                <p>Client : ${clientName}</p>
            `;
            main.appendChild(venteDiv);
        });
    } catch (error) {
        console.error(error.message);
    }
}