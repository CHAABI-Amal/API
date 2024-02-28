const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); //une bibliothèque HTTP client pour faire des requêtes HTTP depuis Node.js.

const app = express();

let path = 'https://swapi.dev/api/'; //la variable path pour stocker l'URL de base de l'API SWAPI 
let result = null;
//Requête initiale vers l'API SWAPI pour obtenir des données
axios.get(path)
    .then(function(response) {
        result = response.data;
    });

//Configuration des middlewares
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
//Configuration pour servir des fichiers statiques depuis le répertoire public
app.use(express.static('public'));
//Lorsqu 'un client accède à cette URL dans son navigateur, 
//le serveur envoie une réponse HTML qui comprend une page Web générée dynamiquement
app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <section>
          <h2>Requested path: </h2>
          <h3>${path}</h3>
        </section>
        <form action="/get-goal" method="POST">
          <div class="form-control">
            <label>Choose path : </label>
            <input type="text" name="path">
          </div>
          <button>Set new path</button>
        </form>
        <div class="results">
          <pre><code>${JSON.stringify(result, null, 4)}</code></pre>
        </div>
      </body>
    </html>
  `);
});
//la méthode HTTP POST sur l'URL /get-goal. 
//Lorsqu'un client soumet un formulaire avec cette action, 
//le serveur exécute la fonction de rappel spécifiée
app.post('/get-goal', (req, res) => {
    path = req.body.path;
    axios.get(path)
        .then(function(response) {
            result = response.data;
            res.redirect('/');
        }).catch(function(err) {
            res.redirect('/');
        })
});

//Démarrage du serveur 
app.listen(80);