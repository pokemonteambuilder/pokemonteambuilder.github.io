#!/usr/bin/python

import json

finallines = []
ignoredlines = ['genderRatio', 'heightm', 'weightkg', 'color', 'evos', 'forme', 'formeLetter', 'prevo', 'evoLevel', 'eggGroups', 'otherFormes']
with open('pokedex_original.js', 'r') as fd:
    for line in fd:
        addline = True
        for entry in ignoredlines:
            if line.find(entry) != -1:
                addline = False
        if addline:
            finallines.append(line)

with open('pokedex.js', 'w') as fd:
    fd.write(''.join(finallines))
