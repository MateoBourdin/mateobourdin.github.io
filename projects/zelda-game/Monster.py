import sys
import random


import Player
import Background


class Monster:pass

def create( name, skin, damage, pos, life, drops, high):
    """
    Crée un monstre.

    Paramètres :
        Aucun

    Valeur de retour :
        Monstre
    """
    mons=Monster()
    mons.name = name
    mons.skin = skin
    mons.damage = damage
    mons.pos = list(pos)
    mons.life = life
    mons.drops = drops
    mons.mvt_cd=0
    mons.high=high
    mons.random_base_color=[str(random.randint(1,255)),str(random.randint(1,255)),str(random.randint(1,255))]
    mons.color="White"
    mons.damage_cd=0
    mons.direction=0
    
    return mons


#-------------------------------------------------------Accesseurs et Mutateurs-------------------------------------------------
def get_name(mons): return mons.name
def get_str(mons,filename): 
    myfile = open(filename, "r")
    mons.str3=myfile.read()
    myfile.close()
    return mons.str3
def set_str(mons,val): mons.str=val
def get_filename1(mons): return mons.filename1
def get_filename2 (mons): return mons.filename2
def set_filename2(mons,val): mons.filename2=val
def set_filename1(mons,val): mons.filename1=val
def get_random_color(mons): return mons.random_base_color
def set_random_color(mons, color): mons.random_base_color=color
def get_direction(mons): return mons.direction
def get_color(mons): return mons.color
def set_color(mons, color): mons.color=color
def get_damage_cd(mons): return mons.damage_cd
def set_damage_cd(mons,val): mons.damage_cd=val
def get_mvt_cd(mons): return mons.mvt_cd
def set_mvt_cd(mons,val): mons.mvt_cd=val

def set_damage(mons,Value):
    mons.damage=Value
    
def get_damage(mons):
    return mons.damage

def set_drop(mons,value):
    mons.drops=value

def get_drop(mons):
    return mons.drops

def set_life(mons,val):
    if mons.damage_cd<=0:
        mons.life=val
        mons.color="Red"
        mons.damage_cd=3

def get_life(mons):
    return mons.life

def set_pos(mons,newpos):
    mons.pos=newpos

def get_pos(mons):
    return mons.pos

def set_skin(mons,skin):#Par exemple le skin du monstre se tranforme en G quand il meurt
    mons.skin=skin



def move_to_pos(mons, ReachPosition):
    """
    Fait bouger le monstre dans le jeu.
    
    Paramètres :
        ReachPosition: tuple Position vers laquelle le monstre doit se déplacer
    
    Valeur de retour :
        Aucune
    """
    mons.direction=ReachPosition[1]-mons.pos[1]
    if mons.direction>0: 
        mons.pos=(mons.pos[0]-1,mons.pos[1]+1)
    else:
        mons.pos=(mons.pos[0]-1,mons.pos[1]-1)
    mons.mvt_cd=3

    #return mons.pos
    # À implémenter - Déplacement du monstre dans la direction spécifiée

def show(mons):
    if mons.color=="Red":
        sys.stdout.write("\033[38;2;100;0;0m")
        if mons.high==2:
            skinUP='M'
            txt1="\033["+str(mons.pos[0])+";"+str(mons.pos[1])+"H"
            skinDown='M'
            txt2="\033["+str(mons.pos[0]+1)+";"+str(mons.pos[1])+"H"
            sys.stdout.write(txt1)
            sys.stdout.write(mons.skin)
            sys.stdout.write(txt2)
            sys.stdout.write(mons.skin)  
        else:
            txt2="\033["+str(mons.pos[0]+1)+";"+str(mons.pos[1])+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(mons.skin)  


    else:
        sys.stdout.write("\033[38;2;"+mons.random_base_color[0]+";"+mons.random_base_color[1]+";"+mons.random_base_color[2]+"m")
        if mons.high==2:
            skinUP='M'
            txt1="\033["+str(mons.pos[0])+";"+str(mons.pos[1])+"H"
            skinDown='M'
            txt2="\033["+str(mons.pos[0]+1)+";"+str(mons.pos[1])+"H"
            sys.stdout.write(txt1)
            sys.stdout.write(mons.skin)
            sys.stdout.write(txt2)
            sys.stdout.write(mons.skin)  
        else:
            txt2="\033["+str(mons.pos[0]+1)+";"+str(mons.pos[1])+"H"
            sys.stdout.write(txt2)
            sys.stdout.write(mons.skin)  

        





if __name__=="__main__":

    mon=create("Ganon","F",50,[10,60],300,300,1,True,'Ganon.txt', 'Ganon2.txt')
    #print(mon.str1)
    #print(str(list(mon.data1[1])))
    show(mon)