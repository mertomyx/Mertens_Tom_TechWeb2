(async () => {
    try {
        // Charger les données depuis le fichier Catalogue.json
        const response = await fetch('/catalogue.json');
        if (!response.ok) throw new Error('Erreur lors du chargement du catalogue.');
        const montres = await response.json();

        const catalogue = document.getElementById("Catalogue");

        // Afficher les montres disponibles
        montres.forEach(montre => {
            if (montre.disponible) {
                const div = document.createElement("div");
                div.className = "montre";
                div.innerHTML = `
                    <h2>${montre.modele}</h2>
                    <p>Prix : ${montre.prix}€</p>
                    <p>Description : ${montre.description}</p>
                    <button data-id="${montre.id}">Acheter</button>
                `;
                catalogue.appendChild(div);
            }
        });

        // Gérer les clics sur "Acheter"
        catalogue.addEventListener("click", async (event) => {
            const target = event.target;

            if (target.tagName === "BUTTON") {
                const montreId = parseInt(target.dataset.id, 10);
                const montre = montres.find(m => m.id === montreId);

                if (montre) {
                    // Collecter les informations personnelles
                    const nom = prompt("Entrez votre nom :")?.trim();
                    const prenom = prompt("Entrez votre prénom :")?.trim();
                    const email = prompt("Entrez votre email :")?.trim();
                    const adresse = prompt("Entrez votre adresse postale :")?.trim();

                    if (!nom || !prenom || !email || !adresse) {
                        alert("Tous les champs doivent être remplis pour continuer.");
                        return;
                    }

                    // Charger les données clients et ventes
                    const clientsResponse = await fetch('/Clients.json');
                    const ventesResponse = await fetch('/Vente.json');

                    if (!clientsResponse.ok || !ventesResponse.ok) {
                        throw new Error('Erreur lors du chargement des fichiers Clients ou Ventes.');
                    }

                    const clients = await clientsResponse.json();
                    const ventes = await ventesResponse.json();

                    // Ajouter un nouveau client si nécessaire
                    let client = clients.find(c => c.email === email);
                    if (!client) {
                        const newClientId = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1;
                        client = {
                            id: newClientId,
                            nom,
                            prenom,
                            email,
                            adresse,
                            commandes: []
                        };
                        clients.push(client);

                        // Sauvegarder le nouveau client
                        await saveData('/Clients.json', clients);
                    }

                    // Ajouter la vente
                    const newVenteId = ventes.length > 0 ? ventes[ventes.length - 1].id + 1 : 1;
                    const newVente = {
                        id: newVenteId,
                        modele: montre.modele,
                        prix: montre.prix,
                        date: new Date().toISOString().split('T')[0], // Date actuelle
                        clientId: client.id
                    };
                    ventes.push(newVente);

                    // Sauvegarder la nouvelle vente
                    await saveData('/Vente.json', ventes);

                    // Ajouter l'id de la commande au client
                    client.commandes.push(newVenteId);
                    await saveData('/Clients.json', clients);

                    alert(`Merci pour votre achat, ${prenom} ${nom} !`);
                    window.location.reload(); // Rafraîchir pour mettre à jour l'affichage
                }
            }
        });

        // Fonction pour sauvegarder les données dans un fichier JSON
        async function saveData(path, data) {
            try {
                console.log(`Tentative de sauvegarde dans ${path} avec les données :`, data);
                const response = await fetch(path, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la sauvegarde sur ${path}: ${response.statusText}`);
                }

                console.log(`Données sauvegardées avec succès dans ${path}`);
            } catch (error) {
                console.error("Erreur lors de la sauvegarde :", error.message);
            }
        }
    } catch (error) {
        console.error('Erreur dans Catalogue.js :', error.message);
    }
})();