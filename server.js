const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route pour ajouter des données dans un fichier JSON
app.post("/:file", (req, res) => {
    const filePath = path.join(__dirname, req.params.file);

    // Charger le fichier JSON existant
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return res.status(500).send("Erreur lors de la lecture du fichier.");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
            if (!Array.isArray(jsonData)) {
                jsonData = []; // Si ce n'est pas un tableau, initialiser un tableau vide
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
            jsonData = [];
        }

        const newData = req.body;

        // Vérification que la donnée envoyée est un objet valide
        if (!newData || typeof newData !== "object" || Array.isArray(newData)) {
            return res.status(400).send("Les données envoyées doivent être un objet JSON valide.");
        }

        // Ajouter uniquement le nouvel objet au tableau
        jsonData.push(newData);

        // Sauvegarder les données mises à jour dans le fichier
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (writeErr) => {
            if (writeErr) {
                console.error("Erreur lors de la sauvegarde du fichier :", writeErr);
                return res.status(500).send("Erreur lors de la sauvegarde du fichier.");
            }
            res.send("Données ajoutées avec succès !");
        });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});