"use strict";

var POKEDEX = {};
var POKEDEX_FILTERED = {};

var ATTACK_INVINDEX = {};

var FILTER_NAME = "";
var FILTER_TYPES = {"Bug": false, "Dark": false, "Dragon": false, "Electric": false, "Fairy": false, "Fighting": false, "Fire": false, "Flying": false, "Ghost": false, "Grass": false, "Ground": false, "Ice": false, "Normal": false, "Poison": false, "Psychic": false, "Rock": false, "Steel": false, "Water": false};
var numTypesFiltered = 0;

var numSelected = 0;
var currentSelected = ["", "", "", "", "", ""];


function addSelected(pkey, notify) {
    console.log(numSelected);
    for (var i = 0; i < 6; i++) {
        if (currentSelected[i] === pkey) {
            showNotification("You already have this Pokémon.", "is-warning", 800);
            return;
        } // TOOD: return warning message
    }
    // Exit when the Pokemon cannot be added
    if (numSelected >= 6) {
        if (notify == true) {
            showNotification("You already have 6 Pokémon.", "is-warning", 800);
            return;
        }
    } // TODO: return warning message
    // Add the Pokemon to the data structures
    numSelected += 1;
    var index = numSelected - 1;
    currentSelected[index] = pkey;
    // Add the Pokemon name
    $("#sp_box_" + index).find(".sp_name").text(POKEDEX[pkey].species);
    $("#sp_box_" + index).find(".sp_name").html("<a title=\"Poked&eacute;x entry\" class=\"serebii_link\" target=\"_blank\" href=\"" + getSerebiiLink(pkey) + "\">" + POKEDEX[pkey].species + "</a>");
    // Add the Pokemon types
    var types = POKEDEX[pkey].types;
    $("#sp_box_" + index).find(".sp_type1").html("<span class=\"tag tag_type tag_type_" + types[0] + "\">"+ types[0] + "</span>");
    if (types.length == 2) {
        $("#sp_box_" + index).find(".sp_type2").html("<span class=\"tag tag_type tag_type_" + types[1] + "\">"+ types[1] + "</span>");
    }
    // Add the Pokemon image
    $("#sp_box_" + index).find(".sp_icon").html(getIconString(POKEDEX[pkey]));
    // Add the delete button
    $("#sp_box_" + index).find(".sp_delete").html("<a title=\"Remove\" href= \"javascript:removeSelected('" + pkey + "')\"><button class=\"delete\"></button></a>");
    // Add the attacks
    addAttacks(pkey, index);

    if (notify == true) {
        showNotification("Added " + POKEDEX[pkey].species + " to your team!", "is-success", 800);
    }

    calculateWeaknesses();
    calculateResistances();
    generateShareLink();
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
    calculateCoverage();
    generateShareLink();
}


function resetSelected(pindex) {
    $("#sp_box_" + pindex).html($("#sp_box_template").html());
}


function generateShareLink() {
    var prefix = "http://pokemonteambuilder.com/#";
    var middle = "";
    for (var i = 0; i < numSelected; i++) {
        middle += "p_" + currentSelected[i] + "+";
        for (var j = 1; j <= 4; j++) {
            var attack = $("#sp_box_" + i).find(".sp_attack" + j).val();
            if (attack != "-") {
                var akey = ATTACK_INVINDEX[attack];
                middle += "a_" + akey + "+";
            }
        }
    }
    middle = middle.substring(0, middle.length - 1);
    document.location.hash = middle;
    $("#sp_share_link").val(prefix + middle);
}


function getSerebiiLink(pkey) {
    var prefix = "http://www.serebii.net/pokedex-sm/";
    var suffix = ".shtml";
    var num = POKEDEX[pkey]["num"];
    if (num < 10) {
        num = "00" + num;
    }
    else if (num < 100) {
        num = "0" + num;
    }
    return prefix + num + suffix;
}


function addAttacks(pkey, pindex) {
    pkey = POKEDEX[pkey].species.toLowerCase();
    if (pkey.indexOf("-alola") != -1) {
        pkey = pkey.substring(0, pkey.indexOf("-")) + "alola";
    }
    else if (pkey.indexOf("nidoran") != -1) {
        pkey = pkey.substring(0, pkey.indexOf("-")) + pkey.substring(pkey.indexOf("-") + 1, pkey.length);
    }
    else if (pkey.indexOf("-") != -1) {
        pkey = pkey.substring(0, pkey.indexOf("-"));
    }
    if (pkey == "jangmo" || pkey == "hakamo" || pkey == "kommo") {
        pkey += "o";
    }
    else if (pkey == "ho") {
        pkey = "hooh";
    }
    else if (pkey == "type: null") {
        pkey = "typenull";
    }
    var attackDict = JSON.parse(JSON.stringify(LEARNSETS[pkey].learnset));
    if ("prevo" in POKEDEX[pkey]) {
        var prevo1 = POKEDEX[pkey]["prevo"];
        for (var attackkey in LEARNSETS[prevo1].learnset) {
            if (attackkey in attackDict) {
            }
            else {
                attackDict[attackkey] = LEARNSETS[prevo1].learnset;
            }
        }
        if ("prevo" in POKEDEX[prevo1]) {
            var prevo2 = POKEDEX[prevo1]["prevo"];
            for (var attackkey in LEARNSETS[prevo2].learnset) {
                if (attackkey in attackDict) {
                }
                else {
                    attackDict[attackkey] = LEARNSETS[prevo2].learnset;
                }
            }
        }
    }
    var keys = Object.keys(attackDict);
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        var toAppend = "<option>" + MOVEDEX[keys[i]].name +"</option>";
        ATTACK_INVINDEX[MOVEDEX[keys[i]].name] = keys[i];
        $("#sp_box_" + pindex).find(".sp_attack1").append(toAppend);
        $("#sp_box_" + pindex).find(".sp_attack2").append(toAppend);
        $("#sp_box_" + pindex).find(".sp_attack3").append(toAppend);
        $("#sp_box_" + pindex).find(".sp_attack4").append(toAppend);
    }
    $("#sp_box_" + pindex).find(".sp_attack_row").removeClass("hidden");
}


function attackChanged(selector, whichatk) {
    var label = $(selector).parent().parent().parent().find("." + whichatk + "_type");
    if (selector.value == "-") {
        label.addClass("invisible");
        return;
    }
    var attackkey = ATTACK_INVINDEX[selector.value];
    var type = MOVEDEX[attackkey].type;
    var classes = $(label).attr("class").split(' ');
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].indexOf("tag_type_") != -1) {
            $(label).removeClass(classes[i]);
        }
    }
    $(label).addClass("tag_type_" + type);
    $(label).text(type);
    $(label).removeClass("invisible");
    calculateCoverage();
    generateShareLink();
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
    $("#pp_results").append("<div id=\"pp_row_" + currentColumn + "\" class=\"columns is-gapless is-mobile\"></div>");
    for (var key in POKEDEX_FILTERED) {
        if (POKEDEX_FILTERED.hasOwnProperty(key)) {
            $("#pp_row_" + currentColumn).append("<div class=\"column is-1 picons_column picon_border\"><a id=\"" + key + "\" title=\"" + POKEDEX_FILTERED[key].species + "\" href=\"javascript:addSelected('" + key + "', true)\">" + getIconString(POKEDEX_FILTERED[key], key) + "</a></div> ");
        }
        wrapCount += 1;
        if (wrapCount === 12) {
            wrapCount = 0;
            currentColumn += 1;
            $("#pp_results").append("<div id=\"pp_row_" + currentColumn + "\" class=\"columns is-gapless is-mobile\"></div>");
        }
    }

    var shakeController = 0;
    var currentType = "";
    $("i.picons").hover(function() {
        var $icon = $(this);
        var pkey = $icon[0].id;
        if (pkey in POKEDEX) {
            currentType = POKEDEX[pkey].types[0];
            $icon.parent().parent().addClass("picon_border_" + currentType);
        }
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


function calculateCoverage() {
    for (var defense in TYPE_CHART) {
        var count = 0;
        for (var i = 0; i < numSelected; i++) {
            for (var j = 1; j <= 4; j++) {
                var attackname = $("#sp_box_" + i).find(".sp_attack" + j).val();
                if (attackname == "-") {
                    continue;
                }
                if (MOVEDEX[ATTACK_INVINDEX[attackname]].category == "Status") {
                    continue;
                }
                var attack = MOVEDEX[ATTACK_INVINDEX[attackname]].type;
                if (TYPE_CHART[defense].damageTaken[attack] == 1) {
                    count += 1;
                }
            }
        }
        $("#tc_num_" + defense).text("x " + count);
        if (count == 0 && numSelected > 0) {
            $("#tc_num_" + defense).addClass("type_info_danger");
        }
        else {
            $("#tc_num_" + defense).removeClass("type_info_danger");
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
    if (numTypesFiltered == 0) {
        return;
    }
    if (useCurrent == true) {
        var dex = POKEDEX_FILTERED;
    }
    else {
        var dex = POKEDEX;
    }
    var copyPokedex = {};
    for (var key in dex) {
        var types = dex[key].types;
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
    if ($("#pp_filter_preevos")[0].checked == true) {
        filterPreEvos();
    }
    if ($("#pp_filter_nonmegas")[0].checked == true) {
        filterNonMegas();
    }
}


function resetFilters() {
    FILTER_NAME = "";
    $("#pp_filter_name").val("");
    $("#pp_filter_name").attr("placeholder", "Enter text to filter by name");
    $("#pp_filter_preevos")[0].checked = false;
    $("#pp_filter_nonmegas")[0].checked = false;
    for (var key in FILTER_TYPES) {
        FILTER_TYPES[key] = false;
        numTypesFiltered = 0;
        $("#pp_filter_type_" + key).removeClass("tag_selected");
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
    if (status == false) {
        filterByAll();
    }
    else {
        filterPreEvos();
    }
    displayResults();
}


function nonMegasFilterClicked() {
    var status = $("#pp_filter_nonmegas")[0].checked;
    if (status == false) {
        filterByAll();
    }
    else {
        filterNonMegas();
    }
    displayResults();
}


function typeFilterClicked(type) {
    if (FILTER_TYPES[type] == false) {
        // alert(1);
        numTypesFiltered += 1;
        FILTER_TYPES[type] = true;
        $("#pp_filter_type_" + type).addClass("tag_selected");
        filterByAll();
        displayResults();
    }
    else {
        FILTER_TYPES[type] = false;
        numTypesFiltered -= 1;
        $("#pp_filter_type_" + type).removeClass("tag_selected");
        filterByAll();
        displayResults();
    }
}


function disableAllTypes() {
    for (var key in FILTER_TYPES) {
        FILTER_TYPES[key] = false;
        $("#pp_filter_type_" + key).removeClass("tag_selected");
    }
    numTypesFiltered = 0;
    filterByAll(true);
    displayResults();
}


function loadFromHash(hash) {
    hash = hash.substring(1, hash.length);
    var parts = hash.split("+");
    var pcount = -1;
    var acount = 0;
    for (var hashi = 0; hashi < parts.length; hashi++) {
        var part = parts[hashi];
        if (part.indexOf("p_") != -1) {
            pcount += 1;
            acount = 1;
            addSelected(part.substring(2, part.length), false);
        }
        else if (part.indexOf("a_") != -1) {
            var attack = MOVEDEX[part.substring(2, part.length)].name;
            var type = MOVEDEX[part.substring(2, part.length)].type;
            $("#sp_box_" + pcount).find(".sp_attack" + acount).val(attack);
            var label = $("#sp_box_" + pcount).find(".sp_attack" + acount).parent().parent().parent().find(".sp_attack" + acount + "_type");
            $(label).addClass("tag_type_" + type);
            $(label).text(type);
            $(label).removeClass("invisible");
            acount += 1;
        }
        if (pcount >= 7 || acount >= 6) {
            break;
        }
    }
    calculateCoverage();
}


function loadData() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://pokemonteambuilder.com/data/pokedex.json", false );
    xmlHttp.send( null );
    POKEDEX = JSON.parse(xmlHttp.responseText);
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(POKEDEX));
    displayResults();
}


var startTimeout;
function initialize() {
    $.getJSON("http://pokemonteambuilder.com/data/pokedex.json", function(data){loadedData(data);});
    startTimeout = setTimeout(function() {$("#page_notification").text("Loading, please wait...");$("#page_notification").addClass("is-danger");$("#page_notification").show(100);}, 150)
    resetSelected(0);
    resetSelected(1);
    resetSelected(2);
    resetSelected(3);
    resetSelected(4);
    resetSelected(5);
}


function loadedData(data) {
    POKEDEX = data;
    POKEDEX_FILTERED = JSON.parse(JSON.stringify(POKEDEX));
    displayResults();
    if (document.location.hash != "") {
        loadFromHash(document.location.hash);
    }
    else {
        generateShareLink();
    }
    clearTimeout(startTimeout);
    $("#page_notification").hide(100);
    setTimeout(function() {$("#page_notification").removeClass("is-danger");}, 100);
}


var currentTimeout;
var currentColor;
function showNotification(message, classcolor, duration) {
    clearTimeout(currentTimeout);
    $("#page_notification").hide(0);
    $("#page_notification").removeClass(currentColor);
    $("#page_notification").text(message);
    $("#page_notification").addClass(classcolor);
    currentColor = classcolor;
    $("#page_notification").show(duration / 4);
    currentTimeout = setTimeout(function() {$("#page_notification").hide(duration / 4);setTimeout(function() {$("#page_notification").removeClass(classcolor);}, duration / 4);}, duration);
}


function copyToClipboard(elem) {
      // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
          succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}