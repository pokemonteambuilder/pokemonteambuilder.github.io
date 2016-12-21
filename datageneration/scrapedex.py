#!/usr/bin/python

import requests

URL_BASE = 'http://serebii.net/pokedex-sm/'

NAME = None
TYPE1 = None
TYPE2 = None

pokemonDict = {}


def parse_page(url, number):
    print number
    NAME = None
    TYPE1 = None
    TYPE2 = None
    rpage = requests.get(url)
    pagelines = rpage.text.split('\n')
    pindex = 0
    while pagelines[pindex].find('<title>') == -1:
        pindex += 1
    # Got to the name line
    nameindex = pagelines[pindex].find('<title>') + len('<title>')
    NAME = pagelines[pindex][nameindex:].split()[0]
    # print 'NAME: ' + NAME
    pagelines = pagelines[pindex:]
    pindex = 0
    try:
        while pagelines[pindex].find('<td class="cen"><a href="/pokedex-sm/') == -1:
            pindex += 1
    except Exception:
        return
    # Got to the types line
    type1index = pagelines[pindex].find('<td class="cen"><a href="/pokedex-sm/') + len('<td class="cen"><a href="/pokedex-sm/')
    types = pagelines[pindex][type1index:].split('.shtml')
    TYPE1 = pagelines[pindex][type1index:].split('.shtml')[0]
    if len(types) > 2:
        TYPE2 = types[1].split('/pokedex-sm/')[1]
    # print 'TYPE1: {}; TYPE2: {}'.format(TYPE1, TYPE2)
    pokemonDict[NAME] = {}
    pokemonDict[NAME]['number'] = number
    pokemonDict[NAME]['type1'] = TYPE1
    pokemonDict[NAME]['type2'] = TYPE2
    # pagelines = pagelines[pindex:]
    # pindex = 0
    # while pagelines[pindex].find('<td colspan="10" class="fooevo">Sun/Moon Level Up</td>') == -1:
    #     pindex += 1
    # pindex2 = pindex + 1
    # while pagelines[pindex2].find('<td colspan="10" class="fooevo">TM & HM Attacks') == -1:
    #     pindex2 += 1
    # lvattacklist = pagelines[pindex:pindex2+1]
    # lvattackstr = ' '.join(lvattacklist)
    # lvattacklist = lvattackstr.split('<td class="cen">--</td></tr>')
    # for attack in lvattacklist:
    #     ATKNAME = attack[attack.find('.shtml">')+len('.shtml">'):attack.find('</a></td>')]
    #     ATKTYPE =  attack[attack.find('/pokedex-bw/type/')+len('/pokedex-bw/type/'):attack.find('.gif"></td>')]
    #     attack = attack[attack.find('.gif"></td>'):]
    #     ATKCAT = attack[attack.find('/pokedex-bw/type/')+len('/pokedex-bw/type/'):attack.find('.png"></td>')]
    #     print '{} {} {}'.format(ATKNAME, ATKTYPE, ATKCAT)
    # print lvattacklist


# parse_page(URL_BASE + '009.shtml', 9)

for i in range(1, 10):
    url = URL_BASE + '00' + str(i) + '.shtml'
    parse_page(url, i)
for i in range(10, 100):
    url = URL_BASE + '0' + str(i) + '.shtml'
    parse_page(url, i)
for i in range(100, 802):
    url = URL_BASE + '0' + str(i) + '.shtml'
    parse_page(url, i)

print pokemonDict






# for line in pagelines:
#     line = line.strip()
#     if line.find('<title>') != -1:
#         nameindex = line.find('<title>') + len('<title>')
#         NAME = line[nameindex:].split()[0]

# print 'NAME: ' + NAME
# print page.text

# type1index = pagestr.find('<td class="cen"><a href="/pokedex-sm/') + len('<td class="cen"><a href="/pokedex-sm/')
# print pagestr[type1index:].split('.shtml')[0]
# print name

# print 'Formatted tree'
# print tree