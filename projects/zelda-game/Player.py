import os
import sys

class Player: pass

def create(Name):
    player=Player()
    player.name=Name
    player.level={"Player_xp":0,"Xp_for_new_level":50}#Pourcentage jusqu'a atteindre le prochain niveau
    player.active_next_level=0
    player.stats={"Life":5,"Mana":5,"Attack":5}
    player.items={"Candle":0,"O":0,"Village1_statue":0}
    player.quests={"Found_village1_statue":0,"Kill_First_Boss":0}
    player.life=20*player.stats["Life"]
    player.active_life=player.life
    player.mana=20*player.stats["Mana"]
    player.attack=2*player.stats["Attack"]
    player.pos=[26,27]
    player.in_fight=False
    player.pos_in_fight=[5,40]
    player.attack_cd=0
    player.direction='Right'
    player.mvt_cd=0
    player.last_direction='Right'
    player.squat=False
    player.color="White"
    player.damage_cd=0
    player.encounter_cd=0
    return player

def set_encounter_cd(player,val): player.encounter_cd=val
def get_encounter_cd(player): return player.encounter_cd
def get_damage_cd(player): return player.damage_cd
def set_damage_cd(player,val): player.damage_cd=val
def get_color(player): return player.color
def set_color(player,val): player.color=val
def get_active_life(player): return player.active_life
def set_active_life(player,val): player.active_life=val
def get_squat(player): return player.squat
def set_squat(player,val): player.squat=val
def get_last_direction(player): return player.last_direction
def set_last_direction(player,val): player.last_direction=val
def get_level(player): return player.active_next_level
def get_xp(player): return player.level
def set_mvt_cd(player,val): player.mvt_cd=val
def get_mvt_cd(player): return player.mvt_cd
def set_direction(player,val): player.direction=val
def get_direction(player): return player.direction
def set_attack_cd(player,val): player.attack_cd=val
def get_attack_cd(player): return player.attack_cd
def set_fight(player, val): 
    player.encounter_cd=5
    player.in_fight=val  
    
def is_in_fight(player): return player.in_fight
def get_stats(player):  return player.stats


#---Fonctions de Gestion de Vie du Joueur------------
def add_stat_life(player):
    player.stats["Life"]+=1
    player.life=20*player.stats["Life"]
    player.active_life=player.life

def set_life(player,val):   player.life=val

def get_life(player):  return player.life

#---Fonctions de Gestion de Mana du Joueur------------
def add_stat_mana(player):
    player.stats["Mana"]+=1
    player.mana=20*player.stats["Mana"]

def use_mana(player,value_consume):
    player.mana-=value_consume

def get_mana(player):    return player.mana

#---Fonctions de Gestion d'attaque du Joueur------------
def add_stat_attack(player):
    player.stats["Attack"]+=1
    player.attack=2*player.stats["Attack"]

def get_attack(player):  return player.attack

#---Fonctions de Gestion de position du Joueur------------
def set_pos(player,newpos):  player.pos=newpos

def get_pos(player): return player.pos

def set_pos_in_fight(player,val):  player.pos_in_fight=val
    
def get_pos_in_fight(player):  return player.pos_in_fight

#---Fonctions de Gestion des quetes du Joueur------------
def add_advencment_quest(player,name_quest):  player.quests[name_quest]+=1

def get_quests(player):  return player.quests

#---Fonctions de Gestion des objets du Joueur------------
def set_items(player,name_item,value_for_item):  player.items[name_item]=value_for_item

def get_items(player, item):  return player.items[item]

#---Fonctions de Gestion du niveau du Joueur------------
def add_xp(player,value_xp):
    player.level["Player_xp"]+=value_xp
    if player.level["Player_xp"]>=player.level["Xp_for_new_level"]:
        player.active_next_level+=1
        player.level["Player_xp"]-=player.level["Xp_for_new_level"]
        player.level["Xp_for_new_level"]+=int(0.5*player.level["Xp_for_new_level"])

def get_xp(player):
    return player.level

def show(player,direction):
    if player.color=="Red":
        sys.stdout.write("\033[38;2;100;0;0m")
    else:
        sys.stdout.write("\033[38;2;50;200;50m")
    if player.in_fight:
        if direction=='Right' and player.mvt_cd>0:
            skinUp='>'
        elif player.mvt_cd>0 and direction=='Left':
            skinUp='<'
        else:
            skinUp='O'
        if not(player.squat):
            txt="\033["+str(player.pos_in_fight[0])+";"+str(player.pos_in_fight[1])+"H"
            skinDown='N'
            txt2="\033["+str(player.pos_in_fight[0]+1)+";"+str(player.pos_in_fight[1])+"H"
            sys.stdout.write(txt)
            sys.stdout.write(skinUp)
            sys.stdout.write(txt2)
            sys.stdout.write(skinDown)
        else:
            txt2="\033["+str(player.pos_in_fight[0]+1)+";"+str(player.pos_in_fight[1])+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(skinUp)

    else:
        txt="\033["+str(player.pos[0])+";"+str(player.pos[1])+"H"
        skin='O'
        sys.stdout.write(txt)
        sys.stdout.write(skin)
    sys.stdout.write("\033[38;2;200;200;200m")

def show_attack(player):
    sys.stdout.write("\033[38;2;122;208;225m")
    skin1=','
    skin2='_'
    if not(player.squat):
        if player.last_direction=='Right':
            txt="\033["+str(player.pos_in_fight[0])+";"+str(player.pos_in_fight[1]+1)+"H"
            sys.stdout.write(txt)
            sys.stdout.write(skin1)
            txt2="\033["+str(player.pos_in_fight[0])+";"+str(player.pos_in_fight[1]+2)+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(skin2)
        else:
            txt="\033["+str(player.pos_in_fight[0])+";"+str(player.pos_in_fight[1]-1)+"H"
            sys.stdout.write(txt)
            sys.stdout.write(skin1)
            txt2="\033["+str(player.pos_in_fight[0])+";"+str(player.pos_in_fight[1]-2)+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(skin2)
    else:
        if player.last_direction=='Right':
            txt="\033["+str(player.pos_in_fight[0]+1)+";"+str(player.pos_in_fight[1]+1)+"H"
            sys.stdout.write(txt)
            sys.stdout.write(skin1)
            txt2="\033["+str(player.pos_in_fight[0]+1)+";"+str(player.pos_in_fight[1]+2)+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(skin2)
        else:
            txt="\033["+str(player.pos_in_fight[0]+1)+";"+str(player.pos_in_fight[1]-1)+"H"
            sys.stdout.write(txt)
            sys.stdout.write(skin1)
            txt2="\033["+str(player.pos_in_fight[0]+1)+";"+str(player.pos_in_fight[1]-2)+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(skin2)
    sys.stdout.write("\033[38;2;200;200;200m")

        




if __name__ == "__main__":
    P1=create("Player1")
    set_life(P1,20)
    print(get_life(P1))
    add_stat_life(P1)
    print(get_life(P1))
    print(get_stats(P1))
    use_mana(P1,35)
    print(get_mana(P1))
    add_stat_mana(P1)
    print(get_mana(P1))
    print(get_stats(P1))
    print(get_attack(P1))
    add_stat_attack(P1)
    print(get_attack(P1))
    print(get_stats(P1))
    add_xp(P1,20)
    print(get_xp(P1))
    add_xp(P1,40)
    print(get_xp(P1))
    set_items(P1,"Candle",1)
    print(get_items(P1))
    add_advencment_quest(P1,"Found_village1_statue")
    print(get_quests(P1))
    #os.system("clear")
    show(P1)
    set_pos(P1,(20,52))
    print(get_pos(P1))
    show(P1)