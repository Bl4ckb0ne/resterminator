var express = require('express');
var parser = require('xml2json');
var iconv = require('iconv-lite');
var request = require('request');
var path = require('path');
var raml2html = require('raml2html');
var moment = require('moment');
var router = express.Router();

var Contrevenant_Schema = require(__dirname+'/../models/contrevenant'); 

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/contrevenants/', function(req, res, next) {
    Contrevenant_Schema.find({}, function (err, c) {
        if (err) return handleError(err);

        res.header("Content-Type", "application/json");
        res.send({"contrevenants" : c }); 
    });
});

router.get('/contrevenants/date_jugement/', function(req, res, next) {
    if("du" in req.query && "au" in req.query)
    {
        if(moment(req.query['du']).isAfter(req.query['au']))
        {
            res.status(400);
            res.send("Erreur: date 'du' est située après date 'au'");
        }
        else
        {
            Contrevenant_Schema.find({date_infraction: {$gte: req.query['du'], $lte: req.query['au']}}, function (err, c) {
                if (err) return handleError(err);

                res.header("Content-Type", "application/json");
                res.send({"contrevenants" : c }); 
            });
        }
    }
    else
    {
            res.status(400);
            res.send("Erreur: date 'du' et/ou 'au' manquantes");
    }
});

router.get('/contrevenants/etablissement', function(req, res, next) {
    if('etablissement' in req.query)
    {
        Contrevenant_Schema.find({etablissement: req.query['etablissement']}, function (err, c) {
            if (err) return handleError(err);

            res.header("Content-Type", "application/json");
            res.send({"contrevenants" : c }); 
        });
    }
    else
    {
            res.status(400);
            res.send("Erreur: nom d'établissement manquant");
    }
});

router.get('/contrevenants/etablissement/liste/', function(req, res, next) {
    Contrevenant_Schema.find({}, function (err, c) {
        if (err) return handleError(err);

        var etab = {};          

        for(i in c)
        {
            if(c[i].etablissement in etab)
            {
                etab[c[i].etablissement] = etab[c[i].etablissement] + 1;
            }
            else
            {
                etab[c[i].etablissement] = 1;
            }
        }

        var liste = [];
        for(i in etab)
        {
            liste.push({
                nom : i,
                infractions : etab[i],
            });
        }

        liste.sort(function(a,b){
            return a.infractions - b.infractions;
        });
        liste.reverse();

        if('type' in req.query)
        {
            if(req.query['type'] == 'JSON' || req.query['type'] == 'json')
            {
                res.header("Content-Type", "application/json");
                res.send(liste); 
            }
            else if(req.query['type'] == 'XML' || req.query['type'] == 'xml')
            {
                var js2xmlparser = require("js2xmlparser");
                var xml = js2xmlparser.parse("contrevenants", liste);
                res.header("Content-Type", "application/xml");
                res.send(xml); 
            }
            else if(req.query['type'] == 'CSV' || req.query['type'] == 'csv')
            {
                var json2csv = require('json2csv');

                try {
                    var csv = json2csv({data : liste, field : ['nom', 'infractions']});
                    res.header("Content-Type", "text/csv");
                    res.send(csv);
                } catch (err) {
                    console.error(err);
                }

            }
            else
            {
                res.status(400);
                res.send("Erreur: type de donnée erroné");
            }
        }
        else
        {
            res.status(400);
            res.send("Erreur: type de donnée non spécialisé");
        }
    });
});
    

router.get('/dataset/', function(req, res, next) {
    request.get({
            uri : 'http://donnees.ville.montreal.qc.ca/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml',
            encoding : null
    },
    function(err, resp, body){    
            var body = iconv.decode(body, 'iso-8859-1');
            res.header("Content-Type", "application/xml");
            res.send(body); 
    });
});

router.get('/doc/', function(req, res, next) {
    raml2html.render(path.join(__dirname, '../public/doc/resterminator.raml'), raml2html.getDefaultConfig()).then(function(result) {
            res.send(result);
    }, function(error) {
            console.log(error);
    });     
});

module.exports = router;
