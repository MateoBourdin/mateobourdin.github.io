import sys

class PNJ:pass

def create(name,village,pos,interaction,lyrics,skin,special_item="O",secret_lyrics="O"):
    pnj=PNJ()
    pnj.name=name
    pnj.village=village
    pnj.pos=pos
    pnj.interaction=interaction
    pnj.lyrics=lyrics
    pnj.skin=skin
    pnj.cd=0
    pnj.in_interaction=False
    pnj.item=special_item
    pnj.Slyrics=secret_lyrics
    return pnj

def set_secret(pnj,val): pnj.Slyrics=val
def set_item(pnj,val): pnj.item=val
def set_in_interaction(pnj,val): pnj.in_interaction=val
def set_cd(pnj,val): pnj.cd=val
def set_name(pnj,val): pnj.name=val
def set_village(pnj,val): pnj.village=val
def set_pos(pnj,val): pnj.pos=val
def set_interaction(pnj,val): pnj.interaction=val
def set_lyrics(pnj,val): pnj.lyrics=val
def set_skin(pnj,val): pnj.skin=val


def get_name(pnj): return pnj.name
def get_village(pnj): return pnj.village
def get_pos(pnj): return pnj.pos
def get_interaction(pnj): return pnj.interaction
def get_lyrics(pnj): return pnj.lyrics
def get_skin(pnj): return pnj.skin
def get_cd(pnj): return pnj.cd
def get_in_interaction(pnj): return pnj.in_interaction
def get_item(pnj): return pnj.item
def get_secret(pnj): return pnj.Slyrics


def show(pnj):
    sys.stdout.write("\033[38;2;50;50;150m")
    txt="\033["+str(pnj.pos[0])+";"+str(pnj.pos[1])+"H"
    sys.stdout.write(txt)
    sys.stdout.write(pnj.skin)
    txt="\033["+str(pnj.pos[0]+1)+";"+str(pnj.pos[1])+"H"
    sys.stdout.write(txt)
    sys.stdout.write(pnj.skin)
    sys.stdout.write("\033[38;2;200;200;200m")

def show_lyrics(pnj):
    txt="\033["+str(pnj.pos[0]-1)+";"+str(pnj.pos[1]-5)+"H"
    sys.stdout.write(txt)
    sys.stdout.write(pnj.lyrics)