import { DataManager } from "../controllers/DataManager";

(async () => {
    const manager = new DataManager("/data/clients.json", "/data/ventes.json");
    await manager.loadVentes();

    const catalogue = document.getElementById("catalogue");

    if (catalogue) {
        manager.getVentes().forEach(vente => {
            if (!vente.clientId) {
                const div = document.createElement("div");
                div.className = "montre";
                div.innerHTML = `
                    <p><strong>${vente.modele}</strong></p>
                    <p>Prix : ${vente.prix}€</p>
                    <button data-id="${vente.id}">Acheter</button>
                `;
                catalogue.appendChild(div);
            }
        });

        // Event listener pour les boutons "Acheter"
        catalogue.addEventListener("click", async (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.tagName === "BUTTON" && target.dataset.id) {
                const venteId = parseInt(target.dataset.id, 10);
                const vente = manager.getVentes().find(v => v.id === venteId);

                if (vente) {
                    const nom = prompt("Entrez votre nom :");
                    const prenom = prompt("Entrez votre prénom :");
                    const email = prompt("Entrez votre email :");

                    if (nom && prenom && email) {
                        // Ajouter le client si nouveau
                        let client = manager.getClients().find(c => c.email === email);
                        if (!client) {
                            const newClientId = manager.getClients().length + 1;
                            client = {
                                id: newClientId,
                                nom,
                                prenom,
                                email,
                                adresse: "",
                                commandes: []
                            };
                            manager.clients.push(client);
                        }

                        // Mettre à jour la vente
                        vente.clientId = client.id;
                        client.commandes.push(vente.id);

                        alert(`Merci pour votre achat, ${prenom} ${nom} !`);
                    }
                }
            }
        });
    }
})();