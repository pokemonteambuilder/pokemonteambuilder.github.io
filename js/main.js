"use strict";

var POKEDEX = {};
var POKEDEX_FILTERED = {};

var FILTER_NAME = "";
var FILTER_TYPES = {"Bug": true, "Dark": true, "Dragon": true, "Electric": true, "Fairy": true, "Fighting": true, "Fire": true, "Flying": true, "Ghost": true, "Grass": true, "Ground": true, "Ice": true, "Normal": true, "Poison": true, "Psychic": true, "Rock": true, "Steel": true, "Water": true};

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
    $("#sp_box_" + index).find(".sp_type1").html("<span class=\"tag tag_type tag_type_" + types[0] + "\">"+ types[0] + "</span>");
    if (types.length == 2) {
        $("#sp_box_" + index).find(".sp_type2").html("<span class=\"tag tag_type tag_type_" + types[1] + "\">"+ types[1] + "</span>");
    }
    // Add the Pokemon image
    $("#sp_box_" + index).find(".sp_icon").html(getIconString(POKEDEX[pkey]));
    // Add the delete button
    $("#sp_box_" + index).find(".sp_delete").html("<a href= \"javascript:removeSelected('" + pkey + "')\"><button class=\"delete\"></button></a>");

    calculateWeaknesses();
    calculateResistances();
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

    calculateWeaknesses();
    calculateResistances();
}


function resetSelected(pindex) {
    $("#sp_box_" + pindex).html($("#sp_box_template").html());
}


function loadData() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://pokemonteambuilder.github.io/data/pokedex.json", false );
    xmlHttp.send( null );
    POKEDEX = JSON.parse(xmlHttp.responseText);
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(POKEDEX));
    displayResults();
}

function getIconString(pobject, key) {
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
    else if (pobject.species.indexOf("stic-F") != -1) {
        suffix += "-female";
    }
    return "<i id=\"" + key + "\" class=\"image is-40x30 picons picon_" + suffix + "\"></i>";
}


function displayResults() {
    $("#pp_results").html(""); // Clear the old results
    var wrapCount = 0;
    var currentColumn = 1;
    $("#pp_results").append("<div id=\"pp_row_" + currentColumn + "\" class=\"columns is-gapless\"></div>");
    for (var key in POKEDEX_FILTERED) {
        if (POKEDEX_FILTERED.hasOwnProperty(key)) {
            $("#pp_row_" + currentColumn).append("<div class=\"column is-1 picons_column picon_border\"><a id=\"" + key + "\" title=\"" + POKEDEX_FILTERED[key].species + "\" href=\"javascript:addSelected('" + key + "')\">" + getIconString(POKEDEX_FILTERED[key], key) + "</a></div> ");
        }
        wrapCount += 1;
        if (wrapCount === 12) {
            wrapCount = 0;
            currentColumn += 1;
            $("#pp_results").append("<div id=\"pp_row_" + currentColumn + "\" class=\"columns is-gapless\"></div>");
        }
    }

    var shakeController = 0;
    var currentType = "";
    $("i.picons").hover(function() {
        var $icon = $(this);
        
        var pkey = $icon[0].id;
        if (pkey in POKEDEX) {
            currentType = POKEDEX[pkey].types[0];
            // $icon.parent().parent().addClass("picon_border");
            $icon.parent().parent().addClass("picon_border_" + currentType);
            console.log($icon.parent());
        }
        console.log($icon[0].id);
        shakeController = setInterval(function() {$icon.toggleClass("picon_move");}, 175);
    },
    function() {
        var $icon = $(this);
        $icon.parent().parent().removeClass("picon_border_" + currentType);
        $icon.removeClass("picon_move");
        clearInterval(shakeController);
    });
}


function calculateWeaknesses() {
    for (var attack in TYPE_CHART) {
        var count = 0;
        for (var i = 0; i < numSelected; i++) {
            var defense = POKEDEX[currentSelected[i]].types[0];
            var alreadyWeak = false;
            var resistFirst = false;
            if (TYPE_CHART[defense].damageTaken[attack] == 1) {
                count += 1;
                alreadyWeak = true;
            }
            else if (TYPE_CHART[defense].damageTaken[attack] == 2) {
                resistFirst = true;
            }
            if (POKEDEX[currentSelected[i]].types.length > 1) {
                defense = POKEDEX[currentSelected[i]].types[1];
                if (TYPE_CHART[defense].damageTaken[attack] == 2) {
                    if (alreadyWeak == true) {
                        count -= 1;
                    }
                }
                else if (TYPE_CHART[defense].damageTaken[attack] == 1) {
                    if (alreadyWeak == false && resistFirst == false) {
                        count += 1;
                    }
                }
            }
        }
        $("#tw_num_" + attack).text("x " + count);
        if (count >= 3) {
            $("#tw_num_" + attack).addClass("type_info_danger");
        }
        else {
            $("#tw_num_" + attack).removeClass("type_info_danger");
        }
    }
}


function calculateResistances() {
    for (var attack in TYPE_CHART) {
        var count = 0;
        for (var i = 0; i < numSelected; i++) {
            var defense = POKEDEX[currentSelected[i]].types[0];
            var alreadyResist = false;
            var weakFirst = false;
            if (TYPE_CHART[defense].damageTaken[attack] >= 2) {
                count += 1;
                alreadyResist = true;
            }
            else if (TYPE_CHART[defense].damageTaken[attack] == 1) {
                weakFirst = true;
            }
            if (POKEDEX[currentSelected[i]].types.length > 1) {
                defense = POKEDEX[currentSelected[i]].types[1];
                if (TYPE_CHART[defense].damageTaken[attack] == 1) {
                    if (alreadyResist == true) {
                        count -= 1;
                    }
                }
                else if (TYPE_CHART[defense].damageTaken[attack] >= 2) {
                    if (alreadyResist == false && weakFirst == false) {
                        count += 1;
                    }
                }
            }
        }
        $("#tr_num_" + attack).text("x " + count);
        if (count == 0 && numSelected > 0) {
            $("#tr_num_" + attack).addClass("type_info_danger");
        }
        else {
            $("#tr_num_" + attack).removeClass("type_info_danger");
        }
    }
}


function filterByName(useCurrent) {
    if (useCurrent == true) {
        var dex = POKEDEX_FILTERED;
    }
    else {
        var dex = POKEDEX;
    }
    var copyPokedex = {};
    for (var key in dex) {
        if (dex[key].species.toLowerCase().indexOf(FILTER_NAME) != -1) {
            copyPokedex[key] = JSON.parse(JSON.stringify(dex[key]));
        }
    }
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(copyPokedex));
}


function filterByType(useCurrent) {
    if (useCurrent == true) {
        var dex = POKEDEX_FILTERED;
    }
    else {
        var dex = POKEDEX;
    }
    var copyPokedex = {};
    console.log(FILTER_TYPES);
    for (var key in dex) {
        var types = dex[key].types;
        console.log(types);
        if (FILTER_TYPES[types[0]] == true) {
            copyPokedex[key] = JSON.parse(JSON.stringify(dex[key]));
        }
        else if (types.length > 1 && FILTER_TYPES[types[1]] == true) {
            copyPokedex[key] = JSON.parse(JSON.stringify(dex[key]));
        }
    }
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(copyPokedex));
}


function filterByAll() {
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(POKEDEX));
    // Filter by name
    if (FILTER_NAME != "") {
        filterByName(true);
    }
    filterByType(true);
    // Filter by evos
    if ($("#pp_filter_preevos")[0].checked == false) {
        filterPreEvos();
    }
    if ($("#pp_filter_nonmegas")[0].checked == false) {
        filterNonMegas();
    }
}


function resetFilters() {
    FILTER_NAME = "";
    $("#pp_filter_name").val("");
    $("#pp_filter_name").attr("placeholder", "Enter text to filter by name");
    $("#pp_filter_preevos")[0].checked = true;
    $("#pp_filter_nonmegas")[0].checked = true;
    for (var key in FILTER_TYPES) {
        FILTER_TYPES[key] = true;
        $("#pp_filter_type_" + key).addClass("tag_selected");
    }
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(POKEDEX));
    displayResults();
}


var previousEntry = "";
function nameFilterEntered() {
    FILTER_NAME = $("#pp_filter_name").val().toLowerCase();
    if (FILTER_NAME.indexOf(previousEntry) != -1) {
        // Filter with current results
        filterByName(true);
    }
    else {
        // Filter from the beginning
        filterByAll();
    }
    previousEntry = FILTER_NAME;
    displayResults();
}


function filterPreEvos() {
    var dex = POKEDEX_FILTERED;
    var copyPokedex = {};
    for (var key in dex) {
        if ("evos" in dex[key]) {
        }
        else {
            copyPokedex[key] = JSON.parse(JSON.stringify(dex[key]));
        }
    }
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(copyPokedex));
}


function filterNonMegas() {
    var dex = POKEDEX_FILTERED;
    var copyPokedex = {};
    for (var key in dex) {
        if (dex[key].species.indexOf("-Mega") != -1) {
            copyPokedex[key] = JSON.parse(JSON.stringify(dex[key]));
        }
    }
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(copyPokedex));
}


function preEvosFilterClicked() {
    var status = $("#pp_filter_preevos")[0].checked;
    if (status == true) {
        filterByAll();
    }
    else {
        filterPreEvos();
    }
    displayResults();
}


function nonMegasFilterClicked() {
    var status = $("#pp_filter_preevos")[0].checked;
    if (status == true) {
        filterByAll();
    }
    else {
        filterNonMegas();
    }
    displayResults();
}


function typeFilterClicked(type) {
    if (FILTER_TYPES[type] == true) {
        // alert(1);
        // Remove those types
        FILTER_TYPES[type] = false;
        $("#pp_filter_type_" + type).removeClass("tag_selected");
        filterByType(true);
        displayResults();
    }
    else {
        // Add those types back in
        FILTER_TYPES[type] = true;
        $("#pp_filter_type_" + type).addClass("tag_selected");
        filterByAll();
        displayResults();
    }
}


function enableAllTypes() {
    for (var key in FILTER_TYPES) {
        FILTER_TYPES[key] = true;
        $("#pp_filter_type_" + key).addClass("tag_selected");
    }
    filterByAll();
    displayResults();
}


function disableAllTypes() {
    for (var key in FILTER_TYPES) {
        FILTER_TYPES[key] = false;
        $("#pp_filter_type_" + key).removeClass("tag_selected");
    }
    filterByType(true);
    displayResults();
}


function initialize() {
    resetSelected(0);
    resetSelected(1);
    resetSelected(2);
    resetSelected(3);
    resetSelected(4);
    resetSelected(5);
    loadData();
    console.log(TYPE_CHART);
}


