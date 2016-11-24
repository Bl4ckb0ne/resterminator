var mongoose = require("mongoose");

var contrevenant = mongoose.Schema({
    montant: String,
    date_jugement: String,
    date_infraction: String,
    description: String,
    ville: String,
    adresse: String,
    etablissement: String,
    categorie: String,
    proprietaire: String
});

module.exports = mongoose.model('Contrevenant', contrevenant);
