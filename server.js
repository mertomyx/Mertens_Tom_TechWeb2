const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Servir les fichiers statiques (HTML, JSON, etc.)
app.use(express.static(path.join(__dirname)));

// Route pour sauvegarder des données JSON sans créer de doublons
app.post("/:file", (req, res) => {
    const filePath = path.join(__dirname, req.params.file);

    // Charger les données existantes
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return res.status(500).send("Erreur lors de la lecture du fichier.");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
            if (!Array.isArray(jsonData)) {
                jsonData = [];
            }
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
            jsonData = [];
        }

        // Validation des données envoyées
        const newData = req.body;
        if (!newData || Object.keys(newData).length === 0) {
            return res.status(400).send("Les données envoyées sont invalides.");
        }

        // Éviter les doublons
        const isDuplicate = jsonData.some(item => JSON.stringify(item) === JSON.stringify(newData));
        if (isDuplicate) {
            return res.status(200).send("Les données existent déjà, aucune modification nécessaire.");
        }

        // Ajouter les nouvelles données
        jsonData.push(newData);

        // Sauvegarder les données mises à jour
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