// http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
function unique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

$(document).ready(function() {
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
 
    $('#c-date').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url : $('#c-date').attr("action"),
            data : $('#c-date').serialize(),
            type : "GET",
            dataType : "json",
        }) 
        .done(function(data) {
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
        .fail(function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
        });
    });
 
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
        .fail(function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
        });
    });
}); 
