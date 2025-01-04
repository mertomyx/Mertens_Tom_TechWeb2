var Clients = /** @class */ (function () {
    function Clients(id, nom, prenom, email, adresse, commandes) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.adresse = adresse;
        this.commandes = commandes;
    }
    Clients.fromJSON = function (json) {
        return new Clients(json.id, json.nom, json.prenom, json.email, json.adresse, json.commandes || []);
    };
    return Clients;
}());

// Fonction pour charger et afficher les clients
export async function loadClients() {
    try {
        const response = await fetch('/Clients.json'); // Chemin mis à jour
        if (!response.ok) throw new Error('Erreur lors du chargement des données.');
        const data = await response.json();

        // Convertir les données JSON en objets Clients
        const clients = data.map(clientData => Clients.fromJSON(clientData));

        // Insérer les clients dans le DOM
        const main = document.querySelector('main.Clients');
        clients.forEach(client => {
            const clientDiv = document.createElement('div');
            clientDiv.classList.add('client');
            clientDiv.innerHTML = `
                <h2>${client.prenom} ${client.nom}</h2>
                <p>Email : ${client.email}</p>
                <p>Adresse : ${client.adresse}</p>
                <p>Commandes : ${client.commandes.length ? client.commandes.join(', ') : 'Aucune commande'}</p>
            `;
            main.appendChild(clientDiv);
        });
    } catch (error) {
        console.error(error.message);
    }
}