const fs = require('fs')
require("./pokemon-showdown/sim/global-types")

import { Pokedex } from "./pokemon-showdown/data/pokedex"

const banned = new Set([
    "pikachucosplay", "pikachurockstar", "pikachubelle", "pikachupopstar",
    "pikachuphd", "pikachulibre", "pikachuworld", "pichuspikyeared",
    "xerneasneutral", "eternatuseternamax"
])

const pokedexFiltered: typeof Pokedex = {}

for (const [k,v] of Object.entries(Pokedex))
    if (v.num > 0 && !v.name.endsWith("-Totem") && !banned.has(k))
        pokedexFiltered[k] = v

fs.writeFile(
    "../data/pokedex.json",
    JSON.stringify(pokedexFiltered),
    undefined,
    function() { }
)

import { Learnsets } from "./pokemon-showdown/data/learnsets"

const learnsetsFiltered: typeof Learnsets = {}

for (const [k,v] of Object.entries(Learnsets))
    if (pokedexFiltered[k])
        learnsetsFiltered[k] = v

fs.writeFile(
    "../data/learnsets.json",
    JSON.stringify(learnsetsFiltered),
    undefined,
    function() { }
)

import { Moves } from "./pokemon-showdown/data/moves"

const movesFiltered: typeof Moves = {}

for (const [k,v] of Object.entries(Moves))
    if (!v.isZ && !v.isMax)
        movesFiltered[k] = v

fs.writeFile(
    "../data/moves.json",
    JSON.stringify(movesFiltered),
    undefined,
    function() { }
)


import { TypeChart } from "./pokemon-showdown/data/typechart"

fs.writeFile(
    "../data/typechart.json",
    JSON.stringify(TypeChart),
    undefined,
    function() { }
)
