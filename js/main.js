"use strict";

var POKEDEX = {};

var numSelected = 0;
var currentSelected = ["", "", "", "", "", ""];


function addSelected(pkey) {
    // Exit when the Pokemon cannot be added
    if (numSelected === 6) {return;} // TODO: return warning message
    for (var i = 0; i < 6; i++) {
        if (currentSelected[i] === pkey) {return;} // TOOD: return warning message
    }
    // Add the Pokemon to the data structures
    numSelected += 1;
    var index = numSelected - 1;
    currentSelected[index] = pkey;
    // Add the Pokemon name
    $("#sp_box_" + index).find(".sp_name").text(POKEDEX[pkey].species);
    // Add the Pokemon types
    var types = POKEDEX[pkey].types;
    $("#sp_box_" + index).find(".sp_type1").text(types[0]);
    if (types.length == 2) {
        $("#sp_box_" + index).find(".sp_type2").text(types[1]);
    }
    // Add the Pokemon image
    $("#sp_box_" + index).find(".sp_icon").html(getIconString(POKEDEX[pkey]));
    // Add the delete button
    $("#sp_box_" + index).find(".sp_delete").html("<a href= \"javascript:removeSelected('" + pkey + "')\"><button class=\"delete\"></button></a>");
}


function removeSelected(pkey) {
    var index = -1;
    for (var i = 0; i < 6; i++) {
        if (currentSelected[i] === pkey) {
            index = i;
        }
    }
    if (index === -1) {return;} // Should never happen
    for (var curr = index + 1; curr < numSelected; curr++) {
        var prev = curr - 1;
        currentSelected[prev] = currentSelected[curr];
        $("#sp_box_" + prev).html($("#sp_box_" + curr).html());
    }
    currentSelected[numSelected - 1] = "";
    resetSelected(numSelected - 1);
    numSelected -= 1;
}


function resetSelected(pindex) {
    $("#sp_box_" + pindex).html($("#sp_box_template").html());
}


function loadData() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://pokemonteambuilder.github.io/data/pokedex.json", false);
    xmlHttp.send(null);
    POKEDEX = JSON.parse(xmlHttp.responseText);
    displyResults();
}

function getIconString(pobject) {
    var suffix = "" + pobject.num;
    if (pobject.species.indexOf("-Mega-X") != -1) {
        suffix += "-mega-x";
    }
    else if (pobject.species.indexOf("-Mega-Y") != -1) {
        suffix += "-mega-y";
    }
    else if (pobject.species.indexOf("-Mega") != -1) {
        suffix += "-mega";
    }
    else if (pobject.species.indexOf("-Alola") != -1) {
        suffix += "-alolan";
    }
    else if (pobject.species.indexOf("-Therian") != -1) {
        suffix += "-therian";
    }
    else if (pobject.species.indexOf("-10") != -1) {
        suffix += "-10";
    }
    else if (pobject.species.indexOf("-Complete") != -1) {
        suffix += "-complete";
    }
    else if (pobject.species.indexOf("-Attack") != -1) {
        suffix += "-attack";
    }
    else if (pobject.species.indexOf("-Defense") != -1) {
        suffix += "-defense";
    }
    else if (pobject.species.indexOf("-Speed") != -1) {
        suffix += "-speed";
    }
    else if (pobject.species.indexOf("-Sandy") != -1) {
        suffix += "-sandy";
    }
    else if (pobject.species.indexOf("-Trash") != -1) {
        suffix += "-trash";
    }
    else if (pobject.species.indexOf("-Heat") != -1) {
        suffix += "-heat";
    }
    else if (pobject.species.indexOf("-Wash") != -1) {
        suffix += "-wash";
    }
    else if (pobject.species.indexOf("-Frost") != -1) {
        suffix += "-frost";
    }
    else if (pobject.species.indexOf("-Fan") != -1) {
        suffix += "-fan";
    }
    else if (pobject.species.indexOf("-Mow") != -1) {
        suffix += "-mow";
    }
    else if (pobject.species.indexOf("-Primal") != -1) {
        suffix += "-primal";
    }
    else if (pobject.species.indexOf("-Origin") != -1) {
        suffix += "-origin";
    }
    else if (pobject.species.indexOf("-Sky") != -1) {
        suffix += "-sky";
    }
    else if (pobject.species.indexOf("-Zen") != -1) {
        suffix += "-zen";
    }
    else if (pobject.species.indexOf("-Black") != -1) {
        suffix += "-black";
    }
    else if (pobject.species.indexOf("-White") != -1) {
        suffix += "-white";
    }
    else if (pobject.species.indexOf("-Resolute") != -1) {
        suffix += "-resolute";
    }
    else if (pobject.species.indexOf("-Pirouette") != -1) {
        suffix += "-pirouette";
    }
    else if (pobject.species.indexOf("-Ash") != -1) {
        suffix += "-ash";
    }
    else if (pobject.species.indexOf("-Blade") != -1) {
        suffix += "-blade";
    }
    else if (pobject.species.indexOf("-Small") != -1) {
        suffix += "-small";
    }
    else if (pobject.species.indexOf("-Large") != -1) {
        suffix += "-large";
    }
    else if (pobject.species.indexOf("-Super") != -1) {
        suffix += "-super";
    }
    else if (pobject.species.indexOf("-Unbound") != -1) {
        suffix += "-unbound";
    }
    else if (pobject.species.indexOf("-Pa'u") != -1) {
        suffix += "-pau";
    }
    else if (pobject.species.indexOf("-Pom-Pom") != -1) {
        suffix += "-pom-pom";
    }
    else if (pobject.species.indexOf("-Sensu") != -1) {
        suffix += "-sense";
    }
    else if (pobject.species.indexOf("-Midnight") != -1) {
        suffix += "-midnight";
    }
    else if (pobject.species.indexOf("-Midday") != -1) {
        suffix += "-midday";
    }
    else if (pobject.species.indexOf("-School") != -1) {
        suffix += "-school";
    }
    else if (pobject.species.indexOf("-Meteor") != -1) {
        suffix += "-meteor";
    }
    return "<i class=\"image is-40x30 picons picon_" + suffix + "\"></i>";
}


function displyResults() {
    var wrapCount = 0;
    var currentColumn = 1;
    $("#plistbox").append("<div id=\"pp_row_" + currentColumn + "\" class=\"columns is-gapless\"></div>");
    for (var key in POKEDEX) {
        if (POKEDEX.hasOwnProperty(key)) {
            $("#pp_row_" + currentColumn).append("<div class=\"column is-1\"><a href = \"javascript:addSelected('" + key + "')\">" + getIconString(POKEDEX[key]) + "</a></div> ");
        }
        wrapCount += 1;
        if (wrapCount === 12) {
            wrapCount = 0;
            currentColumn += 1;
            $("#plistbox").append("<div id=\"pp_row_" + currentColumn + "\" class=\"columns is-gapless\"></div>");
        }
    }
}


function initialize() {
    resetSelected(0);
    resetSelected(1);
    resetSelected(2);
    resetSelected(3);
    resetSelected(4);
    resetSelected(5);
    loadData();
}