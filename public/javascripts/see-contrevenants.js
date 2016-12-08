// Fonction qui va éliminer les doubles d'une liste 
// http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
function unique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { 
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

$(document).ready(function() {

    // Remplis le menu déroulant de contrevenant pour la recherche
    $.getJSON("/contrevenants/", function(data) {
        var options = $("#options");
        var names = [];

        $('#liste-contrevenants').empty();
        $.each(data.contrevenants, function (index, c) {
            names.push(c.etablissement);
        });

        names = unique(names);
        $.each(names, function(n) {
            options.append($("<option />").val(names[n]).text(names[n]));
        });
    });
 
    // Recherche par date d'infraction
    $('#c-date').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url : $('#c-date').attr("action"),
            data : $('#c-date').serialize(),
            type : "GET",
            dataType : "json",
        }) 
        .done(function(data) {
            // Remplissage de la liste d'affichage
            $('#liste-contrevenants').empty();
            $.each(data.contrevenants, function (index, c) {
                $('#liste-contrevenants').append(
                    $('<ul>').append(
                        '<li>' + c.etablissement + '</li>',
                        '<li>' + c.ville + '</li>',
                        '<li>' + c.adresse + '</li>',
                        '<li>' + c.proprietaire + '</li>',
                        '<li>' + c.categorie+ '</li>',
                        '<li>' + c.description+ '</li>',
                        '<li>' + c.montant + '</li>',
                        '<li>' + c.date_infraction + '</li>',
                        '<li>' + c.date_jugement + '</li>'
                    )
                );
            });
        })
        .fail(function(xhr, status, errorThrown) {
            alert("Désolé, il semble qu'il y a un problème avec la base de donnée");
        });
    });

    // Rercherche par nom 
    $('#c-nom').submit(function(e) {
        e.preventDefault();

        console.log($('#c-nom').serialize()); 
        
        $.ajax({
            url : $('#c-nom').attr("action"),
            data : $('#c-nom').serialize(),
            type : "GET",
            dataType : "json",
        }) 
        .done(function(data) {
            // Remplissage de la liste des contrevenants
            $('#liste-contrevenants').empty();
            $.each(data.contrevenants, function (index, c) {
                $('#liste-contrevenants').append(
                    $('<ul>').append(
                        '<li>' + c.etablissement + '</li>',
                        '<li>' + c.ville + '</li>',
                        '<li>' + c.adresse + '</li>',
                        '<li>' + c.proprietaire + '</li>',
                        '<li>' + c.categorie+ '</li>',
                        '<li>' + c.description+ '</li>',
                        '<li>' + c.montant + '</li>',
                        '<li>' + c.date_infraction + '</li>',
                        '<li>' + c.date_jugement + '</li>'
                    )
                );
            });
        })
        .fail(function(xhr, status, errorThrown) {
            alert("Désolé, il semble qu'il y a un problème avec la base de donnée");
        });
    });
}); 
