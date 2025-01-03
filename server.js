app.post("/:file", (req, res) => {
    const filePath = path.join(__dirname, req.params.file);

    // Charger les données existantes du fichier
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return res.status(500).send("Erreur lors de la lecture du fichier.");
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du fichier JSON :", parseError);
        }

        // Ajouter les nouvelles données
        const newData = req.body;
        if (Array.isArray(jsonData)) {
            jsonData.push(newData);
        } else {
            jsonData = [newData];
        }

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