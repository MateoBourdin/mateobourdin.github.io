import sys
import time
import random

import webio
import Background
import Player
import Monster
import PNJ

GAME = {}


def new_game_state():
    return {
        "player": None, "background": None, "TimeStep": None,
        "debug_list": [], "Encounter_Chance": 0, "Help_menu": True,
        "admin_mod": False, "monster_list": [], "pnj_list": [],
        "game_end": False, "quit": False,
        "awaiting_levelup_choice": False,
    }  # Encounter_Chance represente le pourcentage de chance de declencher un combat


def start(player_name):
    """Appele une seule fois par JS, au lancement de la partie."""
    webio.install()
    webio.clear_keys()
    data = new_game_state()
    init(data, player_name)
    GAME["data"] = data


def step():
    """Appele par JS a chaque tick (~200ms). Un seul passage de boucle de jeu."""
    data = GAME.get("data")
    if data is None or data.get("quit"):
        return False

    if data["awaiting_levelup_choice"]:
        handle_levelup_choice(data)
        show(data)
        return True

    # Traite toutes les touches deja en attente (jusqu'a une limite de
    # securite) avant de faire avancer le reste du jeu : sans ca, des touches
    # pressees rapidement s'empilaient et n'etaient rejouees qu'une par une
    # toutes les 200ms, donnant une impression de commandes en retard.
    keys_processed = 0
    while webio.has_key() and not data.get("quit") and keys_processed < 50:
        interact(data)
        keys_processed += 1

    show(data)
    live(data)
    return not data.get("quit")


def init(data, player_name):
    global Showing_colon
    Showing_colon = 110
    data['background'] = Background.create('StartScreen.txt')
    Background.map_in_color(data['background'])
    data["player"] = Player.create(player_name)

    data['timeStep'] = 0.2

    data['Encounter_Chance'] = 10
    Player.set_pos_in_fight(data["player"], [5, 3])
    data['background'] = Background.create('Temple.txt')
    Player.set_fight(data['player'], True)


def quitGame(data):
    # couleur white
    sys.stdout.write("\033[37m")
    sys.stdout.write("\033[40m")
    data['quit'] = True


def interact(data):

    # gestion des evenement clavier
    if webio.has_key():
        KeyEnter = webio.read_key()

        if KeyEnter:
            sys.stdout.write("\033[30;100H")

            if KeyEnter == '\x1b':  # x1b is ESC
                quitGame(data)

            # ----------------------------------------------------------Joueur en combat----------------------------------------------
            elif Player.is_in_fight(data['player']):

                pos = Player.get_pos_in_fight(data["player"])
                new_pos = pos

                # -----------------------Reaction du personnage au touche du clavier-----------------------

                if KeyEnter == 'q':
                    new_pos = ((Player.get_pos_in_fight(data["player"])[0]), Player.get_pos_in_fight(data["player"])[1] - 1)
                    Player.set_direction(data['player'], 'Left')
                    Player.set_last_direction(data['player'], 'Left')
                    Player.set_mvt_cd(data['player'], 3)

                elif KeyEnter == 'd':
                    new_pos = ((Player.get_pos_in_fight(data["player"])[0]), Player.get_pos_in_fight(data["player"])[1] + 1)
                    Player.set_direction(data['player'], 'Right')
                    Player.set_last_direction(data['player'], 'Right')
                    Player.set_mvt_cd(data['player'], 3)

                elif KeyEnter == ' ' and Background.get_char_at_pos(data['background'], [new_pos[0] + 2, new_pos[1]]) == 'Z':

                    if Player.get_last_direction(data['player']) == 'Right' and Player.get_mvt_cd(data['player']) > 0:
                        new_pos = ((Player.get_pos_in_fight(data["player"])[0]) - 2, Player.get_pos_in_fight(data["player"])[1] + 2)

                    elif Player.get_last_direction(data['player']) == 'Left' and Player.get_mvt_cd(data['player']) > 0:
                        new_pos = ((Player.get_pos_in_fight(data["player"])[0]) - 2, Player.get_pos_in_fight(data["player"])[1] - 2)

                    else:
                        new_pos = ((Player.get_pos_in_fight(data["player"])[0]) - 3, Player.get_pos_in_fight(data["player"])[1])

                elif KeyEnter == 'm' and Player.get_attack_cd(data['player']) <= 0:
                    Player.set_attack_cd(data['player'], 5)

                elif KeyEnter == 'c':
                    if Player.get_squat(data['player']):
                        Player.set_squat(data['player'], False)
                    else:
                        Player.set_squat(data['player'], True)

                elif KeyEnter == '\r' or KeyEnter == '\n':
                    for elt in data['pnj_list']:
                        if PNJ.get_pos(elt)[1] + 1 == new_pos[1] or PNJ.get_pos(elt)[1] - 1 == new_pos[1] or PNJ.get_pos(elt)[1] == new_pos[1]:
                            PNJ.set_in_interaction(elt, True)
                            PNJ.set_cd(elt, 10)

                # -----------------------------------------------Gestion de position du joueur----------------------------------------------

                cara_on_new_pos = Background.get_char_at_pos(data['background'], [new_pos[0] + 1, new_pos[1]])

                if cara_on_new_pos == 'Z':  # Detection d'obstacle pour le joueur
                    new_pos = pos

                elif cara_on_new_pos == 'D':
                    data['monster_list'] = []
                    data['background'] = Background.create('Map.txt')
                    Player.set_fight(data['player'], False)

                elif cara_on_new_pos == 'R':
                    data['background'] = Background.create('Map.txt')
                    data['pnj_list'] = []
                    Player.set_fight(data['player'], False)

                elif cara_on_new_pos == 'V':
                    data['background'] = Background.create('CaveWithoutIssues.txt')
                    Mons1 = Monster.create("Blob", "B", 10, [10, 25], 30, 20, 1)
                    Mons2 = Monster.create("Blob", "B", 10, [10, 20], 30, 20, 1)
                    Mons3 = Monster.create("Blob", "B", 10, [10, 30], 30, 20, 1)
                    data['monster_list'] = [Mons1, Mons2, Mons3]
                    Player.set_items(data['player'], "Village1_statue", 1)
                    sys.stdout.write("\033[20;" + str(Showing_colon) + "H")
                    sys.stdout.write('Congrat u just got: ')
                    sys.stdout.write("\033[21;" + str(Showing_colon) + "H")
                    sys.stdout.write('Village statue ')

                elif cara_on_new_pos == 'I':
                    data['background'] = Background.create('CaveWithoutIssues.txt')
                    Mons1 = Monster.create("Blob", "B", 10, [10, 25], 30, 20, 1)
                    Mons2 = Monster.create("Blob", "B", 10, [10, 20], 30, 20, 1)
                    Mons3 = Monster.create("Blob", "B", 10, [10, 30], 30, 20, 1)
                    data['monster_list'] = [Mons1, Mons2, Mons3]
                    Player.set_items(data['player'], "Candle", 1)
                    sys.stdout.write("\033[20;" + str(Showing_colon) + "H")
                    sys.stdout.write('Congrat u just got: ')
                    sys.stdout.write("\033[21;" + str(Showing_colon) + "H")
                    sys.stdout.write('Candle')

                elif cara_on_new_pos == 'N':
                    Player.set_pos_in_fight(data["player"], [5, 3])
                    data['background'] = Background.create('PalacePart2NoBoss.txt')
                    data['monster_list'] = []
                    new_pos = [5, 3]
                    Mons2 = Monster.create("Ganondorf", "G", 50, [10, 28], 300, 300, 2)
                    data['monster_list'] = [Mons2]

                elif cara_on_new_pos == 'L':
                    new_pos = [5, 40]
                    data['background'] = Background.create('PalacePart1.txt')

                if new_pos != Player.get_pos_in_fight(data["player"]):
                    Player.set_pos_in_fight(data["player"], new_pos)

            # -----------------------------------------------------------------Joueur non en combat---------------------------------------------------------

            else:
                new_pos = Player.get_pos(data["player"])
                # -----------------------Reaction du personnage au touche du clavier-----------------------
                if KeyEnter == 'q':
                    new_pos = (Player.get_pos(data["player"])[0], (Player.get_pos(data["player"])[1]) - 1)

                elif KeyEnter == 'd':
                    new_pos = (Player.get_pos(data["player"])[0], (Player.get_pos(data["player"])[1]) + 1)

                elif KeyEnter == 's':
                    new_pos = ((Player.get_pos(data["player"])[0]) + 1, Player.get_pos(data["player"])[1])

                elif KeyEnter == 'z':
                    new_pos = ((Player.get_pos(data["player"])[0]) - 1, Player.get_pos(data["player"])[1])

                cara_on_new_pos = Background.get_char_at_pos(data['background'], new_pos)

                # ----------BIOMES---------------

                # --------------Plains------------
                if cara_on_new_pos == '7':
                    Encounter = random.randint(0, 100)
                    if Encounter > 100 - data['Encounter_Chance'] and Player.get_encounter_cd(data['player']) <= 0:
                        Mons1 = Monster.create("Blob", "W", 20, [10, 14], 30, 25, 1)
                        Mons2 = Monster.create("Humanoid", "T", 20, [10, 28], 40, 30, 2)
                        Mons3 = Monster.create("Blob", "B", 20, [10, 48], 30, 25, 1)
                        data['monster_list'] = [Mons1, Mons2, Mons3]
                        Player.set_pos_in_fight(data["player"], [5, 40])
                        data['background'] = Background.create('plain.txt')
                        Player.set_fight(data['player'], True)
                    elif Player.get_encounter_cd(data['player']) > 0:
                        Player.set_encounter_cd(data['player'], Player.get_encounter_cd(data['player']) - 1)

                # --------------Forests-----------------
                elif cara_on_new_pos == 't':
                    Encounter = random.randint(0, 100)
                    if Encounter > 100 - data['Encounter_Chance'] and Player.get_encounter_cd(data['player']) <= 0:
                        Mons1 = Monster.create("Humanoid", "T", 20, [10, 10], 40, 30, 2)
                        Mons2 = Monster.create("Humanoid", "T", 20, [10, 20], 40, 30, 2)
                        Mons3 = Monster.create("Humanoid", "T", 20, [10, 50], 40, 30, 2)
                        Mons4 = Monster.create("Humanoid", "T", 20, [10, 60], 40, 30, 2)
                        data['monster_list'] = [Mons1, Mons2, Mons3, Mons4]
                        Player.set_pos_in_fight(data["player"], [5, 40])
                        data['background'] = Background.create('Forest.txt')
                        Player.set_fight(data['player'], True)
                    elif Player.get_encounter_cd(data['player']) > 0:
                        Player.set_encounter_cd(data['player'], Player.get_encounter_cd(data['player']) - 1)

                # --------------Deserts-------------------
                elif cara_on_new_pos == '~':

                    Encounter = random.randint(1, 100)
                    if Encounter > 100 - data['Encounter_Chance'] and Player.get_encounter_cd(data['player']) <= 0:
                        Mons1 = Monster.create("Blob", "W", 20, [10, 10], 30, 25, 1)
                        Mons2 = Monster.create("Blob", "W", 20, [10, 25], 30, 25, 1)
                        Mons3 = Monster.create("Blob", "W", 20, [10, 50], 30, 25, 1)
                        data['monster_list'] = [Mons1, Mons2, Mons3]
                        Player.set_pos_in_fight(data["player"], [5, 40])
                        data['background'] = Background.create('Desert.txt')
                        Player.set_fight(data['player'], True)
                    elif Player.get_encounter_cd(data['player']) > 0:
                        Player.set_encounter_cd(data['player'], Player.get_encounter_cd(data['player']) - 1)

                # -------------Temple---------------------------
                elif cara_on_new_pos == 'T':
                    Player.set_pos_in_fight(data["player"], [5, 3])
                    data['background'] = Background.create('Temple.txt')
                    Player.set_fight(data['player'], True)

                # --------------Palace---------------------------------------
                elif cara_on_new_pos == 'P':
                    Player.set_pos_in_fight(data["player"], [5, 3])
                    Mons1 = Monster.create("LordHumanoid", "L", 30, [Player.get_pos_in_fight(data["player"])[0] - 1, Player.get_pos_in_fight(data["player"])[1] + 30], 50, 50, 2)
                    Mons2 = Monster.create("Humanoid", "T", 20, [Player.get_pos_in_fight(data["player"])[0] - 1, Player.get_pos_in_fight(data["player"])[1] + 40], 40, 30, 2)
                    Mons3 = Monster.create("LordHumanoid", "L", 30, [Player.get_pos_in_fight(data["player"])[0] - 1, Player.get_pos_in_fight(data["player"])[1] + 50], 50, 50, 2)
                    Mons4 = Monster.create("Humanoid", "T", 20, [Player.get_pos_in_fight(data["player"])[0] - 1, Player.get_pos_in_fight(data["player"])[1] + 70], 40, 30, 2)
                    data['monster_list'] = [Mons1, Mons2, Mons3, Mons4]
                    data['background'] = Background.create('PalacePart1.txt')
                    Player.set_fight(data['player'], True)

                # -------------Caves--------------------
                elif cara_on_new_pos == 'A':
                    Mons1 = Monster.create("Blob", "B", 10, [10, 25], 30, 20, 1)
                    Mons2 = Monster.create("Blob", "B", 10, [10, 20], 30, 20, 1)
                    Mons3 = Monster.create("Blob", "B", 10, [10, 30], 30, 20, 1)
                    data['monster_list'] = [Mons1, Mons2, Mons3]

                    if str(new_pos) == '(19, 70)':
                        Player.set_pos_in_fight(data["player"], [5, 3])
                        data['background'] = Background.create('SpecialCave.txt')
                        Player.set_fight(data['player'], True)
                        new_pos = [14, 66]
                        sys.stdout.write("\033[20;" + str(Showing_colon) + "H")
                        sys.stdout.write('Special cave activate')

                    elif str(new_pos) == '(14, 66)':
                        Player.set_pos_in_fight(data["player"], [5, 3])
                        data['background'] = Background.create('SpecialCave.txt')
                        new_pos = [19, 70]
                        Player.set_fight(data['player'], True)

                    elif str(new_pos) == '(6, 41)':
                        Player.set_pos_in_fight(data["player"], [5, 3])
                        if Player.get_items(data['player'], 'Village1_statue') == 0:
                            data['background'] = Background.create('CaveObjectV.txt')
                        else:
                            data['background'] = Background.create('CaveWithoutIssues.txt')
                        Player.set_fight(data['player'], True)
                    elif str(new_pos) == '(33, 25)':
                        Player.set_pos_in_fight(data["player"], [5, 3])
                        if Player.get_items(data['player'], 'Candle') == 0:
                            data['background'] = Background.create('CaveObjectI.txt')
                        else:
                            data['background'] = Background.create('CaveWithoutIssues.txt')
                        Player.set_fight(data['player'], True)

                    else:
                        Player.set_pos_in_fight(data["player"], [5, 3])
                        data['background'] = Background.create('CaveWithoutIssues.txt')
                        Player.set_fight(data['player'], True)

                # -------------Special Encounter-------------

                # -------------Villages-----------------------
                elif str(new_pos) == '(9, 5)':
                    Player.set_active_life(data['player'], Player.get_life(data['player']))
                    pnj1 = PNJ.create("Rogier", 1, [11, 13], True, "Hello I'm Rogier a wizard", "|")
                    pnj2 = PNJ.create("Bertha", 1, [11, 23], True, "I heard that, the terrible Gannondorf was in the desert palace", "U")
                    pnj3 = PNJ.create("Idiot of village", 1, [11, 40], True, "I lost our village statue, can you help me?", "?", "Village1_statue", "Thanks you save my life, take this stats")
                    data['pnj_list'] = [pnj1, pnj2, pnj3]
                    Player.set_pos_in_fight(data["player"], [5, 3])
                    data['background'] = Background.create('Town1.txt')
                    Player.set_fight(data['player'], True)

                elif str(new_pos) == '(27, 63)':
                    Player.set_active_life(data['player'], Player.get_life(data['player']))
                    pnj1 = PNJ.create("Gregor", 2, [11, 63], True, "Wednesday its afterwork!!!!", "%")
                    pnj2 = PNJ.create("Maket", 2, [11, 22], True, "I need the candle, its neer the south of the lake", "?", "Candle", "Thanks i can custom my house now, take this stats")
                    pnj3 = PNJ.create("Ganan", 2, [11, 57], True, "Ganondorf is not really bad?", "G")
                    pnj4 = PNJ.create("Pepe", 2, [11, 14], True, "Its dangerous outside the paths", "K")
                    data['pnj_list'] = [pnj1, pnj2, pnj3, pnj4]
                    Player.set_pos_in_fight(data["player"], [5, 3])
                    data['background'] = Background.create('Town2.txt')
                    Player.set_fight(data['player'], True)

                sys.stdout.write("\033[2;" + str(Showing_colon) + "H")
                sys.stdout.write('Case you are on: ')
                sys.stdout.write(str(cara_on_new_pos))
                sys.stdout.write("\033[1;" + str(Showing_colon) + "H")
                sys.stdout.write('Coordonates: ')
                sys.stdout.write(str(new_pos))

                if cara_on_new_pos == '#' or cara_on_new_pos == '-' or cara_on_new_pos == 'Z':  # Detection d'obstacle pour le joueur
                    new_pos = Player.get_pos(data["player"])
                Player.set_pos(data["player"], new_pos)


def end_game(data):
    Player.set_fight(data['player'], False)
    data['background'] = Background.create("End.txt")


def show(data):

    # affichage des different element
    Background.map_in_color(data['background'])

    if len(data['pnj_list']) >= 1:
        for pnj in data['pnj_list']:
            PNJ.show(pnj)
            if PNJ.get_in_interaction(pnj) and PNJ.get_cd(pnj) > 0:
                PNJ.show_lyrics(pnj)

    if len(data['monster_list']) >= 1:
        for elt in data['monster_list']:
            Monster.show(elt)

    Player.show(data['player'], Player.get_direction(data['player']))

    if Player.get_attack_cd(data['player']) > 3:
        Player.show_attack(data['player'])

    # deplacement curseur
    sys.stdout.write("\033[0;0H\n")

    if not (data['Help_menu']):
        sys.stdout.write("\033[0;" + str(Showing_colon) + "H")
        sys.stdout.write('For help and informations press h')

    else:

        sys.stdout.write("\033[3;" + str(Showing_colon) + "H")
        sys.stdout.write('Encounter Chance: ')
        sys.stdout.write(str(data['Encounter_Chance']))
        sys.stdout.write("\033[4;" + str(Showing_colon) + "H")
        sys.stdout.write('To move on map: z,q,s,d')
        sys.stdout.write("\033[5;" + str(Showing_colon) + "H")
        sys.stdout.write('To move on stage: q,s,d,space')
        sys.stdout.write("\033[6;" + str(Showing_colon) + "H")
        sys.stdout.write('To attack on stage: m')
        sys.stdout.write("\033[7;" + str(Showing_colon) + "H")
        sys.stdout.write('Your level: ')
        sys.stdout.write(str(Player.get_level(data['player'])))
        sys.stdout.write("\033[8;" + str(Showing_colon) + "H")
        sys.stdout.write('Your stats:')
        sys.stdout.write("Life:" + str(Player.get_stats(data['player'])['Life']) + " Mana:" + str(Player.get_stats(data['player'])['Mana']) + " Attack:" + str(Player.get_stats(data['player'])['Attack']))
        sys.stdout.write("\033[9;" + str(Showing_colon) + "H")
        sys.stdout.write('Your Life: ')
        sys.stdout.write(str(Player.get_life(data['player'])))
        sys.stdout.write("\033[9;" + str(Showing_colon) + "H")
        sys.stdout.write('Your Damages: ')
        sys.stdout.write(str(Player.get_attack(data['player'])))
        sys.stdout.write("\033[10;" + str(Showing_colon) + "H")
        sys.stdout.write('Your XP: ')
        sys.stdout.write(str(Player.get_xp(data['player'])['Player_xp']) + '/' + str(Player.get_xp(data['player'])['Xp_for_new_level']))
        sys.stdout.write("\033[11;" + str(Showing_colon) + "H")
        sys.stdout.write('To squat and unsquat on stage: c')
        sys.stdout.write("\033[12;" + str(Showing_colon) + "H")
        sys.stdout.write('Encounter cooldown: ')
        sys.stdout.write(str(Player.get_encounter_cd(data['player'])))

    if data['awaiting_levelup_choice']:
        sys.stdout.write("\033[14;" + str(Showing_colon) + "H")
        sys.stdout.write('Level up! Press S (attack), L (life) or M (mana)')

    sys.stdout.write("\033[0;0H")
    sys.stdout.write('Life: ')
    sys.stdout.write(str(Player.get_active_life(data['player'])) + "/" + str(Player.get_life(data['player'])))


def handle_levelup_choice(data):
    """Remplace le input() bloquant du jeu original : on attend une seule
    touche (S, M ou L) plutot qu'une ligne de texte suivie d'Entree."""
    if not webio.has_key():
        return
    key = webio.read_key().upper()
    if key == 'S':
        Player.add_stat_attack(data['player'])
        data['awaiting_levelup_choice'] = False
    elif key == 'M':
        Player.add_stat_mana(data['player'])
        data['awaiting_levelup_choice'] = False
    elif key == 'L':
        Player.add_stat_life(data['player'])
        data['awaiting_levelup_choice'] = False


def live(data):

    if len(data['pnj_list']) >= 1:
        for pnj in data['pnj_list']:
            if PNJ.get_cd(pnj) > 0:
                PNJ.set_cd(pnj, PNJ.get_cd(pnj) - 1)
            if Player.get_items(data['player'], str(PNJ.get_item(pnj))) == 1:
                PNJ.set_lyrics(pnj, PNJ.get_secret(pnj))
                Player.add_stat_life(data['player'])
                Player.add_stat_attack(data['player'])
                Player.add_stat_mana(data['player'])
                Player.set_items(data['player'], str(PNJ.get_item(pnj)), 0)

    if Player.is_in_fight(data['player']):
        sys.stdout.write("\033[0;100H")
        if Player.get_active_life(data['player']) < 0:
            sys.stdout.write("\033[2J\033[H")
            sys.stdout.write("\033[" + str(Player.get_pos_in_fight(data['player'])[0]) + ";" + str(Player.get_pos_in_fight(data['player'])[1]) + "H")
            sys.stdout.write("You died")
            sys.stdout.write("\033[" + str(Player.get_pos_in_fight(data['player'])[0] + 1) + ";" + str(Player.get_pos_in_fight(data['player'])[1]) + "H")
            sys.stdout.write("Try again")
            sys.stdout.write("\033[" + str(Player.get_pos_in_fight(data['player'])[0] + 2) + ";" + str(Player.get_pos_in_fight(data['player'])[1]) + "H")
            quitGame(data)
            return

        if Background.get_char_at_pos(data['background'], [Player.get_pos_in_fight(data['player'])[0] + 2, Player.get_pos_in_fight(data['player'])[1]]) != 'Z':
            Player.set_pos_in_fight(data['player'], [Player.get_pos_in_fight(data['player'])[0] + 1, Player.get_pos_in_fight(data['player'])[1]])

        if len(data['monster_list']) >= 1:
            for monster in data['monster_list']:
                if Background.get_char_at_pos(data['background'], [Monster.get_pos(monster)[0] + 2, Monster.get_pos(monster)[1]]) != 'Z':
                    Monster.set_pos(monster, [Monster.get_pos(monster)[0] + 1, Monster.get_pos(monster)[1]])
                if Monster.get_mvt_cd(monster) <= 0:
                    Monster.move_to_pos(monster, [Player.get_pos_in_fight(data['player'])[0], Player.get_pos_in_fight(data['player'])[1]])
                else:
                    Monster.set_mvt_cd(monster, Monster.get_mvt_cd(monster) - 1)

                if Player.get_pos_in_fight(data['player'])[1] == Monster.get_pos(monster)[1]:
                    if Player.get_damage_cd(data['player']) >= 0:
                        sys.stdout.write("\033[0;0H")
                        sys.stdout.write("                                     ")
                        Player.set_color(data['player'], "Red")
                        Player.set_damage_cd(data['player'], 3)
                        Player.set_active_life(data['player'], Player.get_active_life(data['player']) - Monster.get_damage(monster))
                    Player.set_pos_in_fight(data['player'], [Player.get_pos_in_fight(data['player'])[0] - 1, Player.get_pos_in_fight(data['player'])[1] - 4])

    if Player.get_mvt_cd(data['player']) > 0:
        Player.set_mvt_cd(data['player'], Player.get_mvt_cd(data['player']) - 1)
        Player.set_direction(data['player'], 'Mid')

    if Player.get_attack_cd(data['player']) > 0:
        Player.set_attack_cd(data['player'], Player.get_attack_cd(data['player']) - 1)
    if Player.get_attack_cd(data['player']) > 3:
        if len(data['monster_list']) >= 1:
            for monster in data['monster_list']:
                if Player.get_last_direction(data['player']) == 'Right':
                    if Monster.get_pos(monster)[1] <= Player.get_pos_in_fight(data['player'])[1] + 2 and Monster.get_pos(monster)[1] > Player.get_pos_in_fight(data['player'])[1]:
                        Monster.set_life(monster, Monster.get_life(monster) - Player.get_attack(data['player']))
                        limite_tp = 4
                        while len(Background.get_map_data(data['background'])[4]) < limite_tp:
                            limite_tp -= 1
                        Monster.set_pos(monster, [Monster.get_pos(monster)[0] - 1, Monster.get_pos(monster)[1] + limite_tp])

                else:
                    if Monster.get_pos(monster)[1] >= Player.get_pos_in_fight(data['player'])[1] - 2 and Monster.get_pos(monster)[1] < Player.get_pos_in_fight(data['player'])[1]:
                        Monster.set_life(monster, Monster.get_life(monster) - Player.get_attack(data['player']))
                        limite_tp = 4
                        while Monster.get_pos(monster)[1] - limite_tp < 0:
                            limite_tp -= 1
                        Monster.set_pos(monster, [Monster.get_pos(monster)[0] - 1, Monster.get_pos(monster)[1] - limite_tp])

                if Monster.get_life(monster) <= 0:
                    level = Player.get_level(data['player'])
                    Player.add_xp(data['player'], Monster.get_drop(monster))
                    if level != Player.get_level(data['player']):
                        txt = "\033[" + str(Player.get_pos_in_fight(data['player'])[0] - 1) + ";" + str(Player.get_pos_in_fight(data['player'])[1]) + "H"
                        sys.stdout.write(txt)
                        sys.stdout.write("Level up Congrat")
                        data['awaiting_levelup_choice'] = True
                    if Monster.get_name(monster) == "Ganondorf":
                        data['game_end'] = True
                        end_game(data)
                    data['monster_list'].remove(monster)

    for monster in data['monster_list']:
        if Monster.get_damage_cd(monster) > 0:
            Monster.set_damage_cd(monster, Monster.get_damage_cd(monster) - 1)
        else:
            Monster.set_color(monster, "White")

    if Player.get_damage_cd(data['player']) > 0:
        Player.set_damage_cd(data['player'], Player.get_damage_cd(data['player']) - 1)
    else:
        Player.set_color(data['player'], "White")
